@echo off
echo === LLM Compare - Build Windows App ===
echo.

cd /d "%~dp0"

echo [1/4] Creating resources/app directory...
mkdir resources\app 2>nul

echo [2/4] Copying project files...
xcopy "..\index.html" "resources\app\" /Y >nul
xcopy "..\css\*.*" "resources\app\css\" /E /Y >nul
xcopy "..\js\*.*" "resources\app\js\" /E /Y >nul
xcopy "..\chrome-extension\*.*" "resources\app\chrome-extension\" /E /Y >nul
xcopy "..\firefox-extension\*.*" "resources\app\firefox-extension\" /E /Y >nul
xcopy "..\proxy-server.js" "resources\app\" /Y >nul

echo [3/4] Installing dependencies...
call npm install

echo [4/4] Building Windows installer...
call npm run build:win

echo.
echo === Build complete! ===
echo Installers are in: dist\
pause
