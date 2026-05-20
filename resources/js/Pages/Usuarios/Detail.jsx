import DangerButton from "@/components/DangerButton";
import InputLabel from "@/components/InputLabel";
import SecondaryButton from "@/components/SecondaryButton";
import TextInput from "@/components/TextInput";
import { useEffect, useState } from "react";
import { useForm, Link, usePage, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import PrimaryButton from "@/components/PrimaryButton";
import WarningButton from "@/components/WarningButton";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";
import CheckInput from "@/components/CheckInput";
import TableButton from "@/components/TableButton";
import Icon from "@/components/Icon";
import Pagination from "@/components/Pagination";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button'
import { toast } from 'react-toastify';


import axios from "axios";

export default function Detail({id}) {
    const { translations} = usePage().props;

    const [selectedPermissions, setSelectedPermissions] = useState([]);
    useEffect(()=>{
        buscarInfoRoles(id);
    },[]);

    const asignarPermisos = async() => {
        try {
            const res = await axios.put(route("usuarios.asignarPermisos"),{
                id: id,
                permisos: selectedPermissions,
            })
            toast.success(translations.auth.success)
            router.visit(route("usuarios.index"))
        } catch (error) {
            if(error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error)
            }
        }
    }

    const buscarInfoRoles = (id) => {
        const data = { id: id };
        axios.get(route("usuarios.getPermissions"), {
            params: { id: id }
        }).then((response) => {
                setSelectedPermissions(response.data.permisos);
            })
            .catch((error) => {
                console.error(
                    "Error al recuperar la información del rol:",
                    error
                );
            });
    };
    const handleChange = (moduleIndex, permisoId) => {
        const updatedPermissions = [...selectedPermissions];
        const module = updatedPermissions[moduleIndex];

        // Encuentra el permiso y alterna su estado
        const permiso = module.permisos.find((permiso) => permiso.id_permiso === permisoId);
        permiso.status = !permiso.status;

        setSelectedPermissions(updatedPermissions); // Actualiza el estado
    };
    const handleModuleChange = (moduleIndex) => {
        const updatedPermissions = [...selectedPermissions];
        const module = updatedPermissions[moduleIndex];

        // Verifica el estado actual del módulo
        const isAllSelected = module.permisos.every((permiso) => permiso.status);

        // Alterna el estado de todos los permisos
        module.permisos.forEach((permiso) => {
            permiso.status = !isAllSelected;
        });

        setSelectedPermissions(updatedPermissions); // Actualiza el estado
    };

    return (

    <div className="col-md-12 grid-margin stretch-card">
        <div className='p-5 flex gap-1 flex-col'>
            <div>
                <Link href={route("usuarios.index")}>
                    <Button label={translations.auth.back} size='small'/>
                </Link>
            </div>
        </div>
        <div className="card">
            <div className="card-body">
                <h1 className="text-2xl font-semibold text-[#01356A] ">
                    {translations.administration.role.titleassign}
                </h1>
                <div className="row">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {selectedPermissions.map((permiso, permisoIndex) => (
                            <Accordion key={permisoIndex} className=" ">
                                <AccordionTab header={translations.administration.role.module + permiso.nombre}>
                                    {/* Checkbox para seleccionar todos los permisos del módulo */}
                                    <div className="flex items-center mb-3">
                                        <Checkbox
                                            onChange={() => handleModuleChange(permisoIndex)}
                                            checked={permiso.permisos.every((subPermiso) => subPermiso.status)} // Todos seleccionados
                                            indeterminate={
                                                permiso.permisos.some((subPermiso) => subPermiso.status) &&
                                                !permiso.permisos.every((subPermiso) => subPermiso.status)
                                            } // Algunos seleccionados
                                            inputId={`modulo-${permisoIndex}`}
                                        />
                                        <label className="ml-2 font-bold" htmlFor={`modulo-${permisoIndex}`}>
                                           { translations.auth.select_all}
                                        </label>
                                    </div>
                                    {/* Permisos individuales */}
                                    <div className="flex flex-wrap gap-2">
                                        {permiso.permisos.map((subPermiso) => (
                                            <div key={subPermiso.id_permiso} className="flex items-center w-full sm:w-1/2">
                                                <Checkbox
                                                    onChange={() => handleChange(permisoIndex, subPermiso.id_permiso)}
                                                    checked={subPermiso.status}
                                                    inputId={`permiso-${subPermiso.id_permiso}`}
                                                />
                                                <label className="ml-2" htmlFor={`permiso-${subPermiso.id_permiso}`}>
                                                    {subPermiso.name_permiso}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionTab>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="md:col-span-3 mt-3 text-right">
            <Button label={ translations.documental_gestion.dependency.save } className='col-span-2' size='small' onClick={() => {asignarPermisos()}}/>
        </div>
    </div>
    );

}
