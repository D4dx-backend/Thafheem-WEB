# 🌐 API Calls: Development vs Production

## 📋 Overview

This document explains how API calls are configured and work differently in **development (localhost)** vs **production** environments.

---

## 🔧 Configuration Files

### 1. **API Configuration** (`src/config/apiConfig.js`)

This is the **main configuration file** that determines which API URL to use:

```javascript
const isDevelopment = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_DEV_API_URL = 'http://localhost:5000';
const DEFAULT_PROD_API_URL = 'https://thafheemapi.thafheem.net';

// Auto-detects environment and uses appropriate URL
const API_BASE_URL = envApiUrl
  ? envApiUrl.trim()
  : (isDevelopment ? DEFAULT_DEV_API_URL : DEFAULT_PROD_API_URL);

// Final API path: {API_BASE_URL}/api
const API_BASE_PATH = `${API_BASE_URL}/api`;
```

---

## 🏠 Development (Localhost)

### **How it works:**

1. **Frontend runs on**: `http://localhost:5173` (Vite dev server)
2. **Backend API runs on**: `http://localhost:5000`
3. **API calls go to**: `http://localhost:5000/api/...`

### **Example API Call:**
```javascript
// When you call:
fetch(`${API_BASE_PATH}/bangla/translation/1/1`)

// In development, it becomes:
fetch('http://localhost:5000/api/bangla/translation/1/1')
```

### **Visual Flow:**
```
┌─────────────────────┐         ┌─────────────────────┐
│   Browser           │         │   Backend API       │
│   localhost:5173    │─────────▶│   localhost:5000    │
│   (Frontend)       │  HTTP   │   (Node.js/Express) │
└─────────────────────┘         └─────────────────────┘
```

---

## 🚀 Production

### **How it works:**

1. **Frontend runs on**: `https://thafheem.net`
2. **Backend API runs on**: `https://thafheemapi.thafheem.net` (Separate server)
3. **API calls go to**: `https://thafheemapi.thafheem.net/api/...`

### **Example API Call:**
```javascript
// When you call:
fetch(`${API_BASE_PATH}/bangla/translation/1/1`)

// In production, it becomes:
fetch('https://thafheemapi.thafheem.net/api/bangla/translation/1/1')
```

### **Visual Flow:**
```
┌─────────────────────┐         ┌─────────────────────┐
│   User's Browser   │         │   Backend API       │
│   thafheem.net     │─────────▶│   thafheemapi.      │
│   (Frontend)       │  HTTPS  │   thafheem.net      │
│                    │         │   (Node.js Server)  │
└─────────────────────┘         └─────────────────────┘
         │                              │
         │                              │
         └─────────── Internet ─────────┘
```

---

## 🔄 Environment Detection

The system **automatically detects** which environment you're in:

### **Development Detection:**
- Uses `import.meta.env.DEV` (Vite's built-in variable)
- When running `npm run dev` → `DEV = true`
- When running `npm run build` → `DEV = false`

### **Production Detection:**
- Uses `import.meta.env.PROD` (Vite's built-in variable)
- When built and deployed → `PROD = true`

---

## ⚙️ Manual Override (Environment Variables)

You can **override** the automatic detection using environment variables:

### **Create `.env` file in `Thafheem-WEB/`:**

```bash
# Force a specific API URL (optional)
VITE_API_BASE_URL=https://thafheemapi.thafheem.net

# Optional: API version
VITE_API_VERSION=v1
```

### **Priority Order:**
1. **First**: `VITE_API_BASE_URL` environment variable (if set)
2. **Second**: Auto-detect based on `DEV`/`PROD` mode
   - Development → `http://localhost:5000`
   - Production → `https://thafheemapi.thafheem.net`

---

## 🌍 CORS Configuration

### **Backend CORS Setup** (`Thafheem-API/server.js`)

The backend allows requests from these origins:

```javascript
const allowedOrigins = [
  'http://localhost:5173',        // Vite dev server
  'http://localhost:5174',        // Alternative port
  'http://localhost:4173',        // Preview server
  'https://thafheem.net',               // Production domain
  process.env.FRONTEND_URL              // Custom env variable
];
```

### **Important Notes:**
- ✅ **Development**: CORS allows all origins (for easier development)
- ✅ **Production**: Only specific origins are allowed
- ⚠️ **If you add a new domain**, update the `allowedOrigins` array in `server.js`

---

## 📝 Example API Endpoints

### **All these endpoints work the same way:**

| Endpoint | Development URL | Production URL |
|----------|----------------|----------------|
| Translation | `http://localhost:5000/api/bangla/translation/1/1` | `https://thafheemapi.thafheem.net/api/bangla/translation/1/1` |
| Interpretation | `http://localhost:5000/api/bangla/interpretation/1/1` | `https://thafheemapi.thafheem.net/api/bangla/interpretation/1/1` |
| Word-by-Word | `http://localhost:5000/api/bangla/word-by-word/1/1` | `https://thafheemapi.thafheem.net/api/bangla/word-by-word/1/1` |
| Chapter Info | `http://localhost:5000/api/chapter-info/1/mal` | `https://thafheemapi.thafheem.net/api/chapter-info/1/mal` |

---

## 🚨 Common Issues & Solutions

### **Issue 1: CORS Error in Production**
**Error**: `Access to fetch at 'https://thafheemapi.thafheem.net/api/...' from origin 'https://thafheem.net' has been blocked by CORS policy`

**Solution**: 
- Add your production domain to `allowedOrigins` in `Thafheem-API/server.js`
- Restart the backend server

### **Issue 2: API Calls Still Going to Localhost in Production**
**Cause**: Environment variable not set or build cache issue

**Solution**:
1. Clear build cache: `rm -rf dist node_modules/.vite`
2. Rebuild: `npm run build`
3. Check `.env` file has correct values

### **Issue 3: Backend Not Accessible**
**Error**: `Failed to fetch` or `Network error`

**Solution**:
- Ensure backend server is running on `thafheemapi.thafheem.net`
- Check firewall/security settings
- Verify DNS is pointing correctly

---

## 🔍 How to Verify Current Configuration

### **In Browser Console:**
```javascript
// Check what API base path is being used
console.log(import.meta.env.DEV);  // true in dev, false in prod
console.log(import.meta.env.VITE_API_BASE_URL);  // undefined or your custom URL
```

### **In Network Tab:**
1. Open browser DevTools → Network tab
2. Make an API call
3. Check the **Request URL** - it will show:
   - Development: `localhost:5000/api/...`
   - Production: `thafheemapi.thafheem.net/api/...`

---

## 📦 Deployment Checklist

### **Before Deploying to Production:**

- [ ] Backend API is deployed and running on `thafheemapi.thafheem.net`
- [ ] Backend CORS includes your production domain
- [ ] Environment variables are set (if needed)
- [ ] Test API calls work from production frontend
- [ ] Database connection is configured for production
- [ ] SSL certificates are valid for API domain

---

## 🎯 Summary

| Aspect | Development | Production |
|--------|------------|------------|
| **Frontend URL** | `localhost:5173` | `thafheem.net` |
| **Backend URL** | `localhost:5000` | `thafheemapi.thafheem.net` |
| **API Base Path** | `http://localhost:5000/api` | `https://thafheemapi.thafheem.net/api` |
| **Detection** | Auto (via `import.meta.env.DEV`) | Auto (via `import.meta.env.PROD`) |
| **Override** | `.env` file with `VITE_API_BASE_URL` | `.env` file with `VITE_API_BASE_URL` |

---

## 💡 Key Takeaway

**The system automatically switches between localhost and production URLs based on your build environment. You don't need to change any code - it just works!**

- ✅ **Development**: Uses `localhost:5000`
- ✅ **Production**: Uses `thafheemapi.thafheem.net`
- ✅ **Override**: Set `VITE_API_BASE_URL` in `.env` if needed

