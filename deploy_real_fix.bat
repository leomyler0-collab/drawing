@echo off
echo ========================================
echo CRITICAL FIX: Moving vercel.json to git root
echo ========================================
git commit -m "Fix: Move vercel.json to git root and update paths for SpookySketch subdirectory"
git push origin main
echo.
echo ========================================
echo This WILL fix the Vercel deployment!
echo ========================================
pause
