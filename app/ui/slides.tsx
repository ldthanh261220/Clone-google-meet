import { useState } from "react";
import { Button } from "./button";
import { ButtonIcon } from "./button-icon";
import { motion, AnimatePresence } from "framer-motion";

export function Slides(){
    const slides = [
        {
          image: "https://www.gstatic.com/meet/premium_carousel_01_c90aec4dbb8bb21d1e18c468ad080c97.gif",
          title: "Dùng thử các tính năng nâng cao của Google Meet",
          description: "Gọi nhóm lâu hơn và còn nhiều lợi ích khác trong gói dùng thử Google One cao cấp trong 1 tháng",
          enableButton: true
        },
        {
          image: "https://www.gstatic.com/meet/premium_carousel_02_174e55774263506d1280ce6552233189.gif",
          title: "Tổ chức cuộc gọi nhóm lâu hơn",
          description: "Những cuộc họp có từ ba người tham gia trở lên có thể kéo dài tới 24 giờ, vượt xa giới hạn 1 giờ hiện tại. Tối đa 100 người tham gia có thể tham gia cuộc họp.",
          enableButton: true
        },
        {
          image: "https://www.gstatic.com/meet/premium_carousel_03_4f42ed34b9d0637ce38be87ecd8d1ca0.gif",
          title: "Phát trực tiếp lên YouTube",
          description: "Phát trực tiếp cuộc họp cho nhiều khán giả trên YouTube",
          enableButton: true
        },
        {
          image: "https://www.gstatic.com/meet/premium_carousel_04_9659d3a952a74b27223836d673fe391f.gif",
          title: "Ghi lại và chia sẻ bản ghi",
          description: "Sau khi bắt đầu, các bản ghi sẽ được lưu vào Google Drive và có thể chia sẻ với những người khác",
          enableButton: true
        },
        {
          image: "https://www.gstatic.com/meet/premium_carousel_05_5600a16209c1ddbeca641f40acb3ceaf.gif",
          title: "Loại bỏ tạp âm",
          description: "Tính năng khử tiếng ồn thông minh loại bỏ tạp âm khi bạn trình bày với những người khác",
          enableButton: true
        },
        {
          image: "https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg",
          title: "Nhận đường liên kết bạn có thể chia sẻ",
          description: "Nhấp vào Cuộc họp mới để nhận đường liên kết mà bạn có thể gửi cho những người mình muốn họp cùng",
          enableButton: false
        },
        {
          image: "https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg",
          title: "Lên kế hoạch trước",
          description: "Nhấp vào Cuộc họp mới để lên lịch cuộc họp trong Lịch Google và gửi lời mời cho người tham gia",
          enableButton: false
        },
        {
          image: "https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg",
          title: "Cuộc họp của bạn được bảo vệ an toàn",
          description: "Không ai có thể tham gia cuộc họp trừ phi người tổ chức mời hoặc cho phép",
          enableButton: false
        },
      ];
      const [currentSlide, setCurrentSlide] = useState(0);
      const [direction, setDirection] = useState("right");

      const handlePrev = () => {
        setDirection("left");
        setTimeout(() => {
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        }, 20); // Delay nhẹ để AnimatePresence nhận đúng direction
      };

      const handleNext = () => {
        setDirection("right");
        setTimeout(() => {
          setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 20);
      };

      const current = slides[currentSlide];

    return(
        <div className="flex basis-[45%] flex-col items-center">
            <div className="flex items-center"> 
            <ButtonIcon content="Trước" icon="chevron_left" onClick={handlePrev} delay/>
           <img
              className={
                current.image?.endsWith('.gif')
                  ? 'w-[330px]'
                  : 'w-[248px] m-[41px]'
                    }
                    alt={current.title}
                    loading="lazy"
                    role="img"
                    src={current.image}
                  />  
            <ButtonIcon content="Tiếp theo" icon="chevron_right" onClick={handleNext} delay/>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide} // Phải có key để Framer biết khi nào đổi slide
                initial={{ x: direction === "right" ? 50 : -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === "right" ? -50 : 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center font-normal pb-2 max-w-[400px] text-center gap-2 h-[190px]"
              >
                <h2 className="text-[25px] leading-[28px] tracking-[0]">
                  {current.title}
                </h2>
                <h3 className="text-[14px] max-w-[350px]">
                  {current.description}
                </h3>
                {current.enableButton && (
                  <Button
                    href="https://one.google.com/explore-plan/meet?utm_source=meet&utm_medium=web&utm_campaign=g1_meet_carousel&g1_landing_page=5"
                    className="!py-2 !px-5 text-[14px] !my-3"
                  >
                    <span>Bắt đầu dùng thử</span>
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div
                        key={i}
                        className={`w-[6px] h-[6px] rounded-full ${i === currentSlide ? "bg-blue-600" : "bg-gray-300"}`}
                        />
                    ))}
                </div>
          </div>
    )
    
}