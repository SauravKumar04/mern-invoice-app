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
  ...props
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-purple-900 mb-2 select-none"
        >
          {label} {required && <span className="text-red-500">*</span>}
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
        className={`w-full rounded-xl border bg-white px-4 py-3 text-base
          shadow-sm placeholder-gray-400 transition
          duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-purple-300'
          }
        `}
        {...props}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-sm text-red-600 font-medium select-text"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
