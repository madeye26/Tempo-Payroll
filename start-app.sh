#!/bin/bash
echo "Starting Salary Management System..."
echo ""
echo "This will start the application on your local network."
echo "After starting, the app will be available at:"
echo ""

# Get the IP address
IP=$(hostname -I | awk '{print $1}')

echo "http://$IP:3000"
echo ""
echo "Press Ctrl+C to stop the server when done."
echo ""

cd "$(dirname "$0")"
npx serve -s dist -l tcp://0.0.0.0:3000
