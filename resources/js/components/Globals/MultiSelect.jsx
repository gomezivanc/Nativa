import { usePage } from "@inertiajs/react";
import { MultiSelect } from "primereact/multiselect";
import { Controller } from "react-hook-form";

export default function MultiSelectG({ control, name,  rules, disabled = false ,optionLabel = "name",optionValue = 'id', options = [] }) {
    const { translations, current_language } = usePage()?.props

    return (
        <Controller
            name={name}
            control={control}
            rules={{...rules}}
            render={({ field, fieldState }) => (
                <>
                    <MultiSelect display="chip" options={options} optionLabel={optionLabel} optionValue={optionValue} filter
                        value={field.value} placeholder={ translations.auth.select_opcion }
                        disabled={disabled} dataKey="id"
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
