import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useForm ,Controller } from "react-hook-form";
import { Link , usePage} from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useLoading } from "../../Context/preloadContext";
import Upload from "../../components/Upload";
import SignatureCanvas from "react-signature-canvas";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

export default function UserProfile({
    id,
    translations,
    id_person,
    userRoles,
    signatureURL
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            id_dependency: null,
            regional_id: null,
        },
        mode: "onChange", // Enable validation as fields change
    });
    const { ziggy, userDependecy, userRegional  } = usePage().props;
    const person = watch("person");

    // Watch password field for validation
    const password = watch("password");
    const sigCanvas = useRef(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const { setIsLoading } = useLoading();
    const [getPersonas, setGetPersonas] = useState([]);
    const [urlSignature, setUrlSignature] = useState([]);
    const [getDependency, setGetDependency] = useState([]);
    const [regionals,setRegionals] = useState([])
    const isAdmin = userRoles?.includes(1);
    const [changePassword, setChangePassword] = useState(false);
    const backRoute = isAdmin ? route('usuarios.index') : route('main');
    const [charges, setCharges] = useState([]);
    const regionalSelected = watch("regional_id");
    const dependencySelected = watch("id_dependency");
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        consultaGetPersonas();
        getRegionals();
    }, []);

    useEffect(() => {
        setPersona(person);
    }, [person]);
    
    useEffect(() => {
        if (userRegional) {
            setValue("regional_id", Number(userRegional));
        }

        if (userDependecy) {
            setValue("id_dependency", Number(userDependecy));
        }

        setIsInitialLoad(false);
    }, [userDependecy, userRegional]);

    useEffect(() => {
        if (regionalSelected) {
            getDependencies(regionalSelected);

            if (!isInitialLoad) {
                setValue("id_dependency", null);
                setValue("id_charge", null);
                setCharges([]);
            }
        }
    }, [regionalSelected]);

    useEffect(() => {
        if (dependencySelected) {
            getCharges(dependencySelected, regionalSelected);

            if (!isInitialLoad) {
                setValue("id_charge", null);
            }
        }
    }, [dependencySelected]);

    useEffect(() => {
        if (userRegional) {
            getDependencies(userRegional);
        }

        if (userDependecy) {
            getCharges(userDependecy, userRegional);
        }
    }, [userRegional, userDependecy]);

    useEffect(() => {
        if (!changePassword) {
            setValue("current_password", "");
            setValue("password", "");
            setValue("confirm_password", "");
        }
    }, [changePassword]);

    const setPersona = (id) => {
        const persona = getPersonas.find((p) => p.id == id);
        if (!persona) {
            return;
        }
        setUrlSignature(persona.url_signature);
        setValue("first_name", persona.nombres, { shouldValidate: true });
        setValue("last_name", persona.apellidos);
        setValue("user", persona.nombre_user);
        setValue("email", persona.email_user);
        setValue("observations", persona.observaciones);
    };

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
                    id_dependency: dependencyId,
                    id_regional: regionalId // opcional
                },
            });

            setCharges(res.data);
        } catch (error) {
            toast.error(translations.auth.error);
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

    // Load existing signature if available
    useEffect(() => {
        if (signatureURL && sigCanvas.current) {
            fetch(`${ziggy.url}/getfile?path=${signatureURL}`)
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        sigCanvas.current.fromDataURL(reader.result);
                        setIsEmpty(false);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch((error) =>
                    console.error("Error loading signature:", error)
                );
        }
    }, []);

    // Clear signature canvas
    const clear = () => {
        sigCanvas.current.clear();
        setIsEmpty(true);
    };

    // Handle file upload change
    function fileChange(e) {
        if (e.length > 0) {
            setValue("file", e[0]?.data);
            setValue("filename", e[0]?.name);
        }else{
            setValue("file", null);
            setValue("filename", null);
        }
    }

    // Password validation rules
    const passwordRules = {
        required: {
            value: false,
            message:
                translations.administration.validation.attributes
                    .field_required,
        },
        minLength: {
            value: 8,
            message:
                translations.administration.validation.attributes
                    .password_min_length,
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message:
                translations.administration.validation.attributes
                    .password_pattern,
        },
    };

    // Submit form data
    async function submit(data) {

        setIsLoading(true);

        // Add signature data if available
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {

            const originalCanvas = sigCanvas.current.getCanvas();
            const newCanvas = document.createElement("canvas");
            newCanvas.width = 500;
            newCanvas.height = 160;

            const ctx = newCanvas.getContext("2d");

            ctx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height, 0, 0, 500, 160);

            const signatureData = newCanvas.toDataURL("image/png");

            data.signature = signatureData;
        }
        
        data.id_user = id;

        try {
            const res = await axios.post(route("usuarios.update-profile"), data);
            toast.success(translations.auth.success);
            // Optionally redirect or stay on the same page
        } catch (error) {
            console.error('error', error);
            if (error.response) {
                if (error.response.data.errors) {

                    const errors = error.response.data.errors;

                    Object.keys(errors).forEach((field) => {
                        errors[field].forEach((message) => {
                            toast.error(`${field}: ${message}`);
                        });
                    });

                } 
                else if (error.response.data.message) {
                    toast.error(error.response.data.message);
                } 
                else {
                    toast.error(translations.auth.error);
                }
            } else {
                toast.error(translations.auth.error);
            }
        }     
        finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }
    
    return (
        <div>
            <div className="md:px-20">
                <Card
                    header={
                        <div className="p-5 flex justify-between items-center">
                            <h1 className="text-xl font-bold">
                                {translations.administration.user.user_profile}
                            </h1>
                            
                            <Link href={backRoute}>
                                <Button label={translations.auth.back} size="small"  icon="pi pi-arrow-left" className="p-button-outlined" />
                            </Link>
                        </div>
                    }
                >
                    <form onSubmit={handleSubmit(submit)} className="grid gap-5 grid-cols-1 md:grid-cols-6">
                        {/* Name */}
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="first_name" className="mb-1 font-medium">
                                {translations.administration.user.form.first_name}
                            </label>
                            <InputText
                                id="first_name"
                                {...register("first_name", {
                                    required: translations.administration.validation .attributes.field_required,
                                })}
                                className={{ "p-invalid": errors?.first_name, "w-full": true,
                                }}

                            />
                            {errors?.first_name && (
                                <small className="text-red-600">
                                    {errors.first_name?.message}
                                </small>
                            )}
                        </span>
                        {/* last_name */}
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="last_name" className="mb-1 font-medium">
                                {translations.administration.user.form.last_name}
                            </label>
                            <InputText
                                id="last_name"
                                {...register("last_name", {
                                    required: translations.administration.validation .attributes.field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.last_name,
                                    "w-full": true,
                                }}

                            />
                            {errors?.last_name && (
                                <small className="text-red-600">
                                    {errors.last_name?.message}
                                </small>
                            )}
                        </span>

                        <div className="md:col-span-6 border-t pt-4 mt-4">
                            <h2 className="text-lg font-semibold text-gray-500">
                                {translations.administration.user.form.user}
                            </h2>
                        </div>
                        
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="username">{ translations.configuration.provider.form.regional_id }</label>
                            <Controller
                                name="regional_id"
                                control={control}
                                // rules={{
                                //     required:
                                //         translations.validation.attributes.field_required,
                                //     }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={regionals}
                                            placeholder={translations.auth.select_opcion}
                                            disabled={!isAdmin}
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
                                {translations.administration.user.form.dependency}
                            </label>
                            <Controller
                                name="id_dependency"
                                control={control}
                                // rules={{
                                //     required: translations.validation.attributes.field_required,
                                // }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={getDependency}
                                            placeholder={translations.auth.select_opcion}
                                            disabled={!isAdmin}
                                            showClear
                                            optionLabel="name"
                                            optionValue="id"
                                            filter
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(e.value)
                                            }
                                            className={{ "p-invalid": fieldState.error,"w-full ": true,
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
                                // rules={{
                                //     required: translations.validation.attributes.field_required,
                                // }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Dropdown
                                            options={charges}
                                            placeholder={translations.auth.select_opcion}
                                            optionLabel="cargo"
                                            optionValue="id"
                                            filter
                                            disabled={!dependencySelected || !isAdmin}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
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

                        {/* Username */}
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="user" className="mb-1 font-medium">
                                {translations.administration.user.form.user}
                            </label>
                            <InputText
                                id="user"
                                {...register("user", {
                                    required: translations.administration.validation.attributes.field_required,
                                })}
                                className={{
                                    "p-invalid": errors?.user,
                                    "w-full": true,
                                }}
                                disabled
                            />
                            {errors?.user && (
                                <small className="text-red-600">
                                    {errors.user?.message}
                                </small>
                            )}
                        </span>

                        {/* Email */}
                        <span className="flex flex-col md:col-span-3">
                            <label htmlFor="email" className="mb-1 font-medium">
                                {translations.administration.user.form.email}
                            </label>
                            <InputText
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: translations.administration.validation.attributes.field_required,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: translations.administration.validation.attributes.email_invalid,
                                    },
                                })}
                                className={{ "p-invalid": errors?.email, "w-full": true}}
                                disabled={!isAdmin}
                            />
                            {errors?.email && (
                                <small className="text-red-600"> {errors.email?.message} </small>
                            )}
                        </span>

                        {/* Current Password */}
                        <div className="md:col-span-6 border-t pt-4 mt-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-500">
                                    {translations.administration.user.change_Password}
                                </h2>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="changePassword"
                                        checked={changePassword}
                                        onChange={(e) => setChangePassword(e.checked)}
                                    />
                                    <label htmlFor="changePassword" className="text-sm text-gray-600">
                                        Cambiar contraseña
                                    </label>
                                </div>
                            </div>

                            {changePassword && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                                    {/* Current Password */}
                                    <span className="flex flex-col">
                                        <label className="mb-1 font-medium">
                                            {translations.administration.user.form.current_password}
                                        </label>

                                        <div className="relative">
                                            <InputText
                                                type={showCurrentPassword ? "text" : "password"}
                                                {...register("current_password", {
                                                    required: translations.administration.validation.attributes.field_required,
                                                })}
                                                className={`w-full ${errors?.current_password ? "p-invalid" : ""}`}
                                            />

                                            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-3 text-gray-500">
                                                <i className={`pi ${showCurrentPassword ? "pi-eye-slash" : "pi-eye"}`}></i>
                                            </button>
                                        </div>

                                        {errors?.current_password && (
                                            <small className="text-red-500 mt-1"> {errors.current_password.message} </small>
                                        )}
                                    </span>

                                    {/* New Password */}
                                    <span className="flex flex-col">
                                        <label className="mb-1 font-medium">
                                            {translations.administration.user.form.new_password}
                                        </label>

                                        <div className="relative">
                                            <InputText type={showNewPassword ? "text" : "password"}
                                                {...register("password", passwordRules)}
                                                className={`w-full ${errors?.password ? "p-invalid" : ""}`}
                                            />

                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-gray-500" >
                                                <i className={`pi ${showNewPassword ? "pi-eye-slash" : "pi-eye"}`}></i>
                                            </button>
                                        </div>

                                        {errors?.password && (
                                            <small className="text-red-500 mt-1">
                                                {errors.password.message}
                                            </small>
                                        )}

                                        {password && !errors.password && (
                                            <div className="mt-2">
                                                <div className="flex gap-1">
                                                    {[
                                                        password.length >= 8,
                                                        /[A-Z]/.test(password),
                                                        /[a-z]/.test(password),
                                                        /[0-9]/.test(password),
                                                        /[@$!%*?&]/.test(password)
                                                    ].map((valid, i) => (
                                                        <div key={i} className={`h-1 flex-1 rounded-full ${ valid ? "bg-green-500" : "bg-gray-200" }`} />
                                                    ))}
                                                </div>

                                                <small className="text-gray-500 mt-1 block">
                                                    Debe contener:
                                                    mínimo 8 caracteres, mayúscula, minúscula,
                                                    número y carácter especial.
                                                </small>
                                            </div>
                                        )}
                                    </span>

                                    {/* Confirm Password */}
                                    <span className="flex flex-col">
                                        <label className="mb-1 font-medium">
                                            {translations.administration.user.form.confirm_password}
                                        </label>

                                        <div className="relative">
                                            <InputText
                                                type={showConfirmPassword ? "text" : "password"}
                                                {...register("confirm_password", {
                                                    validate: (value) =>
                                                        value === watch("password") ||
                                                        translations.administration.validation.attributes.password_mismatch,
                                                })}
                                                className={`w-full ${errors?.confirm_password ? "p-invalid" : ""}`}
                                            />

                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-gray-500"
                                            >
                                                <i className={`pi ${showConfirmPassword ? "pi-eye-slash" : "pi-eye"}`}></i>
                                            </button>
                                        </div>

                                        {errors?.confirm_password && (
                                            <small className="text-red-500 mt-1">
                                                {errors.confirm_password.message}
                                            </small>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>    

                        <div className="md:col-span-6 border-t pt-4 mt-4">
                            <h2 className="text-lg font-semibold text-gray-500">
                                {translations.administration.user.signatures}
                            </h2>
                        </div>

                        {/* Mechanical Signature (Upload) */}
                        <span className="flex flex-col md:col-span-6">
                            <label htmlFor="mechanical_signature" className="mb-1 font-medium" >
                                { translations.administration.user.form.mechanical_signature}
                            </label>
                            <Upload
                                onChangeDocs={fileChange}
                                limitDocs={1}
                                allowedFiles=".jpg,.jpeg,.png"
                                iconSelect="pi pi-fw pi-images"
                            />
                            <small className="text-gray-500 mt-1">
                                {translations.administration.user.upload}
                            </small>
                        </span>
                        {urlSignature && (
                            <div className="md:col-span-6 mt-3 border rounded-md p-3 bg-gray-50">
                                <div className="text-sm font-medium mb-2">
                                    {translations.administration.user.current_signature}
                                </div>

                                <div className="flex justify-center items-center bg-white p-4 border rounded min-h-[120px]">
                                    
                                    <img src={`${ziggy.url}/getfile?path=${urlSignature}`} alt="User Signature physical" className="max-w-md w-full h-auto rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "flex";
                                        }}
                                    />

                                    {/* Fallback */}
                                    <div className="hidden flex-col items-center text-gray-400 text-sm">
                                        <i className="pi pi-image text-2xl mb-2"></i>
                                        Firma no disponible
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Physical Signature (Drawing) */}
                        <span className="flex flex-col md:col-span-6 my-3">
                            <label htmlFor="physical_signature" className="mb-1 font-medium">
                                {translations.administration.user.form.physical_signature}
                            </label>
                            <div className="w-full flex justify-end mb-2">
                                <Button
                                    label={ translations.administration.user.clean_signature}
                                    icon="pi pi-trash"
                                    severity="danger"
                                    onClick={clear}
                                    disabled={isEmpty}
                                    size="small"
                                />
                            </div>
                            <div className="border border-gray-300 rounded-md p-1 bg-white">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    canvasProps={{ className: "w-full h-40" }}
                                    onEnd={() =>
                                        setIsEmpty(sigCanvas.current.isEmpty())
                                    }
                                    minWidth={1}
                                    maxWidth={3}
                                    velocityFilterWeight={1}
                                    dotSize={2}
                                />
                            </div>
                            <small className="text-gray-500 mt-1">
                                {translations.administration.user.draw}
                            </small>
                        </span>

                        {/* Additional Notes/Observations */}
                        <span className="flex flex-col md:col-span-6">
                            <label htmlFor="observations" className="mb-1 font-medium">
                                {translations.administration.user.form.observations }
                            </label>
                            <InputTextarea
                                id="observations"
                                {...register("observations")}
                                className={{
                                    "p-invalid": errors?.observations,
                                    "w-full": true,
                                }}
                                rows={3}
                            />
                        </span>

                        {/* Submit Button */}
                        <div className="md:col-span-6 flex justify-end mt-4">
                            <Button
                                label={translations.auth.company.save_changes}
                                icon="pi pi-save"
                                className="w-full md:w-auto"
                            />
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
