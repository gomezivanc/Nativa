<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <link rel="shortcut icon" href="{{ asset('favicon.jpeg') }}" />
    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap">
    {{-- <script type="text/javascript" src="http://localhost:8082/web-apps/apps/api/documents/api.js"></script> --}}
    {{-- <script type="text/javascript" src="https://demotion-unchanged-gutter.ngrok-free.dev/web-apps/apps/api/documents/api.js"></script> --}}
    {{-- <script type="text/javascript" src="http://onlyoffice.181.49.45.246.nip.io/web-apps/apps/api/documents/api.js"></script> --}}
    <!-- No bloquea el renderizado de la página -->
    {{-- <script type="text/javascript" src="http://onlyoffice.181.49.45.246.nip.io/web-apps/apps/api/documents/api.js" defer></script> --}}

    <script>
        window.onlyOfficeLoaded = false;

        function loadOnlyOffice() {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');

                script.src =

                    // "http://onlyoffice.181.49.45.246.nip.io/web-apps/apps/api/documents/api.js";
                    "https://demotion-unchanged-gutter.ngrok-free.dev/web-apps/apps/api/documents/api.js";

                script.async = true;

                script.onload = () => {
                    window.onlyOfficeLoaded = true;
                    console.log('OnlyOffice cargado');
                    resolve();
                };

                script.onerror = () => {
                    console.warn('No se pudo cargar OnlyOffice');
                    resolve(false); // NO reject para no romper la app
                };

                document.head.appendChild(script);
            });
        }

        loadOnlyOffice();
    </script>
    {{-- <script type="text/javascript" src="{{ env('ONLYOFFICE_INTERNAL_URL', 'http://localhost:8082') }}/web-apps/apps/api/documents/api.js"></script> --}}
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
