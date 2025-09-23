@echo off
setlocal ENABLEDELAYEDEXPANSION

rem Ensure correct local path.
cd /D "%~dp0"

rem Build React Frontend
echo "Building React frontend..."
cd src/WebApp
call npm install
call npm run build
cd ..\..

rem Launch Backend
echo "Launching backend..."
call .\launch-windows.bat %*
