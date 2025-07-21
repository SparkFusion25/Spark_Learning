# 🚀 Vercel Deployment Guide for Rocketter Learning

## Quick Deploy Options

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import from Git Repository:**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the `rocketter-learning` repository
   - Click "Import"

4. **Configure Project Settings:**
   ```
   Project Name: rocketter-learning
   Framework Preset: Create React App
   Root Directory: ./
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. **Add Environment Variables:**
   Go to "Environment Variables" section and add:
   ```
   REACT_APP_NAME=Rocketter Learning
   REACT_APP_VERSION=1.0.0
   REACT_APP_ENV=production
   REACT_APP_API_URL=https://your-api-domain.com/api
   REACT_APP_JWT_SECRET=rocketter-learning-super-secret-key-2024
   REACT_APP_ENABLE_AI_COMPANION=true
   REACT_APP_ENABLE_3D_WORLDS=true
   ```

6. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project directory:**
   ```bash
   cd rocketter-learning
   vercel --prod
   ```

4. **Follow the prompts:**
   ```
   ? Set up and deploy "~/rocketter-learning"? [Y/n] y
   ? Which scope should contain your project? [Your Account]
   ? Link to existing project? [y/N] n
   ? What's your project's name? rocketter-learning
   ? In which directory is your code located? ./
   ```

## Environment Variables for Vercel

### Required Variables (Add in Vercel Dashboard)

```bash
# App Configuration
REACT_APP_NAME=Rocketter Learning
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=production

# API Configuration
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_API_TIMEOUT=10000

# Authentication
REACT_APP_JWT_SECRET=rocketter-learning-super-secret-key-2024
REACT_APP_SESSION_TIMEOUT=86400000

# Feature Flags
REACT_APP_ENABLE_AI_COMPANION=true
REACT_APP_ENABLE_3D_WORLDS=true
REACT_APP_ENABLE_VOICE_COMMANDS=false
REACT_APP_ENABLE_AR_FEATURES=false

# Security
REACT_APP_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
REACT_APP_CORS_ORIGINS=https://your-vercel-app.vercel.app

# Deployment
REACT_APP_DEPLOY_ENV=production
REACT_APP_BUILD_HASH=vercel-build
```

### Optional Variables (for later integration)

```bash
# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
REACT_APP_MIXPANEL_TOKEN=your-mixpanel-token

# Third-party Services
REACT_APP_TWILIO_ACCOUNT_SID=your-twilio-account-sid
REACT_APP_SENDGRID_API_KEY=your-sendgrid-api-key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key

# Error Monitoring
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

## Vercel Configuration Files

The following files are already configured for optimal Vercel deployment:

### `vercel.json`
```json
{
  "version": 2,
  "name": "rocketter-learning",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### `.vercelignore`
```
node_modules
.env
.env.local
coverage
build
.git
```

## Post-Deployment Steps

1. **Update Environment Variables:**
   - Replace `https://your-vercel-app.vercel.app` with your actual Vercel URL
   - Update `REACT_APP_API_URL` when you have a backend

2. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Enable Analytics:**
   - Go to Project Settings → Analytics
   - Enable Vercel Analytics for performance monitoring

## Demo Credentials

The deployed app will include these demo credentials:

### Parent Login
- **Email:** `parent@family.com`
- **Password:** `password123`

### Admin Login
- **Email:** `admin@sparklearn.com`
- **Password:** `admin123`

### Child Access
- Click "I'm Ready to Learn & Play!" (no credentials needed)

## Troubleshooting

### Build Fails
- Check that all dependencies are in `dependencies` not `devDependencies`
- Ensure `npm run build` works locally

### Environment Variables Not Working
- Make sure variables start with `REACT_APP_`
- Variables are set in Vercel Dashboard under Project Settings

### Routing Issues
- The `vercel.json` handles React Router routing
- All routes redirect to `index.html` for client-side routing

### Performance Optimization
- Static assets are cached for 1 year
- Build output is optimized for production
- Vercel automatically enables compression

## Monitoring & Analytics

After deployment, you can monitor:
- **Performance:** Vercel Analytics dashboard
- **Errors:** Browser console and error boundaries
- **Usage:** Google Analytics (when configured)
- **User Feedback:** React Hot Toast notifications

## Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel Dashboard
3. Test locally with `npm run build` first
4. Check environment variables are properly set

---

**🎉 Your Rocketter Learning platform will be live at: `https://your-project-name.vercel.app`**