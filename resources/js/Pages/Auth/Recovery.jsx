import { useRef, useState } from "react";
import InputError from "@/components/InputError";
import TextInput from "@/components/TextInput";
import InputLabel from "@/components/InputLabel";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Toast } from "primereact/toast";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export default function Recovery({ status }) {
    const toast = useRef(null);
    const { ziggy, translations } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const [inputErrors, setInputErrors] = useState({
        email: false,
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("password.create"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: function (response) {
                if (response.props && response.props.flash.message) {
                    setSuccessMessage(response.props.flash.message);
                }
            },
            onError: (errs) => {
                let errMsgs = [];
                if (errs) {
                    setInputErrors({
                        email: !!errs.email,
                    });
                    for (let x in errs) {
                        errMsgs.push({
                            severity: "error",
                            summary: "Error",
                            detail: errs[x],
                        });
                    }
                    toast.current.show(errMsgs);
                }
            },
        });
    };

    return (
        <>
            <LanguageSwitcher />
            <Toast ref={toast} />
            <Head title="Recuperar contraseña" />

            {/* Título */}
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    {translations.auth.recovery.recovery}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Ingresa tu correo electrónico para recuperar tu contraseña
                </p>
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel
                        forInput="email"
                        value={translations.auth.recovery.email}
                        className="!text-slate-700 font-semibold text-sm"
                    />
                    <TextInput
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg focus:border-ibg-500 focus:ring-1 focus:ring-ibg-500 transition-all duration-200"
                        isFocused={true}
                        handleChange={onHandleChange}
                        placeholder="correo@ejemplo.com"
                    />
                    {inputErrors.email && (
                        <InputError className="text-red-500 mt-1.5">{errors.email}</InputError>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-ibg-600 hover:bg-ibg-900 text-white font-semibold rounded-lg shadow-lg shadow-ibg-900/20 transition-all duration-300 ease-out ${
                            processing && 'opacity-25 cursor-not-allowed'
                        }`}
                    >
                        {processing ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        )}
                        {translations.auth.recovery.send}
                    </button>
                </div>
            </form>

            {/* Volver al inicio de sesión */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center pb-2">
                <Link
                    href={route("showlogin")}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-ibg-600 transition-colors duration-200 font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al inicio de sesión
                </Link>
            </div>
        </>
    );
}
