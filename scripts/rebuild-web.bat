@echo off
REM Rebuild and restart the Next.js web container (from repo root)
cd /d "%~dp0\.."
echo Rebuilding agc-web...
docker compose up -d --build web
if %ERRORLEVEL% neq 0 (
  echo Build failed.
  pause
  exit /b 1
)
echo Done. Open http://localhost:9200 and hard-refresh (Ctrl+Shift+R).
pause
