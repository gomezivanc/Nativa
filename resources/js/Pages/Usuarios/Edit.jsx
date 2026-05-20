import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import { useState, useEffect } from "react";
import { useForm, Link, usePage, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputSwitch } from "primereact/inputswitch"; // Importante
import { InputText } from "primereact/inputtext";   // Importante
import { Controller } from "react-hook-form";

export default function Edit({ errors, translations, allRoles, userRoles }) {
    const { usuario, persona } = usePage().props;
    const [getDependency, setGetDependency] = useState([]);
    const [typeDocs, setTypeDocs] = useState([]);
    const [regionals, setRegionals] = useState([]);
    const [charges, setCharges] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState(userRoles || []);

    // 1. Agregamos los campos de contratista al useForm
    let { data, setData, post, processing, reset, control } = useForm({
        id: usuario.id || "",
        nombres: persona.nombre || "",
        apellidos: persona.apellido || "",
        tipo_documento: persona.tipo_documento_id || persona.tipo_documento || "",
        numero_documento: persona.numero_documento || "",
        usuario: usuario.usuario || "",
        email: usuario.email || "",
        observaciones: usuario?.observaciones || "",
        id_persona: usuario?.id_persona || "",
        dependency_id: usuario?.dependency_id || "",
        regional_id: usuario?.regional_id || "",
        charge_id: usuario?.charge_id || "",
        is_contractor: !!usuario?.is_contractor,
        boss_mail: usuario?.boss_mail || "",
        fecha_finaliza: usuario?.fecha_finaliza || "",
        notification: usuario?.notification || 5,
        contrasena: "",
        contrasena2: "",
        roles: userRoles || [],
    });
    const passwordsMatch = data.contrasena && data.contrasena2 && data.contrasena === data.contrasena2;
    const regionalSelected = data.regional_id;
    const dependencySelected = data.dependency_id;
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        getRegionals();
        getTypeDocs();
    }, []);

    useEffect(() => {
        return () => {
            reset("contrasena", "contrasena2");
        };
    }, []);

    useEffect(() => {
        if (regionalSelected) {
            getDependencies(regionalSelected);

            if (!isInitialLoad) {
                setData("dependency_id", "");
                setData("charge_id", "");
                setCharges([]);
            }
        }
    }, [regionalSelected]);

    useEffect(() => {
        if (dependencySelected) {
            getCharges(dependencySelected, regionalSelected);

            if (!isInitialLoad) {
                setData("charge_id", "");
            }
        }
    }, [dependencySelected]);

    useEffect(() => {
        if (usuario?.regional_id) {
            getDependencies(usuario.regional_id);
        }

        if (usuario?.dependency_id) {
            getCharges(usuario.dependency_id, usuario.regional_id);
        }

        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (!regionalSelected) return;

        getDependencies(regionalSelected);

        if (!isInitialLoad) {
            setData("dependency_id", "");
            setData("charge_id", "");
            setCharges([]);
        }
    }, [regionalSelected]);

    useEffect(() => {
        if (!dependencySelected) return;

        getCharges(dependencySelected, regionalSelected);

        if (!isInitialLoad) {
            setData("charge_id", "");
        }
    }, [dependencySelected]);

    async function getDependencies(regionalId) {
        try {
            const res = await axios.get(route("dependencies.list"), {
                params: {
                    typeData: "todos",
                    regional_id: regionalId
                },
            });

            setGetDependency(res.data);

            const exists = res.data.find(d => d.id === data.dependency_id);

            if (!exists) {
                setData("dependency_id", "");
            }

        } catch (error) {
            toast.error(translations.auth.error);
        }
    }

    async function getRegionals() {
        const res = await axios.get(route('regional.list'),{
            params: {
                typeData: 'todos'
            }
        })
        setRegionals(res.data)
    }

    async function getCharges(dependencyId, regionalId = null) {
        try {
            const res = await axios.get(route("charges.list"), {
                params: {
                    typeData: "todos",
                    dependency_id: dependencyId,
                    id_regional: regionalId
                },
            });

            setCharges(res.data);

            const exists = res.data.find(c => c.id === data.charge_id);

            if (!exists) {
                setData("charge_id", "");
            }

        } catch (error) {
            toast.error(translations.auth.error);
        }
    }

    const getTypeDocs = async () => {
        try {
            const response = await axios.get(route('tipoDocumento.index'));
            setTypeDocs(response.data.tipoDocumentos);
        } catch (error) {
            console.log(error);
        }
    };

    const save = (e) => {
        e.preventDefault();

        if (data.contrasena || data.contrasena2) {
            if (data.contrasena !== data.contrasena2) {
                Swal.fire({
                    icon: "warning",
                    title: "Las contraseñas no coinciden",
                });
                return;
            }
        }

        post(route("usuarios.actualizarPerfil"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "Usuario Actualizado!",
                }).then(() => {
                    router.push(
                        route("main"),
                        {},
                        { preserveState: true, preserveScroll: true }
                    );
                });
            },
            onError: function (errors) {
                const mensajes = Object.values(errors).join("\n");

                Swal.fire({
                    icon: "error",
                    title: "Errores encontrados",
                    text: mensajes,
                });
            },
        });
    };

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

    return (
        <div className="min-h-screen py-6">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-600">
                            {translations.administration.user.form.edit_user}
                        </h2>
                    </div>

                        <form onSubmit={save} className="space-y-6">

                            {/* SECCIÓN CONTRATISTA */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex flex-col">
                                    <label className="font-semibold text-gray-700">¿Es contratista?</label>
                                    <InputSwitch
                                        checked={data.is_contractor}
                                        onChange={(e) => setData("is_contractor", e.value)}
                                    />
                                </div>
                            </div>

                            
                            {data.is_contractor == 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    {/* Correo Jefe Inmediato */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">Correo Jefe Inmediato</label>
                                        <InputText
                                            value={data.boss_mail}
                                            onChange={(e) => setData("boss_mail", e.target.value)}
                                            className={errors.boss_mail ? "p-invalid w-full" : "w-full"}
                                            placeholder="ejemplo@correo.com"
                                        />
                                        {errors.boss_mail && (
                                            <small className="text-red-600 mt-1">{errors.boss_mail}</small>
                                        )}
                                    </div>

                                    {/* Fecha de Finalización */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            Fecha de Finalización del contrato
                                        </label>
                                        <InputText
                                            type="date"
                                            // 1. Usamos split para limpiar "2026-04-27 15:14:27" -> "2026-04-27"
                                            value={data.fecha_finaliza ? data.fecha_finaliza.split(' ')[0] : ''} 
                                            
                                            // 2. Asegúrate que el nombre aquí sea el mismo que arriba
                                            onChange={(e) => setData("fecha_finaliza", e.target.value)}
                                            
                                            className={errors.fecha_finaliza ? "p-invalid w-full" : "w-full"}
                                        />
                                        {errors.fecha_finaliza && (
                                            <small className="text-red-600 mt-1">{errors.fecha_finaliza}</small>
                                        )}
                                    </div>

                                    {/* Tiempo de Notificación */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="notification">
                                            Días de notificación (mín. 5)
                                        </label>
                                        <InputText 
                                            id="notification"
                                            type='number'
                                            min={5}
                                            placeholder="Ej: 15" 
                                            value={data.notification}
                                            onChange={(e) => setData("notification", e.target.value)}
                                            className={errors.notification ? "p-invalid w-full" : "w-full"} 
                                        />
                                        {errors.notification && (
                                            <small className="text-red-600 mt-1">{errors.notification}</small>
                                        )}
                                    </div>
                                </div>
                            )}


                            {/* DATOS PERSONALES */}
                            <div>
                                <h3 className="text-md font-semibold text-gray-600 mb-4">
                                    {translations.administration.user.form.personal_information}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <InputLabel value={translations.auth.users.table.names} className="text-sm font-medium text-gray-600"/>
                                        <TextInput value={data.nombres} handleChange={(e) => setData("nombres", e.target.value)} className="mt-1 w-full"/>
                                    </div>

                                    <div>
                                        <InputLabel value={translations.auth.users.form.last_name} className="text-sm font-medium text-gray-600"/>
                                        <TextInput value={data.apellidos} handleChange={(e) => setData("apellidos", e.target.value)} className="mt-1 w-full" />
                                    </div>

                                    <div>
                                        <span className="flex flex-col gap-1">
                                            <label className="text-sm text-gray-600">
                                                {translations.auth.users.form.type_doc}
                                            </label>

                                            <Dropdown
                                                options={typeDocs}
                                                value={data.tipo_documento}
                                                optionLabel="nombre"
                                                optionValue="id"
                                                filter
                                                showClear
                                                placeholder="Seleccione"
                                                onChange={(e) => setData("tipo_documento", e.value)}
                                                className="w-full"
                                            />
                                        </span>
                                    </div>

                                    <div>
                                        <InputLabel value={translations.auth.users.form.num_doc} className="text-sm font-medium text-gray-600"/>
                                        <TextInput value={data.numero_documento} handleChange={(e) => setData("numero_documento", e.target.value)} className="mt-1 w-full" />
                                    </div>

                                </div>
                            </div>

                            {/* DATOS DE USUARIO */}
                            <div>
                                <h3 className="text-md font-semibold text-gray-600 mb-4">
                                    {translations.administration.user.form.access_information}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <InputLabel value={translations.administration.user.form.user} className="text-sm font-medium text-gray-600"/>
                                        <TextInput value={data.usuario} handleChange={(e)  => setData("usuario", e.target.value)} className="mt-1 w-full" />
                                    </div>

                                    <div>
                                        <InputLabel value={translations.administration.user.form.email} className="text-sm font-medium text-gray-600"/>
                                        <TextInput type="email" value={data.email} handleChange={(e)  => setData("email", e.target.value)} className="mt-1 w-full" />
                                    </div>

                                    <div>
                                        <span className="flex flex-col gap-1">
                                            <label className="text-sm text-gray-600">
                                                Roles
                                            </label>

                                            <MultiSelect display="chip" filter options={allRoles} optionLabel="name" optionValue="id" 
                                                placeholder="Seleccione roles" maxselectedlabels={3} className="w-full" value={data.roles}
                                                onChange={(e) => {
                                                    setData('roles', e.value || []);
                                                    setSelectedRoles(e.value || []);
                                                }}
                                            />
                                        </span>
                                    </div>

                                    <div>
                                        <span className="flex flex-col gap-1">
                                            <label className="text-sm text-gray-600">
                                                {translations.administration.user.form.regional}
                                            </label>

                                            <Dropdown
                                                options={regionals}
                                                value={data.regional_id}
                                                optionLabel="name"
                                                optionValue="id"
                                                filter
                                                showClear
                                                placeholder="Seleccione"
                                                onChange={(e) => setData("regional_id", e.value)}
                                                className="w-full"
                                            />
                                        </span>
                                    </div>

                                    <div>
                                        <span className="flex flex-col gap-1">
                                            <label className="text-sm text-gray-600">
                                                {translations.administration.user.form.dependency}
                                            </label>

                                            <Dropdown
                                                options={getDependency}
                                                value={data.dependency_id}
                                                disabled={!data.regional_id}
                                                optionLabel="name"
                                                optionValue="id"
                                                filter
                                                showClear
                                                placeholder="Seleccione"
                                                onChange={(e) => setData("dependency_id", e.value)}
                                                className="w-full"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:col-span-3">
                                <label>Cargo</label>
                                <Dropdown
                                    options={charges}
                                    value={data.charge_id}
                                    placeholder="Seleccione"
                                    optionLabel="cargo"
                                    optionValue="id"
                                    filter
                                    disabled={!dependencySelected}
                                    onChange={(e) => setData("charge_id", e.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* CONTRASEÑA */}
                            <div>
                                <h3 className="text-md font-semibold text-gray-600 mb-4">
                                    {translations.administration.user.form.security}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <InputLabel value="Contraseña" className="text-sm font-medium text-gray-600"/>
                                        <div className="relative">
                                            <TextInput
                                                type={passwordInputType}
                                                value={data.contrasena}
                                                handleChange={(e) => setData("contrasena", e.target.value)}
                                                className="mt-1 w-full pr-10"
                                            />
                                            <button type="button" onClick={() => togglePasswordVisibility(1)} className="absolute right-2 top-2 text-gray-500" >
                                                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel value="Confirmar contraseña" className="text-sm font-medium text-gray-600"/>
                                        <div className="relative">
                                            <TextInput
                                                type={passwordInputType2}
                                                value={data.contrasena2}
                                                handleChange={(e) => setData("contrasena2", e.target.value)}
                                                className="mt-1 w-full pr-10"
                                            />
                                            <button type="button" onClick={() => togglePasswordVisibility(2)} className="absolute right-2 top-2 text-gray-500" >
                                                <i className={`fa ${showPassword2 ? "fa-eye-slash" : "fa-eye"}`} />
                                            </button>
                                        </div>
                                        {data.contrasena2 && data.contrasena !== data.contrasena2 && (
                                            <span className="text-red-500 text-xs mt-1">
                                                Las contraseñas no coinciden
                                            </span>
                                        )}
                                        {data.contrasena2 && passwordsMatch && (
                                            <span className="text-green-500 text-xs mt-1">
                                                Las contraseñas coinciden
                                            </span>
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* OBSERVACIONES */}
                            <div>
                                <InputLabel value="Observaciones" className="text-sm font-medium text-gray-600"/>
                                <textarea
                                    value={data.observaciones}
                                    onChange={(e) => setData("observaciones", e.target.value)}
                                    rows="3"
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>

                            {/* BOTONES */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Link href={route('usuarios.index')} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600" >
                                    {translations.administration.permission.return}
                                </Link>

                                <button type="submit" className="px-4 py-2 rounded bg-[#002F65] text-white hover:bg-[#001E41]" >
                                    {translations.administration.permission.save}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
    );
}
