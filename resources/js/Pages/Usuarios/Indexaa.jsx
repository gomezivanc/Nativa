import DangerButton from "@/components/DangerButton";
import InputLabel from "@/components/InputLabel";
import TableButton from "@/components/TableButton";
import TextInput from "@/components/TextInput";
import { useState } from "react";
import { useForm, Link, usePage, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import DynamicSelect from "@/components/DynamicSelect";
import Icon from "@/components/Icon";
import Pagination from "@/components/Pagination";
import Select from 'react-select';

export default function Usuario({ errors }) {
    const { usuarios, tipo_documento, roles, queryUsuarios, translations } = usePage().props;

    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);

    const [operation, setOperation] = useState(1);

    const [getPersonas, setGetPersonas] = useState([]);
    const [validarPersona, setValidarPersona] = useState(false);
    const [disabledInput, setDisabledInput] = useState(false);
    const [disabledInputUser, setDisabledInputUser] = useState(false);

    const [hasMinimumLength, setHasMinimumLength] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecial, setHasSpecial] = useState(false);
    const [hasPasswordCoin, setHasPasswordCoin] = useState(true);
    const [validarSwal, setValidarSwal] = useState(0);

    const { data, setData, get, post, processing } = useForm({
        queryUsuarios: queryUsuarios || "",
        nombres: "",
        apellidos: "",
        nombre_tipo_doc: '',
        tipo_documento: 0,
        numero_documento: "",
        usuario: "",
        roles: [],
        email: "",
        contrasena: "",
        contrasena2: "",
        observaciones: "",
        val_persona: 0,
    });

    const openModal = (op, id, nombres, apellidos, n_tipo_documento, tipo_documento, numero_documento, usuario, roles, email, contrasena, observaciones, persona_id, dependency) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);
        consultaGetPersonas();
        if (op === 1) {
            setValidarPersona(false);
            setData({ nombres: "", apellidos: "", nombre_tipo_doc: "", tipo_documento: 0, numero_documento: "", usuario: "", roles: [], email: "", contrasena: "", contrasena2: "", observaciones: "" });
        } else {
            setValidarPersona(true);
            setDisabledInput(true);
            setData({ id: id, nombres: nombres, apellidos: apellidos, nombre_tipo_doc: n_tipo_documento, tipo_documento: tipo_documento, numero_documento: numero_documento, usuario: usuario, roles: roles, email: email, contrasena: "", contrasena2: "", observaciones: observaciones, persona_id: persona_id,dependency: dependency });
        }
    };

    const save = (e) => {
        e.preventDefault();
        if (disabledInputUser == false) {
            if (operation === 1) {
                setValidarSwal(1);
            } else if (operation === 2 && (data.contrasena !== '' || data.contrasena2 !== '')) {
                setValidarSwal(1);
            }
            if (!hasMinimumLength || !hasLowercase || !hasUppercase || !hasNumber || !hasSpecial || !hasPasswordCoin) {
                if (validarSwal == 1) {
                    Swal.fire('Error', '!Tienes que cumplir con los requerimientos para la contraseña¡', 'error');
                    return;
                }
            }
        }
        if (operation === 1) {
            axios.post(route("usuarios.store"), {
                nombres: data.nombres,
                apellidos: data.apellidos,
                tipo_documento: data.tipo_documento,
                numero_documento: data.numero_documento,
                usuario: data.usuario,
                roles: data.roles,
                dependency: data.dependency,
                email: data.email,
                contrasena: data.contrasena,
                contrasena2: data.contrasena2,
                observaciones: data.observaciones,
                val_persona: data.val_persona,
                val_user_exist: disabledInputUser == true ? 1 : 0,
            }).then(function (response) {
                if (response.data.status == 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Se ha registrado el usuario.",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        setHasMinimumLength(false);
                        setHasNumber(false);
                        setHasLowercase(false);
                        setHasUppercase(false);
                        setHasSpecial(false);
                        setDisabledInputUser(false);
                        router.get(route("usuarios.index"), {}, { preserveState: true, preserveScroll: true });
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.data.mensaje,
                        showConfirmButton: true,
                    });
                }
            }).catch((e) => {
                const mensaje_error = Object.values(e.response.data.errors);
                const mensaje = [];
                for (let i = 0; i < mensaje_error.length; i++) {
                    const subArray = mensaje_error[i][0] + '<br>';
                    mensaje.push(subArray);
                }
                Swal.fire({ icon: 'warning', html: mensaje.join(' ') });
            });
        } else {
            post(route("usuarios.update"), {
                id: data.id,
                nombres: data.nombres,
                apellidos: data.apellidos,
                tipo_documento: data.tipo_documento,
                numero_documento: data.numero_documento,
                usuario: data.usuario,
                rol: data.roles,
                dependency: data.dependency,
                email: data.email,
                password: data.contrasena,
                observaciones: data.observaciones,
                persona_id: data.persona_id,
                preserveState: true,
                preserveScroll: true,
                onSuccess: function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "Usuario Actualizado Exitosamente!",
                        showConfirmButton: true,
                    }).then(() => {
                        setFormulario(false);
                        setListado(true);
                        setHasMinimumLength(false);
                        setHasNumber(false);
                        setHasLowercase(false);
                        setHasUppercase(false);
                        setHasSpecial(false);
                        router.get(
                            route("usuarios.index"),
                            {},
                            { preserveState: true, preserveScroll: true }
                        );
                    });
                },
                onError: function (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error!",
                        showConfirmButton: true,
                    });
                },
            });
        }
    };

    const cambiarEstado = (id, estado) => {
        let nomEstado, titulo = '';
        if (estado == 1) {
            nomEstado = 'activar';
            titulo = 'Activado';
        } else {
            nomEstado = 'inactivar';
            titulo = 'Inactivado';
        }
        Swal.fire({
            title: 'Esta seguro de ' + nomEstado + ' el usuario?',
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#026882',
            cancelButtonColor: '#AE0C22',
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.value) {
                axios.put(route("usuarios.cambiarEstado"), {
                    id: id,
                    estado: estado,
                }).then((response) => {
                    router.get(route("usuarios.index"), {}, { preserveState: true, preserveScroll: true });
                    Swal.fire("Exitoso!", "El usuario ha sido " + titulo + " con éxito.", "success");
                }).catch(function (error) {
                    console.log(error);
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) { }
        });
    };

    const consultaGetPersonas = () => {
        axios.get(route('usuarios.personas')).then((response) => {
            setGetPersonas(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    const setPersona = (id) => {
        setValidarPersona(true);
        setDisabledInput(id === 0 ? false : true);
        getPersonas.map((persona) => {
            data.val_persona = id === 0 ? true : false;
            if (id === persona.id) {
                data.nombres = persona.nombres;
                data.apellidos = persona.apellidos;
                data.tipo_documento = persona.tipo_documento;
                data.nombre_tipo_doc = persona.nombre_tipo_doc;
                data.numero_documento = persona.numero_documento;
                data.usuario = persona.nombre_user;
                data.email = persona.email_user;
                setDisabledInputUser(persona.validar_user === 0 ? false : true);
            }
        });
    };

    const getSelectedTipoDocumento = (selectedOption) => {
        setData("tipo_documento", selectedOption.id);
    };

    const getSelectedRole = (selectedOption) => {
        setData(
            "roles",
            selectedOption.map((item) => item.id)
        );
    };
    const getSelectedDependency = (selectedOption) => {
        setData(
            "dependency",
            selectedOption.id
        );
    };

    const handlePasswordChange = (value) => {
        setData((prevData) => ({
            ...prevData,
            contrasena: value,
        }));
        handlePasswordMatch(value, data.contrasena2);
    };

    const handlePassword2Change = (value) => {
        setData((prevData) => ({
            ...prevData,
            contrasena2: value,
        }));
        handlePasswordMatch(data.contrasena, value);
    };

    const handlePasswordValidate = (passwordValidate) => {
        setHasMinimumLength(passwordValidate.length > 11 ? true : false);
        setHasNumber(/\d/.test(passwordValidate));
        setHasLowercase(/[a-z]/.test(passwordValidate));
        setHasUppercase(/[A-Z]/.test(passwordValidate));
        setHasSpecial(/[!@#$%^&*()_+\-=.]/.test(passwordValidate));
    };

    const handlePasswordMatch = (value1, value2) => {
        setHasPasswordCoin(value1 === value2);
    }

    const [showPassword, setShowPassword] = useState(false);
    const [passwordInputType, setPasswordInputType] = useState("password");

    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordInputType2, setPasswordInputType2] = useState("password");

    const togglePasswordVisibility = (id) => {
        if (id === 1) {
            setShowPassword((prevShowPassword) => !prevShowPassword);
            setPasswordInputType((prevPasswordInputType) =>
                prevPasswordInputType === "password" ? "text" : "password"
            );
        } else if (id === 2) {
            setShowPassword2((prevShowPassword2) => !prevShowPassword2);
            setPasswordInputType2((prevPasswordInputType2) =>
                prevPasswordInputType2 === "password" ? "text" : "password"
            );
        }
    };

    function handleSearch(e) {
        e.preventDefault();
        get(route("usuarios.index"), { preserveState: true, preserveScroll: true });
    }

    return (
        <>
            <Head title="Usuarios" />
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <div className="max-w-[97%] mx-auto sm:px-6">
                        <div className="h-8 py px-2 overflow-hidden shadow-sm sm:rounded-md mb-5 border-[#E5E7EB] border">
                            <Link href={route("usuarios.index")} className="text-[#02558A] hover:text-[#0088be8c] text-lg font-roboto italic" >
                                Usuarios{" "}
                            </Link>
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
                                            <form className="inline-flex rounded-md shadow-sm w-full" onSubmit={handleSearch} >
                                                <input type="text" className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                                    value={data.queryUsuarios} placeholder={ translations.auth.users.search }
                                                    onChange={(e) => setData("queryUsuarios", e.target.value)}
                                                />
                                                <button type="submit" className="bg-transparent border-0 text-gray-900 -ml-6" >
                                                    <i className="fa-solid fa-search"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <Link onClick={() => openModal(1)} className="btn_principal max-sm:text-xs" preserveScroll={true} preserveState={true} >
                                        <div className="w-4 h-4 mr-2">
                                            <Icon className="w-4 h-4 text-white fill-current group-hover:text-gray-300 focus:text-gray-300" name="agregar" />
                                        </div>
                                        { translations.auth.users.table.create }
                                    </Link>
                                </div>

                                <div className="overflow-x-auto bg-white rounded shadow">
                                    <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap mb-5">
                                        <thead className="border-t font-medium border-2 border-grey-900">
                                            <tr className="font-bold text-left bg-[#D0D3D4]">
                                                <th scope="col" className=" px-6 pt-5 pb-4" >
                                                    #
                                                </th>
                                                <th scope="col" className="titulo_tabla">
                                                    { translations.auth.users.table.names }
                                                </th>
                                                <th scope="col" className="titulo_tabla">
                                                { translations.auth.users.table.user }
                                                </th>
                                                <th scope="col" className="titulo_tabla">
                                                    { translations.auth.users.table.rol }
                                                </th>
                                                <th scope="col" className="titulo_tabla">
                                                    { translations.auth.users.table.email }
                                                </th>
                                                <th scope="col" className="titulo_tabla">
                                                    { translations.auth.users.table.state }
                                                </th>
                                                <th scope="col" className="titulo_tabla">
                                                        
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-left">
                                            {usuarios.data.map((usuario, i) => (
                                                <tr key={usuario.id} className="hover:bg-gray-50 focus-within:bg-gray-100 border-b" >
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {i + 1}
                                                    </td>
                                                    <th scope="row" className="contenido_tabla " >
                                                        {usuario.nombre}{" "}{usuario.apellidos}
                                                    </th>
                                                    <td className="px-6 py-4 text-blue-900 whitespace-nowrap font-roboto">
                                                        {usuario.usuario}
                                                    </td>
                                                    <td className="contenido_tabla">
                                                        {usuario.rol_nom}
                                                    </td>
                                                    <td className="contenido_tabla">
                                                        {usuario.email}
                                                    </td>
                                                    <td className="whitespace-nowrap  px-6 py-4 font-bold font-roboto">
                                                        {usuario.estado ==
                                                            true ? (
                                                            <p>Activo</p>
                                                        ) : (
                                                            <p>Inactivo</p>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap border-r px-3 py-2 space-x-2 centrar">
                                                        <div className="w-8 h-8">
                                                            <TableButton
                                                                className="contenedor_boton_tabla"
                                                                onClick={() =>
                                                                    openModal(
                                                                        2,
                                                                        usuario.id,
                                                                        usuario.nombre,
                                                                        usuario.apellidos,
                                                                        usuario.n_tipo_documento,
                                                                        usuario.tipo_documento,
                                                                        usuario.numero_documento,
                                                                        usuario.usuario,
                                                                        usuario.idrol,
                                                                        usuario.email,
                                                                        "",
                                                                        usuario.observaciones,
                                                                        usuario.persona_id,
                                                                        usuario.dependency,
                                                                    )
                                                                }
                                                            >
                                                                <div className="w-6 h-6  ">
                                                                    <Icon className="editar_tabla " name="edit" />
                                                                </div>
                                                            </TableButton>
                                                        </div>
                                                        {usuario.estado == true ? (
                                                            <div className="w-8 h-8">
                                                                <TableButton className="contenedor_boton_tabla " onClick={() => cambiarEstado(usuario.id, 0)} >
                                                                    <div className="w-6 h-6  ">
                                                                        <Icon className="eliminar_tabla " name="trash" />
                                                                    </div>
                                                                </TableButton>
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8">
                                                                <TableButton className="contenedor_boton_tabla" onClick={() => cambiarEstado(usuario.id, 1)} >
                                                                    <div className="w-6 h-6">
                                                                        <Icon className="activar_tabla" name="comprobado" />
                                                                    </div>
                                                                </TableButton>
                                                            </div>
                                                        )
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                            {usuarios.data.length === 0 && (
                                                <tr>
                                                    <td className="px-6 py-4 border-t" colSpan="4" >
                                                        No se encuentran usuarios.
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
                                            {operation === 1 && (
                                                <div className="w-full p-2 grid grid-cols-6 gap-2">
                                                    <div className="px-3 lg:col-span-12 col-span-12 mb-2">
                                                        <InputLabel
                                                            forInput="personas"
                                                            value={ translations.auth.users.form.person }
                                                            className="text-sm font-medium"
                                                        />
                                                        <DynamicSelect
                                                            multiple={false}
                                                            withIcons={true}
                                                            options={getPersonas}
                                                            valueKey="id"
                                                            labelKey="nombre"
                                                            onChange={(selectedOption) => {
                                                                consultaGetPersonas
                                                                setPersona(selectedOption.id);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {validarPersona && (
                                                <>
                                                    <div className="w-full p-2 grid grid-cols-6 gap-2">
                                                        <div className="px-3 lg:col-span-3 col-span-6">
                                                            <InputLabel forInput="nombre" value={ translations.auth.users.table.names } className="text-sm font-medium" />
                                                            {disabledInput && (
                                                                <TextInput
                                                                    id="nombres"
                                                                    className="mt-1 block"
                                                                    name="nombres"
                                                                    value={data.nombres}
                                                                    disabled={disabledInput}
                                                                    onFocus={(e) => e.target.blur()}
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                />
                                                            )}
                                                            {disabledInput == false && (
                                                                <TextInput
                                                                    id="nombres"
                                                                    type="text"
                                                                    className="mt-1 block"
                                                                    name="nombres"
                                                                    errors={errors.nombres}
                                                                    value={data.nombres}
                                                                    onChange={(e) => setData("nombres", e.target.value)}
                                                                    placeholder="Nombres"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="px-3  lg:col-span-3 col-span-6">
                                                            <InputLabel forInput="apellido" value={ translations.auth.users.form.last_name } className="text-sm font-medium" />
                                                            {disabledInput && (
                                                                <TextInput
                                                                    id="apellios"
                                                                    className="mt-1 block"
                                                                    name="apellidos"
                                                                    value={data.apellidos}
                                                                    disabled={disabledInput}
                                                                    onFocus={(e) => e.target.blur()}
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                />
                                                            )}
                                                            {disabledInput == false && (
                                                                <TextInput
                                                                    id="apellios"
                                                                    type="text"
                                                                    className="mt-1 block"
                                                                    name="apellidos"
                                                                    errors={errors.apellidos}
                                                                    value={data.apellidos}
                                                                    onChange={(e) => setData("apellidos", e.target.value)}
                                                                    placeholder="Apellidos"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="px-3  lg:col-span-3 col-span-6">
                                                            <InputLabel forInput="tipo_documento" value={ translations.auth.users.form.type_doc } className="text-sm font-medium" />
                                                            {disabledInput && (
                                                                <TextInput
                                                                    id="nombre_tipo_doc"
                                                                    className="mt-1 block"
                                                                    name="nombre_tipo_doc"
                                                                    value={data.nombre_tipo_doc}
                                                                    disabled={disabledInput}
                                                                    onFocus={(e) => e.target.blur()}
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                />
                                                            )}
                                                            {disabledInput == false && (
                                                                <DynamicSelect
                                                                    multiple={false}
                                                                    withIcons={true}
                                                                    options={tipo_documento}
                                                                    errors={errors.tipo_documento}
                                                                    value={data.tipo_documento}
                                                                    valueKey="id"
                                                                    labelKey="nombre"
                                                                    onChange={getSelectedTipoDocumento}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="px-3  lg:col-span-3 col-span-6">
                                                            <InputLabel forInput="documento" value={ translations.auth.users.form.num_doc } className="text-sm font-medium" />
                                                            {disabledInput && (
                                                                <TextInput
                                                                    id="numero_documento"
                                                                    className="mt-1 block"
                                                                    name="numero_documento"
                                                                    value={data.numero_documento}
                                                                    disabled={disabledInput}
                                                                    onFocus={(e) => e.target.blur()}
                                                                />
                                                            )}
                                                            {disabledInput == false && (
                                                                <TextInput
                                                                    id="numero_documento"
                                                                    type="text"
                                                                    className="mt-1 block"
                                                                    name="numero_documento"
                                                                    errors={errors.numero_documento}
                                                                    value={data.numero_documento}
                                                                    onChange={(e) => setData("numero_documento", e.target.value)}
                                                                    placeholder="Numero de documento"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="px-3  lg:col-span-2 col-span-6">
                                                            <InputLabel forInput="usuario" value={ translations.auth.users.form.user } className="text-sm font-medium" />
                                                            {disabledInputUser && (
                                                                <TextInput
                                                                    id="usuario"
                                                                    className="mt-1 block"
                                                                    name="usuarios"
                                                                    value={data.usuario}
                                                                    disabled={disabledInputUser}
                                                                    onFocus={(e) => e.target.blur()}
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                />
                                                            )}
                                                            {disabledInputUser == false && (
                                                                <TextInput
                                                                    id="usuario"
                                                                    type="text"
                                                                    className="mt-1 block"
                                                                    name="usuario"
                                                                    errors={errors.usuario}
                                                                    value={data.usuario}
                                                                    onChange={(e) => setData("usuario", e.target.value)}
                                                                    placeholder="Usuario"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="px-3  lg:col-span-2 col-span-6">
                                                            <InputLabel forInput="rol" value={ translations.auth.users.form.rol } className="text-sm font-medium" />
                                                            <DynamicSelect
                                                                urlRoute={"roles.all"}
                                                                onChange={getSelectedRole}
                                                                value={data.roles}
                                                                multiple={true}
                                                                labelKey={"name"}
                                                            />
                                                        </div>
                                                        <div className="px-3  lg:col-span-2 col-span-6">
                                                            <InputLabel forInput="rol" value={ translations.auth.users.form.dependency } className="text-sm font-medium" />
                                                            <DynamicSelect
                                                                urlRoute={"dependencies.list"}
                                                                parentSearch='typeData'
                                                                parentValue='typeData'
                                                                onChange={getSelectedDependency}
                                                                value={data.dependency}
                                                                multiple={false}
                                                                labelKey={"name"}
                                                            />
                                                        </div>
                                                        <div className="px-3  lg:col-span-2 col-span-6">
                                                            <InputLabel forInput="email" value="Email" className="text-sm font-medium" />
                                                            {disabledInputUser && (
                                                                <TextInput
                                                                    id="email"
                                                                    className="mt-1 block"
                                                                    name="email"
                                                                    value={data.email}
                                                                    disabled={disabledInputUser}
                                                                    onFocus={(e) => e.target.blur()}
                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                />
                                                            )}
                                                            {disabledInputUser == false && (
                                                                <TextInput
                                                                    id="email"
                                                                    type="text"
                                                                    className="mt-1 block"
                                                                    name="email"
                                                                    errors={errors.email}
                                                                    value={data.email}
                                                                    onChange={(e) => setData("email", e.target.value)}
                                                                    placeholder="Email"
                                                                />
                                                            )}

                                                        </div>
                                                    </div>
                                                    {disabledInputUser == false && (
                                                        <>
                                                            <div className="w-full p-2 grid grid-cols-6 gap-2 mt-5">
                                                                <div className="px-3  lg:col-span-12 flex justify-center items-center">
                                                                    <small id="passwordHelp" className="form-text text-muted text-lg">
                                                                        { translations.auth.users.form.pass_message }:
                                                                        <span>
                                                                            <span className={hasMinimumLength ? 'has_required' : ''} style={{ color: hasMinimumLength ? 'green' : 'red', textDecoration: hasMinimumLength ? 'line-through' : 'none' }}>
                                                                                { translations.auth.users.form.hasMinimumLength }
                                                                            </span>,
                                                                            <span className={hasLowercase ? 'has_required' : ''} style={{ color: hasLowercase ? 'green' : 'red', textDecoration: hasLowercase ? 'line-through' : 'none' }}>
                                                                                { translations.auth.users.form.hasLowercase }
                                                                            </span>,
                                                                            <span className={hasUppercase ? 'has_required' : ''} style={{ color: hasUppercase ? 'green' : 'red', textDecoration: hasUppercase ? 'line-through' : 'none' }}>
                                                                                { translations.auth.users.form.hasUppercase }
                                                                            </span>,
                                                                            <span className={hasNumber ? 'has_required' : ''} style={{ color: hasNumber ? 'green' : 'red', textDecoration: hasNumber ? 'line-through' : 'none' }}>
                                                                                { translations.auth.users.form.hasNumber }
                                                                            </span>,
                                                                            <span className={hasSpecial ? 'has_required' : ''} style={{ color: hasSpecial ? 'green' : 'red', textDecoration: hasSpecial ? 'line-through' : 'none' }}>
                                                                                { translations.auth.users.form.hasSpecial }
                                                                            </span>.
                                                                        </span>
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div className="w-full p-2 grid grid-cols-6 gap-2">
                                                                <div className="px-3  lg:col-span-3 col-span-6">
                                                                    <InputLabel forInput="contrasena" value={ translations.auth.users.form.password } className="text-sm font-medium" />
                                                                    <div className="relative">
                                                                        <TextInput
                                                                            id="contrasena"
                                                                            type={passwordInputType}
                                                                            className="mt-1 block"
                                                                            name="contrasena"
                                                                            errors={errors.contrasena}
                                                                            value={data.contrasena}
                                                                            onChange={(e) => {
                                                                                handlePasswordChange(e.target.value)
                                                                                handlePasswordValidate(e.target.value)
                                                                            }}
                                                                            placeholder="Contraseña"
                                                                            autoComplete="off"
                                                                        />
                                                                        <button type="button" onClick={() => { togglePasswordVisibility(1); }}
                                                                            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700"
                                                                        >
                                                                            {showPassword ? (
                                                                                <i className="fa fa-eye-slash" style={{ fontSize: "23px", }} aria-hidden="true"></i>
                                                                            ) : (
                                                                                <i className="fa fa-eye" style={{ fontSize: "23px", }} aria-hidden="true"></i>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="px-3  lg:col-span-3 col-span-6">
                                                                    <InputLabel forInput="contrasena2" value={ translations.auth.users.form.confirm_password } className="text-sm font-medium" />
                                                                    <div className="relative">
                                                                        <TextInput
                                                                            id="contrasena2"
                                                                            type={passwordInputType2}
                                                                            className="mt-1 block"
                                                                            errors={errors.contrasena2}
                                                                            name="contrasena2"
                                                                            onChange={(e) => { handlePassword2Change(e.target.value) }}
                                                                            placeholder="Contraseña"
                                                                            autoComplete="off"
                                                                        />
                                                                        <button type="button" onClick={() => { togglePasswordVisibility(2); }}
                                                                            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700" >
                                                                            {showPassword2 ? (
                                                                                <i className="fa fa-eye-slash" style={{ fontSize: "23px", }} aria-hidden="true"></i>
                                                                            ) : (
                                                                                <i className="fa fa-eye" style={{ fontSize: "23px", }} aria-hidden="true"></i>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-full p-2 grid grid-cols-6 gap-2 mt-5">
                                                                <div className="px-3  lg:col-span-12 flex justify-center items-center">
                                                                    <small id="passwordHelp" className="form-text text-muted text-lg">
                                                                        <span className={hasPasswordCoin ? 'has_required' : ''} style={{ color: hasPasswordCoin ? 'green' : 'red', textDecoration: hasPasswordCoin ? 'line-through' : 'none' }}>
                                                                            {hasPasswordCoin ? 'La contraseña coincide' : 'La contraseña no coincide'}
                                                                        </span>
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div className="w-full p-2 grid grid-cols-6 gap-2 mt-5">
                                                                <div className="px-3  lg:col-span-6 col-span-6">
                                                                    <InputLabel forInput="observaciones" value={ translations.auth.users.form.obs } className="text-sm font-medium" />
                                                                    <textarea
                                                                        id="observaciones"
                                                                        name="observaciones"
                                                                        value={data.observaciones}
                                                                        onChange={(e) => setData("observaciones", e.target.value)}
                                                                        rows="4"
                                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Observaciones..."
                                                                    ></textarea>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            <div className="grid justify-items-stretch px-8 py-4 border-t border-gray-200">
                                                <div className="mt-4 justify-self-end space-x-2">
                                                    {validarPersona && (
                                                        <button type="submit" className="px-3 py-2 rounded bg-[#002F65] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41]">
                                                            {operation === 1 && (
                                                                <div>{ translations.auth.users.form.create }</div>
                                                            )}
                                                            {operation === 2 && (
                                                                <div> { translations.auth.users.form.edit }</div>
                                                            )}
                                                        </button>
                                                    )}
                                                    <Link href={route("usuarios.index")} className="px-3 py-2 rounded bg-[#667379] text-white text-sm font-bold whitespace-nowrap hover:bg-[#595D60] focus:bg-[#6F7477]">
                                                        { translations.auth.back }
                                                    </Link>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Cierre Formulario */}
                    </div>
                    {listado && (
                        <Pagination
                            className="mt-6 mb-5"
                            links={usuarios.links}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
