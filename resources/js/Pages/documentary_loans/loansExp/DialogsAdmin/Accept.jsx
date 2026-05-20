import { router, usePage } from "@inertiajs/react"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function Accept({ selectedItem, mode, onFinish }) {
    const { translations, typeRequirements, current_language, typeLoan } = usePage().props
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()

    async function submit(data) {
        try {
            data.ids = selectedItem.map(i => i.id)
            data.mode = mode
            const res = await axios.post(route("admin-loans-exp.storeLoanState"),data)
            toast.success(res.data.message)
            router.visit(route("admin-loans-exp-exp.adminLoans"))
            onFinish()
        } catch (error) {
            console.error(error);
            
            toast.error(error.response.data.message)
        }finally{
        }
    }
    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(submit)}>
            {
                mode == 3 &&
                <span className="flex flex-col">
                    <label htmlFor="username">
                        {
                            translations.request_loans.request_loans
                                .table.loan_dialog.return_at
                        }
                    </label>
                    <InputText type="date" { ...register('return_at',{
                            required:
                                translations.validation.attributes
                                    .field_required,
                    })} />
                </span>
            }
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
            {
                mode !== 4 &&
                <span className="flex flex-col">
                    <label htmlFor="username">
                        {
                            translations.request_loans.request_loans
                                .table.loan_dialog.password
                        }
                    </label>
                    <InputText type="password" { ...register('password',{
                            required:
                                translations.validation.attributes
                                    .field_required,
                    })} />
                </span>
            }
            <span>
                <Button label={ translations.documental_gestion.exp_files.add } />
            </span>
        </form>
    )
}