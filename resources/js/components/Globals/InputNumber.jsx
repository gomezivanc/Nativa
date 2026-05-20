import { InputNumber } from "primereact/inputnumber";
import { Controller } from "react-hook-form";
import { useState } from "react";

export function Inputnumber({ control, placeholder, name, errors, rules, maxLength,maxValue, useGrouping = false }) {
    const [localValue, setLocalValue] = useState(null); // Estado local para controlar el valor del input

    const handleValueChange = (newValue, field) => {
        const newValueStr = newValue?.toString(); // Convertimos el valor a string para evaluar la longitud

        if (!newValueStr || newValueStr.length <= maxLength) {
            setLocalValue(newValue); // Actualizamos el estado local si el valor es válido
            field.onChange(newValue); // Actualizamos el valor en react-hook-form
        } else {
            console.log(field.value.toString());
            
            // Si el valor excede el límite, mantenemos el valor actual sin cambios
            setLocalValue(0);
            field.onChange(maxValue);
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={{...rules}}
            render={({ field, fieldState }) => (
                <div className="flex flex-col items-center gap-2 w-full">
                    {/* Este muestra el valor actual del campo */}

                    <InputNumber
                        useGrouping={useGrouping}
                        placeholder={placeholder}
                        inputClassName="w-full"
                        value={localValue || field.value || null} // Usamos el valor local como fuente principal
                        onChange={(e) => field.onChange(e.value)} // Validamos antes de actualizar
                        className={`w-full ${errors[name] ? 'p-invalid' : ''}`} // Clase para errores
                    />
                    {fieldState.error && (
                        <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                    )}
                </div>
            )}
        />
    );
}
