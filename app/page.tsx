"use client";
import { useEffect, useState,useRef  } from "react";
import Image from "next/image";
import { lusitana } from '@/app/ui/fonts'
import { Button } from "./ui/button";
import { Slides } from "./ui/slides";
import { ButtonIcon } from "./ui/button-icon";
import { DropdownButtonIcon } from "./ui/DropdownButtonIcon";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // cập nhật mỗi giây
    return () => clearInterval(timer); // dọn dẹp
  }, []);

  const timeString = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dayOfWeek = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
  const dateString = `${dayOfWeek[currentTime.getDay()]}, ${currentTime.getDate()} thg ${currentTime.getMonth() + 1}`;
  const MySupportmenu =() =>(
    <div className="rounded-xl shadow-lg p-2 bg-white border w-48">
                <ul>
                    <li className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Trợ giúp</li>
                    <li className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Đào tạo</li>
                    <li className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Điều khoản dịch vụ</li>
                    <li className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Chính sách quyền riêng tư</li>
                    <li className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Bản tóm tắt điều khoản</li>
                </ul>
            </div>
  )
  return (
    <div>
    <div className="flex px-2">
      <div className="flex m-2.5 items-center flex-1">
        <img className="w-31" src="/google-meet-icon.png" alt="Google meet logo"/>
        <span className="ml-1 text-gray-500 text-[22px]">
          Meet
        </span>
      </div>
      <div className={`flex items-center text-[#5F6368] text-[18px]`}>
        <span>{timeString}</span>
        <span className="mx-1"> • </span>
        <span className="mr-3">{dateString}</span>
        <DropdownButtonIcon
          icon="help"
          menu={<MySupportmenu />}
          tooltip="Hỗ trợ"
        />
        <ButtonIcon content="Hỗ trợ" icon="help"/>
        <ButtonIcon content="Báo cáo sự cố" icon="feedback"/>
        <ButtonIcon content="Cài đặt" icon="settings"/>
      </div>
      <div className="flex pl-[30px] pr-[4px] items-center">
        <ButtonIcon content="Các ứng dụng của Google" icon="Apps"/>

<span className="rounded-full hover:bg-gray-200 transition-colors cursor-pointer p-1 ml-1.5">
    <img className="rounded-full" src="/avt-account-gg.jpg"/>
  </span>
     
  </div>
    </div>    
      <div className="h-[calc(100vh-4rem)]">
        <div className="inline-flex items-center justify-evenly h-full min-h-full w-full text-base overflow-y-auto animate-fadeIn">
          <div className="inline-flex  flex-col shrink max-w-[40rem] px-[3em] py-[1em]">
              <h1 className="text-[45px] font-normal leading-[52px] tracking-[0] pb-2 m-0 text-[#1f1f1f]">Tính năng họp và gọi video dành cho tất cả mọi người</h1>
              <div className="text-[22px] font-normal leading-[28px] tracking-[0] pb-2 max-w-[480px] text-[#444746]">Kết nối, cộng tác và ăn mừng ở mọi nơi với<br />
                <span className="whitespace-nowrap">
                  Google Meet
                </span>
              </div>
              <div className="flex flex-wrap gap-4 my-4 items-center">
                  <Button>
                    <span className="material-symbols-outlined">
                        video_call
                      </span>
                      <span>
                        Cuộc họp mới
                      </span>
                    </Button>
                  
                  <div className="flex items-center gap-2 p-3 rounded-2xl transition-colors border-2 border-gray-500 focus-within:border-blue-500">
                    <span className="material-symbols-outlined text-gray-500 mx -2 cursor-pointer"
                            onClick={() => inputRef.current?.focus()}
>
                      keyboard
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Nhập một mã hoặc đường liên kết"
                      className="outline-none flex-1"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    >
                    </input>
                  </div>
                  <h3 className={`ml-3 text-[15px] ${inputValue ? "text-blue-600" : "text-gray-400"}`}>Tham gia</h3>
              </div>
              <div className="h-[0.25px] bg-black my-3"/>
              <a className="text-black text-[14px]" href="https://support.google.com/meet/?hl=vi">
                <span className="text-blue-500 underline">Tìm hiểu thêm</span> về Google Meet
              </a>
          </div>
          <Slides/>
        </div>
      </div>  
    </div>

  )
}
