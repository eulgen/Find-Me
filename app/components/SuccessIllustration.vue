<template>
  <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="165" r="130" fill="#FFD5D0" fill-opacity="0.4" />
    
    <!-- Tropical background trees -->
    <path d="M40 250 C40 180 90 140 120 180 C150 150 180 190 180 250 Z" fill="#4CAF50" opacity="0.8" />
    <path d="M240 250 C240 200 270 170 300 200 C330 180 360 210 360 250 Z" fill="#2E7D32" opacity="0.8" />
    
    <g stroke="#1A237E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <!-- Winding sandy pathway -->
      <path d="M50 280 Q200 240 350 280" stroke="#E0DBCF" stroke-width="14" fill="none" />
      
      <!-- Character Left (Boy in Navy Shirt, Green Pants) -->
      <g transform="translate(100, 120)">
        <!-- Head & Facial features -->
        <circle cx="25" cy="20" r="15" fill="#8D6E63" />
        <!-- Hair -->
        <path d="M10 15 C10 5, 40 5, 40 15 C45 15, 40 25, 25 22 Z" fill="#1A237E" />
        <!-- Smiling Mouth -->
        <path d="M22 25 Q25 29 28 25" stroke="#FFF" stroke-width="2" fill="#1A237E" />
        <!-- Body/Shirt -->
        <path d="M10 35 H40 L45 80 H5 L10 35 Z" fill="#1A237E" />
        <!-- Left ARM pointing to the right -->
        <path d="M42 45 L79 38" stroke="#8D6E63" stroke-width="3.5" />
        <path d="M79 38 Q82 35 85 38" stroke="#1A237E" stroke-width="2" /> <!-- Finger pointing -->
        <!-- Right Arm holding phone -->
        <path d="M8 45 L-12 30" stroke="#8D6E63" stroke-width="3.5" />
        <rect x="-24" y="10" width="16" height="26" rx="3" fill="#FFF" stroke="#1A237E" stroke-width="2" />
        <rect x="-21" y="13" width="10" height="20" rx="1.5" fill="#4CAF50" />
        <!-- Pants -->
        <path d="M12 80 V130 H22 V95 H28 V130 H38 V80" fill="#2E7D32" />
        <!-- Feet -->
        <path d="M12 130 H2 V134 H12 V130 Z" fill="#1A237E" />
        <path d="M38 130 H48 V134 H38 V130 Z" fill="#1A237E" />
      </g>

      <!-- Character Right (Boy in Green Shirt, Dark Blue Shorts) -->
      <g transform="translate(230, 125)">
        <!-- Head -->
        <circle cx="25" cy="20" r="15" fill="#A1887F" />
        <!-- Hair -->
        <path d="M10 15 Q25 0 40 15 Z" fill="#1A237E" />
        <!-- Smiling Mouth -->
        <path d="M21 24 Q25 28 29 24" stroke="#FFF" stroke-width="2" />
        <!-- Body/Shirt -->
        <path d="M5 35 H45 L40 75 H10 L5 35 Z" fill="#4CAF50" />
        <!-- Arm pointing right as well -->
        <path d="M38 45 L75 35" stroke="#A1887F" stroke-width="3.5" />
        <!-- Left Arm holding paper address sheet -->
        <path d="M10 45 L-5 55" stroke="#A1887F" stroke-width="3.5" />
        <rect x="-18" y="50" width="16" height="22" rx="2" fill="#FFF" stroke="#1A237E" stroke-width="2.5" />
        <circle cx="-10" cy="61" r="3" fill="#2E7D32" />
        <!-- Short Pants -->
        <path d="M10 75 V110 H22 V90 H28 V110 H40 V75 Z" fill="#1A237E" />
        <!-- Legs & Feet -->
        <path d="M14 110 V126" stroke="#A1887F" stroke-width="3" />
        <path d="M34 110 V126" stroke="#A1887F" stroke-width="3" />
        <path d="M14 126 H4 V130 H14 Z" fill="#4CAF50" />
        <path d="M34 126 H24 V130 H34 Z" fill="#4CAF50" />
      </g>
      
      <!-- FOUND IT! Speech bubble -->
      <g transform="translate(140, 30)">
        <path d="M10 0 H120 C130 0 135 5 135 15 V45 C135 55 130 60 120 60 H40 L20 75 L28 60 H10 C0 60 -5 55 -5 45 V15 C-5 5 0 0 10 0 Z" fill="#FFF" stroke="#1A237E" stroke-width="3.5" />
        <text x="65" y="38" fill="#2E7D32" font-size="18" font-weight="900" text-anchor="middle" font-family="sans-serif">FOUND IT!</text>
      </g>
    </g>
  </svg>
</template>
