@echo off
echo Committing changes...
git commit -m "Production-ready: All admin features work with localStorage"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done! All changes pushed to GitHub.
pause
