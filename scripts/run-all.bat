@echo off
echo Starting Backend + Frontend...
cd /d "%~dp0.."
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
