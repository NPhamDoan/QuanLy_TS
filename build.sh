#!/bin/bash
set -e

# Build frontend
cd frontend
npm install
npm run build

# Copy frontend output to backend/public
cp -r dist ../backend/public

# Build backend
cd ../backend
npm install
npm run build
