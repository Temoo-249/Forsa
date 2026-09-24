@echo off
title Forsa Platform - Launcher
echo ========================================================
echo         تشغيل منصة فرصة (نسخة العرض التجريبي - Demo)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] جاري تشغيل خادم الباك إند (Django API)...
start "Forsa Backend (Django)" cmd /k "if exist .\venv\Scripts\activate.bat (call .\venv\Scripts\activate.bat) & python manage.py runserver 127.0.0.1:8000"

timeout /t 2 /nobreak >nul

echo [2/2] جاري تشغيل الواجهة الأمامية (Next.js)...
start "Forsa Frontend (Next.js)" cmd /k "cd Forsa_frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo  تم تشغيل المنصة بنجاح!
echo  - الواجهة الأمامية: http://localhost:3000
echo  - خادم الباك إند:  http://127.0.0.1:8000
echo ========================================================
echo.
echo جاري فتح المنصة في المتصفح تلقائياً...
start http://localhost:3000

exit
