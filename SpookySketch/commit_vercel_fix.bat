@echo off
git commit -m "Fix: Add root vercel.json to specify frontend directory"
git push origin main
echo.
echo Vercel deployment should work now!
pause
