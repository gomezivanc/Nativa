import { useEffect, useState } from "react";
import TableButton from '@/components/TableButton';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInputs';
import { useForm, Link, usePage, router, Head } from '@inertiajs/react';
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";
import Icon from '@/components/Icon';
import DynamicSelect from '@/components/DynamicSelect';

const Index = ({ errors }) => {
    const { tiposDocumentos, queryDocumento, translations } = usePage().props;
    const [searchValue, setSearchValue] = useState(queryDocumento || '');
    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);
    const [operation, setOperation] = useState(1);

    const { data, setData, get } = useForm({
        queryDocumento: queryDocumento || '',
        id: '',
        nombre: '',
    });

    useEffect(() => {
        setData("queryDocumento", searchValue);
    }, [searchValue]);

    const openModal = (op, id, nombre) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);
        if (op === 1) {
            setData({
                id: '', nombre: '',
            });
        } else {
            setData({
                id: id, nombre: nombre,
            });
        }
    }

    const save = (e) => {
        e.preventDefault();
        if (operation === 1) {
            axios.post(route("tipoDocumento.store"), {
                nombre: data.nombre,
            }).then(function (response) {
                if (response.data.status == 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Se ha registrado el tipo de documento.",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        router.get(
                            route("tipoDocumento.index"),
                            {},
                            { preserveScroll: true, preserveState: false }
                        );
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.data.mensaje,
                        showConfirmButton: true,
                    });
                }
            }).catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrio un error!",
                    showConfirmButton: true,
                });
            });
        } else {
            axios.post(route("tipoDocumento.update"), {
                id: data.id,
                nombre: data.nombre,
            }).then(function (response) {
                if (response.data.status == 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Se ha actualizado el tipo de documento.",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        router.get(
                            route("tipoDocumento.index"),
                            {},
                            { preserveScroll: true, preserveState: false }
                        );
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.data.mensaje,
                        showConfirmButton: true,
                    });
                }
            }).catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrio un error!",
                    showConfirmButton: true,
                });
            });
        }
    }

    const cambiarEstado = (id, estado) => {
        let nomEstado, titulo = '';
        if (estado == 1) {
            nomEstado = 'activar';
            titulo = 'Activado';
        }
        else {
            nomEstado = 'inactivar';
            titulo = 'Inactivado';
        }
        Swal.fire({
            title: 'Esta seguro de ' + nomEstado + ' el tipo de documento?',
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#026882',
            cancelButtonColor: '#AE0C22',
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.value) {
                axios.put(route("tipoDocumento.cambiarEstado"), {
                    id: id,
                    estado: estado,
                }).then((response) => {
                    router.get(
                        route("tipoDocumento.index"),
                        {},
                        { preserveScroll: true, preserveState: false }
                    );
                    Swal.fire("Exitoso!", "El tipo de documento ha sido " + titulo + " con éxito.", "success");
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) { }
        });
    };

    function handleSearch(e) {
        e.preventDefault();
        get(route("tipoDocumento.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head tile="Tipos de Documentos" />
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <div className="max-w-[97%] max-auto sm:px-6">
                        <div className="h-8 py px-2 overflow-hidden shadow-sm sm:rounded-md mb-5 border-[#E5E7EB] border">
                            <Link href={route('personas.index')} className="text-[#02558A] hover:text-[#0088be8c] text-lg font-roboto italic">
                            { translations.auth.type_documents.type_documents }
                            </Link>
                            {formulario && operation === 1 && (
                                <span className='text-base text-gray-900'>/ { translations.auth.type_documents.form.create }</span>
                            )}
                            {formulario && operation === 2 && (
                                <span className='text-base text-gray-900'>/ { translations.auth.type_documents.form.edit }</span>
                            )}
                        </div>
                    </div>
                    <div className="max-w-[97%] max-auto sm:px-6">
                        {listado && (
                            <div className="flex-col overflow-hidden shadow-sm sm:rounded w-full">
                                <div className="lg:flex items-center justify-between mb-6 px-1">
                                    <div className="justify-start lg:w-1/2 w-full mb-5">
                                        <div className="max-sm:ml-1 mt-2">
                                            <form className="inline-flex rounded-md shadow-sm w-full" onSubmit={handleSearch}>
                                                <input type="text" className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                                    value={searchValue} placeholder={ translations.auth.type_documents.search }
                                                    onChange={(e) => setSearchValue(e.target.value)} />
                                                <button type="submit" className="bg-transparent border-0 text-gray-900 -ml-6">
                                                    <i className="fa-solid fa-search"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <Link onClick={() => openModal(1)} className="btn_principal max-sm:text-xs"
                                        preserveScroll={true} preserveState={true} >
                                        <div className='w-4 h-4 mr-2'>
                                            <Icon className="w-4 h-4 text-white fill-current group-hover:text-gray-300 focus:text-gray-300" name="agregar" />
                                        </div>
                                        { translations.auth.type_documents.table.create }
                                    </Link>
                                </div>
                                <div className="overflow-x-auto bg-white rounded shadow">
                                    <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap mb-5">
                                        <thead className="border-t font-medium border-2 border-grey-900">
                                            <tr className="font-bold text-left bg-[#D0D3D4]">
                                                <th scope="col" className="titulo_tabla"> # </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.type_documents.table.name } </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.type_documents.table.state } </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.type_documents.table.actions } </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-left">
                                            {tiposDocumentos.data.map((documento, i) => (
                                                <tr key={documento.id} className="hover:bg-gray-50 focus-within:bg-gray-100 border-b">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {i + 1}
                                                    </td>
                                                    <td className="contenido_tabla">
                                                        {documento.nombre}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-bold font-roboto">
                                                        {documento.estado == true ?
                                                            <span className="badge badge-outline-success">{ translations.auth.state.active }</span>
                                                            :
                                                            <span className="badge badge-outline-danger">{ translations.auth.state.inactive }</span>
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap border-r px-3 py-2 space-x-2 centrar">
                                                        <div className="w-8 h-8">
                                                            <TableButton
                                                                className='contenedor_boton_tabla'
                                                                onClick={() => openModal(2, documento.id, documento.nombre)}>
                                                                <div className='w-6 h-6'>
                                                                    <Icon className="editar_tabla " name="edit" />
                                                                </div>
                                                            </TableButton>
                                                        </div>
                                                        {documento.estado == true ?
                                                            <div className="w-8 h-8">
                                                                <TableButton
                                                                    className='contenedor_boton_tabla '
                                                                    onClick={() => cambiarEstado(documento.id, 0)}>
                                                                    <div className='w-6 h-6  '>
                                                                        <Icon className="eliminar_tabla " name="trash" />
                                                                    </div>
                                                                </TableButton>
                                                            </div>
                                                            :
                                                            <div className="w-8 h-8">
                                                                <TableButton className="contenedor_boton_tabla"
                                                                    onClick={() => cambiarEstado(documento.id, 1)} >
                                                                    <div className="w-6 h-6">
                                                                        <Icon className="activar_tabla" name="comprobado" />
                                                                    </div>
                                                                </TableButton>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                            {tiposDocumentos.data.length === 0 && (
                                                <tr>
                                                    <td className="px-6 py-4 border-t" colSpan="4">
                                                        { translations.auth.not_found }
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {/* Formulario Crear/Editar*/}
                        {formulario && (
                            <>
                                <div className="mx-auto my-2">
                                    <div className="p-4 rounded shadow">
                                        <form name="createForm" onSubmit={save}>
                                            <div className="w-full p-2 grid grid-cols-6 gap-6">
                                                <div className="px-3 lg:col-span-3 col-span-6">
                                                    <InputLabel forInput="nombre" value="Nombre" className="text-sm font-medium" />
                                                    <TextInput id="nombre" type="text" className="mt-1 block" name="nombre" placeholder="Nombre"
                                                        errors={errors.nombre} value={data.nombre} onChange={e => setData('nombre', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="grid justify-items-stretch px-8 py-4 border-t border-gray-200">
                                                <div className="mt-4 justify-self-end space-x-2">
                                                    <button type="submit" className="px-3 py-2 rounded bg-[#002F65] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41]">
                                                        {operation === 1 && (
                                                            <div> { translations.auth.type_documents.form.create } </div>
                                                        )}
                                                        {operation === 2 && (
                                                            <div> { translations.auth.type_documents.form.edit } </div>
                                                        )}
                                                    </button>
                                                    <Link href={route("tipoDocumento.index")} className="px-3 py-2 rounded bg-[#667379] text-white text-sm font-bold whitespace-nowrap hover:bg-[#595D60] focus:bg-[#6F7477]" >
                                                        { translations.auth.back }
                                                    </Link>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}
                        {listado && (
                            <Pagination className="mt-6" links={tiposDocumentos.links} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index
