
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Calendar } from 'primereact/calendar'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { useLoading } from "../../../Context/preloadContext"

export default function Index({ id, translations }) {
    const { register,handleSubmit,getValues,formState: {
        errors,
    },setValue,control, watch} = useForm()
    const { setIsLoading } = useLoading();
    useEffect(() => {
        if(id) {
            getItem(id)
        }
    },[])

    const { fields, append, remove,insert } = useFieldArray({
        control,
        name: "questions"
    });



    async function submit(data) {
        setIsLoading(true);
        try {
            const res = await axios.post(route("satisfaction-survey.store"),data)
            toast.success(translations.auth.success)
            router.visit(route("satisfaction-survey.index"))
        } catch (error) {
            if(error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error)
            }
        }finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("satisfaction-survey.show",id))
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }

        let questions = res.data.questions.map(q => {
            return {
                text: q.question
            }
        })

        setValue('questions', questions)

    }

    function addQuestion() {
        append({
            question: '',
        })
    }
    function removeQuestion(i) {
        append({
            question: '',
        })
    }

    return (
        <div>
            <div>
                <Card  header={
                    <div className='p-5 flex gap-1 flex-col'>
                        <div>
                            <Link href={route("satisfaction-survey.index")}>
                                <Button label={translations.auth.back} size='small'/>
                            </Link>
                        </div>
                    </div>
                }>
                    <form onSubmit={handleSubmit(submit)}
                        className='grid gap-2 grid-cols-1 md:grid-cols-3 items-end'
                    >
                        <h2 className='md:col-span-3 font-bold'>{ translations.configuration.satisfaction_survey.title }</h2>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col">
                            <label htmlFor="username">{ translations.configuration.satisfaction_survey.form.name }</label>
                            <InputText { ...register("name",{ required: translations.validation.attributes.field_required }) } className={{ 'p-invalid': errors?.name,'w-full':true }} />
                            {errors?.name && (
                                <span className="text-red-600">{errors.name?.message}</span>
                            )}
                        </span>
                        <hr className='md:col-span-3' />
                        <span className="flex flex-col md:col-span-3">
                            <div>
                                <Button type='button' icon="pi pi-plus" onClick={addQuestion} label={translations.configuration.satisfaction_survey.form.add} />
                            </div>
                        </span>
                        <div className="md:col-span-3 grid md:grid-cols-2">
                            {fields.map((field, index) => (
                                <div className='flex flex-col gap-2' key={field.id} style={{ marginBottom: "10px" }}>
                                    <div className="flex gap-2">
                                        <Button severity='danger' type="button" onClick={() => remove(index)} icon="pi pi-times" />
                                        <InputText
                                            {...register(`questions.${index}.text`, {
                                                required: "La pregunta es obligatoria",
                                                minLength: {
                                                    value: 3,
                                                    message: "La pregunta debe tener al menos 3 caracteres"
                                                }
                                            })}
                                            className={{ 'p-invalid': errors.questions?.[index]?.text }}
                                            placeholder="Escribe tu pregunta aquí"
                                        />
                                    </div>
                                    {errors.questions?.[index]?.text && (
                                        <p style={{ color: "red" }}>{errors.questions[index].text.message}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="md:col-span-3">
                            <Button label={ translations.documental_gestion.dependency.save } className='col-span-2' size='small'/>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
