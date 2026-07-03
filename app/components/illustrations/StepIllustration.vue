<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  step: {
    type: Number,
    required: true
  }
});

const currentStep = computed(() => props.step % 3);
</script>

<template>
  <div class="relative w-full aspect-square flex items-center justify-center">
    <!-- Phone Mockup Frame (Static, only contents change) -->
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full max-w-[400px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.2)]">
      <g class="animate-float">
        
        <!-- Phone Shadow -->
        <rect x="100" y="340" width="200" height="15" rx="7.5" fill="#000000" opacity="0.1" class="animate-shadow" />

        <!-- Phone Body -->
        <rect x="110" y="40" width="180" height="340" rx="32" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />
        <rect x="114" y="44" width="172" height="332" rx="28" fill="#f8fafc" />
        
        <!-- Phone Notch / Dynamic Island -->
        <rect x="170" y="52" width="60" height="16" rx="8" fill="#0f172a" />
        <circle cx="180" cy="60" r="4" fill="#1e293b" />
        
        <!-- Screen Content Container -->
        <g clip-path="url(#screen-clip)">
          <!-- Shared Screen Header -->
          <rect x="114" y="44" width="172" height="60" fill="#ffffff" />
          <path d="M124 84 L130 78 L124 72" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <rect x="150" y="76" width="100" height="10" rx="5" fill="#e2e8f0" />
          
          <!-- Dynamic Content based on Step -->
          
          <!-- Step 1: Formulaire -->
          <g v-if="currentStep === 0" key="step0" class="animate-fade-in">
            <!-- Header Label -->
            <rect x="130" y="115" width="80" height="10" rx="4" fill="#cbd5e1" />
            <!-- Input 1 -->
            <rect x="130" y="130" width="140" height="32" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
            <rect x="140" y="142" width="60" height="8" rx="4" fill="#94a3b8" />
            
            <!-- Input 2 -->
            <rect x="130" y="175" width="60" height="10" rx="4" fill="#cbd5e1" />
            <rect x="130" y="190" width="140" height="32" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
            <rect x="140" y="202" width="90" height="8" rx="4" fill="#94a3b8" />
            
            <!-- Input 3 (Textarea) -->
            <rect x="130" y="235" width="100" height="10" rx="4" fill="#cbd5e1" />
            <rect x="130" y="250" width="140" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
            <rect x="140" y="262" width="110" height="6" rx="3" fill="#94a3b8" opacity="0.5" />
            <rect x="140" y="276" width="70" height="6" rx="3" fill="#94a3b8" opacity="0.5" />

            <!-- Submit Button -->
            <rect x="130" y="315" width="140" height="36" rx="8" fill="#00bc7d" />
            <rect x="180" y="329" width="40" height="8" rx="4" fill="#ffffff" />
            
            <!-- Floating form element overlay -->
            <g class="animate-bounce-slow" filter="url(#drop-shadow)">
              <rect x="155" y="225" width="110" height="36" rx="8" fill="#ffffff" />
              <circle cx="175" cy="243" r="8" fill="#00bc7d" />
              <path d="M172 243 L175 246 L178 240" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <rect x="190" y="239" width="60" height="8" rx="4" fill="#e2e8f0" />
            </g>
          </g>

          <!-- Step 2: Carte et Map Pin -->
          <g v-else-if="currentStep === 1" key="step1" class="animate-fade-in">
            <!-- Map Base Color -->
            <rect x="114" y="104" width="172" height="272" fill="#f1f5f9" />
            
            <!-- Map Lines -->
            <path d="M114 144 L286 144 M114 184 L286 184 M114 224 L286 224 M114 264 L286 264 M114 304 L286 304 M114 344 L286 344" stroke="#e2e8f0" stroke-width="2" />
            <path d="M144 104 L144 376 M184 104 L184 376 M224 104 L224 376 M264 104 L264 376" stroke="#e2e8f0" stroke-width="2" />
            
            <!-- Parks & Water -->
            <path d="M144 144 L184 144 L184 184 L144 184 Z" fill="#dcfce7" />
            <path d="M224 224 L286 224 L286 264 L224 264 Z" fill="#dcfce7" />
            <path d="M114 264 L184 264 L184 344 L114 344 Z" fill="#e0f2fe" />
            
            <!-- Map Route -->
            <path d="M124 320 L164 240 L204 260 L244 160" stroke="#155dfc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
            
            <!-- Radar Circle -->
            <circle cx="200" cy="200" r="50" fill="#00bc7d" opacity="0.1" class="animate-ping-slow" />
            <circle cx="200" cy="200" r="40" stroke="#00bc7d" stroke-width="1" stroke-dasharray="4 4" class="animate-spin-slow" style="transform-origin: 200px 200px;" />
            
            <!-- Map Pin -->
            <g class="animate-bounce-slow">
              <path d="M200 155 C180 155 165 170 165 190 C165 215 200 245 200 245 C200 245 235 215 235 190 C235 170 220 155 200 155 Z" fill="#00bc7d" />
              <path d="M200 155 C180 155 165 170 165 190 C165 215 200 245 200 245 L200 155 Z" fill="#049e6b" />
              <circle cx="200" cy="190" r="12" fill="#ffffff" />
              <circle cx="200" cy="190" r="6" fill="#155dfc" />
            </g>
            
            <!-- Bottom sheet UI -->
            <rect x="114" y="296" width="172" height="80" fill="#ffffff" filter="url(#drop-shadow-top)" />
            <rect x="180" y="306" width="40" height="4" rx="2" fill="#cbd5e1" />
            <rect x="130" y="326" width="100" height="12" rx="6" fill="#155dfc" opacity="0.2" />
            <rect x="130" y="346" width="140" height="8" rx="4" fill="#e2e8f0" />
          </g>

          <!-- Step 3: Exemple de code -->
          <g v-else key="step2" class="animate-fade-in">
            <!-- Confetti/Sparkles background -->
            <circle cx="140" cy="140" r="6" fill="#00bc7d" class="animate-pulse" />
            <circle cx="270" cy="280" r="8" fill="#155dfc" class="animate-bounce" />
            <circle cx="260" cy="130" r="12" fill="#f59e0b" opacity="0.5" class="animate-pulse" />
            
            <!-- Abstract sharing lines -->
            <path d="M200 200 L140 140 M200 200 L260 140 M200 200 L260 260 M200 200 L140 260" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4 4" />

            <!-- The Code Card -->
            <g class="animate-float-delay" filter="url(#drop-shadow)">
              <rect x="130" y="150" width="140" height="140" rx="16" fill="#ffffff" stroke="#155dfc" stroke-width="2" />
              
              <!-- Plaque Badge inside card -->
              <rect x="180" y="165" width="40" height="40" rx="10" fill="#0f172a" />
              <rect x="185" y="170" width="30" height="30" rx="6" fill="#1e293b" stroke="#00bc7d" stroke-width="2" />
              <circle cx="200" cy="185" r="4" fill="#00bc7d" />
              
              <!-- The Text representation of FM-YDE-BAS -->
              <rect x="145" y="225" width="110" height="24" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
              <rect x="155" y="233" width="90" height="8" rx="4" fill="#1e293b" />
              
              <rect x="155" y="260" width="90" height="6" rx="3" fill="#cbd5e1" opacity="0.5" />
            </g>
            
            <!-- Share Button -->
            <rect x="130" y="320" width="140" height="40" rx="20" fill="#155dfc" />
            <rect x="175" y="336" width="50" height="8" rx="4" fill="#ffffff" />
            <path d="M150 340 L160 335 L160 345 Z" fill="#ffffff" />
          </g>
        </g>
      </g>

      <defs>
        <clipPath id="screen-clip">
          <rect x="114" y="44" width="172" height="332" rx="28" />
        </clipPath>
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.1" />
        </filter>
        <filter id="drop-shadow-top" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="-4" stdDeviation="6" flood-color="#000000" flood-opacity="0.05" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes floatDelay {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes shadow {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(0.95); opacity: 0.05; }
}
@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes spinSlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes pingSlow {
  0% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1); opacity: 0.2; }
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}
.animate-float-delay {
  animation: floatDelay 4s ease-in-out infinite alternate;
}
.animate-shadow {
  animation: shadow 5s ease-in-out infinite;
  transform-origin: center;
}
.animate-bounce-slow {
  animation: bounceSlow 3s ease-in-out infinite;
}
.animate-spin-slow {
  animation: spinSlow 10s linear infinite;
}
.animate-ping-slow {
  animation: pingSlow 3s ease-in-out infinite;
  transform-origin: center;
}
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
</style>
