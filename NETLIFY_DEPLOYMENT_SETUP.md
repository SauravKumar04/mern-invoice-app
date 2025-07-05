# Netlify Deployment Setup Guide

## Issue Fixed: Network Error ERR_CONNECTION_REFUSED

The error you encountered was due to your frontend (deployed on Netlify) trying to connect to `localhost:4000`, which doesn't exist in production.

## What Was Fixed:

1. **Updated payments.js**: Now uses the same API configuration as other files
2. **Added proper environment variable handling**: Consistent API URL configuration
3. **Created environment templates**: For both development and production

## Environment Variables Setup

### Step 1: Set Up Your Backend URL

First, find your backend URL. Since you're using Render for the backend:

1. Go to your Render dashboard
2. Find your backend service
3. Copy the URL (should look like: `https://your-app-name.onrender.com`)

### Step 2: Configure Netlify Environment Variables

1. **Go to your Netlify dashboard**
2. **Select your site**
3. **Go to Site settings → Environment variables**
4. **Add a new variable**:
   - **Key**: `VITE_API`
   - **Value**: `https://your-backend-url.onrender.com/api`
   
   Example:
   ```
   VITE_API=https://your-invoice-backend.onrender.com/api
   ```

### Step 3: Redeploy Your Site

After setting the environment variable:
1. Go to your Netlify site dashboard
2. Click "Deploys" tab
3. Click "Trigger deploy" → "Clear cache and deploy site"

## Local Development Setup

For local development, create a `.env.local` file in your `client` directory:

```env
# client/.env.local
VITE_API=http://localhost:4000/api
```

## Verification Steps

### 1. Check Environment Variable in Browser
After redeploying, you can verify the environment variable is set:
1. Open your deployed site
2. Open browser developer tools (F12)
3. Go to Console tab
4. Type: `console.log(import.meta.env.VITE_API)`
5. You should see your backend URL, not localhost

### 2. Test API Connectivity
Try these actions to confirm the fix:
- Send a QR code email
- Download a QR code
- Create/edit an invoice
- Any other API call

## Common Issues and Solutions

### Issue 1: Environment variable not found
**Problem**: Still seeing localhost:4000 in network requests
**Solution**: 
- Make sure the environment variable is named exactly `VITE_API` (case sensitive)
- Ensure you've redeployed after setting the variable
- Clear browser cache

### Issue 2: API URL has wrong format
**Problem**: Network errors or 404 responses
**Solution**:
- Make sure your backend URL ends with `/api`
- Example: `https://your-app.onrender.com/api`
- NOT: `https://your-app.onrender.com/`

### Issue 3: Backend is sleeping (Render free tier)
**Problem**: First request takes a long time or times out
**Solution**:
- Render free tier puts apps to sleep after inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid tier for production

## File Changes Made

### 1. Updated `client/src/api/payments.js`
```javascript
// Before (incorrect)
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// After (correct)
import api from './axios';
// Uses the same API instance as other files
```

### 2. Updated `client/src/api/axios.js`
```javascript
// Added fallback URL for development
const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:4000/api',
});
```

### 3. Created Environment Templates
- `.env.example`: Template for environment variables
- `.env.local`: Local development configuration

## Testing the Fix

1. **Set the environment variable** in Netlify
2. **Redeploy** your site
3. **Test QR code functionality**:
   - Go to an invoice
   - Click "Send QR Code"
   - Should now connect to your backend instead of localhost

## Backend Considerations

Make sure your backend is configured to accept requests from your Netlify domain:

1. **CORS Configuration**: Update your backend CORS settings to allow your Netlify domain
2. **Environment Variables**: Ensure your backend has all required environment variables set in Render

## Next Steps

1. ✅ Set `VITE_API` environment variable in Netlify
2. ✅ Redeploy your Netlify site
3. ✅ Test QR code functionality
4. ✅ Test all other API features
5. ✅ Monitor for any remaining issues

## Support

If you continue to have issues:
1. Check browser network tab for actual URLs being called
2. Verify environment variable is set correctly
3. Check backend logs for any errors
4. Ensure backend is running and accessible

The network error should now be resolved! 🎉