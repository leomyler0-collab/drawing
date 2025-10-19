@echo off
echo Committing Vercel fix v2...
git commit -m "Fix: Update vercel.json to install dependencies correctly"
echo.
echo Pushing to GitHub...
git push origin main
echo.
echo ========================================
echo Vercel should deploy successfully now!
echo ========================================
pause
