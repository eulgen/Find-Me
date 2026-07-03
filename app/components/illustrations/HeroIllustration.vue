<template>
  <div class="relative w-full aspect-square flex items-center justify-center">
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-2xl">
      <!-- Base Glowing Platform -->
      <ellipse cx="300" cy="450" rx="220" ry="60" fill="url(#platGrad)" opacity="0.3" class="animate-pulse-slow" />
      <ellipse cx="300" cy="450" rx="180" ry="45" fill="url(#platGrad2)" opacity="0.5" />
      
      <!-- Animated Orbiting Rings -->
      <g class="orbit-ring-1">
        <ellipse cx="300" cy="450" rx="260" ry="75" stroke="#00bc7d" stroke-width="1.5" stroke-dasharray="10 20" opacity="0.4" fill="none" />
      </g>
      <g class="orbit-ring-2">
        <ellipse cx="300" cy="450" rx="200" ry="55" stroke="#155dfc" stroke-width="2" stroke-dasharray="30 15 5 15" opacity="0.6" fill="none" />
      </g>

      <!-- Isometric Map Grid (Base) -->
      <path d="M150 400 L300 320 L450 400 L300 480 Z" fill="#ffffff" class="dark:fill-slate-900" stroke="#e2e8f0" stroke-width="4" stroke-linejoin="round" />
      <path d="M150 400 L300 320 L450 400 L300 480 Z" fill="url(#gridGrad)" opacity="0.5" />
      
      <!-- 3D thickness of the map -->
      <path d="M150 400 L300 480 L300 500 L150 420 Z" fill="#cbd5e1" class="dark:fill-slate-800" />
      <path d="M450 400 L300 480 L300 500 L450 420 Z" fill="#94a3b8" class="dark:fill-slate-700" />

      <!-- Map Elements (Streets and blocks) -->
      <path d="M220 360 L280 330 L320 350 L260 380 Z" fill="#f1f5f9" class="dark:fill-slate-800" />
      <path d="M330 355 L390 325 L410 335 L350 365 Z" fill="#f8fafc" class="dark:fill-slate-700" />
      <path d="M260 410 L300 390 L340 410 L300 430 Z" fill="#e2e8f0" class="dark:fill-slate-800" />
      <path d="M320 440 L380 410 L420 430 L360 460 Z" fill="#f1f5f9" class="dark:fill-slate-700" />

      <!-- Map Pin Main (Center) - Floats -->
      <g class="floating-pin">
        <!-- Pin shadow -->
        <ellipse cx="300" cy="380" rx="30" ry="10" fill="#000000" opacity="0.1" class="pin-shadow" />
        
        <!-- Pin Body -->
        <path d="M300 210 C260 210 230 245 230 285 C230 330 300 380 300 380 C300 380 370 330 370 285 C370 245 340 210 300 210 Z" fill="url(#pinMainGrad)" />
        <path d="M300 215 C265 215 238 248 238 285 C238 318 282 355 300 370 C318 355 362 318 362 285 C362 248 335 215 300 215 Z" fill="url(#pinGlow)" opacity="0.6" />
        
        <!-- Pin Inner Cutout -->
        <circle cx="300" cy="280" r="35" fill="#ffffff" />
        <!-- Pin Core Dot -->
        <circle cx="300" cy="280" r="16" fill="#155dfc" />
        <circle cx="300" cy="280" r="8" fill="#ffffff" />

        <!-- Connecting Line from Pin to Map -->
        <line x1="300" y1="380" x2="300" y2="405" stroke="#00bc7d" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 6" opacity="0.8" />
        
        <!-- Radar rings from tip -->
        <ellipse cx="300" cy="405" rx="40" ry="15" fill="none" stroke="#00bc7d" stroke-width="3" opacity="0" class="radar-echo-1" />
        <ellipse cx="300" cy="405" rx="80" ry="30" fill="none" stroke="#00bc7d" stroke-width="1.5" opacity="0" class="radar-echo-2" />
      </g>

      <!-- Decorational Floating Elements -->
      <g class="float-delay-1">
        <!-- Glass Shield -->
        <path d="M120 220 L160 200 L200 220 L200 260 C200 300 160 320 160 320 C160 320 120 300 120 260 Z" fill="#ffffff" opacity="0.8" stroke="#155dfc" stroke-width="4" stroke-linejoin="round" />
        <path d="M160 240 L150 260 L160 280 L170 260 Z" fill="#155dfc" />
        <!-- Check inside shield -->
        <path d="M145 260 L155 270 L175 250" stroke="#155dfc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>

      <g class="float-delay-2">
        <!-- Floating QR-like Data Block -->
        <rect x="420" y="160" width="80" height="80" rx="16" fill="#ffffff" opacity="0.9" stroke="#00bc7d" stroke-width="4" />
        <rect x="440" y="180" width="15" height="15" rx="4" fill="#00bc7d" />
        <rect x="465" y="180" width="15" height="15" rx="4" fill="#155dfc" />
        <rect x="440" y="205" width="15" height="15" rx="4" fill="#155dfc" />
        <rect x="465" y="205" width="15" height="15" rx="4" fill="#00bc7d" />
      </g>

      <defs>
        <!-- Gradients -->
        <radialGradient id="platGrad" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stop-color="#00bc7d" stop-opacity="1" />
          <stop offset="100%" stop-color="#00bc7d" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="platGrad2" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stop-color="#155dfc" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#155dfc" stop-opacity="0" />
        </radialGradient>

        <linearGradient id="pinMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#01d898" />
          <stop offset="100%" stop-color="#00bc7d" />
        </linearGradient>
        <linearGradient id="pinGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00bc7d" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#155dfc" stop-opacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
@keyframes shadow-scale {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(0.8); opacity: 0.05; }
}
@keyframes orbit1 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes orbit2 {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes radar {
  0% { transform: scale(0.5); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}

.floating-pin {
  animation: float 5s ease-in-out infinite;
}
.pin-shadow {
  animation: shadow-scale 5s ease-in-out infinite;
  transform-origin: 300px 380px;
}
.orbit-ring-1 {
  animation: orbit1 25s linear infinite;
  transform-origin: 300px 450px;
}
.orbit-ring-2 {
  animation: orbit2 35s linear infinite;
  transform-origin: 300px 450px;
}
.float-delay-1 {
  animation: float 6s ease-in-out infinite 1s;
}
.float-delay-2 {
  animation: float 7s ease-in-out infinite 2s;
}
.radar-echo-1 {
  animation: radar 3s ease-out infinite;
  transform-origin: 300px 405px;
}
.radar-echo-2 {
  animation: radar 3s ease-out infinite 1.5s;
  transform-origin: 300px 405px;
}
</style>
