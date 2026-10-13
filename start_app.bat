@echo off
echo ==========================================
echo Starting Grammar App (Offline Localhost)
echo ==========================================

echo Starting API Server...
start "Grammar API Server" cmd /k "node server.js"

echo Starting Frontend Server...
cd web
start "Grammar Frontend" cmd /k "npm run dev"

echo ==========================================
echo Server sedang berjalan!
echo Silakan buka browser di: http://localhost:5173
echo ==========================================
pause
