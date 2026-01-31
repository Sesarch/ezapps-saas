import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shop = searchParams.get('shop');
    
    console.log('OAuth start requested for shop:', shop);
    
    if (!shop) {
      console.error('Missing shop parameter');
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=missing_shop', request.url)
      );
    }

    // Verify environment variables
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const scopes = process.env.SHOPIFY_SCOPES;
    
    if (!clientId || !scopes) {
      console.error('Missing Shopify environment variables', { 
        hasClientId: !!clientId, 
        hasScopes: !!scopes 
      });
      return NextResponse.redirect(
        new URL('/dashboard/stores?error=missing_config', request.url)
      );
    }

    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated', userError);
      return NextResponse.redirect(
        new URL('/login?redirect=/dashboard/stores', request.url)
      );
    }
    
    console.log('User authenticated:', user.id);

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Normalize shop domain
    let shopDomain = shop.trim().toLowerCase();
    if (!shopDomain.includes('.myshopify.com')) {
      shopDomain = `${shopDomain}.myshopify.com`;
    }
    
    console.log('Normalized shop domain:', shopDomain);

    // Build redirect URI
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/auth/shopify/callback`;
    
    console.log('Redirect URI:', redirectUri);

    // Build Shopify OAuth URL - FIXED SYNTAX!
    const shopifyAuthUrl = new URL(`https://${shopDomain}/admin/oauth/authorize`);
    shopifyAuthUrl.searchParams.set('client_id', clientId);
    shopifyAuthUrl.searchParams.set('scope', scopes);
    shopifyAuthUrl.searchParams.set('redirect_uri', redirectUri);
    shopifyAuthUrl.searchParams.set('state', state);
    
    console.log('Redirecting to Shopify OAuth:', shopifyAuthUrl.toString());

    // Create response with state cookie
    const response = NextResponse.redirect(shopifyAuthUrl.toString());
    
    // Set cookies for state verification
    response.cookies.set('shopify_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    
    response.cookies.set('shopify_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    
    console.log('OAuth start successful, cookies set');
    
    return response;
  } catch (error: any) {
    console.error('OAuth start error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/stores?error=oauth_start_failed', request.url)
    );
  }
}
 
