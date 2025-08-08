'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

interface RemoteStream {
  id: string;
  stream: MediaStream;
}

export default function MeetingPage() {
  const { id } = useParams();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const socketRef = useRef<WebSocket | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    initializeConnection();
    
    return () => {
      cleanup();
    };
  }, [id]);

  const initializeConnection = async () => {
    try {
      // Lấy stream từ camera và microphone
      localStream.current = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      // Kết nối WebSocket
      socketRef.current = new WebSocket('wss://socket-meeting-server-production.up.railway.app');
      
      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        socketRef.current?.send(JSON.stringify({ type: 'join', room: id }));
      };

      socketRef.current.onmessage = async (message) => {
        const data = JSON.parse(message.data);
        console.log('Received message:', data.type);
        
        switch (data.type) {
          case 'joined':
            setClientCount(data.clientCount);
            break;
            
          case 'user-joined':
            setClientCount(data.clientCount);
            // Tạo offer cho user mới
            await createPeerConnection(data.clientId, true);
            break;
            
          case 'user-left':
            setClientCount(data.clientCount);
            handleUserLeft(data.clientId);
            break;
            
          case 'offer':
            await handleOffer(data.from, data.payload);
            break;
            
          case 'answer':
            await handleAnswer(data.from, data.payload);
            break;
            
          case 'ice-candidate':
            await handleIceCandidate(data.from, data.payload);
            break;
        }
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error initializing connection:', error);
    }
  };

  const createPeerConnection = async (clientId: string, createOffer: boolean) => {
    if (peerConnections.current[clientId]) {
      return; // Đã tồn tại connection
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    peerConnections.current[clientId] = peerConnection;

    // Thêm local stream tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream.current!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          room: id,
          payload: event.candidate
        }));
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote track from:', clientId);
      const remoteStream = event.streams[0];
      
      setRemoteStreams(prev => {
        const existing = prev.find(s => s.id === clientId);
        if (existing) {
          return prev.map(s => s.id === clientId ? { id: clientId, stream: remoteStream } : s);
        }
        return [...prev, { id: clientId, stream: remoteStream }];
      });
    };

    // Create offer if needed
    if (createOffer) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        socketRef.current?.send(JSON.stringify({
          type: 'offer',
          room: id,
          payload: offer
        }));
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }
  };

  const handleOffer = async (fromClientId: string, offer: RTCSessionDescriptionInit) => {
    try {
      await createPeerConnection(fromClientId, false);
      const peerConnection = peerConnections.current[fromClientId];
      
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      socketRef.current?.send(JSON.stringify({
        type: 'answer',
        room: id,
        payload: answer
      }));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (fromClientId: string, answer: RTCSessionDescriptionInit) => {
    try {
      const peerConnection = peerConnections.current[fromClientId];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (fromClientId: string, candidate: RTCIceCandidateInit) => {
    try {
      const peerConnection = peerConnections.current[fromClientId];
      if (peerConnection && candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const handleUserLeft = (clientId: string) => {
    // Đóng peer connection
    if (peerConnections.current[clientId]) {
      peerConnections.current[clientId].close();
      delete peerConnections.current[clientId];
    }
    
    // Xóa remote stream
    setRemoteStreams(prev => prev.filter(s => s.id !== clientId));
  };

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const leaveRoom = () => {
    socketRef.current?.send(JSON.stringify({
      type: 'leave',
      room: id
    }));
    
    cleanup();
    
    // Redirect hoặc thông báo
    window.location.href = '/';
  };

  const cleanup = () => {
    // Đóng tất cả peer connections
    Object.values(peerConnections.current).forEach(pc => {
      pc.close();
    });
    peerConnections.current = {};

    // Dừng local stream
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        track.stop();
      });
    }

    // Đóng WebSocket
    if (socketRef.current) {
      socketRef.current.close();
    }

    setRemoteStreams([]);
    setIsConnected(false);
  };

  const RemoteVideo = ({ remoteStream }: { remoteStream: RemoteStream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useEffect(() => {
      if (videoRef.current && remoteStream.stream) {
        videoRef.current.srcObject = remoteStream.stream;
      }
    }, [remoteStream.stream]);

    return (
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-48 bg-gray-900 rounded-lg object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          User {remoteStream.id.slice(-4)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Video Meeting</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Đã kết nối' : 'Đang kết nối...'}</span>
          </div>
        </div>
        <div className="text-sm">
          Phòng: {id} • {clientCount} người tham gia
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 bg-gray-800 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              Bạn {isMuted ? '(Tắt mic)' : ''} {isVideoOff ? '(Tắt camera)' : ''}
            </div>
          </div>

          {/* Remote Videos */}
          {remoteStreams.map(remoteStream => (
            <RemoteVideo key={remoteStream.id} remoteStream={remoteStream} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center p-4 bg-gray-800 space-x-4">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
        >
          {isVideoOff ? '📹' : '📷'}
        </button>
        
        <button
          onClick={leaveRoom}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white"
        >
          📞
        </button>
      </div>
    </div>
  );
}