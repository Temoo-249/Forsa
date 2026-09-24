@echo off
title Forsa Backend (Django)
echo ==============================================
echo   Starting Forsa Backend Server (Django)
echo   API URL: http://127.0.0.1:8000/
echo ==============================================
cd /d "%~dp0"
if exist ".\venv\Scripts\activate.bat" (
  call .\venv\Scripts\activate.bat
)
python manage.py runserver 127.0.0.1:8000
pause
