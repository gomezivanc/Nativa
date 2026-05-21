import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import InputLabel from '@/components/InputLabel';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Toast } from 'primereact/toast';
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export default function ResetPassword({ status }) {

    const toast = useRef(null);
    const { email, token } = usePage().props;
    const { ziggy, translations } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        // email: '',
        contrasena: '',
        contrasena_confirmation: '',
        token: token,
        email:email,
        
    });
    
    const passwordValidations = {
        length: data.contrasena.length >= 8,
        upper: /[A-Z]/.test(data.contrasena),
        lower: /[a-z]/.test(data.contrasena),
        number: /[0-9]/.test(data.contrasena),
        special: /[@$!%*?&]/.test(data.contrasena),
        match: data.contrasena === data.contrasena_confirmation && data.contrasena !== ""
    };

    const isPasswordValid =
    passwordValidations.length &&
    passwordValidations.upper &&
    passwordValidations.lower &&
    passwordValidations.number &&
    passwordValidations.special &&
    passwordValidations.match;

    const [touched, setTouched] = useState({
        contrasena: false,
        contrasena_confirmation: false,
    });
    
    const onHandleChange = (event) => {
        const { name, value } = event.target;

        setData(name, value);

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    };

    const [inputErrors, setInputErrors] = useState({
        email: false, // Ajusta los campos de error según tu formulario
        });
 
    const submit = (e) => {
        e.preventDefault();

        post(route('password.reset'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: function (response) {
                },
            onError: (errs) => {
            let errMsgs = [];
            if (errs) {
                setInputErrors({
                email: !!errs.email, // Ajusta los campos de error según tu formulario
                });
                for (let x in errs) {
                    errMsgs.push({ severity: 'error', summary: 'Error', detail: errs[x] });
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

            <Head title="Restablecer contraseña" />
            <div className='flex-col w-full h-[100%] mt-12'>
                <div className='centrar '>
                    <img src="images/PNG/" className="hidden max-lg:flex h-28 max-lg:h-16 mt-7 max-lg:mt-4" />
                </div>

                <div className='w-full centrar flex-col mt-2 lg:mt-5 2xl:mt-12 mb-8'>
                    <div className='text-3xl 2xl:text-4xl max-md:text-xl font-bold text-[#002F65]'>{translations.auth.users.form.reset_password}</div>
                </div>  

                <form onSubmit={submit}>
                    <div className='centrar flex-col mt-3 2xl:mt-20 '>

                    <div className='w-11/12 max-md:w-11/12 max-lg:w-3/5 2xl:w-2/3 relative'>
                        <InputLabel
                            forInput="contrasena"
                            value={translations.auth.users.form.password}
                            className="text-[13px] 1xl:text-xl"
                        />

                        <TextInput
                            id="contrasena"
                            type={showPassword ? "text" : "password"}
                            name="contrasena"
                            value={data.contrasena}
                            errors={errors.contrasena}
                            className="block w-full h-10 max-lg:h-7 pr-10"
                            handleChange={onHandleChange}
                            placeholder={translations.auth.users.form.password}
                        />

                        <i
                            className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute right-3 top-9 cursor-pointer text-gray-500`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>

                    {touched.contrasena && (
                        <p className="mb-2 text-xs flex flex-wrap gap-1">
                            <span className={passwordValidations.length ? "text-green-600 line-through" : "text-gray-500"}>
                                8 caracteres
                            </span>
                            <span className={passwordValidations.upper ? "text-green-600 line-through" : "text-gray-500"}>
                                mayúscula
                            </span>
                            <span className={passwordValidations.lower ? "text-green-600 line-through" : "text-gray-500"}>
                                minúscula
                            </span>
                            <span className={passwordValidations.number ? "text-green-600 line-through" : "text-gray-500"}>
                                número
                            </span>
                            <span className={passwordValidations.special ? "text-green-600 line-through" : "text-gray-500"}>
                                carácter especial
                            </span>
                        </p>
                    )}

                    <div className='w-11/12 max-md:w-11/12 max-lg:w-3/5 2xl:w-2/3 relative'>
                        <InputLabel
                            forInput="contrasena_confirmation"
                            value={translations.auth.users.form.confirm_password}
                            className="text-[13px] 1xl:text-xl"
                        />

                        <TextInput
                            id="contrasena_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            name="contrasena_confirmation"
                            value={data.contrasena_confirmation}
                            errors={errors.contrasena_confirmation}
                            className="block w-full h-10 max-lg:h-7 pr-10"
                            handleChange={onHandleChange}
                            placeholder={translations.auth.users.form.confirm_password}
                        />

                        <i
                            className={`pi ${showConfirmPassword ? "pi-eye-slash" : "pi-eye"} absolute right-3 top-9 cursor-pointer text-gray-500`}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        ></i>
                    </div>

                        {touched.contrasena_confirmation && data.contrasena_confirmation && (
                            <p className={`text-sm mt-1 ${
                                passwordValidations.match ? "text-green-600" : "text-red-500"
                            }`}>
                                {passwordValidations.match
                                    ? "Las contraseñas coinciden"
                                    : "Las contraseñas no coinciden"}
                            </p>
                        )}
                    </div>

                    {/* Seccion boton enviar */}
                    <div className='centrar flex-col mt-4 max-lg:mt-2 2xl:mt-10'>
                        <PrimaryButton disabled={!isPasswordValid || processing} className="centrar h-9 max-lg:h-7" >
                            {translations.auth.users.form.change}
                        </PrimaryButton>
                    </div>
                </form>
                <div className='centrar flex-col fixed bottom-1 2xl:bottom-3 lg:w-[44%] w-[88%] p-3'>                <div className='mb-3 text-sm 2xl:text-lg font-semibold'> { translations.auth.recovery.back_login }
                        <Link href={route('showlogin')}
                            className="underline text-[#002F65] hover:text-gray-900 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 text-xl max-lg:text-sm max-2xl:text-lg ml-2">
                            { translations.auth.recovery.click_here }
                        </Link>

                    </div>
                    <img src={ziggy.url + "/images/SVG/logo_azul.svg"} className='object-cover h-6 max-lg:h-5 2xl:h-9' />
                </div>
            </div>
        </>
    );
}
