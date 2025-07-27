#!/bin/bash

# Build the React app
echo "Building React app..."
npm run build

# Go to project root
echo "Cleaning root directory (except .git, zoomies-react, zoomies-mobile)..."
cd ..
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '.git' \
  ! -name 'zoomies-react' \
  ! -name 'zoomies-mobile' \
  ! -name '..' \
  -type f -exec rm -f {} +
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '.git' \
  ! -name 'zoomies-react' \
  ! -name 'zoomies-mobile' \
  ! -name '..' \
  -type d -exec rm -rf {} +

# Copy the built files to the root for GitHub Pages
echo "Copying built files to root..."
cp -r zoomies-react/dist/* ./

# Add all files
git add .

# Commit the changes
git commit -m "Deploy React app to GitHub Pages (clean root first)"

# Push to GitHub
git push origin main

echo "Deployment complete! Your site should be available at:"
echo "https://lilsmores.github.io/zoomies-demo/" 