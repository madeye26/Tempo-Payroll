@echo off
echo Building the Salary Management System...

:: Create deployment directory
if exist deploy rmdir /s /q deploy
mkdir deploy

:: Build the application
npm run build

:: Copy build files to deploy directory
xcopy /E /I dist deploy\app

:: Create run script with environment variables
echo @echo off > deploy\run.bat
echo echo Setting up environment variables... >> deploy\run.bat
echo set VITE_SUPABASE_URL=https://dreamy-colden8-l6gjb.supabase.co >> deploy\run.bat
echo set VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWFteS1jb2xkZW44LWw2Z2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1MzA0MDAsImV4cCI6MjAzMzEwNjQwMH0.Yx-Ky_Ht_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij_Ij >> deploy\run.bat
echo echo Starting Salary Management System... >> deploy\run.bat
echo cd app >> deploy\run.bat
echo start http://localhost:4173 >> deploy\run.bat
echo npx serve -s . >> deploy\run.bat

:: Create zip file
echo Creating deployment package...
powershell Compress-Archive -Path deploy\* -DestinationPath salary-management-system.zip -Force

echo Deployment package created successfully!
echo You can distribute the salary-management-system.zip file to users.
