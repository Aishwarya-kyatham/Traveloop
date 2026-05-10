import React from 'react';

const Card = ({ children, className = '', glass = false, hover = false, ...props }) => {
  const base = "rounded-2xl border border-[var(--border)] transition-all duration-300";
  const bg = glass ? "bg-glass" : "bg-[var(--card)]";
  const hoverStyle = hover ? "hover:border-[var(--border-hover)] hover:shadow-glow hover:-translate-y-1 cursor-default" : "";

  return (
    <div className={`${base} ${bg} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-0 ${className}`} {...props}>{children}</div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>{children}</div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-bold text-[var(--text)] leading-tight ${className}`} {...props}>{children}</h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-[var(--muted)] mt-1 ${className}`} {...props}>{children}</p>
);

export default Card;
