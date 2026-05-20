import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
// import vue from '@vitejs/plugin-vue';

export default defineConfig({
    base: './',
    plugins: [
        laravel({
            input: ['resources/js/app.jsx','resources/css/app.css'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: "localhost",
        cors: true, // 👈 Habilita CORS en Vite
    }
});
