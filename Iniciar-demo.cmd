@echo off
title Clipa - Demo local
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Abriendo la version sin servidor. Todos los recursos son locales.
  start "" "%~dp0index.html"
  exit /b
)
echo Abre http://127.0.0.1:4173 en tu navegador.
echo Deja esta ventana abierta durante la presentacion.
node server.cjs
pause
