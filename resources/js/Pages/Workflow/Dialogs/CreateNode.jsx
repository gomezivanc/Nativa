import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLoading } from "../../../Context/preloadContext";
import { useForm } from "react-hook-form";
import { router, usePage } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { toast } from 'react-toastify';
import DropdownG from '../../../components/Globals/Drodown'
import SwitchG from '../../../components/Globals/Switch';
import axios from "axios";

export default function CreateNode({ className }) {
    const { translations, workflow, } = usePage().props
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control,
        watch,
        clearErrors
    } = useForm();
    const { setIsLoading } = useLoading();

    const [nodes, setNodes] = useState([]);
    const [nodesNext, setNodesNext] = useState([]);
    const [nodesCache, setNodesCache] = useState([]);
    const is_parallel_flow = watch('is_parallel_flow')
    const conditional_true = watch('conditional_true')
    const is_finish = watch('is_finish')
    const next_node = watch('next_node')

    const isFirstRender = useRef(true);

    useEffect(() => {
        getNodes()
    },[])

    const noUpdate = useRef(false)
    useEffect(() => {
        if(noUpdate.current) {
            return
        }
        if (isFirstRender.current) {
            isFirstRender.current = false; // Marcamos que ya pasó el primer render
            return; // Evitamos ejecutar el efecto en la primera carga
        }

        // Lógica para asegurarse de que no ambos sean 1
        // if (is_parallel_flow === 1) {
        //     setValue('conditional_true',0);  // Si is_parallel_flow es 1, setea conditional_true a 0
        // }

        // if (conditional_true === 1) {
        //     setValue('is_parallel_flow',0);  // Si conditional_true es 1, setea is_parallel_flow a 0
        // }
        if(is_parallel_flow== 1 && conditional_true == 1) {
            setValue('is_finish',0)
        }

        if(is_finish == 1) {
            setValue('is_parallel_flow',0)
        }
        setValue('last_node',null)
        setValue('next_node',null)
        setValue('conditional_true_yes',null)
        syncNode()
        clearErrors()
        noUpdate.current = false
    }, [is_parallel_flow, conditional_true,is_finish]);

    useEffect(() => {
        if(!next_node) {
            return
        }
        setValue('is_parallel_flow',0)
        setValue('name',null);
        setValue('is_finish',0)
        // setValue('last_node',null)
        clearErrors()
        syncNode()
        noUpdate.current = true
    },[next_node])

    async function submit(data) {
        setIsLoading(true);
        try {
            data.workflow_id = workflow.id;
            const res = await axios.post(route("workflow.storeNode"), data);
            toast.success(translations.auth.success);
            router.visit(route("workflow.node",workflow.id));
        } catch (error) {
            console.error(error);

            toast.error(translations.auth.error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getNodes() {
        const res = await axios.get(route('workflow.getNodesWorkflows',workflow.id))
        setNodes(res.data)
        setNodesCache(res.data)
        syncNode()
    }

    function syncNode() {
        if(is_parallel_flow == 1) {
            setNodes(nodesCache.filter(i => {
                return i.is_parallel_flow !== 1
            }))
            return
        }
        if(conditional_true == 1) {
            setNodes(nodesCache.filter(i => {
                return i.is_parallel_flow == 1
            }))
            setNodesNext(nodesCache.filter(i => {
                return i.is_parallel_flow !== 1
            }))

            return
        }
        setNodes(nodesCache)
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className={"grid gap-2 grid-cols-1 items-end "+className}
        >
            <h2 className=" font-bold">
                {translations.menu.workflow.workflow}
            </h2>
            <hr className="" />
                    <span className="flex flex-col">
                        <label htmlFor="username">
                            {translations.workflow.form.name}
                        </label>
                        <InputText disabled={next_node}
                            {...register("name", {
                                required: next_node == null ? translations.validation.attributes.field_required : false,
                            })}
                            className={{ "p-invalid": errors?.name, "w-full": true }}
                        />
                        {errors?.name && (
                            <span className="text-red-600">{errors.name?.message}</span>
                        )}
                    </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.workflow.form.conditional_node}
                </label>
                <SwitchG name="is_parallel_flow" control={control} trueLabel={translations.auth.yes_not.yes} falseLabel={translations.auth.yes_not.no} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.workflow.form.conditional_true}
                </label>
                <SwitchG name="conditional_true" control={control} trueLabel={translations.auth.yes_not.yes} falseLabel={translations.auth.yes_not.no} />
            </span>
            <span className="flex flex-col">
                <label htmlFor="username">
                    {translations.workflow.form.is_end}
                </label>
                <SwitchG name="is_finish" control={control} trueLabel={translations.auth.yes_not.yes} falseLabel={translations.auth.yes_not.no} />
            </span>
            {
                conditional_true == 1 &&
                <>
                    <span className="flex flex-col">
                        <label htmlFor="username">
                            {translations.workflow.form.conditional_true_yes}
                        </label>
                        <SwitchG name="conditional_true_yes" control={control} trueLabel={translations.auth.yes_not.yes} falseLabel={translations.auth.yes_not.no} />
                    </span>
                </>
            }
            {
                conditional_true == 1 && <>
                    <span className="flex flex-col">
                        <label htmlFor="username">
                            {translations.workflow.form.last_node}
                        </label>
                        <DropdownG name="last_node" options={nodes} control={control} optionLabel="node_data.data.label" optionValue="id" />
                    </span>
                    {
                        is_finish !== 1 &&
                        <>
                            <span className="flex flex-col">
                                <label htmlFor="username">
                                    {translations.workflow.form.next_node}
                                </label>
                                <DropdownG name="next_node" options={nodesNext} control={control} optionLabel="node_data.data.label" optionValue="id" />
                            </span>
                        </>
                    }
                </>
            }
            <div>
                <Button
                    label={translations.configuration.trd.save}
                    className="col-span-2"
                    size="small"
                />
            </div>
        </form>
    );
}
