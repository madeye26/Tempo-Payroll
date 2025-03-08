@echo off
echo Starting Salary Management System...
echo.
echo This will start the application on your local network.
echo After starting, the app will be available at:
echo.

REM Get the IP address
FOR /F "tokens=4 delims= " %%i IN ('route print ^| find " 0.0.0.0"') DO set IP=%%i

echo http://%IP%:3000
echo.
echo Press Ctrl+C to stop the server when done.
echo.

cd /d %~dp0
npx serve -s dist -l tcp://0.0.0.0:3000
