<script setup lang="ts">
</script>

<template>
  <div class="relative w-full aspect-square bg-[#00bc7d] flex items-center justify-center overflow-hidden">
    <!-- Dynamic Pattern Background -->
    <svg class="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="cta-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 10 M 0 0 L 10 10" fill="none" stroke="#ffffff" stroke-width="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cta-grid)" />
    </svg>

    <!-- Main SVG Illustration -->
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full relative z-10 drop-shadow-2xl">
      <!-- Background floating elements -->
      <g class="animate-float-slow">
        <circle cx="100" cy="100" r="40" fill="#ffffff" opacity="0.1" />
        <circle cx="320" cy="80" r="60" fill="#155dfc" opacity="0.2" />
        <circle cx="80" cy="300" r="80" fill="#155dfc" opacity="0.15" />
      </g>

      <!-- Center 3D Smartphone/Card -->
      <g class="animate-float">
        <!-- Shadow -->
        <rect x="110" y="270" width="180" height="20" rx="10" fill="#000000" opacity="0.2" class="animate-shadow" />
        
        <!-- Phone Body -->
        <rect x="120" y="80" width="160" height="280" rx="24" fill="#ffffff" stroke="#155dfc" stroke-width="6" />
        <rect x="126" y="86" width="148" height="268" rx="18" fill="#f8fafc" />
        
        <!-- Screen Content -->
        <!-- Header -->
        <rect x="140" y="110" width="120" height="40" rx="12" fill="#e2e8f0" />
        <rect x="150" y="125" width="20" height="10" rx="4" fill="#00bc7d" />
        <rect x="180" y="125" width="60" height="10" rx="4" fill="#94a3b8" />
        
        <!-- Map snippet -->
        <rect x="140" y="160" width="120" height="100" rx="12" fill="#cbd5e1" />
        <path d="M140 210 L180 180 L220 220 L260 190 L260 260 L140 260 Z" fill="#94a3b8" opacity="0.5" />
        <path d="M200 230 C190 230 185 240 185 250 C185 260 200 280 200 280 C200 280 215 260 215 250 C215 240 210 230 200 230 Z" fill="#155dfc" />
        <circle cx="200" cy="245" r="4" fill="#ffffff" />
        
        <!-- Code / QR section -->
        <rect x="140" y="270" width="120" height="60" rx="12" fill="#ffffff" stroke="#00bc7d" stroke-width="2" stroke-dasharray="4 4" />
        <rect x="155" y="285" width="30" height="30" rx="4" fill="#155dfc" />
        <rect x="195" y="290" width="50" height="8" rx="4" fill="#00bc7d" />
        <rect x="195" y="305" width="35" height="6" rx="3" fill="#94a3b8" />
      </g>
      
      <!-- Sparkles / Success Indicators -->
      <g class="animate-pulse-quick">
        <path d="M60 200 L80 190 L100 200 L90 180 L100 160 L80 170 L60 160 L70 180 Z" fill="#ffffff" opacity="0.8" />
        <path d="M300 150 L310 145 L320 150 L315 140 L320 130 L310 135 L300 130 L305 140 Z" fill="#155dfc" opacity="0.6" />
        <path d="M320 280 L340 270 L360 280 L350 260 L360 240 L340 250 L320 240 L330 260 Z" fill="#ffffff" opacity="0.9" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}
@keyframes shadow {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(0.9); opacity: 0.1; }
}
@keyframes pulseQuick {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
.animate-float-slow {
  animation: floatSlow 8s ease-in-out infinite;
}
.animate-shadow {
  animation: shadow 4s ease-in-out infinite;
  transform-origin: 200px 280px;
}
.animate-pulse-quick {
  animation: pulseQuick 2s ease-in-out infinite;
  transform-origin: center;
}
</style>
