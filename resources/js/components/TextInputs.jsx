import { forwardRef, useEffect, useRef, useState } from 'react';

export default ({ type, value, placeholder, error, ref, isFocused, name, className, errors = [], ...props }) => {
    const input = ref ? ref : useRef();
  
    useEffect(() => {
      if (isFocused) {
        input.current.focus();
      }
    }, []);
  
    return (
      <div className="flex flex-col items-start">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          ref={input}
          placeholder={placeholder}
          {...props}
          className={`bg-gray-50 placeholder-gray-400 border border-gray-300 text-gray-900 text-sm font-oswald rounded-lg focus:ring-blue-50 focus:border-blue-300 block w-full p-2.5  ${errors.length ? 'error' : ''}` + (error ? ' p-invalid' : '')}
        />
        {errors && <div className="text-xs text-red-400">{errors}</div>}
      </div>
    );
  };