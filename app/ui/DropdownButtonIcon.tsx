import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';

interface DropdownButtonIconProps {
  icon: string;
  menu: React.ReactNode;
  tooltip?: string;
}

export const DropdownButtonIcon: React.FC<DropdownButtonIconProps> = ({
  icon,
  menu,
  tooltip,
}) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const toggle = () => setVisible((prev) => !prev);

  return (
    <Tippy
      interactive
      visible={visible}
      onClickOutside={hide}
      placement="bottom-start"
      render={(attrs) => (
        <div tabIndex={-1} {...attrs}>
          {menu}
        </div>
      )}
    >
      <span
        onClick={toggle}
        className="select-none material-symbols-outlined p-3 text-gray-500 hover:bg-gray-200 transition-colors rounded-full cursor-pointer"
        title={tooltip}
      >
        {icon}
      </span>
    </Tippy>
  );
};
