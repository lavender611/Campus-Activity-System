@echo off
setlocal
title Open port 8080 for phone (Campus Activity backend)
cd /d "%~dp0"

echo ==================================================
echo   Campus Activity - open backend port 8080
echo ==================================================
echo.

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This script must run as Administrator.
    echo Right-click this file and choose "Run as administrator".
    echo.
    pause
    exit /b 1
)

echo Removing old rule if it exists...
netsh advfirewall firewall delete rule name="CampusActivity-Backend-8080" >nul 2>&1

echo Adding inbound rule for TCP 8080...
netsh advfirewall firewall add rule name="CampusActivity-Backend-8080" dir=in action=allow protocol=TCP localport=8080 profile=private,public
if %errorlevel% neq 0 (
    echo [ERROR] Failed to add firewall rule.
    echo.
    pause
    exit /b 1
)

echo.
echo Done. Port 8080 is now open for the phone.
echo Phone can reach the backend at http://[your-pc-ip]:8080
echo Keep this rule while you use the mini program.
echo.
pause
exit /b 0
