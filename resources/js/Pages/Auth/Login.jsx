import { useEffect, useRef, useState, useCallback } from "react";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import Password from "@/components/Password";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Toast } from "primereact/toast";
import Icon from "@/components/Icon";
import { GoogleReCaptchaProvider,  withGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

const Logins = ({ status, props, success, googleReCaptchaProps, }) => {
    const toast = useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        usuario: "",
        password: "",
        remember: "",
        g_recaptcha_response: "",
    });
    const { translations } = usePage().props;
    const { flash } = usePage().props;
    const [token, setToken] = useState(null);

    const getToken = useCallback(async () => {
        if (googleReCaptchaProps.executeRecaptcha != undefined) {
            const _token = await googleReCaptchaProps.executeRecaptcha("Login");
            setData({ ...data, g_recaptcha_response: _token });
            setToken(_token);
        }
    }, [googleReCaptchaProps]);

    useEffect(() => {
        getToken();
    }, [getToken]);
    
    const [inputErrors, setInputErrors] = useState({
        usuario: false,
        password: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordInputType, setPasswordInputType] = useState("password");

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
        setPasswordInputType((prevPasswordInputType) =>
            prevPasswordInputType === "password" ? "text" : "password"
        );
    };

    useEffect(() => {
        if (!toast.current) return;

        if (flash?.message) {
            setTimeout(() => {
                toast.current.show({
                    severity: "success",
                    summary: "Éxito",
                    detail: flash.message,
                });
            }, 300);
        }

        if (flash?.error) {
            setTimeout(() => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: flash.error,
                });
            }, 300);
        }
    }, [flash]);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const onHandleChange = (event) => {
        setInputErrors(event.target.name, false);
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("login2"), {
            preserveScroll: true,
            // preserveState: true,
            onError: (errs) => {
                if (errs) {
                    setInputErrors({
                        usuario: !!errs.usuario,
                        password: !!errs.password,
                    });

                    if (errs.errors && errs.errors.password) {
                        const errorMessage = errs.errors.password[0];
                        if (errorMessage === "Contraseña incorrecta") {
                            setInputErrors({ ...inputErrors, password: true });
                            toast.current.show([
                                {
                                    severity: "error",
                                    summary: "Error",
                                    detail: errorMessage,
                                },
                            ]);
                            return;
                        }
                    }

                    const errorMessages = Object.values(errs).map((err) => ({
                        severity: "error",
                        summary: "Error",
                        detail: err,
                    }));
                    toast.current.show(errorMessages);
                }
            },
        });
    };

    if (status) {
        if (status === "Usuario bloqueado" || status === "Usuario inactivo") {
            sessionStorage.setItem("errorMessage", status);
            window.location.reload();
        }
    }
    
    return (
        <>
            <LanguageSwitcher />
            <Toast ref={toast} />
            <Head title="Inicio" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            {flash?.message && (
                <div className="mb-4 text-green-600 font-semibold text-center">
                    {flash.message}
                </div>
            )}
            <div className="flex-col w-full h-[100%] centrar">
                <div className="centrar -mt-20 mb-5">
                    <img
                        src="images/PNG/Turrisystesm.png"
                        className="hidden max-lg:flex h-28 max-lg:h-16 "
                    />
                </div>
                <div className="w-full">
                    <div className="w-full centrar flex-col">
                        <div className="text-4xl max-md:text-lg max-xl:text-2xl max-2xl:text-3xl font-bold text-[#002F65]">
                            {translations.auth.login.login}
                        </div>
                    </div>
                    {success && (
                        <div className="w-full centrar">
                            <div className="centrar w-1/2 p-1 text-sm text-green-800 rounded-lg bg-green-50 space-x-2">
                                <Icon
                                    className="w-4 h-10 text-green-800 fill-current group-hover:text-gray-300 focus:text-gray-600"
                                    name="chulo"
                                />
                                <div className="font-medium">{success}</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="centrar flex-col lg:mt-1">
                            <div className="w-3/5 max-xl:w-full ">
                                <InputLabel
                                    forInput="usuario"
                                    value={translations.auth.login.user}
                                    className="max-md:text-xs max-lg:text-base max-2xl:text-lg"
                                />
                                <TextInput
                                    id="usuario"
                                    type="text"
                                    name="usuario"
                                    value={data.usuario}
                                    errors={errors.usuario}
                                    className="mt-1 block w-full"
                                    autoComplete="usuario"
                                    isFocused={true}
                                    handleChange={onHandleChange}
                                    error={inputErrors.usuario}
                                    placeholder="Escriba su usuario"
                                />
                            </div>
                            <div className="w-3/5 max-xl:w-full">
                                <InputLabel
                                    forInput="password"
                                    value={translations.auth.login.password}
                                    className="max-md:text-xs max-lg:text-base max-2xl:text-lg"
                                />
                                <div className="relative">
                                    <Password
                                        id="password"
                                        type={passwordInputType}
                                        name="password"
                                        errors={errors.password}
                                        value={data.password}
                                        className="w-full" // Agrega un padding derecho para acomodar el botón
                                        autoComplete="current-password"
                                        handleChange={onHandleChange}
                                        error={inputErrors.password}
                                        placeholder="Contraseña"
                                    />
                                </div>

                                {inputErrors.password && (
                                    <InputError className="text-red-500">
                                        {errors.password}
                                    </InputError>
                                )}
                            </div>
                        </div>
                        {/* Seccion olvidaste tu contraseña */}
                        <div className="centrar block mt-4 lg:mt-2 max-sm:mt-3">
                            <Link
                                href={route("recovery")}
                                className="underline text-gray-600 hover:text-gray-900 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-xl max-md:text-sm max-2xl:text-lg"
                            >
                                {translations.auth.login.remember_passsword}
                            </Link>
                        </div>

                        {/* Seccion boton ingresar */}
                        <div className="centrar flex-col mt-20 max-md:mt-12 lg:mt-4">
                            <PrimaryButton
                                className="centrar ml-3 w-3/6 h-12 max-2xl:w-3/6 max-md:h-8 max-2xl:h-10 "
                                processing={processing}
                            >
                                {translations.auth.login.enter}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const MyAppp = withGoogleReCaptcha(Logins);

export default function Login() {
    const [REACT_APP_SITE_KEY, setREACT_APP_SITE_KEY] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;

                try {
                    url = route("env");
                } catch (ziggyError) {
                    console.error("Ruta no encontrada en Ziggy:", ziggyError);
                    setREACT_APP_SITE_KEY(
                        "6LeJ2YkpAAAAANxRpkG7F3dHfmnsptjd2ToRrTv0"
                    );
                    return;
                }

                const response = await axios.get(url);

                const siteKey =
                    response?.data?.REACT_APP_SITE_KEY ||
                    "6LeJ2YkpAAAAANxRpkG7F3dHfmnsptjd2ToRrTv0";

                setREACT_APP_SITE_KEY(siteKey.toString());
            } catch (error) {
                console.error("Error al obtener las variables:", error);

                setREACT_APP_SITE_KEY(
                    "6LeJ2YkpAAAAANxRpkG7F3dHfmnsptjd2ToRrTv0"
                );
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const reloadParam = urlParams.get("reload");

        if (reloadParam === "true") {
            const urlWithoutReload = window.location.pathname;
            window.history.replaceState({}, document.title, urlWithoutReload);
            window.location.reload();
        }
    }, []);

    return (
        <>
            {REACT_APP_SITE_KEY && (
                <GoogleReCaptchaProvider
                    reCaptchaKey={REACT_APP_SITE_KEY.toString()}
                >
                    <MyAppp />
                </GoogleReCaptchaProvider>
            )}
        </>
    );
}
