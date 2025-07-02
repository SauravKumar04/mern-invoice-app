import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = null,
  required = false,
  variant = 'light', // 'light' for dark backgrounds, 'dark' for light backgrounds
  ...props
}) => {
  const labelColors = {
    light: 'text-white/90 font-semibold drop-shadow-sm',
    dark: 'text-gray-700 font-semibold'
  };

  const inputStyles = {
    light: `w-full rounded-xl border bg-white/95 backdrop-blur-sm px-4 py-3 text-gray-900 text-base
      shadow-lg placeholder-gray-500 transition-all duration-300 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 focus:bg-white
      focus:shadow-xl focus:scale-[1.02] transform
      disabled:opacity-50 disabled:cursor-not-allowed
      border-white/30 hover:border-white/50`,
    dark: `w-full rounded-xl border bg-white px-4 py-3 text-gray-900 text-base
      shadow-sm placeholder-gray-400 transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
      disabled:opacity-50 disabled:cursor-not-allowed
      border-purple-300 hover:border-purple-400`
  };

  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm mb-2 select-none transition-colors duration-200 ${labelColors[variant]}`}
        >
          {label} {required && <span className="text-red-300">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${inputStyles[variant]} ${
          error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/90'
            : ''
        }`}
        {...props}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-sm text-red-200 font-medium select-text bg-red-500/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-red-400/30"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
