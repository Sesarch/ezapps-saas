{/* NAVBAR LOGO SECTION */}
<Link href="/" className="flex items-center group shrink-0">
  {/* YOUR LOGO FILE: Replaces the EZ APPS text */}
  <img 
    src="/logo.png" 
    alt="EZ APPS" 
    className="h-8 w-auto object-contain" 
    onError={(e) => {
        // Fallback in case the path is wrong during deployment
        console.error("Logo failed to load at /logo.png");
    }}
  />
  
  {/* The 'Enterprise' tag stays for that corporate look */}
  <div className="hidden sm:block h-5 w-[1px] bg-slate-200 mx-4" />
  <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
    Enterprise
  </span>
</Link>
