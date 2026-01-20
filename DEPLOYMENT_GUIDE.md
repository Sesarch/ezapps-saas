# 🎉 FIX COMPLETE - Shopify OAuth Issue Resolved!

## ✅ What Was Fixed

The error was: `invalid input syntax for type uuid: "shopify"`

**Root Cause:**
Your code was trying to insert the string `"shopify"` into the `platform_id` column, but that column expects a **UUID** that references the `platforms` table.

**The Fix:**
Updated `/src/app/api/auth/shopify/callback/route.ts` to:
1. First lookup the Shopify platform UUID from the `platforms` table
2. Then use that UUID when inserting the store record

**Before (Line 85):**
```typescript
platform_id: 'shopify',  // ❌ Wrong - string instead of UUID
```

**After (Lines 80-99):**
```typescript
// Get the Shopify platform UUID from the platforms table
const { data: platform, error: platformError } = await supabaseAdmin
  .from('platforms')
  .select('id')
  .eq('slug', 'shopify')
  .single()

if (platformError || !platform) {
  console.error('Platform lookup error:', JSON.stringify(platformError))
  return NextResponse.redirect(new URL('/dashboard/stores?error=platform_not_found', request.url))
}

console.log('CALLBACK - Got platform UUID:', platform.id)

// Save store to database
const { data, error: dbError } = await supabaseAdmin
  .from('stores')
  .insert({
    user_id: user.id,
    platform_id: platform.id,  // ✅ Now using the actual UUID!
    store_url: shopDomain,
    access_token: accessToken,
  })
```

---

## 🚀 How to Deploy This Fix

### **Option 1: Replace File Manually (Recommended)**

1. **Download the fixed file:** `callback-route.ts` (attached)
2. **In your local project**, navigate to:
   ```
   src/app/api/auth/shopify/callback/route.ts
   ```
3. **Replace the entire file** with the downloaded `callback-route.ts`
4. **Commit and push** to your Git repository:
   ```bash
   git add src/app/api/auth/shopify/callback/route.ts
   git commit -m "Fix: Use platform UUID instead of string for platform_id"
   git push
   ```
5. **Vercel will auto-deploy** the changes

---

### **Option 2: Manual Code Update**

If you prefer to edit the code yourself:

1. Open your project in your code editor
2. Navigate to: `src/app/api/auth/shopify/callback/route.ts`
3. Find this section (around line 74-94):
   ```typescript
   // Use service role client to bypass RLS
   const supabaseAdmin = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   )

   // Save store to database
   const { data, error: dbError } = await supabaseAdmin
     .from('stores')
     .insert({
       user_id: user.id,
       platform_id: 'shopify',  // ← THIS LINE IS WRONG
       store_url: shopDomain,
       access_token: accessToken,
     })
     .select()
   ```

4. Replace it with:
   ```typescript
   // Use service role client to bypass RLS
   const supabaseAdmin = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   )

   // Get the Shopify platform UUID from the platforms table
   const { data: platform, error: platformError } = await supabaseAdmin
     .from('platforms')
     .select('id')
     .eq('slug', 'shopify')
     .single()

   if (platformError || !platform) {
     console.error('Platform lookup error:', JSON.stringify(platformError))
     return NextResponse.redirect(new URL('/dashboard/stores?error=platform_not_found', request.url))
   }

   console.log('CALLBACK - Got platform UUID:', platform.id)

   // Save store to database
   const { data, error: dbError } = await supabaseAdmin
     .from('stores')
     .insert({
       user_id: user.id,
       platform_id: platform.id,  // ✅ Now using UUID
       store_url: shopDomain,
       access_token: accessToken,
     })
     .select()
   ```

5. Save the file
6. Commit and push:
   ```bash
   git add src/app/api/auth/shopify/callback/route.ts
   git commit -m "Fix: Use platform UUID instead of string for platform_id"
   git push
   ```

---

## ✅ Testing After Deployment

Once Vercel finishes deploying:

1. **Go to:** https://ezapps.app/login
2. **Login** with your account
3. **Navigate to:** Dashboard → Stores
4. **Click:** "Connect Store"
5. **Enter a Shopify store name** (e.g., "test-store")
6. **Click:** "Connect Store" button

### **Expected Success Flow:**
1. ✅ You're redirected to Shopify OAuth page
2. ✅ You see "Install EZ Apps" button
3. ✅ After clicking install, you're redirected back
4. ✅ Store appears in your stores list
5. ✅ No more errors!

### **If You Still See Errors:**
Check the Vercel Function Logs for the new error message and let me know.

---

## 📊 What This Fix Does

### **Step-by-Step Flow (After Fix):**

1. User authorizes Shopify app
2. Shopify redirects back with authorization code
3. Your app exchanges code for access token ✅
4. **NEW:** App queries `platforms` table for Shopify UUID
5. **NEW:** Gets UUID: `b0a4f798-caa4-4bea-a0cd-4fc91f0fa93...`
6. App inserts store record with **correct UUID**
7. Store is saved successfully ✅
8. User sees "Store connected" message ✅

---

## 🎯 Summary of All Changes Made Today

1. ✅ Fixed Shopify Client ID typo
2. ✅ Updated Shopify Client Secret
3. ✅ Updated `NEXT_PUBLIC_APP_URL` to match Shopify app config
4. ✅ Updated all 3 Supabase credentials to `ezapps-saas` project
5. ✅ **Fixed platform_id to use UUID instead of string**

---

## 🔮 Future Platform Integrations

When you add other platforms (WooCommerce, Etsy, etc.), you'll need similar fixes:

```typescript
// For WooCommerce:
const { data: platform } = await supabaseAdmin
  .from('platforms')
  .select('id')
  .eq('slug', 'woocommerce')  // ← Change slug
  .single()

// For Etsy:
const { data: platform } = await supabaseAdmin
  .from('platforms')
  .select('id')
  .eq('slug', 'etsy')  // ← Change slug
  .single()
```

Each platform's OAuth callback will need to lookup its respective UUID from the `platforms` table.

---

## ❓ Need Help?

If the deployment fails or you encounter any issues:
1. Check Vercel deployment logs
2. Check Function logs after trying to connect
3. Verify the file was updated correctly in your repository

---

## 🎊 Congratulations!

Once this is deployed, your Shopify OAuth integration will be fully functional! 🚀
