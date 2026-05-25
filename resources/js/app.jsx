import './bootstrap';
import 'react-dropdown-tree-select/dist/styles.css';
import '../css/app.css';
//primereact core
import "primereact/resources/primereact.min.css";
//primereact icons
import "primeicons/primeicons.css";
//import '@fortawesome/fontawesome-free/css/all.min.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { InertiaProgress } from '@inertiajs/progress';
import Guest from "./Layouts/GuestLayout";
import Authenticated from "./Layouts/AuthenticatedLayout";
import "primereact/resources/themes/viva-light/theme.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider } from './Context/preloadContext';
import LoadingIndicator from './Context/Preload';
import 'quill/dist/quill.snow.css';

InertiaProgress.init({
    color: '#d4a843',
    showSpinner: true,
});

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

// Initialize theme: always light by default, then check localStorage
const initTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Default light unless user explicitly saved dark
    const isDark = saved === 'dark' || (!saved && prefersDark && saved !== 'light');
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
initTheme();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        let page = pages[`./Pages/${name}.jsx`]
        page.default.layout = name.startsWith('Auth/') || name.startsWith('Public/') ? page => <Guest children={page} /> : name.startsWith('ValidateCode') || name.startsWith('Inicio') ? undefined : page => <Authenticated children={page} />
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
                <LoadingProvider>
                    <LoadingIndicator />
                    <App {...props} />
                </LoadingProvider>
            </>
        );
    },
    progress: {
        delay: 250,
        color: '#d4a843',
    },
});
