import React, { useEffect, useState, useRef } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { classNames } from "primereact/utils";
import { router } from "@inertiajs/react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "../../css/validate_code.css";

export default function ValidateCode() {
    const { translations, ziggy } = usePage().props;
    const toast = useRef(null);
    const [btnValidar, setBtnValidar] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState("00:00");
    const temporizadorRef = useRef(null);
    const inputRefs = useRef([...Array(8)].map(() => React.createRef()));

    // console.log(ziggy, 'Ziggy de validate Code')

    const { data, setData, get, post } = useForm({
        codigoVerificacion1: "",
        codigoVerificacion2: "",
        codigoVerificacion3: "",
        codigoVerificacion4: "",
        codigoVerificacion5: "",
        codigoVerificacion6: "",
        codigoVerificacion7: "",
        codigoVerificacion8: "",
    });

    const handleKeyDown = (event, index) => {
        if (
            event.key === "Backspace" &&
            event.target.value.length === 0 &&
            index > 0
        ) {
            inputRefs.current[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pastedText = e.clipboardData.getData("text").trim();

        if (/^\d{8}$/.test(pastedText)) {
            Array.from(pastedText).forEach((char, index) => {
                const inputName = `codigoVerificacion${index + 1}`;
                setData((prevData) => ({
                    ...prevData,
                    [inputName]: char,
                }));
                // Focus the next input after pasting
                if (index < 7) {
                    setTimeout(() => {
                        inputRefs.current[index + 1].current.focus();
                    }, 0);
                }
            });
        }
    };

    useEffect(()=> {
        const totalLength = Object.values(data).reduce(
            (acc, value) => acc + value.length,
            0
        );
        setBtnValidar(totalLength === 8);
    }, [data]);

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        const inputName = `codigoVerificacion${index + 1}`;

        // Only allow digits
        if (value && !/^\d+$/.test(value)) return;

        setData((prevData) => ({
            ...prevData,
            [inputName]: value.slice(0, 1), // Ensure only one character
        }));

        // Move to next input if value is entered
        if (value.length === 1 && index < 7) {
            inputRefs.current[index + 1].current.focus();
        }
    };

    const getTimeRemaining = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);

        return {
            total,
            minutes,
            seconds,
        };
    };

    const startTemporizador = (endTime) => {
        const { total, minutes, seconds } = getTimeRemaining(endTime);

        if (total >= 0) {
            setTiempoRestante(
                (minutes > 9 ? minutes : "0" + minutes) +
                    ":" +
                    (seconds > 9 ? seconds : "0" + seconds)
            );
        }

        if (total <= 0) {
            get(route("ResendCode"), {
                onSuccess: () => {
                    clearTemporizador();
                    toast.current.show({
                        severity: "success",
                        summary: "Enviado!",
                        detail: "Se reenvió al email el código de validación.",
                        life: 3000,
                    });
                },
                onError: (e) => {
                    if (endTime) {
                        toast.current.show({
                            severity: "error",
                            summary: "Error!",
                            detail: e.errors.error,
                            life: 3000,
                        });
                    }
                },
            });
        }
    };

    const clearTemporizador = () => {
        setTiempoRestante("02:00");

        if (temporizadorRef.current) {
            clearInterval(temporizadorRef.current);
        }

        const endTime = getEndTime();
        const id = setInterval(() => {
            startTemporizador(endTime);
        }, 1000);

        temporizadorRef.current = id;
    };

    const getEndTime = () => {
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 2);
        return endTime;
    };

    useEffect(() => {
        clearTemporizador();
        toast.current.show({
            severity: "success",
            summary: "Enviado!",
            detail: "Se envió al correo registrado el código de validación.",
            life: 3000,
        });

        return () => {
            if (temporizadorRef.current) {
                clearInterval(temporizadorRef.current);
            }
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("validarCodigo"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (response) => {
                console.log(response.success);
            },
            onError: (e) => {
                toast.current.show({
                    severity: "error",
                    summary: "Error!",
                    detail: e["error"],
                    life: 3000,
                });
            },
        });
    };

    const renderInputs = () => {
        return Array.from({ length: 8 }).map((_, index) => {
            const inputName = `codigoVerificacion${index + 1}`;
            return (
                <React.Fragment key={index}>
                    {index % 4 === 0 && index !== 0 && (
                        <div className="input-separator"></div> // Línea divisoria entre filas
                    )}
                    <InputText
                        id={`code-${index}`}
                        ref={inputRefs.current[index]}
                        type="tel"
                        autoComplete="off"
                        maxLength={1}
                        value={data[inputName]}
                        className={classNames(
                            "p-inputtext-lg",
                            "code-input",
                            "text-center",
                            data[inputName] ? "p-filled" : ""
                        )}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onChange={(e) => handleInputChange(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                    />
                </React.Fragment>
            );
        });
    };
    const header = (
        <div className="flex flex-col align-center p-3">
            <img
                src={`${ziggy.url}/images/PNG/logo_blanco.png` || "/placeholder.svg"}
                className="logo-image"
                alt="Logo"
            />
            <h2 className="text-white text-center mt-3 mb-0">
                {translations.auth.code_verify.code_verify}
            </h2>
        </div>
    );

    const footer = (
        <div className="flex justify-content-center">
            <img
                src={`${ziggy.url}/images/SVG/` || "/placeholder.svg"}
                className="footer-logo"
                alt=""
            />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Head title="Validación Código" />
            <div
                className="verification-page"
                style={{
                    backgroundImage: `url('${ziggy.url}/images/SVG/fondo_empresas.svg')`,
                }}
            >
                <Card
                    className="verification-card"
                    header={header}
                    footer={footer}
                >
                    <form onSubmit={submit}>
                        <div className="">
                            <div className="code-inputs-container">
                                {renderInputs()}
                            </div>

                            <div className="flex justify-center items-center mt-4">
                                <Badge
                                    value={tiempoRestante}
                                    severity="info"
                                    className="p-1 text-lg font-bold text-white rounded-sm shadow-lg"
                                />
                            </div>
                            <div className="timer-text">
                                {translations.auth.code_verify.time_code}
                            </div>

                            <div className="button-container">
                                {btnValidar && (
                                    <Button
                                        type="submit"
                                        label={
                                            translations.auth.code_verify
                                                .validate
                                        }
                                        icon="pi pi-check-circle"
                                        className="p-button-success p-button-rounded"
                                    />
                                )}

                                <Button
                                    type="button"
                                    label={translations.auth.code_verify.logout}
                                    icon="pi pi-sign-out"
                                    className="p-button-danger p-button-rounded mt-3"
                                    onClick={() => router.post(route("logout"))}
                                />
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
}
