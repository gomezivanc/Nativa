import React from "react";
import Carusel from "../components/Aplicativos/Carusel";
import { Button } from 'primereact/button'
import { Link, usePage } from "@inertiajs/react";
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export default function Inicio() {
    const { auth, ziggy, translations } = usePage().props;
    // console.log(ziggy, ' de Inicio')
    return (
        <div
    className="flex flex-col items-center justify-center w-full h-screen bg-cover bg-left-bottom"
    style={{
        backgroundImage: `url('${ziggy.url}/images/SVG/fondo_empresas.svg')`,
    }}
>
    {/* Contenedor Principal */}
    <div className="flex flex-col items-center w-11/12 h-full max-w-4xl">

        {/* Logo y Título */}
        <div className="flex flex-col items-center w-full mt-5 mb-8">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-opacity-80 bg-gray-800 max-md:w-24 max-md:h-24 shadow-lg">
                <img
                    src={`${ziggy.url}/images/PNG/logo_blanco.png`}
                    className="object-contain w-20 h-20 max-md:w-16 max-md:h-16"
                    alt="Logo Blanco"
                />
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-white max-md:text-2xl">
                { translations.auth.tenants.tenant }
            </h1>
        </div>

        {/* Carusel */}
        <div className="flex-grow w-full p-4 mb-6 bg-white bg-opacity-10 rounded-lg shadow-lg max-md:p-2">
            <Carusel />
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-center w-full mb-6 space-x-8 max-md:space-x-4">
            {auth.user.super_administrador == 1 && (
                <Link
                    href={route("dashboard")}
                >
                    <Button label={ translations.auth.tenants.administration } rounded severity="help" />
                </Link>
            )}
            <LanguageSwitcher />
            <Link
                href={route("logout")}
                method="post"
            >
                    <Button label={ translations.auth.tenants.logout } severity="danger" rounded />
            </Link>
        </div>

        {/* Footer */}
        <div className="w-full mb-6">
            <img
                src={`${ziggy.url}/images/SVG.svg`}
                className="w-40 mx-auto opacity-80 max-md:w-28"
                alt=" Logo Blanco"
            />
        </div>
    </div>
</div>


    );
}
