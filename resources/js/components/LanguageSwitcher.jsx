import { useRef, useState } from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { usePage, router } from "@inertiajs/react";

export const LanguageSwitcher = ({ isFixed = true, btn_class, fontSize = '2rem' }) => {
    const op = useRef(null);
    const { current_language } = usePage()?.props;

    const languages = [
        { code: 'en', label: 'English', icon: 'pi pi-globe' },
        { code: 'es', label: 'Español', icon: 'pi pi-globe' },
    ];

    const handleLanguageChange = (language) => {
        router.visit(`/lang/${language}`, {
            data: { language },
            preserveScroll: true,
            onSuccess: () => {
                router.visit(window.location.href, { preserveState: true });
            },
        });
    };

    return (
        <div className={isFixed ? "fixed top-5 right-5 z-50" : ''}>
            <OverlayPanel ref={op} className="shadow-xl rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col space-y-1 min-w-[140px]">
                    {languages.map((lang) => (
                        <Button
                            key={lang.code}
                            label={lang.label}
                            icon={lang.icon}
                            className={`mb-1 last:mb-0 ${current_language === lang.code ? 'p-button-info' : 'p-button-secondary p-button-text'}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        />
                    ))}
                </div>
            </OverlayPanel>
            <button
                onClick={(e) => op.current.toggle(e)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${btn_class || 'text-slate-600 dark:text-slate-300'}`}
                style={{ fontSize }}
            >
                <i className="pi pi-globe"></i>
                <span className="uppercase text-xs font-bold tracking-wider">{current_language}</span>
            </button>
        </div>
    );
};
