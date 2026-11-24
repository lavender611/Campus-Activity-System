@echo off
setlocal
title Campus Activity Backend - close this window to stop
set "JAVA_HOME=D:\java_home2024110681"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "MVN=D:\MAVEN\apache-maven-3.9.15\bin\mvn.cmd"
cd /d "%~dp0"

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [ERROR] JDK not found: %JAVA_HOME%\bin\java.exe
    echo Edit JAVA_HOME in this file.
    pause
    exit /b 1
)
if not exist "%MVN%" (
    echo [ERROR] Maven not found: %MVN%
    echo Edit MVN in this file.
    pause
    exit /b 1
)

echo Starting Spring Boot backend (first run downloads dependencies, may take 1-3 minutes)...
echo When ready: http://localhost:8080/api/activities returns JSON
echo.

call "%MVN%" -f "%~dp0pom.xml" spring-boot:run

echo.
echo Backend process exited (Ctrl+C or startup failure).
pause
