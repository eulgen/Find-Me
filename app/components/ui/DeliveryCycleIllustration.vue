<template>
  <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="175" r="135" fill="#F0F9F0" />
    
    <!-- Winding road mapping -->
    <path d="M50 290 Q200 130 350 290" stroke="#4CAF50" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M60 290 Q200 135 340 290" stroke="#FFF" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round" fill="none" />

    <g stroke="#1A237E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <!-- House Target '33A' in the foreground -->
      <g transform="translate(260, 200)">
        <path d="M0 40 L45 10 L90 40 V100 H0 Z" fill="#FFF" />
        <!-- Door -->
        <path d="M35 100 V65 H55 V100" fill="#1A237E" />
        <!-- Big Adress Tag -->
        <rect x="-20" y="55" width="50" height="30" rx="4" fill="#F5F2FB" stroke="#1A237E" stroke-width="2.5" />
        <text x="5" y="77" fill="#2E7D32" font-size="18" font-weight="900" text-anchor="middle" font-family="sans-serif">33A</text>
      </g>

      <!-- Delivery cycling package boy -->
      <g transform="translate(90, 130)">
        <!-- Bicycle Wheels -->
        <circle cx="20" cy="110" r="28" fill="#FFF" stroke="#1A237E" stroke-width="3.5" />
        <circle cx="20" cy="110" r="22" stroke="#10B981" stroke-width="1" stroke-dasharray="3 3"/>
        <circle cx="105" cy="110" r="28" fill="#FFF" stroke="#1A237E" stroke-width="3.5" />
        <circle cx="105" cy="110" r="22" stroke="#10B981" stroke-width="1" stroke-dasharray="3 3"/>
        
        <!-- Bicycle Frame -->
        <path d="M20 110 L55 110 L80 65 L45 65 Z" fill="none" />
        <path d="M55 110 L105 110 M105 110 L90 55 M55 110 L45 65" />
        
        <!-- Bicycle Handlebars -->
        <path d="M90 55 L82 48 H72" />

        <!-- Rider Body (Green uniform, Cap) -->
        <!-- Legs pedaling -->
        <path d="M45 65 L35 90 L50 100" stroke="#8D6E63" stroke-width="4" />
        <path d="M45 65 L60 85 L65 108" stroke="#8D6E63" stroke-width="4" />
        
        <!-- Torso -->
        <path d="M40 30 L55 68" stroke="#2E7D32" stroke-width="10" />
        <!-- Round Delivery Bag on Back -->
        <rect x="5" y="15" width="28" height="36" rx="4" fill="#1A237E" stroke="#1A237E" stroke-width="2.5" />
        <circle cx="19" cy="33" r="5" fill="#4CAF50" />
        
        <!-- Arms reaching to handlebar -->
        <path d="M40 30 L68 46" stroke="#8D6E63" stroke-width="4" />

        <!-- Head & green cap -->
        <circle cx="38" cy="10" r="11" fill="#8D6E63" />
        <path d="M28 8 C28 0, 48 0, 48 8 L32 4 Z" fill="#4CAF50" />
        <!-- Visor of the cap -->
        <path d="M46 5 L55 9 L45 11 Z" fill="#2E7D32" stroke="#1A237E" stroke-width="1.5" />
      </g>
      
      <!-- Animated "IT'S HERE!" pop bubble -->
      <g transform="translate(130, 80)">
        <path d="M5 0 H85 C92 0 95 3 95 10 V32 C95 38 92 41 85 41 H35 L20 52 L26 41 H5 C-2 41 -5 38 -5 32 V10 C-5 3 -2 0 5 0 Z" fill="#FFF" stroke="#1A237E" stroke-width="2.5" />
        <text x="45" y="25" fill="#2E7D32" font-size="11" font-weight="800" text-anchor="middle" font-family="sans-serif">IT'S HERE!</text>
      </g>
    </g>
  </svg>
</template>
