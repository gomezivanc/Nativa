import { useState, useEffect } from 'react';
import Sidebar from '@/components/Navbar/Sidebar';
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Helmet } from 'react-helmet';

export default function Layout({ title, children }) {
    const { flash } = usePage().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        if (flash.message) {
            Swal.fire({ title: 'Mensaje', html: flash.message, icon: 'success' });
        }
        if (flash.error) {
            Swal.fire({ title: 'Error', html: flash.error, icon: 'error' });
        }
    }, [flash]);

    return (
        <>
            <Helmet titleTemplate="%s | Gestor Documental" title={title} />
            <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    {/* Main content scrollable area */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
