import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { useEffect, useState,useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import { useLoading } from "../../Context/preloadContext";
import Upload from "../../components/Upload";
import DropdownG from '../../components/Globals/Drodown';
import SignatureCanvas from "react-signature-canvas"
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";

export default function Index({
    id,
    translations,
    id_person,
    userRoles,
    userDependecy,
    signatureURL
}) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control,
        watch,
    } = useForm({
        defaultValues: {
            id_role: [], // Valor inicial vacío
        },
    });
    useEffect(() => {
        if (signatureURL && sigCanvas.current) {

            fetch(`${window.location.origin}/getfile?path=${signatureURL}`) // Cargar imagen desde la URL
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        sigCanvas.current.fromDataURL(reader.result); // Cargar firma en el canvas
                        setIsEmpty(false);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch((error) => console.error("Error cargando la firma:", error));
        }
    }, []);

    const sigCanvas = useRef(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const clear = () => {
        sigCanvas.current.clear()
        setIsEmpty(true)
    }
    const { setIsLoading } = useLoading();
    const [getPersonas, setGetPersonas] = useState([]);
    const [getDependency, setGetDependency] = useState([]);
    const [typeDocs, setTypeDocs] = useState([]);
    const [getRole, setRole] = useState([]);
    const [regionals,setRegionals] = useState([])
    const [charges, setCharges] = useState([]);
    const regionalSelected = watch("regional_id");    
    const person = watch("person");
    const dependencySelected = watch("id_dependency");
    const isContractor = watch("is_contractor");

    useEffect(() => {
        consultaGetPersonas();
        getRegionals();
        getRoles();
        setUserRoles();
        getTypeDocs();
        setUserDependency();
    }, []);
    useEffect(() => {
        setPersona(person);
    }, [person]);

    useEffect(() => {
        if (regionalSelected) {
            getDependencies(regionalSelected);
            setValue("id_dependency", null);
            setValue("id_charge", null);
        }
    }, [regionalSelected]);

    useEffect(() => {
        if (dependencySelected) {
            getCharges(dependencySelected, regionalSelected);
            setValue("id_charge", null);
        }
    }, [dependencySelected]);

    function fileChange(e) {
        if(e.length > 0) {
            setValue('file', e[0]?.data);
            setValue('filename', e[0]?.name);
        }
    }
    
    async function submit(data) {
        setIsLoading(true);
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const signatureData = sigCanvas.current.toDataURL("image/png");
            data.signature = signatureData; // Agrega la firma al objeto data
        } else {
            console.warn("No hay firma registrada.");
        }
        data.is_edit = id ? true : false;

        try {
            const res = await axios.post(route("usuarios.store"), data);
            toast.success(translations.auth.success);
            router.visit(route("usuarios.index"));
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    async function getItem(id) {
        const res = await axios.get(route("usuarios.show", id));
        if (res.data.id_dependency) {
            await getCharges(res.data.id_dependency, res.data.regional_id);
        }
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }
    }
    const consultaGetPersonas = () => {
        axios
            .get(route("usuarios.personas"))
            .then((response) => {
                setGetPersonas(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                if (id) {
                    setValue("person", id_person);
                }
            });
    };
    const getTypeDocs = async () => {
        try {
            const response = await axios.get(route('tipoDocumento.index'));
            setTypeDocs(response.data.tipoDocumentos);
        } catch (error) {
            console.log(error);
        }
    };

    const setPersona = (id) => {
        const persona = getPersonas.find((p) => p.id == id);
        if (!persona) {
            return;
        }
        setValue("first_name", persona.nombres);
        setValue("last_name", persona.apellidos);
        setValue("document_type", persona.tipo_documento);
        setValue("id_number", persona.numero_documento);
        setValue("user", persona.nombre_user);
        setValue("email", persona.email_user);
        setValue("observations", persona.observaciones);
    };

    async function getRegionals() {
        const res = await axios.get(route('regional.list'),{
            params: {
                typeData: 'todos'
            }
        })
        setRegionals(res.data)
    }

    async function getDependencies(regionalId) {
        try {
            const res = await axios.get(route("dependencies.list"), {
                params: {
                    typeData: "todos",
                    regional_id: regionalId
                },
            });

            setGetDependency(res.data);
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        }
    }

    async function getCharges(dependencyId, regionalId = null) {
        try {
            const res = await axios.get(route("charges.list"), {
                params: {
                    typeData: "todos",
                    id_dependency: dependencyId,
                    id_regional: regionalId // opcional
                },
            });

            setCharges(res.data);
        } catch (error) {
            toast.error(translations.auth.error);
        }
    }

    async function getRoles() {
        try {
            const res = await axios.get(route("roles.list"), {
                params: {
                    typeData: "todos",
                },
            });
            setRole(res.data);
        } catch (error) {
            if (error.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error(translations.auth.error);
            }
        }
    }
    function setUserRoles() {
        if (userRoles && userRoles.length > 0) {
            const roleIds = userRoles; // No es necesario mapear si ya son IDs
            setValue("id_role", roleIds); // Establecer los valores en el formulario
        }
    }
    function setUserDependency() {
        setValue("id_dependency", userDependecy);
    }

    return (
        <div>
            <div className="md:px-20">
                <Card
                    header={
                        <div className="p-5 flex gap-1 flex-col">
                            <div>
                                <Link href={route("usuarios.index")}>
                                    <Button
                                        label={translations.auth.back}
                                        size="small"
                                    />
                                </Link>
                            </div>
                        </div>
                    }
                >
                    <form onSubmit={handleSubmit(submit)} className="grid gap-2 grid-cols-1 md:grid-cols-6 items-end">
                        <h2 className="md:col-span-6 font-bold">
                            {translations.administration.user.title}
                        </h2>

                        <span className="flex flex-col md:col-span-6">
                            <label htmlFor="username">{ '¿Es contratista?'}</label>
                            <Controller
                                name="is_contractor"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputSwitch trueValue={1} falseValue={0}
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={{ 'p-invalid': fieldState.error, 'w-full p-inputtext-sm': true }}
                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>
                                )}
                            />
                        </span>
                        {isContractor && (
                            <>
                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="boss_mail">
                                        {'Correo Jefe Inmediato'}
                                    </label>
                                    <InputText

                                        {...register("boss_mail", {
                                            required:
                                                translations.validation.attributes
                                                    .field_required,
                                        })}
                                        className={{
                                            "p-invalid": errors?.boss_mail,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.boss_mail && (
                                        <span className="text-red-600">
                                            {errors.boss_mail?.message}
                                        </span>
                                    )}
                                </span>

                                <span className="flex flex-col md:col-span-2">
                                    <label htmlFor="boss_mail">
                                        {'Fecha de Finalizacion del contrato'}
                                    </label>
                                    <InputText
                                        type="date"
                                        {...register("boss_mail", {
                                            required:
                                                translations.validation.attributes
                                                    .field_required,
                                        })}
                                        className={{
                                            "p-invalid": errors?.boss_mail,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.boss_mail && (
                                        <span className="text-red-600">
                                            {errors.boss_mail?.message}
                                        </span>
                                    )}
                                </span>


                            <span className="flex flex-col md:col-span-2">
                                <label htmlFor="notification">
                                    Tiempo de notificación
                                </label>

                                <InputText 
                                    type='number'
                                    min={5}
                                    placeholder={translations.filing.standard_filing.form.remaining_days} 
                                    {...register("notification", { 
                                        required: translations.validation.attributes.field_required,
                                        validate: (value) => {
                                            const num = parseInt(value);
                                            if (isNaN(num)) return "Debe ser un número válido";
                                            return num >= 5 || "Debe ser mínimo 5 días";
                                        }
                                    })} 
                                    className={{ 'p-invalid': errors?.notification, 'w-full': true }} 
                                />
                            </span>
                            </>
                        )}
                        
                        <hr className="md:col-span-6" />
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="first_name">
                                {
                                    translations.administration.user.form
                                        .first_name
                                }
                            </label>
                            <InputText

                                {...register("first_name", {
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.first_name,
                                    "w-full": true,
                                }}
                            />
                            {errors?.first_name && (
                                <span className="text-red-600">
                                    {errors.first_name?.message}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="last_name">
                                {
                                    translations.administration.user.form
                                        .last_name
                                }
                            </label>
                            <InputText

                                {...register("last_name", {
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.last_name,
                                    "w-full": true,
                                }}
                            />
                            {errors?.last_name && (
                                <span className="text-red-600">
                                    {errors.last_name?.message}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="document_type">
                                {
                                    translations.administration.user.form
                                        .document_type
                                }
                            </label>
                            <DropdownG options={typeDocs} optionValue="id" optionLabel="nombre" control={control} name="document_type" rules={{ required: translations.validation.attributes.field_required }} />
                            {errors?.name_module && (
                                <span className="text-red-600">
                                    {errors.name_module?.message}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="id_number">
                                {
                                    translations.administration.user.form
                                        .id_number
                                }
                            </label>
                            <InputText
                                maxLength={20}
                                {...register("id_number", {
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.sigla,
                                    "w-full": true,
                                }}
                            />
                            {errors?.name_module && (
                                <span className="text-red-600">
                                    {errors.name_module?.message}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="user">
                                {translations.administration.user.form.user} 
                            </label>
                            <InputText
                                disabled={id}
                                maxLength={20}
                                {...register("user", {
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.sigla,
                                    "w-full": true,
                                }}
                            />
                            {errors?.name_module && (
                                <span className="text-red-600">
                                    {errors.name_module?.message}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="username">
                                {translations.administration.user.form.role}
                            </label>
                            <Controller
                                name="id_role"
                                control={control}
                                rules={{
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <MultiSelect
                                            display="chip"
                                            onChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                            filter
                                            options={getRole}
                                            optionLabel="name"
                                            optionValue="id"
                                            placeholder={
                                                translations.auth.select_opcion
                                            }
                                            maxselectedlabels={3}
                                            className={{
                                                "p-invalid": fieldState.error,
                                                "w-full": true,
                                            }}
                                            value={field.value}
                                        />

                                        {fieldState.error && (
                                            <span className="text-red-600 w-full">
                                                {fieldState.error?.message}
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </span>
                        
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="username">{ translations.configuration.provider.form.regional_id }</label>
                            <Controller
                                name="regional_id"
                                control={control}
                                rules={{
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={regionals}
                                            placeholder={
                                                translations.auth.select_opcion
                                            }
                                            optionLabel='name'
                                            optionValue='id'
                                            filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={{ 'p-invalid': fieldState.error, 'w-full': true }}
                                        />
                                        {
                                            fieldState.error  && <span className="text-red-600 w-full">{fieldState.error?.message}</span>
                                        }
                                    </>

                                )}
                            />
                        </span>

                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="dependency">
                                { translations.administration.user.form.dependency}
                            </label>
                            <Controller
                                name="id_dependency"
                                control={control}
                                rules={{
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={getDependency}
                                            placeholder={ translations.auth.select_opcion }
                                            disabled={!regionalSelected}
                                            showClear
                                            optionLabel="name"
                                            optionValue="id"
                                            filter
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                            className={{
                                                "p-invalid": fieldState.error,
                                                "w-full ": true,
                                            }}
                                        />

                                        {fieldState.error && (
                                            <span className="text-red-600 w-full">
                                                {fieldState.error?.message}
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </span>

                        <span className="flex flex-col md:col-span-3">
                            <label>Cargo</label>
                            <Controller
                                name="id_charge"
                                control={control}
                                rules={{
                                    required: translations.validation.attributes.field_required,
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={charges}
                                            optionLabel="cargo"
                                            optionValue="id"
                                            placeholder={translations.auth.select_opcion}
                                            filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            disabled={!dependencySelected}
                                            className={{
                                                "p-invalid": fieldState.error,
                                                "w-full": true,
                                            }}
                                        />
                                        {fieldState.error && (
                                            <span className="text-red-600">
                                                {fieldState.error.message}
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </span>

                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="email">
                                {translations.administration.user.form.email}
                            </label>
                            <InputText
                                maxLength={50}
                                {...register("email", {
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.email,
                                    "w-full": true,
                                }}
                            />
                            {errors?.name_module && (
                                <span className="text-red-600">
                                    {errors.name_module?.message}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-6">
                            <label htmlFor="password">
                                {translations.administration.user.form.password}
                            </label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Password
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(e.target.value)}
                                            inputClassName="w-full"
                                            className={{
                                                "p-invalid": fieldState.error,
                                                "w-full": true,
                                            }}
                                        />

                                        {fieldState.error && (
                                            <span className="text-red-600 w-full">
                                                {fieldState.error?.message}
                                            </span>
                                        )}
                                    </>
                                )}
                            />

                            {errors?.password && ( <span className="text-red-600"> {errors.password?.message} </span> )}
                        </span>
                        <span className="flex flex-col md:col-span-6">
                            <label htmlFor="observations">
                                {
                                    translations.administration.user.form
                                        .observations
                                }
                            </label>
                            <InputTextarea
                                {...register("observations", {
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.observations,
                                    "w-full": true,
                                }}
                                rows={5}
                                cols={30}
                            />
                            {errors?.observations && (
                                <span className="text-red-600">
                                    {errors.observations?.message}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col md:col-span-6">
                            <label htmlFor="username">
                                { translations.administration .user.form.mechanical_signature }
                            </label>
                            <Upload
                                onChangeDocs={fileChange}
                                limitDocs={1}
                                allowedFiles=".jpg,.jpeg,.png"
                                iconSelect="pi pi-fw pi-images"
                                />
                        </span>
                        <span className="flex flex-col md:col-span-6 my-3">
                            <label htmlFor="username">
                                {translations.administration.user.form.physical_signature}
                            </label>
                            <div className="w-full">
                                <Button  label={translations.administration.user.clean_signature} icon="pi pi-trash" severity="danger" onClick={clear} disabled={isEmpty} />
                            </div>
                            <SignatureCanvas
                                ref={sigCanvas}
                                canvasProps={{ className: "w-full h-40 border border-gray-300 rounded-md" }}
                                onEnd={() => setIsEmpty(sigCanvas.current.isEmpty())}
                                minWidth={1}         // Grosor mínimo de la línea
                                maxWidth={3}         // Grosor máximo de la línea
                                velocityFilterWeight={1} // Ajusta la suavidad de la firma
                                dotSize={2}
                            />
                        </span>

                        <div className="md:col-span-2">
                            <Button label={ translations.documental_gestion.dependency.save} className="col-span-2" size="small" />
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
