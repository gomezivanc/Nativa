import { forwardRef, useEffect, useRef } from 'react';
import {Password} from "primereact/password";

export default forwardRef(function TextInput(
    { type = 'text', name, id, value, className, autoComplete, required, isFocused, handleChange, placeholder,error,errors = [] },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-start">
            <Password
                inputClassName='w-full'
                name={name}
                feedback={false}
                id={id}
                value={value}
                toggleMask
                className={className + (error?' p-invalid':'')}
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => handleChange(e)}
                placeholder={placeholder}
            />
             {errors && <div className="text-xs text-red-500 form-error mb-2">{errors}</div>}
        </div>
    );
});
