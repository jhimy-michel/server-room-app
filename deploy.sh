#!/bin/bash

echo "Deployment process started..."

# Run the build script using npm
echo "Building the application..."
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
else
    echo "Build failed! Aborting deployment..."
    exit 1
fi

echo "Starting Firebase deployment..."

# Deploy the application using Firebase CLI
firebase deploy

# Check if the deployment was successful
if [ $? -eq 0 ]; then
    echo "Firebase deployment successful!"
else
    echo "Firebase deployment failed!"
    exit 1
fi

echo "Deployment process completed."
