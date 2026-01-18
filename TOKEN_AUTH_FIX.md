# Token-Based Cross-Subdomain Authentication Fix

## The Problem
Cookies set on `ezapps.app` were not reliably accessible on subdomains like `shopify.ezapps.app`, causing users to be asked to login twice.

## The Solution
Instead of relying on shared cookies, we now use a **token-based transfer** system:

## How It Works

### 1. User Logs In (Main Domain)
```
User → ezapps.app/login → Authenticated ✅
```

### 2. User Selects Platform
```
User clicks "Shopify" → ezapps.app/add-platform
```

### 3. Token Transfer
```
Frontend calls: /api/auth/redirect-to-platform?platform=shopify
↓
API extracts: access_token + refresh_token from session
↓
Redirects to: shopify.ezapps.app/auth/callback-subdomain?access_token=xxx&refresh_token=yyy
```

### 4. Subdomain Receives Tokens
```
shopify.ezapps.app/auth/callback-subdomain
↓
Receives tokens from URL
↓
Calls: supabase.auth.setSession({ access_token, refresh_token })
↓
Session established on subdomain ✅
↓
Redirects to: shopify.ezapps.app/dashboard
```

### 5. User Works on Subdomain
```
User works on shopify.ezapps.app/dashboard
Session persists ✅
No second login needed! ✅
```

## Files Changed

1. **`/api/auth/redirect-to-platform/route.ts`** - Updated to pass tokens in URL
2. **`/auth/callback-subdomain/route.ts`** - NEW - Receives tokens and sets session
3. **`/middleware.ts`** - Skip auth check for callback route
4. **`/lib/supabase/middleware.ts`** - Skip auth check for callback route

## Security Considerations

✅ **Tokens are short-lived** - They're Supabase session tokens with expiration
✅ **Single-use** - Once the session is set, tokens are discarded
✅ **HTTPS only** - Production uses HTTPS, tokens encrypted in transit
✅ **No storage** - Tokens are immediately consumed, not stored

This is the same pattern used by major SaaS platforms for cross-domain authentication.

## Testing

1. Clear all cookies
2. Login at ezapps.app
3. Select Shopify platform
4. Should redirect through callback
5. Should land on shopify.ezapps.app/dashboard
6. **Should be logged in - no second login!**

## Troubleshooting

If still seeing login prompts:
1. Check browser console for errors
2. Check that callback route is executing (add console.log)
3. Verify tokens are in URL during redirect
4. Check Supabase session after callback completes
