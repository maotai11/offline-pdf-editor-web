@echo off
:: setup.bat -- Download JS libraries for offline PDF editor
:: Double-click to run on a machine with internet access.
echo Downloading JS libraries...
powershell -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
pause
