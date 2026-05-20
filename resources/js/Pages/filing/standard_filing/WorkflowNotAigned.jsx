import { Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import DropdownG from "../../../components/Globals/Drodown";
import { Message } from "primereact/message";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { useLoading } from "../../../Context/preloadContext";
import Swal from "sweetalert2";

export default function Index({ filing }) {
    const { translations } = usePage()?.props;
    const [loading, setLoading] = useState({
        workflows: false,
    });
    const [workflows, setWorkflows] = useState([]);
    const { control, handleSubmit } = useForm();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        getWorkflows();
    }, []);

    async function getWorkflows() {
        setLoading({
            ...loading,
            workflows: true,
        });

        const res = await axios.get(route("workflow.list"), {
            params: {
                typeData: "todos",
            },
        });

        setWorkflows(res.data);
    }

    async function sumbit(data) {
        setIsLoading(true);
        try {
            data.id = filing.id;
            const res = await axios.post(route("filing.assingWk"), data);
            toast.success(translations.auth.success);
            router.visit(route("filing.workflow", filing.id));
        } catch (error) {
            toast.error(translations.auth.error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <form
                onSubmit={handleSubmit(sumbit)}
                className="flex flex-col gap-3"
            >
                <Card className="w-full md:w-30rem">
                    <div className="flex flex-col gap-4">
                        <Link href={route("filing.index")}>
                            <Button label={translations.auth.back} className="w-full" icon="pi pi-angle-left" />
                        </Link>
                        {/* Error Message */}
                        <Message
                            severity="error"
                            text={
                                translations.workflow.workflow_standart
                                    .message_empty
                            }
                        />
                        {/* Workflow Dropdown */}
                        <div>
                            <label htmlFor="">
                                {translations.workflow.workflow_standart.assign}
                            </label>
                            <DropdownG
                                control={control}
                                name="workflow_id"
                                options={workflows}
                                optionLabel="name"
                                optionValue="id"
                                rules={{
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            label={translations.configuration.trd.save}
                            className="col-span-2"
                            size="small"
                        />
                    </div>
                </Card>
            </form>
        </div>
    );
}
