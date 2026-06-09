<template>
  <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="175" r="135" fill="#F0EDF6" />
    
    <!-- Quick background palm trees -->
    <g transform="translate(250, 60)">
      <path d="M0 120 C10 80, 5 40, -10 20" stroke="#8D6E63" stroke-width="5" fill="none" />
      <!-- Palm fronds -->
      <path d="M-10 20 Q-30 -10 -50 0 M-10 20 Q10 -20 30 -10 M-10 20 Q-40 30 -50 40 M-10 20 Q10 40 40 35 M-10 20 Q-15 -35 -5 -40" stroke="#2E7D32" stroke-width="3" fill="none" stroke-linecap="round" />
    </g>

    <g stroke="#1A237E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <!-- Back road path -->
      <path d="M40 270 H360" stroke="#1A237E" stroke-width="4" />

      <!-- Traditional Mom on Right holding Baby on Back -->
      <g transform="translate(280, 100)">
        <!-- Dress with local patterned motif shape -->
        <path d="M15 110 L5 60 L10 50 H45 L50 64 L40 110 Z" fill="#1A237E" />
        <path d="M13 110 L18 165 H37 L42 110 Z" fill="#2E7D32" />
        <!-- Feet -->
        <path d="M20 165 C20 170 12 173 12 173 H22 V165" fill="#1A237E" />
        <path d="M35 165 C35 170 27 173 27 173 H37 V165" fill="#1A237E" />
        
        <!-- Head & Turban scarf wrap -->
        <circle cx="27" cy="27" r="11" fill="#8D6E63" />
        <path d="M16 26 C16 14, 38 14, 38 26 C43 23, 38 10, 27 12 C16 14, 13 22, 16 26 Z" fill="#1A237E" />
        
        <!-- Arm waving OK! symbol -->
        <path d="M10 50 L-10 40 L-15 20" stroke="#8D6E63" stroke-width="3.5" />
        
        <!-- OK! Text bubble directly over her hand -->
        <g transform="translate(-40, -10)">
          <ellipse cx="25" cy="18" rx="22" ry="16" fill="#FFF" stroke="#1A237E" stroke-width="2.5" />
          <text x="25" y="22" fill="#2E7D32" font-size="11" font-weight="800" text-anchor="middle" font-family="sans-serif">OK!</text>
        </g>

        <!-- Baby tucked on back with traditional sling wrap -->
        <path d="M35 50 Q48 55 42 75" stroke="#1A237E" stroke-width="8" fill="none" />
        <circle cx="45" cy="52" r="5" fill="#A1887F" />
      </g>

      <!-- Local Green and Blue Tuk-Tuk Taxi (Moving Left) -->
      <g transform="translate(45, 120)">
        <!-- Body Wheel Back -->
        <circle cx="32" cy="115" r="18" fill="#1A237E" stroke="#1A237E" stroke-width="3" />
        <circle cx="32" cy="115" r="7" fill="#F5F2FB" />
        <!-- Body Wheel Front -->
        <circle cx="140" cy="115" r="18" fill="#1A237E" stroke="#1A237E" stroke-width="3" />
        <circle cx="140" cy="115" r="7" fill="#F5F2FB" />

        <!-- Tuk Tuk Cabin Frame -->
        <!-- Back wall and roof curve -->
        <path d="M15 110 V55 C15 30 35 25 70 25 H125 C140 25 145 40 145 55 L160 110 H15" fill="#4CAF50" />
        <path d="M15 50 C15 25, 45 20, 85 20 H135 C150 20, 150 40, 150 50" fill="none" />
        
        <!-- Blue Accent Canopy roof trim -->
        <path d="M12 55 H152 C152 45 142 20 120 20 H50 C25 20 12 35 12 55 Z" fill="#1A237E" />

        <!-- Cabin cut-out window openings -->
        <!-- Back passenger bay -->
        <rect x="25" y="38" width="50" height="42" rx="4" fill="#F5F2FB" stroke="#1A237E" stroke-width="2.5" />
        <!-- Driver bay -->
        <path d="M90 38 H135 L143 85 H90 V38 Z" fill="#FFF" stroke="#1A237E" stroke-width="2.5" />

        <!-- Passenger Face -->
        <circle cx="48" cy="54" r="8" fill="#A1887F" />
        <path d="M43 62 Q50 68 57 62" stroke="#A1887F" stroke-width="3" />

        <!-- Driver character steering -->
        <circle cx="110" cy="50" r="8" fill="#8D6E63" />
        <path d="M104 58 L122 75" stroke="#1A237E" stroke-width="3" />
        <!-- Yellow Rickshaw trim -->
        <rect x="15" y="80" width="133" height="15" fill="#FFD5D0" stroke="#1A237E" stroke-width="2.5" />
      </g>
    </g>
  </svg>
</template>
