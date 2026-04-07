@echo off
chcp 65001 >nul 2>&1
title Magisk - Social Network

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║          MAGISK SOCIAL               ║
echo  ║      Rede Social de Artes Ocultas    ║
echo  ╚══════════════════════════════════════╝
echo.
echo   [1] Instalar dependencias
echo   [2] Iniciar servidor de desenvolvimento
echo   [3] Build para producao
echo   [4] Preview do build de producao
echo   [5] Sair
echo.
set /p choice="  Escolha uma opcao: "

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto DEV
if "%choice%"=="3" goto BUILD
if "%choice%"=="4" goto PREVIEW
if "%choice%"=="5" goto EXIT
echo Opcao invalida!
timeout /t 2 >nul
goto MENU

:INSTALL
echo.
echo Instalando dependencias...
call npm install
echo.
echo Dependencias instaladas com sucesso!
pause
goto MENU

:DEV
echo.
echo Iniciando servidor de desenvolvimento...
echo Acesse http://localhost:3000
echo.
call npm run dev
pause
goto MENU

:BUILD
echo.
echo Construindo para producao...
call npm run build
echo.
echo Build concluido! Arquivos em ./dist
pause
goto MENU

:PREVIEW
echo.
echo Iniciando preview do build...
call npm run preview
pause
goto MENU

:EXIT
exit
