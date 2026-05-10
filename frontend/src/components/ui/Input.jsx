import React, { createElement, forwardRef, isValidElement, useId } from 'react';

const Input = forwardRef(({ label, error, hint, icon: Icon, className = '', id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-slate-200">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">
            {isValidElement(Icon) ? Icon : createElement(Icon, { className: 'h-4 w-4' })}
          </span>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={[
            'w-full rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500',
            'border-slate-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition',
            'focus:border-indigo-400/60 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-indigo-400/20',
            Icon ? 'pl-11' : '',
            error ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
      {!error && hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
