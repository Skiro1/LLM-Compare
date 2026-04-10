@echo off
echo === LLM Compare - Build Windows App (Russian) ===
echo.
echo NOTE: Run this script as Administrator to avoid symlink errors!
echo.

cd /d "%~dp0"

echo [1/4] Creating resources/app directory...
mkdir resources\app 2>nul

echo [2/4] Copying Russian project files...
xcopy "..\ru\index.html" "resources\app\" /Y >nul
xcopy "..\ru\css\*.*" "resources\app\css\" /E /Y >nul
xcopy "..\ru\js\*.*" "resources\app\js\" /E /Y >nul
xcopy "..\ru\chrome-extension\*.*" "resources\app\chrome-extension\" /E /Y >nul
xcopy "..\ru\firefox-extension\*.*" "resources\app\firefox-extension\" /E /Y >nul
xcopy "..\proxy-server.js" "resources\app\" /Y >nul

echo [3/4] Installing dependencies...
call npm install

echo [4/4] Building Windows installer...
call npm run build:win

echo.
echo === Build complete! ===
echo Installers are in: dist\
pause
