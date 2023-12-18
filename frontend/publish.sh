#!/bin/bash

# Run the build command
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed, exiting..."
    exit 1
fi

cd build
git init
git checkout -b main
git add .
git commit -m "Publish new build"
git remote add origin https://github.com/lepeat/lepeat.git
git push origin main -f