<!DOCTYPE html>
<html>
    <head>
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        
    </head>
    <body>
        @inertia
    </body>
</html>