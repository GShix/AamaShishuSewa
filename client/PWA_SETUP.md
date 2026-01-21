# 📱 PWA Setup Guide - Aama Shishu Sewa

This guide provides complete instructions to set up and deploy your Progressive Web App (PWA).

## 🎯 What's Already Done

✅ Installed `vite-plugin-pwa` and `workbox-window`  
✅ Configured Vite with PWA plugin and workbox caching strategies  
✅ Created PWA components (InstallPrompt, UpdateNotification, OfflineIndicator)  
✅ Created custom hooks (usePWA, useNetworkStatus)  
✅ Integrated PWA components into App.jsx  
✅ Created icon generation script  
✅ Updated HTML with PWA meta tags  

## 🚀 Quick Start

### Step 1: Generate PWA Icons

First, create your app logo:

1. **Create a logo file**: Place a `logo.png` (1024x1024 recommended) in `client/public/`
   - Use a transparent background PNG
   - Make sure your logo is centered and doesn't touch the edges
   - Example dimensions: 1024x1024px

2. **Generate all required icons**:
   ```bash
   cd client
   node generate-icons.js
   ```

This will create:
- `pwa-64x64.png`
- `pwa-192x192.png`
- `pwa-512x512.png`
- `maskable-icon-512x512.png` (with safe zone padding)
- `apple-touch-icon.png`
- `favicon.ico`

### Step 2: Update Package.json Scripts

Add icon generation to your package.json:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "generate-icons": "node generate-icons.js"
}
```

### Step 3: Test in Development

```bash
npm run dev
```

Visit http://localhost:5173 and:
- Open DevTools → Application → Manifest (verify manifest is valid)
- Open DevTools → Application → Service Workers (verify SW is registered)
- Check Network tab → Offline (test offline functionality)

### Step 4: Build for Production

```bash
npm run build
npm run preview
```

## 📋 PWA Features Implemented

### 1. **Install Prompt**
- Shows after 3 seconds on first visit
- Users can install app to home screen
- Dismissal is remembered for 7 days
- Location: Bottom of screen (mobile-friendly)

### 2. **Update Notification**
- Automatically detects new app versions
- Shows prompt to reload when update is available
- Users can dismiss and update later

### 3. **Offline Indicator**
- Displays when internet connection is lost
- Shows "Back Online" notification when reconnected
- Auto-hides after 3 seconds

### 4. **Service Worker Caching**
- **CacheFirst**: Images, Google Fonts (long-term cache)
- **NetworkFirst**: Supabase API calls (fresh data preferred)
- **Precaching**: All app assets (JS, CSS, HTML)

### 5. **Custom Hooks**

#### `usePWA()`
```jsx
import { usePWA } from './hooks/usePWA';

const { isInstalled, isOnline, canInstall, promptInstall } = usePWA();

// Example usage
{canInstall && (
  <button onClick={promptInstall}>Install App</button>
)}
```

#### `useNetworkStatus()`
```jsx
import { useNetworkStatus, useIsInstalled } from './hooks/useNetworkStatus';

const isOnline = useNetworkStatus();
const isInstalled = useIsInstalled();
```

## 🔧 Customization

### Update Theme Colors

Edit `vite.config.js`:

```javascript
manifest: {
  theme_color: '#your-color',  // Browser UI color
  background_color: '#your-color',  // Splash screen background
}
```

Also update in `index.html`:
```html
<meta name="theme-color" content="#your-color" />
```

### Modify Caching Strategy

Edit `vite.config.js` → `workbox.runtimeCaching`:

```javascript
{
  urlPattern: /your-api-pattern/,
  handler: 'NetworkFirst', // or 'CacheFirst', 'StaleWhileRevalidate'
  options: {
    cacheName: 'your-cache-name',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 86400 // 24 hours
    }
  }
}
```

### Add More Shortcuts

Edit `vite.config.js` → `manifest.shortcuts`:

```javascript
shortcuts: [
  {
    name: 'Your Action',
    short_name: 'Action',
    description: 'Description of action',
    url: '/your-route',
    icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
  }
]
```

## 📱 Testing PWA

### Desktop (Chrome)

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check:
   - **Manifest**: Verify all fields are correct
   - **Service Workers**: Should show active & running
   - **Storage**: Check Cache Storage for cached files
4. Test install: Click ⊕ icon in address bar

### Mobile (Android)

1. Open in Chrome browser
2. Menu → "Add to Home Screen" or "Install App"
3. Check home screen for app icon
4. Open app (should open in standalone mode, no browser UI)

### Mobile (iOS)

1. Open in Safari browser
2. Tap Share button
3. Tap "Add to Home Screen"
4. Confirm and check home screen

### Lighthouse Audit

```bash
npm run build
npm run preview
```

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Aim for 100% PWA score

## 🌐 Deployment

### Vercel

Your `vercel.json` should include:

```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    },
    {
      "source": "/manifest.webmanifest",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

Deploy:
```bash
npm run build
vercel --prod
```

### Netlify

Create `netlify.toml`:

```toml
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Service-Worker-Allowed = "/"

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```

Deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Important Deployment Notes

1. **HTTPS Required**: PWA only works on HTTPS (or localhost)
2. **Service Worker Scope**: Must be served from root path
3. **Cache Headers**: Service worker should not be cached aggressively
4. **Test After Deploy**: Always test on actual device after deployment

## 🐛 Troubleshooting

### Service Worker Not Registering

**Problem**: Service worker doesn't register in production

**Solution**:
- Check browser console for errors
- Verify HTTPS is enabled
- Check service worker scope in DevTools
- Clear cache and hard reload (Ctrl+Shift+R)

### Install Prompt Not Showing

**Problem**: Install button doesn't appear

**Solutions**:
- Not all browsers support install prompt (works in Chrome, Edge)
- App must meet PWA criteria (HTTPS, manifest, service worker)
- User may have already dismissed it
- Check if app is already installed
- Clear site data and try again

### Icons Not Displaying

**Problem**: App icons don't show correctly

**Solutions**:
- Verify icons are in `public/` directory
- Check icon paths in manifest
- Use absolute paths (`/icon.png` not `icon.png`)
- Clear cache and rebuild
- Test with Lighthouse to verify

### Offline Mode Not Working

**Problem**: App doesn't work offline

**Solutions**:
- Check if service worker is active (DevTools → Application → Service Workers)
- Verify caching strategy in `vite.config.js`
- Check Network tab with offline mode enabled
- Look for service worker errors in console
- Ensure critical assets are precached

### Update Not Showing

**Problem**: Users don't see update notification

**Solutions**:
- Update detected only after service worker activates
- May take 24 hours for some browsers to check for updates
- Force update: Unregister SW in DevTools and refresh
- Verify `registerType: 'prompt'` in vite.config.js

## 📊 PWA Checklist

Before deploying, verify:

- [ ] All icons generated and in `public/` folder
- [ ] Manifest.json is valid (check in DevTools)
- [ ] Service worker registers successfully
- [ ] App works offline (test in DevTools)
- [ ] Install prompt appears and works
- [ ] Update notification works
- [ ] Theme colors match your brand
- [ ] HTTPS enabled on production
- [ ] Lighthouse PWA score > 90
- [ ] Tested on real mobile device (Android & iOS)
- [ ] App name and description are correct
- [ ] Shortcuts work as expected
- [ ] Cache strategy is appropriate for your API calls

## 🎨 Animations

Add these to your `index.css` for smooth PWA UI animations:

```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
```

## 📚 Additional Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🎉 You're Done!

Your app is now a fully functional PWA! Users can:
- 📥 Install it to their home screen
- 📴 Use it offline
- 🔄 Get automatic updates
- ⚡ Experience fast loading times
- 📱 Enjoy a native app-like experience

---

**Need Help?** Check the troubleshooting section or open an issue in the project repository.
