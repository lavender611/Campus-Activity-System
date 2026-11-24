@echo off
setlocal
title Campus Activity Stop Backend
cd /d "%~dp0"

set "PS=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%PS%" set "PS="
if not defined PS (
  where pwsh >nul 2>nul
  if not errorlevel 1 set "PS=pwsh"
)
if not defined PS (
  where powershell >nul 2>nul
  if not errorlevel 1 set "PS=powershell"
)
if not defined PS (
  echo [ERROR] PowerShell not found on this machine.
  pause
  exit /b 1
)

"%PS%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"
set "CODE=%errorlevel%"
echo.
if not "%CODE%"=="0" echo [WARN] exited with code %CODE%
pause