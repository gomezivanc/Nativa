import React from 'react';

export default ({
  label,
  name,
  className,
  children,
  placeholder,
  errors = [],
  ...props
}) => {
  return (
    <div className={className}>

      <select
        id={name}
        name={name}
        placeholder={placeholder}
        {...props}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-50 focus:border-blue-300 block w-full p-2.5 form-select ${errors.length ? 'error' : ''}`}
      >
        {children}
      </select>
      {errors && <div className="form-error text-xs text-red-400">{errors}</div>}
    </div>
  );
};
