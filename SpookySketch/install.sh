#!/bin/bash

echo "===================================="
echo " Installing SpookySketch Dependencies"
echo "===================================="
echo ""

echo "[1/4] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install root dependencies"
    exit 1
fi

echo ""
echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    cd ..
    exit 1
fi

echo ""
echo "[3/4] Installing backend dependencies..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    cd ..
    exit 1
fi

cd ..

echo ""
echo "[4/4] Creating environment files..."
if [ ! -f "backend/.env" ]; then
    cp "backend/.env.example" "backend/.env" 2>/dev/null || true
    echo "Created backend/.env from template"
fi
if [ ! -f "frontend/.env.local" ]; then
    cp "frontend/.env.local.example" "frontend/.env.local" 2>/dev/null || true
    echo "Created frontend/.env.local from template"
fi

echo ""
echo "===================================="
echo " Installation Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and Stripe keys"
echo "2. Edit frontend/.env.local with your API URL and Stripe key"
echo "3. Run: npm run dev"
echo ""
