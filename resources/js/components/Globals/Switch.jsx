
import { InputSwitch } from 'primereact/inputswitch';
import { Controller } from "react-hook-form";

export default function Switch({ control, name,  rules, trueLabel = null,falseLabel = null }) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{...rules}}
            render={({ field, fieldState }) => (
                <div className='flex flex-col'>  
                    <div className='flex flex-row items-center gap-2'>
                        <InputSwitch checked={field.value} trueValue={1} falseValue={0} onChange={(e) => field.onChange(e.value)} />
                        <label htmlFor="">
                            { field.value == 1 ? trueLabel : falseLabel }
                        </label>
                    </div>
                    {
                        fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                    }
                </div>
            )}
        />
    );
}
