// DropdownButtonIcon.tsx
import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { ButtonIcon } from './button-icon';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownButtonIconProps {
  icon: string;
  tooltip: string;
  menu: React.ReactNode;
  delay?: boolean;
}

export const DropdownButtonIcon: React.FC<DropdownButtonIconProps> = ({
  icon,
  tooltip,
  menu,
  delay,
}) => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((prev) => !prev);
  const hide = () => setVisible(false);

  return (
    <Tippy
      interactive
      visible={visible}
      onClickOutside={hide}
      placement="bottom-end"
      render={(attrs) => (
        <AnimatePresence>
          {visible && (
            <motion.div
              tabIndex={-1}
              {...attrs}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="z-50"
            >
              {menu}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    >
      <div>
        <ButtonIcon
          icon={icon}
          content={tooltip}
          onClick={toggle}
          delay={delay}
        />
      </div>
    </Tippy>
  );
};
