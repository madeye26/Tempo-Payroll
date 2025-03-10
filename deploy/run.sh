#!/bin/bash
echo "Starting Salary Management System..."
cd app
open http://localhost:4173 || xdg-open http://localhost:4173
npx serve -s .
