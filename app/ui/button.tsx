import clsx from 'clsx';
import React from 'react';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

type ButtonProps =
  | (BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

export function Button({ children, className, href, ...rest }: ButtonProps) {
  const classes = clsx(
    'bg-[rgb(26,115,232)] text-white flex rounded-full px-5 py-3 gap-2 cursor-pointer font-bold hover:opacity-90 hover:shadow-md transition-all duration-200',
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
