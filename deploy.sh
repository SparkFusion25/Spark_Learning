#!/bin/bash

# 🚀 Rocketter Learning - Vercel Deployment Script

echo "🌟 Deploying Rocketter Learning to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project first to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "📱 Your Rocketter Learning platform is now live!"
    echo ""
    echo "🎮 Demo Credentials:"
    echo "👨‍👩‍👧‍👦 Parent: parent@family.com / password123"
    echo "⚙️ Admin: admin@sparklearn.com / admin123"
    echo "🧒 Child: Click 'I'm Ready to Learn & Play!'"
    
else
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi