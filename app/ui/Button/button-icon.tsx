import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';
import { useState } from 'react';

interface ButtonIconProps {
  content: string; // Tooltip content
  icon: string; // Material icon name, e.g., "chevron_left"
  onClick?: () => void; // Optional click handler
  delay?:Boolean;
}

export function ButtonIcon({ content, icon, onClick, delay=false }: ButtonIconProps){
  const delayTime: number = delay ? 1000 : 0;

  return (
    <Tippy
        content={content}
        theme="custom"
        placement="bottom"
        delay={[delayTime, 0]} // Thay đổi từ [0, 1000] thành [0, 0]
        hideOnClick
        >
       <span
        onClick={onClick}

        className="select-none material-symbols-outlined p-3 text-gray-500 hover:bg-gray-200 transition-colors rounded-full cursor-pointer"
      >
        {icon}
      </span>
    </Tippy>
  );
};