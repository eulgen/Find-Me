<script setup lang="ts">
const props = defineProps<{
  isSignUp?: boolean
}>()
</script>

<template>
  <div class="relative w-full h-full overflow-hidden bg-[#0A0D1A] flex items-center justify-center">
    <!-- Abstract 3D Security/Auth Element -->
    <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full opacity-80 animate-slow-spin">
      <g class="float-1">
        <!-- Shield Base / Lock Base -->
        <path d="M400 200 L550 250 L550 450 C550 600 400 700 400 700 C400 700 250 600 250 450 L250 250 L400 200 Z" fill="url(#shieldGrad)" stroke="#00bc7d" stroke-width="4" stroke-linejoin="round" />
        
        <!-- Inner Glow -->
        <path d="M400 220 L530 265 L530 445 C530 575 400 665 400 665 C400 665 270 575 270 445 L270 265 L400 220 Z" fill="url(#innerShieldGrad)" />
      </g>

      <g class="float-2">
        <!-- Map Pin Inside Shield -->
        <path d="M400 350 C370 350 350 375 350 405 C350 440 400 490 400 490 C400 490 450 440 450 405 C450 375 430 350 400 350 Z" fill="#155dfc" opacity="0.9" />
        <circle cx="400" cy="400" r="20" fill="#ffffff" />
      </g>
      
      <!-- Data rings / connections -->
      <circle cx="400" cy="450" r="280" stroke="#00bc7d" stroke-width="1" stroke-dasharray="20 10 5 10" opacity="0.3" class="spin-ring-1" />
      <circle cx="400" cy="450" r="320" stroke="#155dfc" stroke-width="2" stroke-dasharray="50 50" opacity="0.2" class="spin-ring-2" />
      
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00bc7d" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#155dfc" stop-opacity="0.1" />
        </linearGradient>
        <radialGradient id="innerShieldGrad" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.animate-slow-spin {
  animation: slowPan 40s linear infinite alternate;
}
@keyframes slowPan {
  from { transform: scale(1.1) rotate(-2deg); }
  to { transform: scale(1.2) rotate(2deg); }
}

.float-1 {
  animation: float 8s ease-in-out infinite;
  transform-origin: center;
}
.float-2 {
  animation: float 6s ease-in-out infinite reverse;
  transform-origin: center;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

.spin-ring-1 {
  animation: spin 30s linear infinite;
  transform-origin: center;
}
.spin-ring-2 {
  animation: spin 40s linear infinite reverse;
  transform-origin: center;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
