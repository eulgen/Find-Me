<template>
  <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="160" r="130" fill="#F0EDF6" />
    <g stroke="#1A237E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <!-- House in background -->
      <path d="M180 150 L250 90 L320 150 H180 Z" fill="#FFF" />
      <path d="M195 150 V210 H305 V150" fill="#FFF" />
      <path d="M230 165 H270 V210 H230 V165 Z" fill="#1A237E" />
      
      <!-- Giant Number address card on wall -->
      <g transform="translate(195, 200)">
        <rect width="110" height="60" rx="10" fill="#FFF" stroke="#1A237E" stroke-width="3" />
        <text x="55" y="42" fill="#2E7D32" font-size="36" font-weight="900" text-anchor="middle" font-family="sans-serif">28B</text>
      </g>

      <!-- Tropical Banana Leaf growing near house -->
      <g transform="translate(300, 70)">
        <!-- Stem & Leaves with beautiful organic ridges -->
        <path d="M0 120 Q50 60 70 -10 Q5 30 0 120 Z" fill="#2E7D32" />
        <path d="M0 120 Q-30 80 -40 20 Q5 40 0 120 Z" fill="#4CAF50" />
      </g>

      <!-- Hand holding large high-fidelity smartphone -->
      <g transform="translate(60, 100)">
        <!-- Phone body -->
        <rect width="115" height="210" rx="18" fill="#FFF" stroke="#1A237E" stroke-width="4.5" />
        <!-- Dynamic Map inside phone -->
        <rect x="7" y="10" width="101" height="190" rx="12" fill="#FDFCF2" />
        <!-- Map paths -->
        <path d="M15 40 L60 80 L50 140 L100 170" stroke="#1A237E" stroke-width="2.5" stroke-dasharray="3 3" />
        <path d="M25 180 L60 150 L60 80 L95 40" stroke="#4CAF50" stroke-width="6" fill="none" />
        
        <!-- Target marker -->
        <circle cx="95" cy="40" r="7" fill="#2E7D32" stroke="#FFF" stroke-width="1.5" />
        <circle cx="25" cy="180" r="5" fill="#1A237E" />

        <!-- Finger details thumb -->
        <path d="M-6 80 C-12 80 -15 88 -12 92 C-10 95 -6 95 -6 95 Z" fill="#8D6E63" stroke="#1A237E" stroke-width="2.5" />
        <path d="M-6 100 C-13 100 -16 108 -13 112 C-10 115 -6 115 -6 115 Z" fill="#8D6E63" stroke="#1A237E" stroke-width="2.5" />
        <path d="M121 110 H114" />
      </g>
    </g>
  </svg>
</template>
