import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import DropdownG from '../../../../components/Globals/Drodown'
import { toast } from 'react-toastify';
import axios from "axios";
import { useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { useLoading } from "../../../../Context/preloadContext";

export const Loan = ({ onSearch, defaultVals = {}, onSetValues, exp_files_ids }) => {
    // end obtener del backend
    const { translations, typeRequirements, current_language,
        typeLoan } = usePage().props

    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch, reset} = useForm({
        defaultValues: defaultVals
    })
    const { setIsLoading } = useLoading();

    async function submit(data) {
        setIsLoading(true)
        try {
            data.ids = exp_files_ids.map(i => i.id)
            const res = await axios.post(route('request-loans-exp.storeLoan'),data)
            toast.success(res.data.message);
            onSearch()
        } catch (error) {
            console.error(error);

            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}
            className='grid gap-2 grid-cols-1 items-end'
        >
            <h2 className=' font-bold'>{ translations.menu.request_loans }</h2>
            <hr className='' />
            <span className="flex flex-col">
                <label htmlFor="username">
                    {
                        translations.request_loans.request_loans
                            .table.loan_dialog.type_loan
                    }
                </label>
                <DropdownG control={control} options={typeRequirements} rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }} name="type_requirement_id" optionValue="id" optionLabel={'name_'+current_language} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {
                        translations.request_loans.request_loans
                            .table.loan_dialog.requirement
                    }
                </label>
                <DropdownG name="type_loan_id" control={control} options={typeLoan} rules={{
                        required:
                            translations.validation.attributes
                                .field_required,
                    }} optionValue="id" optionLabel={'name_'+current_language} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {
                        translations.request_loans.request_loans
                            .table.loan_dialog.observation
                    }
                </label>
                <InputTextarea { ...register('observation',{
                        required:
                            translations.validation.attributes
                                .field_required,
                })} />
            </span>
            <div className=" flex gap-2">
                <Button label={ translations.documental_gestion.exp_files.add } className='col-span-2' size='small'/>
            </div>
        </form>
    )
}
