import React from 'react';

const Card = ({ children, className = '', hover = false, glass = true, ...props }) => (
  <div
    className={[
      glass ? 'glass-panel' : 'border bg-[var(--surface-strong)] border-[var(--border)]',
      'rounded-[28px]',
      hover ? 'transition duration-300 hover:-translate-y-0.5 hover:border-slate-500/30 hover:bg-white/[0.03]' : '',
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={['px-6 pt-6', className].join(' ')} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={['p-6', className].join(' ')} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={['px-6 pb-6', className].join(' ')} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={['text-lg font-bold theme-text', className].join(' ')} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={['text-sm theme-text-muted', className].join(' ')} {...props}>
    {children}
  </p>
);

export default Card;
