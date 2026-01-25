import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shop = searchParams.get('shop');

    if (!shop) {
      return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 });
    }

    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Ensure shop has .myshopify.com domain
    const shopDomain = shop.includes('.myshopify.com') 
      ? shop 
      : `${shop}.myshopify.com`;

    // Get Shopify app credentials from environment
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders,write_orders,read_inventory,write_inventory';
    
    // Determine redirect URI based on environment
    const redirectUri = process.env.NODE_ENV === 'production'
      ? 'https://shopify.ezapps.app/api/auth/shopify/callback'
      : 'http://localhost:3000/api/auth/shopify/callback';

    if (!clientId) {
      console.error('SHOPIFY_CLIENT_ID is not configured');
      return NextResponse.json({ error: 'Shopify app is not properly configured' }, { status: 500 });
    }

    // Generate state parameter for security
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store state in session for verification (using cookie)
    const response = NextResponse.redirect(
      `https://${shopDomain}/admin/oauth/authorize?` +
      `client_id=${clientId}&` +
      `scope=${scopes}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `grant_options[]=per-user`
    );

    // Set state cookie for verification in callback
    response.cookies.set('shopify_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    });

    // Store user ID for callback
    response.cookies.set('shopify_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600
    });

    return response;
  } catch (error: any) {
    console.error('Shopify OAuth initiation error:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate Shopify connection',
      details: error.message 
    }, { status: 500 });
  }
}
