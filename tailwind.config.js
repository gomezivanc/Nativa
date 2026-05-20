const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
                'press-start': ['"Press Start 2P"', 'cursive'],
                'lemonada': ['"Lemonada"', 'cursive'],
                'oswald': ['"Oswald"', 'sans-serif'],
                'roboto': ['"Roboto"', 'sans-serif'],
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
