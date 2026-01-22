# Vercel Deployment Environment Variables

## Required for Server Deployment

When deploying the server to Vercel, add these environment variables in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

### Database & Authentication
```
SUPABASE_URL=https://jdtjkhxenyafyiqggmkv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Server Configuration
```
NODE_ENV=production
CLIENT_URL=https://your-client-app.vercel.app
ADMIN_REGISTRATION_SECRET=your_admin_secret
```

### Optional Services
```
OPENAI_API_KEY=your_openai_key (if using AI features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SPARROW_SMS_TOKEN=your_sms_token
SPARROW_SMS_FROM=AamaSisu
```

## Client Environment Variables

Update your client `.env` file after server deployment:

```
VITE_API_URL=https://your-server.vercel.app/api
```

Or update `vite.config.js` proxy target to your deployed server URL.

## Deployment Steps

1. **Server:**
   - Push code to GitHub/GitLab
   - Import to Vercel
   - Add all environment variables
   - Deploy

2. **Client:**
   - Update API URL to point to deployed server
   - Redeploy client

3. **Update CORS:**
   - Ensure server CORS allows your client domain
   - Check `CLIENT_URL` matches deployed client

## Important Notes

⚠️ **Never commit `.env` files to Git**
⚠️ **Use different values for production vs development**
⚠️ **Rotate JWT_SECRET for production**
⚠️ **Keep SUPABASE_SERVICE_ROLE_KEY secret**
