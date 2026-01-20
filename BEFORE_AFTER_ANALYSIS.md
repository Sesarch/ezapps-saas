# Before vs After: What Changed

## Timeline of Events

### ✅ Before (Working State)
- **Supabase Project:** `skiimqutaftrcdtorqts`
- **Status:** Everything working (login, Shopify OAuth, dashboard)
- **Shopify App:** Configured with old Supabase callback URLs

### 🔄 What Happened
1. User requested password reset functionality
2. Added forgot-password and reset-password pages
3. Supabase started throwing 429 (rate limiting) errors
4. Created NEW Supabase project: `fjbdzcnazlskhojxrcdq`
5. Updated Vercel environment variables to new Supabase
6. Redeployed application

### ❌ After (Current Broken State)
- **Supabase Project:** `fjbdzcnazlskhojxrcdq` (NEW)
- **Login:** ✅ Works
- **Shopify OAuth:** ❌ Broken - "Could not find Shopify API application with api_key"

---

## Root Cause Analysis

### Why is Shopify OAuth Broken?

The Shopify OAuth error has **NOTHING to do with Supabase** directly. Here's what actually happened:

#### The OAuth Flow
```
1. User clicks "Connect Shopify"
2. App redirects to: https://[store].myshopify.com/admin/oauth/authorize?client_id=XXX&redirect_uri=YYY
3. Shopify checks:
   - Does client_id=XXX match a real app? ← THIS IS WHERE IT FAILS
   - Is redirect_uri=YYY allowed for that app?
4. If both are valid, Shopify shows authorization page
5. User approves
6. Shopify redirects to: redirect_uri?code=ZZZ
7. App exchanges code for access token
8. Access token is stored in Supabase
```

#### The Problem
When you see "Could not find Shopify API application with api_key", it means **Step 3** failed.

Shopify is saying: "I don't have any app with client_id=XXX in my system"

This can happen if:
1. The `SHOPIFY_CLIENT_ID` in Vercel is incorrect/typo
2. The Shopify app was deleted from Shopify Partners
3. The credentials are from a different Shopify Partners account
4. The environment variable wasn't saved properly in Vercel

---

## Environment Variables Comparison

### Before (Working)
```
NEXT_PUBLIC_SUPABASE_URL=https://skiimqutaftrcdtorqts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[old key]
SUPABASE_SERVICE_ROLE_KEY=[old key]
SHOPIFY_CLIENT_ID=[working client ID]
SHOPIFY_CLIENT_SECRET=[working secret]
NEXT_PUBLIC_APP_URL=https://shopify.ezapps.app
```

### After (Current)
```
NEXT_PUBLIC_SUPABASE_URL=https://fjbdzcnazlskhojxrcdq.supabase.co  ← CHANGED
NEXT_PUBLIC_SUPABASE_ANON_KEY=[new key]                            ← CHANGED
SUPABASE_SERVICE_ROLE_KEY=[new key]                                ← CHANGED
SHOPIFY_CLIENT_ID=[same as before?]                                ← CHECK THIS
SHOPIFY_CLIENT_SECRET=[same as before?]                            ← CHECK THIS
NEXT_PUBLIC_APP_URL=https://shopify.ezapps.app                     ← SHOULD BE SAME
```

---

## What Needs to Match

### In Vercel (Environment Variables)
```
SHOPIFY_CLIENT_ID=4e8f1234567890abcdef  ← Must match Shopify Partners
```

### In Shopify Partners Dashboard
```
Client ID: 4e8f1234567890abcdef         ← Must match Vercel
Allowed redirect URIs:
  - https://shopify.ezapps.app/api/auth/shopify/callback
  - http://localhost:3000/api/auth/shopify/callback
```

### In Your Code (route.ts)
```typescript
const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/shopify/callback`
// If NEXT_PUBLIC_APP_URL = https://shopify.ezapps.app
// Then redirectUri = https://shopify.ezapps.app/api/auth/shopify/callback
```

---

## The Disconnect

### Theory 1: Wrong Credentials in Vercel
When updating Supabase credentials, the Shopify credentials might have been:
- Accidentally deleted
- Overwritten with wrong values
- Not saved properly

**Solution:** Re-enter the correct `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` from Shopify Partners

### Theory 2: Shopify App Doesn't Exist
The Shopify app in Partners might have been:
- Deleted
- Never created
- Lost access to

**Solution:** Create a new Shopify app or regain access to existing one

### Theory 3: Redirect URI Mismatch
The redirect URI in Shopify Partners doesn't match what the code is sending.

**Solution:** Update allowed redirect URIs in Shopify Partners to include:
`https://shopify.ezapps.app/api/auth/shopify/callback`

---

## Why Supabase Change Appeared to Break Shopify

### It's a Coincidence
The Supabase change and Shopify OAuth failure happened at the same time, but they're **not directly related**.

### What Likely Happened
When updating environment variables in Vercel:
1. You updated all 3 Supabase variables ✅
2. You might have accidentally:
   - Deleted Shopify variables ❌
   - Changed Shopify variables ❌
   - Not saved them properly ❌

### The Evidence
- Login works (uses Supabase) ✅
- Dashboard loads (uses Supabase) ✅
- Shopify OAuth fails (uses Shopify Partners, NOT Supabase) ❌

This confirms:
- New Supabase is working fine
- Shopify credentials are the problem

---

## Recommended Fix Path

### Option A: Quick Fix (5 minutes)
1. **Don't touch Supabase** - it's working fine
2. Go to Shopify Partners: https://partners.shopify.com/
3. Find your EZ Apps application
4. Copy Client ID and Client Secret
5. Paste into Vercel environment variables
6. Verify redirect URI includes: `https://shopify.ezapps.app/api/auth/shopify/callback`
7. Redeploy

### Option B: Full Reset (If you can't find the Shopify app)
1. Create new Shopify app in Partners
2. Configure redirect URIs
3. Update Vercel with new credentials
4. Redeploy

### Option C: Rollback (If you want the old Supabase)
1. Restore old Supabase credentials
2. Everything will work again
3. But you'll still have rate limiting issues

---

## Testing Checklist

After applying fixes, test in this order:

### 1. Verify Environment Variables (Vercel)
- [ ] All 6 variables exist
- [ ] No typos or extra spaces
- [ ] Saved for Production environment

### 2. Verify Shopify Partners
- [ ] App exists and is active
- [ ] Client ID matches Vercel
- [ ] Redirect URI is correct

### 3. Test Login
- [ ] Go to https://shopify.ezapps.app/login
- [ ] Login with your account
- [ ] Should work ✅ (uses Supabase)

### 4. Test Shopify OAuth
- [ ] Go to /dashboard/stores
- [ ] Enter a store name
- [ ] Click "Connect"
- [ ] Should redirect to Shopify authorization page ✅
- [ ] Should NOT show error ❌

### 5. Complete OAuth Flow
- [ ] Approve app on Shopify page
- [ ] Should redirect back to dashboard
- [ ] Store should appear in your list
- [ ] Should be able to fetch orders

---

## Key Takeaways

1. **Supabase change didn't break Shopify** - they're independent systems
2. **The error is specific:** "Could not find Shopify API application" = Client ID problem
3. **Quick fix:** Verify/update Shopify credentials in Vercel
4. **Always redeploy** after changing environment variables
5. **Test incrementally** - verify each step works before moving to next

---

## Need More Help?

If the fix doesn't work after:
1. ✅ Verifying Shopify credentials in Partners
2. ✅ Updating Vercel environment variables  
3. ✅ Checking redirect URI matches exactly
4. ✅ Redeploying the application

Then check Vercel Function Logs for the actual error message during OAuth.
