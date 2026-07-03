<!--
  @file PageLoader.vue
  @description Loader global findMe — design ultra-premium avec effet Sonar, glassmorphism et particules.
  Se synchronise avec la navigation Nuxt (page:start / page:finish).
-->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import FindMeLogo from "../ui/FindMeLogo.vue";

const isVisible = ref(true);
const progress = ref(0);
const phase = ref<"entering" | "running" | "finishing" | "done">("entering");

let advanceInterval: ReturnType<typeof setInterval> | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

const nuxtApp = useNuxtApp();

const startLoader = () => {
  if (hideTimeout) clearTimeout(hideTimeout);
  if (advanceInterval) clearInterval(advanceInterval);
  isVisible.value = true;
  progress.value = 0;
  phase.value = "running";

  // Progression rapide vers 90% (asymptotique)
  advanceInterval = setInterval(() => {
    if (progress.value < 88) {
      progress.value += (88 - progress.value) * 0.18;
    }
  }, 60);
};

const finishLoader = () => {
  if (advanceInterval) clearInterval(advanceInterval);
  phase.value = "finishing";
  progress.value = 100;

  hideTimeout = setTimeout(() => {
    phase.value = "done";
    isVisible.value = false;
  }, 600); // Laisse le temps pour l'animation à 100%
};

onMounted(() => {
  nuxtApp.hook("page:start", startLoader);
  nuxtApp.hook("page:finish", finishLoader);

  // Initialisation factice au chargement pour le show
  setTimeout(finishLoader, 1000);
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
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0A0D1A] overflow-hidden"
      id="page-reload-loader"
      aria-live="polite"
      aria-label="Chargement de findMe"
    >
      <!-- Background glow orbs animés -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-emerald-500/10 dark:bg-emerald-900/20 blur-[120px] animate-pulse-slow" />
        <div class="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-teal-500/10 dark:bg-teal-900/20 blur-[100px] animate-pulse-slow-delay" />
      </div>

      <!-- Sonar Waves Background -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div class="sonar-ring animate-sonar-1" />
        <div class="sonar-ring animate-sonar-2" />
        <div class="sonar-ring animate-sonar-3" />
      </div>

      <!-- Contenu Principal -->
      <div class="relative z-10 flex flex-col items-center gap-14">
        
        <!-- Conteneur central Pin Glassmorphism -->
        <div class="relative flex flex-col items-center justify-center w-52 h-52">
          <!-- Glow d'ambiance derrière le pin -->
          <div class="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-30 dark:opacity-40 animate-pulse-fast" />
          
          <div class="glass-pin animate-float flex items-center justify-center group">
             <!-- Reflets sur la vitre -->
             <div class="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/60 to-transparent dark:from-white/20 pointer-events-none mix-blend-overlay" />
             <div class="glass-pin-inner">
               <FindMeLogo size="160" id="loader-brand-logo" />
             </div>
          </div>
          
          <!-- Ombre portée animée au sol -->
          <div class="absolute -bottom-10 w-24 h-4 bg-emerald-900/15 dark:bg-emerald-900/50 rounded-[100%] blur-md animate-shadow-pulse" />
        </div>

        <!-- Zone de progression -->
        <div class="flex flex-col items-center gap-6 w-72 mt-4">
          
          <!-- Reveal texte "Chargement" -->
          <div class="overflow-hidden">
            <div class="flex items-center gap-3">
              <span class="inline-block text-[15px] font-black tracking-[0.3em] uppercase text-slate-800 dark:text-[#0f172b] animate-slide-up-fade">
                Chargement
              </span>
              <div class="flex items-center gap-1 text-slate-800 dark:text-[#0f172b]">
                <span class="dot dot-1" />
                <span class="dot dot-2" />
                <span class="dot dot-3" />
              </div>
            </div>
          </div>

          <!-- Barre de chargement ultra-fine avec particules/shimmer -->
          <div class="relative w-full h-[3px] bg-slate-200/50 dark:bg-slate-50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              :style="{ width: progress + '%' }"
            >
              <div class="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] animate-shimmer-fast" />
            </div>
          </div>
          
          <!-- Label de confiance -->
          <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]" />
            Connexion au réseau
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Transition principale de disparition du loader ── */
.loader-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.loader-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.loader-fade-enter-from {
  opacity: 0;
  transform: translateY(-2px);
}
.loader-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  filter: blur(12px);
}

/* ── Carte centrale façon Pin en Verre (Glassmorphism) ── */
.glass-pin {
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  position: relative;
  z-index: 10;
  box-shadow: 
    10px 10px 30px rgba(16, 185, 129, 0.15),
    inset 2px 2px 10px rgba(255, 255, 255, 0.5);
}

:global(.dark) .glass-pin {
  background: rgba(10, 13, 26, 0.4);
  border-color: rgba(16, 185, 129, 0.2);
  box-shadow: 
    10px 10px 30px rgba(0, 0, 0, 0.5),
    inset 2px 2px 10px rgba(16, 185, 129, 0.1);
}

.glass-pin-inner {
  transform: rotate(45deg);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Onde Sonar Arrière ── */
.sonar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
}

.animate-sonar-1 { animation: sonar 3s infinite linear; }
.animate-sonar-2 { animation: sonar 3s infinite linear 1s; }
.animate-sonar-3 { animation: sonar 3s infinite linear 2s; }

@keyframes sonar {
  0% { width: 100px; height: 100px; opacity: 1; border-width: 2px; }
  100% { width: 800px; height: 800px; opacity: 0; border-width: 0px; }
}

/* ── Flottement et Ombres ── */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-45deg); }
  50% { transform: translateY(-15px) rotate(-45deg); }
}

.animate-shadow-pulse {
  animation: shadowPulse 3s ease-in-out infinite;
}

@keyframes shadowPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
}

/* ── Apparition de Texte ── */
.animate-slide-up-fade {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* ── Points de suspension animés ── */
.dot {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.dot-1 { animation: dotBounce 1.4s ease-in-out infinite 0s; }
.dot-2 { animation: dotBounce 1.4s ease-in-out infinite 0.2s; }
.dot-3 { animation: dotBounce 1.4s ease-in-out infinite 0.4s; }

@keyframes dotBounce {
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}

/* ── Reflets sur la barre ── */
.animate-shimmer-fast {
  animation: shimmerMove 1s linear infinite;
}

@keyframes shimmerMove {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}

/* ── Mouvement des Orbes d'arrière-plan ── */
.animate-pulse-slow {
  animation: pulseBg 6s ease-in-out infinite;
}

.animate-pulse-slow-delay {
  animation: pulseBg 6s ease-in-out infinite 3s;
}

@keyframes pulseBg {
  0%, 100% { transform: translate(-50%, -50%); opacity: 0.5; }
  50% { transform: translate(-50%, -50%); opacity: 0.8; }
}
</style>
