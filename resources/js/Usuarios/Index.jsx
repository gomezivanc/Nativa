import React, {useEffect, useState, useRef} from "react";
import {usePage, useForm, Link, Head, router} from "@inertiajs/react";
import TableButton from '@/components/TableButton';
import InputLabel from '@/components/InputLabel';
import TextInput from "@/components/TextInputs";
import Pagination from "@/components/Pagination";
import DynamicSelect from "@/components/DynamicSelect";
import Icon from '@/components/Icon';
import Swal from "sweetalert2";
import { useForm as useFormRH, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Button } from "primereact/button";
import { toast } from "react-toastify";

export default function Index ({ errors }) {
    const { usuarios, queryUsuarios, page, translations } = usePage().props;
    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);
    const [operation, setOperation] = useState(1);
    let [listadoPersonas, setListadoPersonas] = useState([]);
    const [listadoAplicaciones, setListadoAplicaciones] = useState([]);
    const [apps,setApps] = useState([]);
    const { register,handleSubmit,getValues,setValue,control} = useFormRH()
    const { data, setData, get, post} = useForm({
        queryUsuarios: queryUsuarios || '',
        page: page || '',
        id : '',
        persona: '',
        usuario: '',
        email: '',
        contrasena: '',
        contrasena2: '',
        observaciones: '',
        superAdministrador: false,
    });

    const openModal = (op, id, persona, usuario, email, observaciones, super_administrador) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);
        if (op === 1) {
            setData({
                id: '', persona: '', usuario: '', email: '', observaciones : '', superAdministrador: false
            });
        } else {
            setData({
                id: id, persona: persona, usuario: usuario,  email : email, observaciones : observaciones, superAdministrador: super_administrador
            });
            getAplicativos(id);
        }
    }

    const inactivar = (id) => {
        Swal.fire({
            icon: 'info',
            title: 'Esta Seguro de inactivar este Usuario?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#026882',
            cancelButtonColor: '#AE0C22',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                axios.put(route('usuarios.inactivar'), {
                    'id': id
                }).then((response) => {
                    router.get(route('usuarios.index', {
                        page: usuarios.current_page,
                        queryUsuarios: queryUsuarios,
                    }), {}, { preserveState: true, preserveScroll: true });
                    Swal.fire(
                        'Desactivado!',
                        'El registro ha sido desactivado con éxito.',
                        'success'
                    )
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.cancel
            ) {}
        })
    }

    const activar = (id) => {
        Swal.fire({
            icon: 'info',
            title: 'Esta Seguro de activar este Usuario?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#026882',
            cancelButtonColor: '#AE0C22',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                axios.put(route('usuarios.activar'), {
                    'id': id
                }).then((response) => {
                    router.get(route('usuarios.index', {
                        page: usuarios.current_page,
                        queryUsuarios: queryUsuarios,
                    }), {}, { preserveState: true, preserveScroll: true });
                    Swal.fire(
                        'Activado!',
                        'El registro ha sido activado con éxito.',
                        'success'
                    )
                }).catch(function (error) {
                    console.log(error);
                });


            } else if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.cancel
            ) {

            }
        })
    }

    const save = (e) => {
        e.preventDefault();
            if (operation === 1) {
                post(route("usuarios.store"),{
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: function (response) {
                        Swal.fire({
                            icon: "success",
                            title: "Usuario guardado Exitosamente!",
                            showConfirmButton: true,
                        }).then(() => {
                            setFormulario(false);
                            setListado(true);
                            router.get(
                                route("usuarios.index"), {
                                    page: usuarios.current_page,
                                    queryUsuarios: queryUsuarios,
                                },
                                { preserveState: true, preserveScroll: true }
                            );
                        });
                    }, onError: function (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Ocurrió un error!",
                            showConfirmButton: true,
                        });
                    },
                });
            }
        else {
            post(route("usuarios.update"),{
                preserveState: true, preserveScroll: true,
                onSuccess: function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Usuario Actualizado Exitosamente!",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        router.get(
                            route('usuarios.index', {
                                page: usuarios.current_page,
                                queryUsuarios: queryUsuarios,
                            }),
                            {},
                            { preserveState: true, preserveScroll: true }
                        );
                            setData({
                                id: '', persona: '', usuario: '', email: '', observaciones : '', superAdministrador: false
                            });
                    });
            }, onError: function (error) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error!",
                    showConfirmButton: true,
                });
            }});
        }
    }

    const getPersonas = () =>
    {
        axios.get(route('personas.getPersonas')).then((response) => {
            setListadoPersonas(response.data.personas);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getAplicativos = (id) =>
    {
        axios.post(route("usuarios.getAplicativosUser"),{'idUser':id}).then((response) => {
            let tenants = response.data.map((t) => {
                let data = JSON.parse(t.data)

                t.app = data.app
                t.nombre = data.nombre
                return t
            })

            setListadoAplicaciones(tenants);
            getApps(tenants)
        }).catch((error) => {
            console.log(error);
        });
    }

    const getApps = async (tenants) => {
        const res = await axios.get(route('aplicativos.list'),{
            params: {
                typeData: 'todos'
            }
        })
        setApps(
            res.data
        );
    }

    const inactivarAplicativo = (id) => {
        Swal.fire({
            icon: 'info',
            title: 'Esta Seguro de inactivar este Aplicativo?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#026882',
            cancelButtonColor: '#AE0C22',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                axios.put(route('usuarios.inactivarAplicativoUser'), {
                    'id': id
                }).then((response) => {
                   getAplicativos(data.id);
                    Swal.fire(
                        'Desactivado!',
                        'El aplicativo ha sido desactivado con éxito.',
                        'success'
                    )
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.cancel
            ) {}
        })
    }

    const activarAplicativo = (id) => {
        Swal.fire({
            icon: 'info',
            title: 'Esta Seguro de inactivar este Aplicativo?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#026882',
            cancelButtonColor: '#AE0C22',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                axios.put(route('usuarios.activarAplicativoUser'), {
                    'id': id
                }).then((response) => {
                   getAplicativos(id);
                    Swal.fire(
                        'Desactivado!',
                        'El aplicativo ha sido desactivado con éxito.',
                        'success'
                    )
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.cancel
            ) {}
        })
    }

    const addApp = () => {
        let dta2 = getValues()
        router.put(route('usuarios.addApp'),{
            id_usuario: data.id,
            id_aplicativo: dta2.app_id
        },{
            onSuccess: () => {
                toast.dismiss();
                getAplicativos(data.id)
                toast.success("Agregado con exito");
            },
            onError: () => {
                toast.dismiss();
                toast.error("Error al agregar el aplicativo");
            }
        })
    }

    const getSelectedPersona = (selectedOption) => {
        setData({...data, "persona":selectedOption.id});
    }

    const [showPassword, setShowPassword] = useState(false);
    const [passwordInputType, setPasswordInputType] = useState("password");

    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordInputType2, setPasswordInputType2] = useState("password");

    const togglePasswordVisibility = (tipo) => {
        if (tipo === 1) {
            setShowPassword((prevShowPassword) => !prevShowPassword);
            setPasswordInputType((prevPasswordInputType) =>
                prevPasswordInputType === "password" ? "text" : "password"
            );
        } else if (tipo === 2) {
            setShowPassword2((prevShowPassword2) => !prevShowPassword2);
            setPasswordInputType2((prevPasswordInputType2) =>
                prevPasswordInputType2 === "password" ? "text" : "password"
            );
        }
    };

    useEffect(()=>{
        getPersonas();
    },[]);
    useEffect(() => {
        getApps()
    },[listadoAplicaciones])

    useEffect(() => {
        setData("queryUsuarios", queryUsuarios);
    }, [queryUsuarios]);

    function handleSearch(e){
        e.preventDefault();
        get(route("usuarios.index"),{preserveState: true,preserveScroll: true});
    }

    return (
        <>
            <Head title="Usuarios" />
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <div className="max-w-[97%] mx-auto sm:px-6">
                        <div className="h-8 py px-2 overflow-hidden shadow-sm sm:rounded-md mb-5 border-[#E5E7EB] border">
                            <Link
                                href={route("usuarios.index")}
                                className="text-[#02558A] hover:text-[#0088be8c] text-lg font-roboto italic"> { translations.auth.users.users } </Link>
                            {formulario && operation === 1 && (
                                <span className='text-base text-gray-900'>/ { translations.auth.users.table.create }</span>
                            )}
                            {formulario && operation === 2 && (
                                <span className='text-base text-gray-900'>/ { translations.auth.users.table.edit }</span>
                            )}

                        </div>
                    </div>
                    <div className="max-w-[97%] mx-auto sm:px-6">
                        {listado && (
                            <div className="flex-col overflow-hidden shadow-sm sm:rounded-lg w-full ">
                                <div className="lg:flex items-center justify-between mb-6 px-1">
                                    <div className="justify-start lg:w-1/2 w-full mb-5">
                                        <div className="max-sm:ml-1 mt-2">
                                            <form className="inline-flex rounded-md shadow-sm w-full" onSubmit={handleSearch}>
                                                <input type="text"
                                                    className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                                    value={data.queryUsuarios}
                                                    placeholder={ translations.auth.users.search } onChange={(e) => setData("queryUsuarios", e.target.value)} />
                                                <button type="submit"
                                                        className="bg-transparent border-0 text-gray-900 -ml-6">
                                                    <i className="fa-solid fa-search"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-span-1 lg:col-span-4">&nbsp;</div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <div className="flex flex-row-reverse">
                                            <Link
                                                onClick={() => openModal(1)}
                                                className="btn_principal max-sm:text-xs"
                                                preserveScroll={true}
                                                preserveState={true}
                                            >
                                                <div className='w-4 h-4 mr-2'>
                                                    <Icon className="w-4 h-4 text-white fill-current group-hover:text-gray-300 focus:text-gray-300" name="agregar" />
                                                </div>
                                                { translations.auth.users.table.create }
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto bg-white rounded shadow">
                                    <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap mb-5">
                                        <thead className="border-t font-medium border-2 border-grey-900">
                                            <tr className="font-bold text-left bg-[#D0D3D4]">
                                                <th scope="col" className="titulo_tabla">#</th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.users.table.names } </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.users.table.user } </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.users.table.email } </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.users.table.super_admin } </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.users.table.state } </th>
                                                <th scope="col" className="titulo_tabla"> { translations.auth.users.table.actions } </th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-left'>
                                        {usuarios.data.map((usuario, i) => (
                                            <tr key={usuario.id} className="hover:bg-gray-50 focus-within:bg-gray-100 border-b">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {(i + 1)}
                                                </td>
                                                <td className="contenido_tabla">
                                                    {usuario.nombre + ' ' + usuario.apellido}
                                                </td>
                                                <td scope="row" className="px-6 py-4 text-blue-900 whitespace-nowrap font-roboto">
                                                    <span>
                                                        {usuario.usuario}
                                                    </span>
                                                </td>
                                                <td className="contenido_tabla">
                                                    {usuario.email}
                                                </td>
                                                <td className="whitespace-nowrap  px-6 py-4 font-bold font-roboto">
                                                    {usuario.super_administrador == true ? <p>Si</p> : <p>No</p>}
                                                </td>
                                                <td className="whitespace-nowrap  px-6 py-4 font-bold font-roboto">
                                                    {usuario.estado == true ?
                                                        <span className="badge badge-outline-success">{ translations.auth.state.active }</span>
                                                        :
                                                        <span className="badge badge-outline-danger">{ translations.auth.state.inactive }</span>
                                                    }
                                                </td>
                                                <td  className="contenido_tabla flex justify-around">
                                                    <div className='w-8 h-8'>
                                                        <TableButton
                                                            className='contenedor_boton_tabla'
                                                            onClick={() => openModal(2, usuario.id, usuario.id_persona, usuario.usuario,
                                                                usuario.email, usuario.observaciones, usuario.super_administrador)}>
                                                            <div className='w-6 h-6'>
                                                                <Icon className="editar_tabla " name="edit" />
                                                            </div>
                                                        </TableButton>
                                                    </div>
                                                    {usuario.estado == true ?
                                                        <div className='w-8 h-8'>
                                                            <TableButton
                                                                className='contenedor_boton_tabla'
                                                                onClick={() => inactivar(usuario.id)}>
                                                                <div className='w-6 h-6  '>
                                                                    <Icon className="eliminar_tabla " name="trash" />
                                                                </div>
                                                            </TableButton>
                                                        </div>
                                                        :
                                                        <div className='w-8 h-8'>
                                                            <TableButton
                                                                className='contenedor_boton_tabla'
                                                                onClick={() => activar(usuario.id)}>
                                                                <div className='w-6 h-6'>
                                                                    <Icon className="activar_tabla" name="comprobado" />
                                                                </div>
                                                            </TableButton>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                        {usuarios.data.length === 0 && (
                                            <tr>
                                                <td className="px-6 py-4 border-t" colSpan="5">
                                                    { translations.auth.not_found }
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {formulario && (
                            <>
                                <div className="mx-auto my-2">
                                    <div className="p-4 rounded shadow">
                                        <form name="createForm" onSubmit={save}>
                                            <div className='w-full p-2 grid grid-cols-6 gap-2'>
                                                <div className="px-3  lg:col-span-6 col-span-6">
                                                    <InputLabel
                                                        forInput="persona"
                                                        value={ translations.auth.users.form.person }
                                                        className="text-sm font-medium"
                                                    />
                                                    <DynamicSelect
                                                        multiple={false}
                                                        withIcons={true}
                                                        options={listadoPersonas}
                                                                errors={errors.persona}
                                                                value={data.persona}
                                                        valueKey="id"
                                                        labelKey="nom_completo"
                                                        onChange={getSelectedPersona}
                                                    />
                                                    <span className="text-red-600">
                                                        {errors.persona}
                                                    </span>
                                                </div>
                                                <div className="px-3  lg:col-span-3 col-span-6">
                                                    <InputLabel
                                                        forInput="usuario"
                                                        value={ translations.auth.users.form.user }
                                                        className="text-sm font-medium"
                                                    />
                                                    <TextInput id="usuario" type="text" className="mt-1 block w-full" name="usuario" placeholder="Usuario"
                                                        errors={errors.usuario} value={data.usuario} onChange={e => setData('usuario', e.target.value)}
                                                    />
                                                </div>
                                                <div className="px-3 lg:col-span-3 col-span-6">
                                                    <InputLabel
                                                        forInput="email"
                                                        value={ translations.auth.users.form.email }
                                                        className="text-sm font-medium"
                                                    />
                                                    <TextInput
                                                        id="email"
                                                        type="email"
                                                        className="mt-1 block w-full"
                                                        name="email"
                                                        value={data.email}
                                                        errors={errors.email}
                                                        onChange={(e)=> setData({...data, 'email': e.target.value})}
                                                        placeholder="Email"
                                                    />
                                                </div>
                                                <div className="px-3  lg:col-span-3 col-span-6">
                                                    <InputLabel
                                                        forInput="contrasena"
                                                        value={ translations.auth.users.form.password }
                                                        className="text-sm font-medium"
                                                    />
                                                    <div className="relative">
                                                        <TextInput
                                                            id="contrasena"
                                                            type={ passwordInputType }
                                                            className="mt-1 block w-full"
                                                            name="contrasena"
                                                            errors={errors.contrasena}
                                                            value={data.contrasena}
                                                            onChange={e => setData('contrasena', e.target.value)}
                                                            placeholder="Contraseña"

                                                        />
                                                        <button type="button"
                                                            onClick={() => { togglePasswordVisibility(1);}}
                                                            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700"
                                                        >
                                                            {showPassword ? (
                                                                <i
                                                                    className="fa fa-eye-slash"
                                                                    style={{ fontSize: "23px", }}
                                                                    aria-hidden="true"
                                                                ></i>
                                                            ) : (
                                                                <i
                                                                    className="fa fa-eye"
                                                                    style={{ fontSize: "23px", }}
                                                                    aria-hidden="true"
                                                                ></i>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="px-3  lg:col-span-3 col-span-6">
                                                    <InputLabel
                                                        forInput="contrasena2"
                                                        value={ translations.auth.users.form.confirm_password }
                                                        className="text-sm font-medium"
                                                    />
                                                    <div className="relative">
                                                        <TextInput
                                                            id="contrasena2"
                                                            type={ passwordInputType2 }
                                                            className="mt-1 block w-full"
                                                            errors={errors.contrasena2}
                                                            name="contrasena2"
                                                            onChange={e => setData('contrasena2', e.target.value)}
                                                            placeholder="Confirmar Contraseña"

                                                        />
                                                        <button type="button"
                                                                onClick={() => { togglePasswordVisibility(2);}}
                                                                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700"
                                                        >
                                                            {showPassword2 ? (
                                                                <i
                                                                    className="fa fa-eye-slash"
                                                                    style={{ fontSize: "23px", }}
                                                                    aria-hidden="true"
                                                                ></i>
                                                            ) : (
                                                                <i
                                                                    className="fa fa-eye"
                                                                    style={{ fontSize: "23px", }}
                                                                    aria-hidden="true"
                                                                ></i>
                                                            )}

                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="px-3  lg:col-span-3 col-span-6">
                                                    <InputLabel
                                                        forInput="observaciones"
                                                        value={ translations.auth.users.form.obs }
                                                        className="text-sm font-medium"
                                                    />
                                                    <textarea
                                                        id="observaciones"
                                                        name="observaciones"
                                                        value={data.observaciones}
                                                        onChange={e => setData('observaciones', e.target.value)}
                                                        rows="4"
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Observaciones...">
                                                    </textarea>
                                                </div>
                                                <div className="px-3  lg:col-span-3 col-span-6">
                                                    <InputLabel forInput="superAdministrador" value={ translations.auth.users.form.super_admin } className="text-sm font-medium" />
                                                    <input type="checkbox" value={data.superAdministrador} onChange={e => setData('superAdministrador', e.target.checked)} checked={data.superAdministrador} />
                                                </div>
                                                {operation === 2 && (
                                                    <div className="px-3  lg:col-span-6 col-span-6 mt-5">
                                                        <div className="grid md:grid-cols-2 items-end gap-2">
                                                            <span className="flex flex-col">
                                                                <label htmlFor="username">{ translations.auth.tenants.form.app }</label>
                                                                <Controller
                                                                    name="app_id"
                                                                    control={control}
                                                                    rules={{ required: translations.validation.attributes.field_required }}
                                                                    render={({ field, fieldState }) => (
                                                                        <>
                                                                            <Dropdown options={apps} filter optionLabel={a => `${a.app.name}: ${a.nombre}`} optionValue='id'
                                                                                value={field.value}
                                                                                onChange={(e) => field.onChange(e.value)}
                                                                                className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                                                            />
                                                                            {
                                                                                fieldState.error && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                                                            }
                                                                        </>

                                                                    )}
                                                                />
                                                            </span>
                                                            <div>
                                                                <Button label={ translations.auth.users.table_apps.add } type="button" onClick={() => addApp()} />
                                                            </div>
                                                        </div>
                                                        <InputLabel forInput="Aplicativos" value={ translations.auth.users.table_apps.app } className="text-sm font-medium" />

                                                        <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap mb-5 mt-5">
                                                            <thead className="border-t font-medium border-2 border-grey-900">
                                                                <tr className="font-bold text-left bg-[#D0D3D4]">
                                                                    <th scope="col" className="titulo_tabla">#</th>
                                                                    <th scope="col" className="titulo_tabla"> { translations.auth.users.table_apps.app } </th>
                                                                    <th scope="col" className="titulo_tabla"> { translations.auth.users.table_apps.type } </th>
                                                                    <th scope="col" className="titulo_tabla"> { translations.auth.users.table_apps.state } </th>
                                                                    <th scope="col" className="titulo_tabla text-center"> { translations.auth.users.table_apps.actions } </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='text-left'>
                                                                {listadoAplicaciones.map((apli, i) => (
                                                                    <tr key={i} className="hover:bg-gray-50 focus-within:bg-gray-100 border-b">
                                                                        <td className="whitespace-nowrap px-6 py-4">
                                                                            {(i + 1)}
                                                                        </td>
                                                                        <td className="contenido_tabla">
                                                                            {apli.nombre}
                                                                        </td>
                                                                        <td className="contenido_tabla">
                                                                            {apli.app.name}
                                                                        </td>
                                                                        <td className="whitespace-nowrap  px-6 py-4 font-bold font-roboto">
                                                                            {apli.estado == true ? <p>{ translations.auth.state.active }</p> : <p>{ translations.auth.state.inactive }</p>}
                                                                        </td>
                                                                        <td  className="contenido_tabla flex justify-around">
                                                                            {apli.estado == true ?
                                                                                <div className='w-8 h-8'>
                                                                                    <TableButton
                                                                                        className='contenedor_boton_tabla '
                                                                                        onClick={() => inactivarAplicativo(apli.id)}>
                                                                                        <div className='w-6 h-6  '>
                                                                                            <Icon className="eliminar_tabla " name="trash" />
                                                                                        </div>
                                                                                    </TableButton>
                                                                                </div>
                                                                                :
                                                                                <div className='w-8 h-8'>
                                                                                    <TableButton
                                                                                        className='contenedor_boton_tabla'
                                                                                        onClick={() => activarAplicativo(apli.id)}>
                                                                                        <div className='w-6 h-6'>
                                                                                            <Icon className="activar_tabla" name="comprobado" />
                                                                                        </div>
                                                                                    </TableButton>
                                                                                </div>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {(listadoAplicaciones ? listadoAplicaciones.length : 0) === 0 && (
                                                                    <tr>
                                                                        <td className="px-6 py-4 border-t text-center" colSpan="5">
                                                                            {  translations.auth.not_found  }
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid justify-items-stretch px-8 py-4 border-t border-gray-200">
                                                <div className="mt-4 justify-self-end space-x-2">
                                                    <button type="submit" className="px-3 py-2 rounded bg-[#002F65] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41]">
                                                        {operation === 1 && (
                                                            <div> { translations.auth.users.form.create }</div>
                                                        )}
                                                        {operation === 2 && (
                                                            <div> { translations.auth.users.form.edit }</div>
                                                        )}
                                                    </button>
                                                    <Link  href={route('usuarios.index', {
                                                            page: usuarios.current_page,
                                                            queryUsuarios: queryUsuarios,
                                                        })}
                                                        className="px-3 py-2 rounded bg-[#667379] text-white text-sm font-bold whitespace-nowrap hover:bg-[#595D60] focus:bg-[#6F7477]"
                                                    >
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
                            <Pagination className="mt-6" links={usuarios.links} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
