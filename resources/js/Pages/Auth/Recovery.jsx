import { useEffect, useRef, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/components/InputError";
import PrimaryButton from "@/components/PrimaryButton";
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

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const [inputErrors, setInputErrors] = useState({
        email: false, // Ajusta los campos de error según tu formulario
    });

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
                        email: !!errs.email, // Ajusta los campos de error según tu formulario
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

            <div className="flex-col w-full h-[100%] centrar">
                <div className="centrar ">
                    <img
                        src="images/PNG/Turrisystesm.png"
                        className="hidden max-lg:flex h-28 max-lg:h-16 mt-7 max-lg:mt-4"
                    />
                </div>

                <div className="w-full centrar flex-col mt-20 max-lg:mt-5 max-2xl:mt-8 min-2xl:mt-16">
                    <div className="text-4xl max-md:text-lg max-xl:text-2xl max-2xl:text-3xl font-bold text-[#002F65]">
                        { translations.auth.recovery.recovery }
                    </div>
                </div>

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="w-full grid justify-items-center mt-10 text-gray-600">
                        <InputLabel
                            forInput="email"
                            value={ translations.auth.recovery.email }
                            className="max-md:text-xs max-lg:text-base max-2xl:text-lg"
                        />
                        <TextInput
                            type="text"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            handleChange={onHandleChange}
                        />
                    </div>

                    {/* Seccion boton enviar */}
                    <div className="centrar flex-col mt-10 max-md:mt-3 max-2xl:mt-4">
                        <PrimaryButton className="centrar ml-3 w-3/6 h-12 max-2xl:w-3/6 max-md:h-8 max-2xl:h-10 " processing={processing} >
                            { translations.auth.recovery.send }
                        </PrimaryButton>
                    </div>
                </form>

                <div className="centrar flex-col bottom-1 2xl:bottom-3 lg:w-[60%] w-[88%] p-3">
                    <div className="mb-3 text-sm font-semibold">
                        { translations.auth.recovery.back_login }
                        <Link
                            href={route("showlogin")}
                            className="underline text-[#002F65] hover:text-gray-900 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 text-xl max-md:text-sm max-2xl:text-lg ml-2"
                        >
                            { translations.auth.recovery.click_here }
                        </Link>
                    </div>
                    <img
                        src={ziggy.url + "/images/SVG/logo_azul.svg"}
                        alt=""
                        className="object-cover lg:h-9 h-6"
                    />
                </div>
            </div>
        </>
    );
}
