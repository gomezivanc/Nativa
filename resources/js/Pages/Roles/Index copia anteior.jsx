import DangerButton from "@/components/DangerButton";
import InputLabel from "@/components/InputLabel";
import SecondaryButton from "@/components/SecondaryButton";
import TextInput from "@/components/TextInput";
import { useState } from "react";
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
import axios from "axios";

export default function Dashboard(props) {
    const { roles,  queryRoles ,translations} = usePage().props;

    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);

    const [operation, setOperation] = useState(1);

    const { data, setData, get } = useForm({
        id: "",
        nombre: "",
        description: "",
        permiso: "",
        queryRoles: queryRoles || "",
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const openModal = (op, id, nombre, description) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);
        setData({ nombre: "", description: "", permisos: [] });
        if (op === 1) {
        } else if (op === 2) {
            setData({ id: id, nombre: nombre, description: description });
        } else {
            setData({ id: id, nombre: nombre, description: description });
            buscarInfoRoles(id);
        }
    };

    const buscarInfoRoles = (id) => {
        const data = { id: id };
        axios
            .get(route("roles.getPermissions",{
                data
            }), {
                preserveState: true,
                preserveScroll: true,
            })
            .then((response) => {
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


    const save = (e) => {
        e.preventDefault();
        if (operation === 1) {
            axios
                .post(route("roles.store"), {
                    nombre: data.nombre,
                    description: data.description,
                })
                .then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Rol guardado Exitosamente!",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        router.get(
                            route("roles.index"),
                            {},
                            { preserveState: true, preserveScroll: true }
                        );
                    });
                })
                .catch(function (error) {
                    console.log(error);
                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error!",
                        showConfirmButton: true,
                    });
                });
        } else if (operation === 2) {
            axios
                .post(route("roles.update"), {
                    id: data.id,
                    nombre: data.nombre,
                    description: data.description,
                })
                .then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Rol Actualizado Exitosamente!",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        router.get(
                            route("roles.index"),
                            {},
                            { preserveState: true, preserveScroll: true }
                        );
                    });
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error!",
                        showConfirmButton: true,
                    });
                });
        } else {
            axios
                .put(route("roles.asignarPermisos"), {
                    id: data.id,
                    permisos: selectedPermissions,
                })
                .then(function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Permisos Asignados Exitosamente!",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        router.get(
                            route("roles.index"),
                            {},
                            { preserveState: true, preserveScroll: true }
                        );
                    });
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error!",
                        showConfirmButton: true,
                    });
                });
        }
    };

    const inactivar = (id) => {
        Swal.fire({
            title: "Esta Seguro de desactivar este Rol?",
            type: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#026882",
            cancelButtonColor: "#AE0C22",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.value) {
                axios
                    .put(route("roles.inactivar"), {
                        id: id,
                    })
                    .then((response) => {
                        Swal.fire(
                            "Desactivado!",
                            "El registro ha sido desactivado con éxito.",
                            "success"
                        );
                        router.get(
                            route("roles.index"),
                            {},
                            { preserveState: true, preserveScroll: true }
                        );
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    };

    const activar = (id) => {
        Swal.fire({
            title: "Esta Seguro de activar este Rol?",
            type: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#026882",
            cancelButtonColor: "#AE0C22",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.value) {
                axios
                    .put(route("roles.activar"), {
                        id: id,
                    })
                    .then((response) => {
                        Swal.fire(
                            "Activado!",
                            "El registro ha sido activado con éxito.",
                            "success"
                        );
                        router.get(
                            route("roles.index"),
                            {},
                            { preserveState: true, preserveScroll: true }
                        );
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    };


    const buscarInfo = (e) => {
        get(route("roles.index"), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title={translations.administration.role.title} />

            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <div className="max-w-[97%] mx-auto sm:px-6">
                        <div className="h-8 py px-2 overflow-hidden shadow-sm sm:rounded-md mb-5 border-[#E5E7EB] border">
                            <Link
                                href={route("roles.index")}
                                className="text-[#02558A] hover:text-[#0088be8c] text-lg font-roboto italic"
                            >
                            </Link>
                                <div className='flex justify-between items-center'>
                                    <h1 className='text-xl'>{translations.administration.permission.title }</h1>
                                </div>
                            {formulario && operation === 1 && (
                                <span className="text-base text-gray-900">
                                    / Crear
                                </span>
                            )}
                            {formulario && operation === 2 && (
                                <span className="text-base text-gray-900">
                                    / Editar
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="max-w-[97%] mx-auto sm:px-6">
                        {listado && (
                            <div className="flex-col overflow-hidden shadow-sm sm:rounded-lg w-full ">
                                <div className="lg:flex items-center justify-between mb-6 px-1">
                                    <div className="justify-start lg:w-1/2 w-full mb-5">
                                        <div className="max-sm:ml-1 mt-2">
                                            <form className="inline-flex rounded-md shadow-sm w-full">
                                                <input
                                                    type="text"
                                                    className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                                    placeholder="Buscar"
                                                    value={data.queryRoles}
                                                    onChange={(e) =>
                                                        setData(
                                                            "queryRoles",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyUp={buscarInfo}
                                                />
                                                <button className="bg-transparent border-0 text-gray-900 -ml-6">
                                                    <i className="fa-solid fa-search"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <Link
                                        onClick={() => openModal(1)}
                                        className="btn_principal max-sm:text-xs"
                                        preserveScroll={true}
                                        preserveState={true}
                                    >
                                        <div className="w-4 h-4 mr-2">
                                            <Icon
                                                className="w-4 h-4 text-white fill-current group-hover:text-gray-300 focus:text-gray-300"
                                                name="agregar"
                                            />
                                        </div>
                                        Crear Rol
                                    </Link>
                                </div>

                                <div className="overflow-x-auto bg-white rounded shadow mb-10">
                                    <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap">
                                        <thead className="border-t font-medium border-2 border-grey-900">
                                            <tr className="font-bold text-left bg-[#D0D3D4]">
                                                <th
                                                    scope="col"
                                                    className="px-6 pt-5 pb-4"
                                                >
                                                    #
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="titulo_tabla"
                                                >
                                                    Nombre
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="titulo_tabla"
                                                >
                                                    Descripción
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="titulo_tabla"
                                                >
                                                    Estado
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="titulo_tabla"
                                                >
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-left">
                                            {roles.data.map((rol, i) => (
                                                <tr
                                                    key={rol.id}
                                                    className="hover:bg-gray-50 focus-within:bg-gray-100 border-b"
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {i + 1}
                                                    </td>
                                                    <th
                                                        scope="row"
                                                        className="px-6 py-4 text-blue-900 whitespace-nowrap font-roboto"
                                                    >
                                                        {rol.name}
                                                    </th>
                                                    <td className="contenido_tabla">
                                                        {rol.description}
                                                    </td>
                                                    <td className="whitespace-nowrap  px-6 py-4 font-bold font-roboto">
                                                        {rol.status == true ? (
                                                            <span className="badge badge-outline-success">
                                                                Activo
                                                            </span>
                                                        ) : (
                                                            <span className="badge badge-outline-danger">
                                                                Inactivo
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap border-r px-3 py-2 space-x-2 centrar">
                                                        <TableButton
                                                            className="contenedor_boton_tabla "
                                                            onClick={() =>
                                                                openModal(
                                                                    3,
                                                                    rol.id
                                                                )
                                                            }
                                                        >
                                                            <div className="w-6 h-6">
                                                                <Icon
                                                                    className="w-6 h-6 text-[#002f65] fill-current group-hover:text-gray-300 focus:text-gray-600 "
                                                                    name="refresh"
                                                                />
                                                            </div>
                                                        </TableButton>

                                                        <div className="w-8 h-8">
                                                            <TableButton
                                                                className="contenedor_boton_tabla "
                                                                onClick={() =>
                                                                    openModal(
                                                                        2,
                                                                        rol.id,
                                                                        rol.name,
                                                                        rol.description
                                                                    )
                                                                }
                                                            >
                                                                <div className="w-6 h-6  ">
                                                                    <Icon
                                                                        className="editar_tabla"
                                                                        name="edit"
                                                                    />
                                                                </div>
                                                            </TableButton>
                                                        </div>
                                                        {rol.status == true ? (
                                                            <div className="w-8 h-8">
                                                                <TableButton
                                                                    className="contenedor_boton_tabla"
                                                                    onClick={() =>
                                                                        inactivar(
                                                                            rol.id
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="w-6 h-6  ">
                                                                        <Icon
                                                                            className="eliminar_tabla"
                                                                            name="trash"
                                                                        />
                                                                    </div>
                                                                </TableButton>
                                                            </div>
                                                        ) : (
                                                            <TableButton
                                                                className="contenedor_boton_tabla"
                                                                onClick={() =>
                                                                    activar(
                                                                        rol.id
                                                                    )
                                                                }
                                                            >
                                                                <div className="w-6 h-6">
                                                                    <Icon
                                                                        className="w-7 h-7 -ml-[0.15rem] -mt-[0.15rem] text-green-400 fill-current group-hover:text-gray-300 focus:text-gray-600"
                                                                        name="comprobado"
                                                                    />
                                                                </div>
                                                            </TableButton>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {roles.length === 0 && (
                                                <tr>
                                                    <td
                                                        className="px-6 py-4 border-t"
                                                        colSpan="4"
                                                    >
                                                        No se encuentran roles.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <Pagination
                                        className="mt-6"
                                        links={roles.links}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Formulario Crear/Editar*/}
                        {formulario && (
                            <div className="mx-auto my-2 px-4 ">
                                <div className="p-8 rounded shadow">
                                    <form name="createForm" onSubmit={save}>
                                        {(operation === 1 ||
                                            operation === 2) && (
                                            <div className="flex flex-col">
                                                <div>
                                                    <div className="col-span-3 lg:col-span-2">
                                                        <div>
                                                            <InputLabel
                                                                forInput="nombre"
                                                                value="Nombre"
                                                                className="text-sm font-medium"
                                                            />
                                                            <p className="hidden">
                                                                {operation}
                                                            </p>
                                                            <TextInput
                                                                id="nombre"
                                                                type="text"
                                                                className="mt-1 block"
                                                                name="nombre"
                                                                placeholder="Escriba el rol"
                                                                value={
                                                                    data.nombre
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "nombre",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <div className="col-span-3 lg:col-span-2">
                                                        <div>
                                                            <InputLabel
                                                                forInput="descripcion"
                                                                value="Descripción"
                                                                className="text-sm font-medium"
                                                            />
                                                            <TextInput
                                                                id="description"
                                                                type="text"
                                                                className="mt-1 block"
                                                                name="description"
                                                                value={
                                                                    data.description
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "description",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Escriba la descripcion"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {operation === 3 && (
                                            <div className="col-md-12 grid-margin stretch-card">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h1 className="text-2xl font-semibold text-[#01356A] ">
                                                            Asignación de
                                                            Permisos
                                                        </h1>
                                                        <div className="row">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                                                {selectedPermissions.map((permiso, permisoIndex) => (
                                                                    <Accordion key={permisoIndex} className=" ">
                                                                        <AccordionTab header={"Modulo: " + permiso.nombre}>
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
                                                                                    Seleccionar todo
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
                                            </div>
                                        )}
                                        <div className="grid justify-items-stretch">
                                            <div className="mt-4 justify-self-end space-x-2">
                                                <button
                                                    type="submit"
                                                    className="px-3 py-2 rounded bg-[#002F65] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41]"
                                                >
                                                    {operation === 1 && (
                                                        <div> Guardar</div>
                                                    )}
                                                    {operation === 2 && (
                                                        <div> Editar</div>
                                                    )}
                                                    {operation === 3 && (
                                                        <div> Editar</div>
                                                    )}
                                                </button>
                                                <Link
                                                    href={route("roles.index")}
                                                    className="px-3 py-2 rounded bg-[#667379] text-white text-sm font-bold whitespace-nowrap hover:bg-[#595D60] focus:bg-[#6F7477]"
                                                >
                                                    Atrás
                                                </Link>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {/* Cierre Formulario */}
                    </div>
                    {listado && (
                        <Pagination className="mt-6" links={roles.links} />
                    )}
                </div>
            </div>
        </>
    );
}
