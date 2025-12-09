<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EZ Apps - Platform Icons Layout</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #F0EEE9;
      padding: 40px 20px;
      color: #333;
    }
    h1 {
      text-align: center;
      margin-bottom: 10px;
      color: #333;
    }
    .subtitle {
      text-align: center;
      color: #97999B;
      margin-bottom: 40px;
    }
    .section {
      background: white;
      border-radius: 20px;
      padding: 40px 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }
    .section h2 {
      margin-bottom: 30px;
      color: #333;
      font-size: 20px;
      text-align: center;
    }
    
    /* ========== DESKTOP LAYOUT ========== */
    .platforms-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    
    .side-platforms {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .icon-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 12px;
      border-radius: 14px;
      background: #F9F9F9;
      transition: all 0.3s;
      border: 2px solid transparent;
      min-width: 90px;
    }
    .icon-card:hover {
      background: white;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    
    .icon-card .icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      color: white;
      margin-bottom: 8px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    }
    .icon-card .icon-name {
      font-size: 11px;
      font-weight: 600;
      color: #333;
      text-align: center;
    }
    
    /* Center Shopify (larger) */
    .center-platform {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 28px 24px;
      border-radius: 20px;
      background: white;
      border: 3px solid #F5DF4D;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      min-width: 140px;
      position: relative;
    }
    .center-platform::before {
      content: "★ MAIN";
      position: absolute;
      top: -12px;
      background: #F5DF4D;
      color: #333;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 10px;
    }
    .center-platform .icon {
      width: 80px;
      height: 80px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 32px;
      color: white;
      margin-bottom: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    .center-platform .icon-name {
      font-size: 16px;
      font-weight: 700;
      color: #333;
      text-align: center;
      margin-bottom: 4px;
    }
    .center-platform .status {
      font-size: 11px;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
      background: #10B98120;
      color: #10B981;
    }
    
    /* Platform Colors */
    .shopify { background: linear-gradient(135deg, #96BF48, #5E8E3E); }
    .wix { background: linear-gradient(135deg, #0C6EFC, #0052CC); }
    .squarespace { background: linear-gradient(135deg, #222222, #000000); }
    .woocommerce { background: linear-gradient(135deg, #9B5C8F, #7F54B3); }
    .bigcommerce { background: linear-gradient(135deg, #34313F, #121118); }
    .opencart { background: linear-gradient(135deg, #2AC1E9, #23A7CC); }
    .etsy { background: linear-gradient(135deg, #F56400, #D35400); }
    .amazon { background: linear-gradient(135deg, #FF9900, #E88B00); }
    .magento { background: linear-gradient(135deg, #F26322, #E85C1A); }
    
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #97999B;
      font-size: 14px;
    }
    .approved {
      background: #F5DF4D;
      color: #333;
      padding: 15px 30px;
      border-radius: 12px;
      display: inline-block;
      font-weight: 600;
      margin-top: 20px;
    }
    
    /* ========== TABLET LAYOUT ========== */
    @media (max-width: 1024px) {
      .platforms-container {
        flex-direction: column;
        gap: 24px;
      }
      
      /* Top row - 4 platforms */
      .side-platforms.left {
        order: 1;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      /* Center - Shopify (always in middle) */
      .center-platform {
        order: 2;
      }
      
      /* Bottom row - 4 platforms */
      .side-platforms.right {
        order: 3;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
    
    /* ========== MOBILE LAYOUT ========== */
    @media (max-width: 600px) {
      .section {
        padding: 24px 16px;
      }
      
      .platforms-container {
        gap: 20px;
      }
      
      .side-platforms {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        width: 100%;
        max-width: 240px;
      }
      
      .icon-card {
        min-width: unset;
        padding: 12px 8px;
      }
      
      .icon-card .icon {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }
      
      .icon-card .icon-name {
        font-size: 10px;
      }
      
      /* Shopify stays centered and prominent */
      .center-platform {
        padding: 24px 20px;
        min-width: 130px;
      }
      
      .center-platform .icon {
        width: 70px;
        height: 70px;
        font-size: 28px;
      }
      
      .center-platform .icon-name {
        font-size: 15px;
      }
    }

    /* Device labels for demo */
    .device-label {
      text-align: center;
      margin-bottom: 20px;
      padding: 8px 16px;
      background: #F5DF4D;
      border-radius: 8px;
      display: inline-block;
      font-weight: 600;
      font-size: 12px;
    }
    .demo-section {
      text-align: center;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <h1>EZ Apps - Platform Icons</h1>
  <p class="subtitle">Responsive Layout - Shopify Always Centered</p>
  
  <div class="section">
    <div class="demo-section">
      <span class="device-label">📱 Resize browser to test Mobile/Tablet/Desktop</span>
    </div>
    <h2>Supported E-commerce Platforms</h2>
    
    <div class="platforms-container">
      
      <!-- Left 4 platforms -->
      <div class="side-platforms left">
        <div class="icon-card">
          <div class="icon wix">W</div>
          <span class="icon-name">Wix</span>
        </div>
        <div class="icon-card">
          <div class="icon squarespace">S</div>
          <span class="icon-name">Squarespace</span>
        </div>
        <div class="icon-card">
          <div class="icon woocommerce">W</div>
          <span class="icon-name">WooCommerce</span>
        </div>
        <div class="icon-card">
          <div class="icon bigcommerce">B</div>
          <span class="icon-name">BigCommerce</span>
        </div>
      </div>
      
      <!-- Center Shopify (larger) - ALWAYS CENTERED -->
      <div class="center-platform">
        <div class="icon shopify">S</div>
        <span class="icon-name">Shopify</span>
        <span class="status">✓ Active</span>
      </div>
      
      <!-- Right 4 platforms -->
      <div class="side-platforms right">
        <div class="icon-card">
          <div class="icon opencart">O</div>
          <span class="icon-name">OpenCart</span>
        </div>
        <div class="icon-card">
          <div class="icon etsy">E</div>
          <span class="icon-name">Etsy</span>
        </div>
        <div class="icon-card">
          <div class="icon amazon">A</div>
          <span class="icon-name">Amazon</span>
        </div>
        <div class="icon-card">
          <div class="icon magento">M</div>
          <span class="icon-name">Magento</span>
        </div>
      </div>
      
    </div>
  </div>
  
  <div class="footer">
    <p>✓ Shopify stays centered on all screen sizes</p>
    <p style="margin-top: 8px; font-size: 12px;">Desktop: Left 4 | Shopify | Right 4</p>
    <p style="font-size: 12px;">Tablet/Mobile: Top 4 → Shopify → Bottom 4</p>
    <div class="approved">✓ Ready for Approval</div>
  </div>
</body>
</html>
