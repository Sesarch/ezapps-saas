# Shopify OAuth Fix Guide

## Problem
Error: "Could not find Shopify API application with api_key"

## Root Cause
The `SHOPIFY_CLIENT_ID` in your Vercel environment variables doesn't match any actual Shopify app in your Shopify Partners account. This can happen because:
1. The credentials are incorrect/outdated
2. The Shopify app was deleted
3. The redirect URI in the Shopify app doesn't match your current setup

## Solution Options

### Option 1: Restore Old Supabase (FASTEST - Recommended)
Since everything was working before, the simplest fix is to restore the old Supabase credentials:

**In Vercel:**
1. Go to your project settings → Environment Variables
2. Update these variables back to your OLD Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://skiimqutaftrcdtorqts.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your old anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your old service role key)
3. Redeploy your application

**Why this works:** Your Shopify app credentials are still valid and pointing to callback URLs that expect the old Supabase.

---

### Option 2: Fix Shopify App Configuration (If you want to keep NEW Supabase)

#### Step 1: Verify Shopify App Exists
1. Go to https://partners.shopify.com/
2. Click "Apps" in the left sidebar
3. Find your EZ Apps application
4. Click on it to see details
5. **Copy the exact Client ID** (it should start with something like `4e8f1...`)

#### Step 2: Verify Client Secret
1. In the same app details page
2. Look for "Client Secret"
3. **Copy the exact Client Secret**

#### Step 3: Update Vercel Environment Variables
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update these variables:
   - `SHOPIFY_CLIENT_ID` = (paste the Client ID from Step 1)
   - `SHOPIFY_CLIENT_SECRET` = (paste the Client Secret from Step 2)
   - `NEXT_PUBLIC_APP_URL` = `https://shopify.ezapps.app` (verify this is correct)

#### Step 4: Update Shopify App Redirect URLs
This is **CRITICAL** - your Shopify app must allow the callback URL:

1. In your Shopify Partners app settings
2. Find "App Setup" or "Configuration"
3. Look for "Allowed redirect URI(s)"
4. Add this EXACT URL:
   ```
   https://shopify.ezapps.app/api/auth/shopify/callback
   ```
5. Also add for localhost testing:
   ```
   http://localhost:3000/api/auth/shopify/callback
   ```
6. **Save changes**

#### Step 5: Redeploy
1. In Vercel, trigger a new deployment (Settings → Deployments → Redeploy)
2. Or push any commit to trigger automatic deployment

---

### Option 3: Create New Shopify App (Last Resort)

If you can't find your existing Shopify app or credentials:

#### Step 1: Create New App
1. Go to https://partners.shopify.com/
2. Click "Apps" → "Create app"
3. Choose "Custom app"
4. Fill in details:
   - App name: EZ Apps (or similar)
   - App URL: `https://shopify.ezapps.app`
   
#### Step 2: Configure OAuth
1. In the new app, go to "Configuration"
2. Under "Allowed redirect URI(s)", add:
   ```
   https://shopify.ezapps.app/api/auth/shopify/callback
   http://localhost:3000/api/auth/shopify/callback
   ```
3. Under "App scopes", select:
   - `read_orders`
   - `read_products`
   - `read_inventory`

#### Step 3: Get Credentials
1. Copy the "Client ID"
2. Copy the "Client Secret"

#### Step 4: Update Vercel
1. Go to Vercel → Environment Variables
2. Update:
   - `SHOPIFY_CLIENT_ID` = (new Client ID)
   - `SHOPIFY_CLIENT_SECRET` = (new Client Secret)
3. Redeploy

---

## Testing the Fix

After applying any of the above solutions:

1. Go to your app: https://shopify.ezapps.app/login
2. Login with your credentials
3. Go to Stores page
4. Try to connect a Shopify store
5. You should be redirected to Shopify OAuth page (NOT an error)

## Expected OAuth Flow

1. User clicks "Connect Shopify Store"
2. Enters store name (e.g., "my-store")
3. Redirected to: `https://my-store.myshopify.com/admin/oauth/authorize?client_id=...`
4. Shopify shows authorization page
5. User clicks "Install app"
6. Redirected back to: `https://shopify.ezapps.app/api/auth/shopify/callback?code=...`
7. Backend exchanges code for access token
8. Store is saved to database
9. User sees success message

## Common Issues

### "Could not find Shopify API application with api_key"
- **Fix:** Verify `SHOPIFY_CLIENT_ID` matches your Shopify Partners app exactly

### "Redirect URI mismatch"
- **Fix:** Ensure callback URL in Shopify Partners matches: `https://shopify.ezapps.app/api/auth/shopify/callback`

### "Invalid client_secret"
- **Fix:** Verify `SHOPIFY_CLIENT_SECRET` is correct and not expired

### Store saves but can't fetch orders
- **Fix:** Verify you requested the correct scopes in Shopify Partners: `read_orders,read_products,read_inventory`

## Debug Mode

To see detailed logs:
1. Check Vercel deployment logs (Vercel → Deployments → View Function Logs)
2. Look for these debug messages:
   - `DEBUG - redirectUri:` (shows callback URL)
   - `DEBUG - Final shopifyAuthUrl:` (shows complete OAuth URL)
   - `CALLBACK - shop:` (shows which shop is connecting)

## Need Help?

If none of these solutions work, check:
1. Is your Shopify Partners account active?
2. Is your app still in "Development" mode? (Development apps work differently)
3. Are you using the correct Shopify Partners organization?

## Quick Checklist

- [ ] Verified `SHOPIFY_CLIENT_ID` in Vercel
- [ ] Verified `SHOPIFY_CLIENT_SECRET` in Vercel
- [ ] Verified redirect URI in Shopify Partners: `https://shopify.ezapps.app/api/auth/shopify/callback`
- [ ] Verified `NEXT_PUBLIC_APP_URL` = `https://shopify.ezapps.app`
- [ ] Redeployed application after changes
- [ ] Tested OAuth flow end-to-end
