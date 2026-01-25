import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');
    const state = searchParams.get('state');
    const hmac = searchParams.get('hmac');

    console.log('OAuth callback received:', { shop, hasCode: !!code, hasState: !!state });

    // Verify all required parameters are present
    if (!code || !shop || !state) {
      console.error('Missing OAuth parameters:', { code: !!code, shop: !!shop, state: !!state });
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=missing_params', request.url)
      );
    }

    // Verify state parameter matches
    const storedState = request.cookies.get('shopify_oauth_state')?.value;
    const userId = request.cookies.get('shopify_user_id')?.value;

    if (!storedState || state !== storedState) {
      console.error('State mismatch:', { state, storedState });
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=invalid_state', request.url)
      );
    }

    if (!userId) {
      console.error('Missing user ID');
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=missing_user', request.url)
      );
    }

    // Verify HMAC (security check from Shopify)
    if (hmac && !verifyShopifyHmac(searchParams, hmac)) {
      console.error('Invalid HMAC');
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=invalid_hmac', request.url)
      );
    }

    // Exchange code for access token
    console.log('Exchanging code for access token...');
    const accessToken = await exchangeCodeForToken(shop, code);

    if (!accessToken) {
      console.error('Failed to get access token');
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=token_exchange_failed', request.url)
      );
    }

    console.log('Access token received successfully');

    // Get Shopify platform ID from database
    const supabase = await createClient();
    
    const { data: platform } = await supabase
      .from('platforms')
      .select('id')
      .eq('slug', 'shopify')
      .single();

    if (!platform) {
      console.error('Shopify platform not found in database');
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=platform_not_found', request.url)
      );
    }

    // Check if store already exists
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('store_url', shop)
      .eq('user_id', userId)
      .single();

    if (existingStore) {
      // Update existing store
      console.log('Updating existing store...');
      const { error: updateError } = await supabase
        .from('stores')
        .update({
          access_token: accessToken,
          is_active: true,
          refresh_token: null
        })
        .eq('id', existingStore.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        return NextResponse.redirect(
          new URL('/dashboard/stores?error=database_error', request.url)
        );
      }
    } else {
      // Create new store record
      console.log('Creating new store record...');
      const { error: storeError } = await supabase
        .from('stores')
        .insert({
          user_id: userId,
          platform_id: platform.id,
          store_name: shop.replace('.myshopify.com', ''),
          store_url: shop,
          access_token: accessToken,
          is_active: true,
          refresh_token: null
        });

      if (storeError) {
        console.error('Database insert error:', storeError);
        return NextResponse.redirect(
          new URL('/dashboard/stores?error=database_error', request.url)
        );
      }
    }

    console.log('Store connection successful!');

    // Clear cookies
    const response = NextResponse.redirect(
      new URL(`/dashboard/stores?success=true&shop=${shop}`, request.url)
    );

    response.cookies.delete('shopify_oauth_state');
    response.cookies.delete('shopify_user_id');

    return response;
  } catch (error: any) {
    console.error('Shopify OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/stores?error=callback_failed', request.url)
    );
  }
}

// Helper function to verify Shopify HMAC
function verifyShopifyHmac(params: URLSearchParams, hmac: string): boolean {
  try {
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
    if (!clientSecret) return false;

    // Create a copy of params without hmac
    const paramsObj: Record<string, string> = {};
    params.forEach((value, key) => {
      if (key !== 'hmac') {
        paramsObj[key] = value;
      }
    });

    // Sort and create query string
    const sortedParams = Object.keys(paramsObj)
      .sort()
      .map(key => `${key}=${paramsObj[key]}`)
      .join('&');

    // Create HMAC
    const hash = crypto
      .createHmac('sha256', clientSecret)
      .update(sortedParams)
      .digest('hex');

    return hash === hmac;
  } catch (error) {
    console.error('HMAC verification error:', error);
    return false;
  }
}

// Helper function to exchange code for access token
async function exchangeCodeForToken(shop: string, code: string): Promise<string | null> {
  try {
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing Shopify credentials');
      return null;
    }

    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    if (!response.ok) {
      console.error('Token exchange failed:', response.status);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token exchange error:', error);
    return null;
  }
}
