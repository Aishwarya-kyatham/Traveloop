import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, hint, icon: Icon, className = '', id, ...props }, ref) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--muted)]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            flex h-11 w-full rounded-xl
            border border-[var(--input-border)]
            bg-[var(--input-bg)]
            px-4 py-2 text-sm text-[var(--text)]
            placeholder:text-[var(--muted)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--primary)]
            focus-visible:border-transparent
            focus-visible:bg-[var(--card)]
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all duration-150
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-[var(--muted)]">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
