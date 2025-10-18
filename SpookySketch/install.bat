@echo off
echo ====================================
echo  Installing SpookySketch Dependencies
echo ====================================
echo.

echo [1/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

echo.
echo [3/4] Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo [4/4] Creating environment files...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul 2>&1
    echo Created backend\.env from template
)
if not exist "frontend\.env.local" (
    copy "frontend\.env.local.example" "frontend\.env.local" >nul 2>&1
    echo Created frontend\.env.local from template
)

echo.
echo ====================================
echo  Installation Complete! 
echo ====================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your MongoDB URI and Stripe keys
echo 2. Edit frontend\.env.local with your API URL and Stripe key
echo 3. Run: npm run dev
echo.
pause
