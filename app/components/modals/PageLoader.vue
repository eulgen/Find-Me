<!--
  @file PageLoader.vue
  @description Loader global de findMe — design moderne (glassmorphism), excellente animation.
  Se synchronise automatiquement avec le chargement des pages (Nuxt hooks: page:start, page:finish).
-->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import FindMeLogo from "../ui/FindMeLogo.vue";

const isVisible = ref(true); // Affiché au chargement initial
const progress = ref(0);
let advanceInterval: ReturnType<typeof setInterval> | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

const nuxtApp = useNuxtApp();

// Déclenché au début du changement de page
const startLoader = () => {
  if (hideTimeout) clearTimeout(hideTimeout);
  isVisible.value = true;
  progress.value = 0;
  
  if (advanceInterval) clearInterval(advanceInterval);
  advanceInterval = setInterval(() => {
    // Rapprochement asymptotique et fluide vers 95%
    if (progress.value < 95) {
      progress.value += (95 - progress.value) * 0.1;
    }
  }, 100);
};

// Déclenché lorsque la page a fini de charger
const finishLoader = () => {
  if (advanceInterval) clearInterval(advanceInterval);
  progress.value = 100;
  
  // Laisse le temps à l'animation d'atteindre 100% avant d'appliquer un fade out doux
  hideTimeout = setTimeout(() => {
    isVisible.value = false;
  }, 600); 
};

onMounted(() => {
  // Hooks natifs de Nuxt pour suivre la navigation avec précision
  nuxtApp.hook("page:start", startLoader);
  nuxtApp.hook("page:finish", finishLoader);
  
  // Pour le chargement initial de l'application (lorsque l'app est déjà montée)
  setTimeout(() => {
    finishLoader();
  }, 800);
});

onBeforeUnmount(() => {
  if (advanceInterval) clearInterval(advanceInterval);
  if (hideTimeout) clearTimeout(hideTimeout);
});
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 dark:bg-[#0A0D1A]/90 backdrop-blur-xl"
      id="page-reload-loader"
      aria-live="polite"
      aria-label="Chargement de la page"
    >
      <div class="relative flex flex-col items-center gap-16">
        
        <!-- Conteneur global de l'animation de la pin -->
        <div class="relative flex flex-col items-center justify-center w-64 h-64">
          
          <!-- Ombre dynamique sous la pin -->
          <div class="absolute bottom-4 w-20 h-4 bg-[#2E7D32]/30 dark:bg-[#4CAF50]/20 rounded-[100%] blur-md animate-shadow-pulse"></div>
          
          <!-- La forme de la Pin contenant le logo (agrandie) -->
          <div class="map-pin animate-float">
            <!-- Reflet "Glass" sur la pin pour un effet 3D premium -->
            <div class="absolute inset-1 rounded-[50%_50%_50%_0] bg-gradient-to-br from-white/80 via-white/30 to-transparent dark:from-white/30 dark:via-white/5 dark:to-transparent pointer-events-none mix-blend-overlay"></div>
            
            <div class="map-pin-inner">
              <!-- Le logo findMe à l'intérieur de la pin -->
              <FindMeLogo size="145" id="loader-brand-logo" class="drop-shadow-xl" />
            </div>
          </div>
          
        </div>

        <!-- Barre de progression design minimaliste -->
        <div class="flex flex-col items-center gap-4 mt-4">
          <div class="relative w-64 h-1.5 bg-gray-200/60 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
            <div
              class="h-full rounded-full transition-all duration-300 ease-out bg-gradient-x relative overflow-hidden"
              :style="{ width: progress + '%' }"
            >
              <div class="shimmer-effect"></div>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-[12px] font-black text-[#2E7D32] dark:text-[#4CAF50] tracking-[0.2em] uppercase drop-shadow-md">
              findMe
            </span>
            <span class="text-[12px] font-semibold text-gray-500 dark:text-slate-400 tracking-widest uppercase animate-pulse">
              Chargement...
            </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transition globale */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
  transform: scale(1.05);
}

/* Forme de la Pin de localisation */
.map-pin {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(76, 175, 80, 0.5);
  border-radius: 50% 50% 50% 0;
  transform: translateY(0) rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    15px 15px 35px rgba(46, 125, 50, 0.15), 
    inset -5px -5px 15px rgba(46, 125, 50, 0.05);
  position: relative;
  z-index: 10;
}

/* Thème sombre pour la Pin */
:global(.dark) .map-pin {
  background: rgba(15, 23, 42, 0.85);
  border-color: rgba(76, 175, 80, 0.3);
  box-shadow: 
    15px 15px 35px rgba(0, 0, 0, 0.5), 
    inset -5px -5px 15px rgba(0, 0, 0, 0.4);
}

/* Conteneur interne pour redresser le logo dans la Pin tournée */
.map-pin-inner {
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  /* Légère correction pour compenser visuellement la pointe de la pin */
  margin-top: -6px;
  margin-left: -6px;
}

/* Animation de flottaison (levitation) de la Pin */
.animate-float {
  animation: float 1.8s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-45deg); }
  50% { transform: translateY(-18px) rotate(-45deg); }
}

/* Animation de l'ombre de la Pin au sol */
.animate-shadow-pulse {
  animation: shadow-pulse 1.8s ease-in-out infinite;
}
@keyframes shadow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(0.5); opacity: 0.15; }
}

/* Animation du dégradé de la barre de progression */
.bg-gradient-x {
  background: linear-gradient(90deg, #1B5E20, #2E7D32, #4CAF50, #81C784);
  background-size: 200% 100%;
  animation: gradientX 2s ease infinite;
}
@keyframes gradientX {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Animation du scintillement de la barre (shimmer) */
.shimmer-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}
</style>
