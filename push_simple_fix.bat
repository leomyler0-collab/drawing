@echo off
echo ============================================
echo Simplifying to frontend-only installation
echo ============================================
git commit -m "Fix: Simplify vercel.json to only install frontend dependencies"
git push origin main
echo.
echo ============================================
echo This is the clean solution! Should work now.
echo ============================================
pause
