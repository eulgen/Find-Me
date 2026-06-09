<template>
  <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Background soft shadow bubble -->
    <circle cx="200" cy="175" r="140" fill="#F5F2FB" />
    <!-- Hand Drawn Organic Map Background Shape -->
    <g stroke="#1A237E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <!-- Houses background overlay -->
      <path d="M110 90 L130 75 L150 90 M110 90 V115 H150 V90" fill="#FFF" />
      <path d="M250 80 L275 60 L300 80 M250 80 V110 H300 V80" fill="#FFF" />
      
      <!-- Folded Map Shape -->
      <path d="M50 140 L130 110 L210 140 L290 110 L370 140 V290 L290 260 L210 290 L130 260 L50 290 Z" fill="#FCFCFC" />
      
      <!-- Vertical fold lines -->
      <path d="M130 110 V260" stroke-dasharray="3 3" />
      <path d="M210 140 V290" />
      <path d="M290 110 V260" stroke-dasharray="3 3" />

      <!-- Green Streets Networks (Vibrant Organic Paths) -->
      <path d="M60 180 Q100 210 130 170 T210 210 T290 160 T350 220" stroke="#4CAF50" stroke-width="7" fill="none" />
      <path d="M110 125 Q130 180 180 160 T250 225 T300 130" stroke="#2E7D32" stroke-width="6" fill="none" />
      <path d="M160 220 C200 240 240 180 280 260" stroke="#2E7D32" stroke-width="6" fill="none" />

      <!-- Green Points as Checkpoints (Filled Dots) -->
      <circle cx="109" cy="184" r="9" fill="#2E7D32" />
      <circle cx="180" cy="160" r="9" fill="#4CAF50" />
      <circle cx="250" cy="225" r="9" fill="#2E7D32" />
      
      <!-- Delivery pointer pin on the map -->
      <g transform="translate(250, 190)">
        <path d="M0 -30 C-10 -30 -15 -20 -15 -10 C-15 5 0 20 0 20 C0 20 15 5 15 -10 C15 -20 10 -30 0 -30 Z" fill="#2E7D32" />
        <circle cx="0" cy="-15" r="5" fill="#FFF" />
      </g>
    </g>
    
    <!-- Banana / Tropical Leaves behind to accent local Cameroon feeling -->
    <path d="M50 80 Q10 100 20 130 Q50 120 50 80 Z" fill="#2E7D32" stroke="#1A237E" stroke-width="3" />
    <path d="M40 95 L15 110" stroke="#1A237E" stroke-width="2.5" />
    <path d="M350 100 Q390 110 380 140 Q350 130 350 100 Z" fill="#4CAF50" stroke="#1A237E" stroke-width="3" />
  </svg>
</template>
