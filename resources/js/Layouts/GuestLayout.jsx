import { usePage } from "@inertiajs/react";

export default function Guest({ children }) {
    const { ziggy } = usePage().props;
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-ibg-500 via-ibg-400 to-ibg-300 overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Círculos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-amber-450/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-terracotta-500/20 rounded-full blur-3xl" />
            </div>

            {/* Card glassmorphism */}
            <div className="relative w-full max-w-md animate-fadeInUp">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 sm:p-10">
                    {/* Logo NativaSoft */}
                    <div className="flex justify-center mb-8">
                        <img
                            src={ziggy?.url ? `${ziggy.url}/images/SVG/Nativa.svg` : ''}
                            alt="NativaSoft"
                            className="h-14 sm:h-16 w-auto"
                        />
                    </div>

                    {/* Contenido inyectado (Login / Recovery) */}
                    {children}
                </div>
            </div>
        </div>
    );
}
