@echo off
echo Building the Salary Management System...

:: Create deployment directory
if exist deploy rmdir /s /q deploy
mkdir deploy

:: Build the application
npm run build

:: Copy build files to deploy directory
xcopy /E /I dist deploy\app

:: Create run script
echo @echo off > deploy\run.bat
echo echo Starting Salary Management System... >> deploy\run.bat
echo cd app >> deploy\run.bat
echo start http://localhost:4173 >> deploy\run.bat
echo npx serve -s . >> deploy\run.bat

:: Create zip file
echo Creating deployment package...
powershell Compress-Archive -Path deploy\* -DestinationPath salary-management-system.zip -Force

echo Deployment package created successfully!
echo You can distribute the salary-management-system.zip file to users.
