@echo off
cd /d "%~dp0\.."
if not exist .env copy .env.example .env
if not exist db mkdir db
echo Running npx prisma generate...
call npx prisma generate
if errorlevel 1 exit /b 1
echo Running npx prisma migrate deploy...
call npx prisma migrate deploy
if errorlevel 1 exit /b 1
echo Done. Database setup complete.
