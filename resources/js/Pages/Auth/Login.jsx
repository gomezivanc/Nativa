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

            {/* Status / Flash messages */}
            {status && (
                <div className="mb-4 font-medium text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-center">
                    {status}
                </div>
            )}

            {flash?.message && (
                <div className="mb-4 text-emerald-700 font-semibold text-center bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                    {flash.message}
                </div>
            )}

            {/* Título y subtítulo */}
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    {translations.auth.login.login}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Ingresa tus credenciales para acceder al sistema
                </p>
            </div>

            {/* Mensaje de éxito */}
            {success && (
                <div className="w-full flex justify-center mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <Icon className="w-4 h-4 text-emerald-600 fill-current shrink-0" name="chulo" />
                        <span className="font-medium">{success}</span>
                    </div>
                </div>
            )}

            {/* Formulario */}
            <form onSubmit={submit} className="space-y-5">
                {/* Campo: Usuario */}
                <div>
                    <InputLabel
                        forInput="usuario"
                        value={translations.auth.login.user}
                        className="!text-slate-700 font-semibold text-sm"
                    />
                    <TextInput
                        id="usuario"
                        type="text"
                        name="usuario"
                        value={data.usuario}
                        errors={errors.usuario}
                        className="mt-1.5 block w-full border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg focus:border-ibg-500 focus:ring-1 focus:ring-ibg-500 transition-all duration-200"
                        autoComplete="usuario"
                        isFocused={true}
                        handleChange={onHandleChange}
                        error={inputErrors.usuario}
                        placeholder="Escriba su usuario"
                    />
                </div>

                {/* Campo: Contraseña */}
                <div>
                    <InputLabel
                        forInput="password"
                        value={translations.auth.login.password}
                        className="!text-slate-700 font-semibold text-sm"
                    />
                    <Password
                        id="password"
                        name="password"
                        errors={errors.password}
                        value={data.password}
                        className="mt-1.5 block w-full"
                        inputClassName="border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg focus:border-ibg-500 focus:ring-1 focus:ring-ibg-500 transition-all duration-200"
                        autoComplete="current-password"
                        handleChange={onHandleChange}
                        error={inputErrors.password}
                        placeholder="Contraseña"
                    />
                    {inputErrors.password && (
                        <InputError className="text-red-500 mt-1.5">{errors.password}</InputError>
                    )}
                </div>

                {/* Recordarme + Olvidaste tu contraseña */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={onHandleChange}
                            className="h-4 w-4 rounded border-slate-300 text-ibg-500 focus:ring-ibg-400 focus:ring-offset-0 cursor-pointer transition-all duration-200"
                        />
                        <span className="ml-2.5 text-sm text-slate-500 group-hover:text-slate-700 transition-colors duration-200">
                            Recordarme
                        </span>
                    </label>
                    <Link
                        href={route("recovery")}
                        className="text-sm text-ibg-600 hover:text-ibg-900 transition-colors duration-200 font-medium underline underline-offset-2"
                    >
                        {translations.auth.login.remember_passsword}
                    </Link>
                </div>

                {/* Botón Ingresar */}
                <div className="pt-2">
                    <PrimaryButton
                        className="w-full flex items-center justify-center gap-2.5 py-3 text-base"
                        processing={processing}
                    >
                        {translations.auth.login.enter}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </PrimaryButton>
                </div>
            </form>
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
