@echo off
rem Starts the Laravel API, the Stripe payment server and the website, each in its own window.
rem Run the first-time setup in README.md before using this file.
set "ROOT=%~dp0."

start "Laravel API (port 8000)" /D "%ROOT%\backend" cmd /k php artisan serve
start "Stripe payment server (port 4242)" /D "%ROOT%" cmd /k npm run server
start "Website (port 5173)" /D "%ROOT%" cmd /k npm run dev

echo.
echo Three windows were opened. When they are ready, open http://localhost:5173
echo Close each window (or press Ctrl+C in it) to stop that part.
