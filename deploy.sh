#!/bin/bash
echo "Building the Salary Management System..."

# Create deployment directory
rm -rf deploy
mkdir -p deploy

# Build the application
npm run build

# Copy build files to deploy directory
cp -r dist deploy/app

# Create run script
echo '#!/bin/bash' > deploy/run.sh
echo 'echo "Starting Salary Management System..."' >> deploy/run.sh
echo 'cd app' >> deploy/run.sh
echo 'open http://localhost:4173 || xdg-open http://localhost:4173' >> deploy/run.sh
echo 'npx serve -s .' >> deploy/run.sh
chmod +x deploy/run.sh

# Create zip file
echo "Creating deployment package..."
cd deploy
zip -r ../salary-management-system.zip *
cd ..

echo "Deployment package created successfully!"
echo "You can distribute the salary-management-system.zip file to users."
