import React, { useState } from 'react';
import clsx from 'clsx';
import Tippy from '@tippyjs/react/headless';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  menu: React.ReactNode;
  className?: string;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  className,
  menu,
  onClick,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((v) => !v);
  const hide = () => setVisible(false);

  const classes = clsx(
    'bg-[rgb(26,115,232)] text-white flex items-center rounded-full px-5 py-3 gap-2 cursor-pointer font-bold hover:opacity-90 hover:shadow-md transition-all duration-200',
    className
  );

  return (
    <Tippy
      interactive
      visible={visible}
      onClickOutside={hide}
      placement="bottom-start"
      render={(attrs) => (
        <AnimatePresence>
          {visible && (
            <motion.div
              {...attrs}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="z-50"
            >
              {menu}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    >
      <button
        className={classes}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) onClick(e);
          toggle();
        }}
        {...rest}
      >
        {children}
      </button>
    </Tippy>
  );
};
