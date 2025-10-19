@echo off
echo ========================================
echo   SpookySketch - Elite Pro Edition
echo ========================================
echo.
echo Starting the application...
echo.
cd frontend
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting development server...
echo Open http://localhost:3000 in your browser
echo.
echo Admin Login:
echo   Email: leomyler0@gmail.com
echo   Password: SuperBoy2020
echo.
call npm run dev
