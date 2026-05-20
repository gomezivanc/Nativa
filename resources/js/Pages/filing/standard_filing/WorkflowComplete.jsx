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
import Nodes from "../../Workflow/Nodes";

export default function Index({ filing,nodes,edges }) {
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 p-4 h-full gap-2">
            <Card className="w-full h-full">
                <Link href={route("filing.index")}>
                    <Button label={translations.auth.back} className="w-full" icon="pi pi-angle-left" />
                </Link>
                <div className="flex justify-center items-center h-full mt-3">
                    <Message
                        severity="success"
                        text={
                            translations.workflow.workflow_standart
                                .message_complete
                        }
                    />
                </div>
            </Card>
            <Nodes nodes={nodes} edges={edges} notEditable className='md:col-span-2 w-full' />
        </div>
    );
}
