<script setup lang="ts">
import type { NuxtError } from '#app';
import { Home, ArrowLeft } from 'lucide-vue-next';
import ButtonUI from '~/components/ui/ButtonUI.vue';
import FindMeLogo from '~/components/ui/FindMeLogo.vue';

const props = defineProps<{
  error: NuxtError
}>();

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="h-[100dvh] w-full bg-[#F8FAFC] dark:bg-[#0A0D1A] flex flex-col justify-between overflow-hidden relative font-sans transition-colors duration-300 selection:bg-[#00bc7d]/30">
    
    <!-- ============================================== -->
    <!-- 1. BACKDROPS & GLOWS (Premium Ambiance)        -->
    <!-- ============================================== -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <!-- Glow Vert (Primary) -->
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00bc7d]/10 dark:bg-[#00bc7d]/15 blur-[120px] animate-pulse-slow"></div>
      <!-- Glow Bleu (Secondary) -->
      <div class="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#155dfc]/10 dark:bg-[#155dfc]/15 blur-[140px] animate-pulse-slow" style="animation-delay: 2s;"></div>
      
      <!-- Subtle Grid -->
      <div 
        class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 40px 40px; color: #00bc7d"
      ></div>
    </div>

    <!-- ============================================== -->
    <!-- 2. HEADER LOGO                                 -->
    <!-- ============================================== -->
    <header class="w-full p-6 sm:p-8 flex items-center justify-between z-10 shrink-0">
      <FindMeLogo size="140" @click="handleError" class="cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-md" />
    </header>

    <!-- ============================================== -->
    <!-- 3. MAIN CONTENT (404, Illustration, Actions)   -->
    <!-- ============================================== -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-2 text-center z-10 w-full max-w-3xl mx-auto min-h-0">
      
      <!-- Premium Illustration (Radar & Floating Pin) -->
      <div class="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] flex items-center justify-center mb-8 shrink-0 stagger-1">
        
        <!-- Radar Pulses -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="radar-ring delay-0"></div>
          <div class="radar-ring delay-1"></div>
          <div class="radar-ring delay-2"></div>
          <!-- Ground shadow -->
          <div class="absolute bottom-[15%] w-[120px] h-[12px] bg-slate-900/10 dark:bg-black/40 rounded-[100%] blur-[4px]"></div>
        </div>

        <!-- Floating Map Pin -->
        <div class="relative z-10 floating-pin flex flex-col items-center">
          <div class="relative">
            <!-- Glassmorphism glowing behind pin -->
            <div class="absolute inset-0 bg-[#00bc7d] blur-[30px] opacity-40 dark:opacity-60 rounded-full"></div>
            <!-- The Pin SVG -->
            <svg viewBox="0 0 100 120" class="w-24 h-auto drop-shadow-2xl">
              <!-- Pin shape -->
              <path d="M50,5 C25,5 5,25 5,50 C5,75 50,115 50,115 C50,115 95,75 95,50 C95,25 75,5 50,5 Z" fill="url(#pinGrad)" />
              <!-- Inner circle (cutout) -->
              <circle cx="50" cy="45" r="18" fill="#F8FAFC" class="dark:fill-[#0A0D1A]" />
              <!-- Small inner dot -->
              <circle cx="50" cy="45" r="8" fill="#155dfc" />
              <!-- Subtle top highlight for 3D effect -->
              <path d="M50,10 C30,10 12,26 10,48 C15,22 35,15 50,15 C65,15 85,22 90,48 C88,26 70,10 50,10 Z" fill="#ffffff" opacity="0.3" />
              <defs>
                <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#01c684" />
                  <stop offset="100%" stop-color="#00bc7d" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        <!-- Big 404 text behind/around the pin with glassmorphism -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-[140px] sm:text-[180px] font-black tracking-tighter text-slate-900/5 dark:text-white/5 select-none blur-[1px]">4</span>
          <span class="w-[70px] sm:w-[90px]"></span> <!-- Space for pin -->
          <span class="text-[140px] sm:text-[180px] font-black tracking-tighter text-slate-900/5 dark:text-white/5 select-none blur-[1px]">4</span>
        </div>
      </div>

      <!-- Typography -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight mb-4 shrink-0 stagger-2 drop-shadow-sm">
        Destination <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00bc7d] to-[#155dfc]">Introuvable</span>
      </h1>
      
      <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed font-medium shrink-0 stagger-3">
        Désolé, l'adresse ou la page que vous recherchez semble avoir disparu de notre radar. 
        Vérifiez le lien ou retournez à votre point de départ.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto shrink-0 pb-4 stagger-4">
        <ButtonUI 
          variant="primary" 
          size="lg" 
          class="w-full sm:w-auto"
          :icon="Home"
          @click="handleError"
        >
          Retour à l'accueil
        </ButtonUI>
        
        <ButtonUI 
          variant="outline" 
          size="lg" 
          class="w-full sm:w-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          :icon="ArrowLeft"
          @click="() => $router.back()"
        >
          Page précédente
        </ButtonUI>
      </div>

    </main>

    <!-- ============================================== -->
    <!-- 4. FOOTER                                      -->
    <!-- ============================================== -->
    <footer class="w-full p-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 z-10 shrink-0 stagger-5">
      &copy; {{ new Date().getFullYear() }} FindMe. L'adressage certifié.
    </footer>
  </div>
</template>

<style scoped>
/* Staggered entrance animations */
.stagger-1 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
.stagger-2 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
.stagger-3 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
.stagger-4 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
.stagger-5 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Radar pulse animation */
.radar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(65deg);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #00bc7d;
  opacity: 0;
  animation: radarPulse 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}
.radar-ring.delay-0 { animation-delay: 0s; }
.radar-ring.delay-1 { animation-delay: 1.33s; }
.radar-ring.delay-2 { animation-delay: 2.66s; }

@keyframes radarPulse {
  0% {
    width: 20px;
    height: 20px;
    opacity: 0.8;
    border-width: 4px;
  }
  100% {
    width: 380px;
    height: 380px;
    opacity: 0;
    border-width: 1px;
  }
}

/* Floating Pin animation */
.floating-pin {
  animation: float 4s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-12px) rotate(2deg); }
  50% { transform: translateY(-18px) rotate(0deg); }
  75% { transform: translateY(-12px) rotate(-2deg); }
}

/* Pulse slow for background glow */
@keyframes pulseSlow {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}
.animate-pulse-slow {
  animation: pulseSlow 8s ease-in-out infinite;
}
</style>
