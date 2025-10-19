@echo off
echo Fixing install command...
git commit -m "Fix: Use npm --prefix for install command instead of cd"
git push origin main
echo.
echo Fix pushed! Vercel will retry now.
pause
