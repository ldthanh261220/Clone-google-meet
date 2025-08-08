// components/StartMeetingItem.tsx

'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export function StartMeetingItem() {
  const router = useRouter();

  const handleClick = () => {
    const meetingId = uuidv4();
    router.push(`/meeting/${meetingId}`);
  };

  return (
    <li
      onClick={handleClick}
      className="px-4 h-12 flex items-center hover:bg-gray-200 cursor-pointer"
    >
      <span className="material-symbols-outlined mr-2">add</span>
      <span>Bắt đầu một cuộc họp tức thì</span>
    </li>
  );
}
