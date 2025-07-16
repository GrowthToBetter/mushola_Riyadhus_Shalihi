@echo off
echo Starting Musholla Display for TV...
echo.
echo Make sure TV is set to 1920x1080 resolution (16:9 aspect ratio)
echo Browser will open in fullscreen mode - press F11 to exit fullscreen if needed
echo.
pause

REM Start the Next.js development server
start cmd /k "cd /d "%~dp0" && npm run dev"

REM Wait for server to start
timeout /t 5 /nobreak >nul

REM Open browser in fullscreen mode
start "" "chrome.exe" --start-fullscreen --disable-web-security --disable-features=VizDisplayCompositor --kiosk "http://localhost:3000"

echo.
echo Display started! 
echo Press any key to stop the server...
pause >nul

REM Kill the server
taskkill /f /im node.exe 2>nul
taskkill /f /im chrome.exe 2>nul

echo Server stopped.
pause
