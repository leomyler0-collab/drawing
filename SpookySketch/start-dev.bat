@echo off
echo ========================================
echo   SpookySketch Development Starter
echo ========================================
echo.

REM Check if .env files exist
if not exist "frontend\.env.local" (
    echo [WARNING] frontend\.env.local not found!
    echo Creating from .env.example...
    copy frontend\.env.example frontend\.env.local
    echo.
    echo [CREATED] frontend\.env.local
    echo Please check NEXT_PUBLIC_API_URL is set to: http://localhost:5000
    echo.
)

if not exist "backend\.env" (
    echo [WARNING] backend\.env not found!
    echo.
    echo Please create backend\.env with:
    echo   PORT=5000
    echo   MONGODB_URI=your_mongodb_connection_string
    echo   JWT_SECRET=supersecretkey123
    echo   CORS_ORIGIN=http://localhost:3000
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting Backend Server...
start "SpookySketch Backend" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo [INFO] Starting Frontend Server...
start "SpookySketch Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows should have opened.
echo Check backend terminal for "Connected to MongoDB"
echo.
echo Press any key to close this window...
pause >nul
