import { useRef, useState } from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { usePage, router } from "@inertiajs/react";

export const LanguageSwitcher = ({ isFixed = true,btn_class, fontSize = '2rem' }) => {
    const op = useRef(null);
    const { current_language } = usePage()?.props

    const languages = [
        { code: 'en', label: 'English', icon: 'pi pi-globe' },
        { code: 'es', label: 'Español', icon: 'pi pi-globe' },
    ];

    const handleLanguageChange = (language) => {
        router.visit(`/lang/${language}`, {
            data: { language },
            preserveScroll: true,
            onSuccess: () => {
                // Redirige después del cambio
                router.visit(window.location.href, { preserveState: true });
            },
        });
    };

    return (
        <div className={isFixed ? "fixed top-5 right-5" : ''}>
            <OverlayPanel ref={op}>
                <div className="flex flex-col space-y-1">
                    {languages.map((lang) => (
                        <Button
                            key={lang.code}
                            label={lang.label}
                            icon={lang.icon}
                            className={`mb-2 ${current_language === lang.code ? 'p-button-info' : 'p-button-secondary'}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        />
                    ))}
                </div>
            </OverlayPanel>
            <i className={"pi pi-globe p-overlay-badge cursor-pointer p-button-rounded p-button-primary p-button-lg shadow-lg hover:shadow-xl " + btn_class} style={{ fontSize: fontSize }} onClick={(e) => op.current.toggle(e)} >
                <Badge value={ current_language }></Badge>
            </i>
        </div>
    );
};
