import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  href?: string; // 👈 hỗ trợ chuyển hướng khi có href
}

export function Button({ children, className, href, onClick, ...rest }: ButtonProps) {
  const classes = clsx(
    'bg-[rgb(26,115,232)] text-white flex rounded-full px-5 py-3 gap-2 cursor-pointer font-bold hover:opacity-90 hover:shadow-md transition-all duration-200',
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Gọi hàm onClick của người dùng nếu có
    if (onClick) {
      onClick(e);
    }

    // Nếu có href và chưa bị e.preventDefault() thì chuyển trang
    if (href && !e.defaultPrevented) {
      window.location.href = href;
    }
  };

  return (
    <button className={classes} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
