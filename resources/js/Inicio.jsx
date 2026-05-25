import React from "react";
import Carusel from "../components/Aplicativos/Carusel";
import { Button } from 'primereact/button'
import { Link, usePage } from "@inertiajs/react";
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export default function Inicio() {
    const { auth, ziggy, translations } = usePage().props;

    const toggleDarkMode = () => {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Light mode blobs */}
                <div className="dark:hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-[150%] h-[150%] opacity-30 blur-3xl animate-blob1">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-ibg-300 via-ibg-400 to-slate-200"></div>
                    </div>
                    <div className="absolute top-1/4 -right-1/4 w-[120%] h-[120%] opacity-20 blur-3xl animate-blob2">
                        <div className="w-full h-full rounded-full bg-gradient-to-tl from-amber-400/40 via-terracotta-300/30 to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-1/4 left-1/4 w-[100%] h-[100%] opacity-25 blur-3xl animate-blob3">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-ibg-200/50 via-slate-100 to-transparent"></div>
                    </div>
                </div>
                {/* Dark mode blobs */}
                <div className="hidden dark:block">
                    <div className="absolute -top-1/2 -left-1/2 w-[150%] h-[150%] opacity-40 blur-3xl animate-blob1">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-ibg-700 via-ibg-900 to-slate-950"></div>
                    </div>
                    <div className="absolute top-1/4 -right-1/4 w-[120%] h-[120%] opacity-30 blur-3xl animate-blob2">
                        <div className="w-full h-full rounded-full bg-gradient-to-tl from-amber-600/40 via-terracotta-500/30 to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-1/4 left-1/4 w-[100%] h-[100%] opacity-25 blur-3xl animate-blob3">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-ibg-500/30 via-slate-800 to-transparent"></div>
                    </div>
                </div>
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-11/12 max-w-4xl py-12">

                {/* Logo & Title */}
                <div className="flex flex-col items-center w-full mb-10">
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-full bg-amber-450/20 dark:bg-amber-450/30 blur-xl group-hover:bg-amber-450/30 transition-all duration-500"></div>
                        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 flex items-center justify-center shadow-2xl">
                            <img
                                src={`${ziggy.url}/images/PNG/logo_blanco.png`}
                                className="object-contain w-16 h-16 md:w-20 md:h-20 brightness-0 dark:brightness-100 invert dark:invert-0 opacity-90 transition-all"
                                alt="Logo"
                            />
                        </div>
                    </div>
                    <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-ibg-950 dark:text-white tracking-tight drop-shadow-lg">
                        Gestor Documental
                    </h1>
                    <p className="mt-2 text-lg md:text-xl text-slate-600 dark:text-slate-300 font-light tracking-wide">
                        {translations.auth.tenants.tenant}
                    </p>
                </div>

                {/* Glassmorphism Carousel Container */}
                <div className="w-full p-1 md:p-2 mb-10 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-2xl">
                    <div className="rounded-2xl overflow-hidden bg-slate-100/50 dark:bg-slate-900/30">
                        <Carusel />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    {auth.user.super_administrador == 1 && (
                        <Link href={route("dashboard")}>
                            <Button
                                label={translations.auth.tenants.administration}
                                icon="pi pi-cog"
                                rounded
                                className="px-6 py-3 bg-ibg-900 hover:bg-ibg-950 text-white font-semibold shadow-lg shadow-ibg-900/30 border border-ibg-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                            />
                        </Link>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-200 font-medium shadow-lg hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-300"
                    >
                        <i className="pi pi-moon"></i>
                        <span className="text-sm">Modo oscuro</span>
                    </button>
                    <LanguageSwitcher isFixed={false} btn_class="text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/20" fontSize="1.2rem" />
                    <Link href={route("logout")} method="post">
                        <Button
                            label={translations.auth.tenants.logout}
                            icon="pi pi-sign-out"
                            rounded
                            className="px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold shadow-lg shadow-terracotta-500/30 border border-terracotta-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                        />
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center text-slate-500 dark:text-slate-500 text-sm">
                    <p> {new Date().getFullYear()} · Gestor Documental</p>
                </div>
            </div>

            {/* Inline styles for blob animations */}
            <style>{`
                @keyframes blob1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    33% { transform: translate(30px, -50px) rotate(10deg) scale(1.1); }
                    66% { transform: translate(-20px, 20px) rotate(-5deg) scale(0.95); }
                }
                @keyframes blob2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    33% { transform: translate(-40px, 30px) rotate(-8deg) scale(1.05); }
                    66% { transform: translate(20px, -20px) rotate(5deg) scale(0.9); }
                }
                @keyframes blob3 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    33% { transform: translate(50px, 20px) rotate(5deg) scale(1.08); }
                    66% { transform: translate(-30px, -40px) rotate(-10deg) scale(0.92); }
                }
                .animate-blob1 { animation: blob1 20s infinite ease-in-out; }
                .animate-blob2 { animation: blob2 25s infinite ease-in-out; }
                .animate-blob3 { animation: blob3 18s infinite ease-in-out; }
            `}</style>
        </div>
    );
}
