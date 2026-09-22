import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Space-separated modifiers: "primary", "ghost", "onDark", "danger", "wide", "sm". */
  variant?: string;
}

export function Button({ children, variant = '', className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`ff-btn ${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
