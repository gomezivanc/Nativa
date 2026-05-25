const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                'press-start': ['"Press Start 2P"', 'cursive'],
                'lemonada': ['"Lemonada"', 'cursive'],
                'oswald': ['"Oswald"', 'sans-serif'],
                'roboto': ['"Roboto"', 'sans-serif'],
            },
            colors: {
                ibg: {
                    50:  '#f4f7fb',
                    100: '#e8eff6',
                    200: '#cddceb',
                    300: '#a2bdd6',
                    400: '#719abc',
                    500: '#4f7da6',
                    600: '#3c648b',
                    700: '#325171',
                    800: '#2d455f',
                    900: '#1e3a5f',
                    950: '#152a45',
                },
                amber: {
                    450: '#d4a843',
                },
                terracotta: {
                    500: '#c45c4a',
                    600: '#a84d3d',
                },
            },
        },
    },
    variants:{
        width:["responsive", "hover", "focus"],
        extend:{},
    },

    plugins: [
            require('@tailwindcss/forms'),
            require('@tailwindcss/typography')
        ],
};
