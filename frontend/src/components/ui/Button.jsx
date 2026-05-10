import React from 'react';

const variants = {
  primary:
    'border border-indigo-400/30 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 text-white shadow-glow hover:scale-[1.01] hover:brightness-110',
  secondary:
    'glass-panel theme-text hover:border-slate-400/30 hover:bg-white/10',
  ghost:
    'border border-transparent bg-transparent theme-text-secondary hover:bg-white/5 hover:text-white',
  danger:
    'border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20',
};

const sizes = {
  sm: 'h-9 px-3 text-xs rounded-xl',
  default: 'h-11 px-4 text-sm rounded-2xl',
  lg: 'h-12 px-5 text-sm rounded-2xl',
  xl: 'h-14 px-6 text-base rounded-2xl',
  icon: 'h-11 w-11 rounded-2xl',
};

const Button = ({ children, variant = 'primary', size = 'default', className = '', loading = false, ...props }) => (
  <button
    className={[
      'inline-flex items-center justify-center gap-2 font-semibold transition duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
      'disabled:pointer-events-none disabled:opacity-50',
      variants[variant],
      sizes[size],
      className,
    ].join(' ')}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    ) : null}
    {children}
  </button>
);

export default Button;
