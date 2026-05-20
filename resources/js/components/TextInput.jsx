import { forwardRef, useEffect, useRef } from 'react';
import {InputText} from "primereact/inputtext";

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
            <InputText
                type={type}
                name={name}
                id={id}
                value={value}
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
