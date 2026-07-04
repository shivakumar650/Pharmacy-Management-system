@echo off
echo ========================================
echo  Restarting Pharmacy System Backend
echo ========================================
echo.
cd backend
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting backend server...
start cmd /k "npm start"
echo.
echo Backend server is starting...
echo Please wait a few seconds for it to fully start.
echo.
pause
