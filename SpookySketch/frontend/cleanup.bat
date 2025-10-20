@echo off
echo Removing test files...

if exist "src\app\auth-debug" (
    rmdir /s /q "src\app\auth-debug"
    echo Removed auth-debug page
)

if exist "public\test-user-management.js" (
    del /f "public\test-user-management.js"
    echo Removed test-user-management.js
)

if exist "public\test-real-users.html" (
    del /f "public\test-real-users.html"
    echo Removed test-real-users.html
)

echo Cleanup complete!
