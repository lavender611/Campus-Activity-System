@echo off
setlocal
cd /d "%~dp0"

echo ==================================================
echo    Campus Activity - Mobile (H5)
echo ==================================================
echo.

set "NPM="
if exist "%ProgramFiles%\nodejs\npm.cmd" set "NPM=%ProgramFiles%\nodejs\npm.cmd"
if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "NPM=%ProgramFiles(x86)%\nodejs\npm.cmd"
if exist "%LOCALAPPDATA%\Programs\nodejs\npm.cmd" set "NPM=%LOCALAPPDATA%\Programs\nodejs\npm.cmd"
if not defined NPM if exist "D:\Nodejs\nodejs\npm.cmd" set "NPM=D:\Nodejs\nodejs\npm.cmd"
if not defined NPM if exist "C:\Nodejs\nodejs\npm.cmd" set "NPM=C:\Nodejs\nodejs\npm.cmd"
if not defined NPM for %%P in (npm.cmd) do if not "%%~$PATH:P"=="" set "NPM=%%~$PATH:P"

if not defined NPM (
  echo [ERROR] npm was not found on this computer.
  echo Please install Node.js 20+ and run this file again.
  echo.
  pause
  exit /b 1
)

for %%I in ("%NPM%") do set "NODEDIR=%%~dpI"
set "PATH=%NODEDIR%;%PATH%"
echo Using npm: %NPM%
echo.

if not exist "node_modules" (
  echo Installing dependencies, please wait...
  call "%NPM%" install --no-audit --no-fund
  if errorlevel 1 (
    echo [ERROR] npm install failed. Check network and retry.
    echo.
    pause
    exit /b 1
  )
)

echo Your LAN address:
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | ForEach-Object { '    http://' + $_.IPAddress + ':5173' }"
echo.
echo Phone: open the http address above ^(same Wi-Fi as this PC^).
echo Keep this window open while the phone page is in use.
echo Press Ctrl + C to stop the server.
echo.

call "%NPM%" run dev

echo.
echo [INFO] dev server stopped, exit code %errorlevel%.
echo If this window closes instantly again, check the folder above.
pause