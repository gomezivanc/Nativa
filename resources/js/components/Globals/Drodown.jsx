import { InputNumber } from "primereact/inputnumber";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

export default function DropdownG({ control, name,  rules, disabled = false ,optionLabel = "name",optionValue = 'id', options = [] }) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{...rules}}
            render={({ field, fieldState }) => (
                <>
                    <Dropdown options={options} optionLabel={optionLabel} optionValue={optionValue} filter
                        value={field.value} showClear
                        disabled={disabled}
                        onChange={(e) => field.onChange(e.value)}
                        className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                    />
                    {
                        fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                    }
                </>
            )}
        />
    );
}
