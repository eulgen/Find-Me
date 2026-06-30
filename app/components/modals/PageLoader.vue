<!--
  @file PageLoader.vue
  @description Loader global findMe — design ultra-premium, animations rapides et fluides.
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
  }, 420);
};

onMounted(() => {
  nuxtApp.hook("page:start", startLoader);
  nuxtApp.hook("page:finish", finishLoader);

  // Chargement initial ultra-rapide : 350ms puis fade-out
  setTimeout(finishLoader, 350);
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
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      id="page-reload-loader"
      aria-live="polite"
      aria-label="Chargement de findMe"
    >
      <!-- Background -->
      <div class="absolute inset-0 bg-white dark:bg-[#07090F]" />

      <!-- Background glow orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#2E7D32]/8 dark:bg-[#2E7D32]/12 blur-[100px] animate-loader-orb" />
        <div class="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-[#1A237E]/6 dark:bg-[#1A237E]/10 blur-[80px] animate-loader-orb-2" />
      </div>

      <!-- Main content -->
      <div class="relative flex flex-col items-center gap-10">

        <!-- Map Pin avec logo -->
        <div class="relative flex flex-col items-center justify-center w-56 h-56">

          <!-- Outer pulse rings -->
          <div class="absolute w-36 h-36 rounded-full border border-[#2E7D32]/15 dark:border-[#4CAF50]/10 animate-ring-1" />
          <div class="absolute w-48 h-48 rounded-full border border-[#2E7D32]/8 dark:border-[#4CAF50]/6 animate-ring-2" />

          <!-- Shadow on ground -->
          <div class="absolute bottom-6 w-16 h-3 bg-[#2E7D32]/20 dark:bg-[#4CAF50]/15 rounded-[100%] blur-md animate-shadow-pulse" />

          <!-- Pin shape -->
          <div class="map-pin animate-float">
            <!-- Glass highlight -->
            <div class="absolute inset-1 rounded-[50%_50%_50%_0] bg-gradient-to-br from-white/70 via-white/20 to-transparent dark:from-white/20 dark:via-white/5 dark:to-transparent pointer-events-none mix-blend-overlay" />
            <div class="map-pin-inner">
              <FindMeLogo size="130" id="loader-brand-logo" />
            </div>
          </div>
        </div>

        <!-- Progress + label -->
        <div class="flex flex-col items-center gap-3 w-64">

          <!-- Thin premium progress bar -->
          <div class="relative w-full h-[3px] bg-gray-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-200 ease-out bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#66BB6A] relative overflow-hidden"
              :style="{ width: progress + '%' }"
            >
              <!-- Shimmer sweep -->
              <div class="shimmer" />
            </div>
          </div>

          <!-- Brand text + dots -->
          <div class="flex items-center gap-3">
            <span class="text-[13px] font-black text-[#2E7D32] dark:text-[#4CAF50] tracking-[0.15em] uppercase">
              findMe
            </span>
            <div class="flex items-center gap-1">
              <span class="dot dot-1" />
              <span class="dot dot-2" />
              <span class="dot dot-3" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Fade transition ── */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

/* ── Map Pin ── */
.map-pin {
  width: 170px;
  height: 170px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(76, 175, 80, 0.35);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    12px 12px 28px rgba(46, 125, 50, 0.12),
    0 2px 8px rgba(0,0,0,0.06),
    inset -4px -4px 12px rgba(46, 125, 50, 0.04);
  position: relative;
  z-index: 10;
}
:global(.dark) .map-pin {
  background: rgba(10, 15, 30, 0.92);
  border-color: rgba(76, 175, 80, 0.25);
  box-shadow:
    12px 12px 28px rgba(0, 0, 0, 0.6),
    inset -4px -4px 12px rgba(0, 0, 0, 0.3);
}

.map-pin-inner {
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -5px;
  margin-left: -5px;
}

/* ── Float animation ── */
.animate-float { animation: float 2.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-45deg); }
  50%       { transform: translateY(-16px) rotate(-45deg); }
}

/* ── Shadow pulse ── */
.animate-shadow-pulse { animation: shadowPulse 2.2s ease-in-out infinite; }
@keyframes shadowPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%       { transform: scale(0.45); opacity: 0.1; }
}

/* ── Expanding rings ── */
.animate-ring-1 { animation: expandRing 2.5s ease-out infinite; }
.animate-ring-2 { animation: expandRing 2.5s ease-out infinite 0.6s; }
@keyframes expandRing {
  0%   { transform: scale(0.7); opacity: 0.7; }
  80%  { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(1.1); opacity: 0; }
}

/* ── Background orbs ── */
.animate-loader-orb   { animation: loaderOrb 6s ease-in-out infinite; }
.animate-loader-orb-2 { animation: loaderOrb 8s ease-in-out infinite 2s; }
@keyframes loaderOrb {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
  50%       { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}

/* ── Shimmer on progress bar ── */
.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
  animation: shimmerMove 1.2s infinite;
}
@keyframes shimmerMove {
  0%   { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(120%) skewX(-12deg); }
}

/* ── Loading dots ── */
.dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #4CAF50;
  opacity: 0.3;
}
:global(.light) .dot { background: #2E7D32; }
.dot-1 { animation: dotBounce 1.2s ease-in-out infinite 0s; }
.dot-2 { animation: dotBounce 1.2s ease-in-out infinite 0.2s; }
.dot-3 { animation: dotBounce 1.2s ease-in-out infinite 0.4s; }
@keyframes dotBounce {
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
  40%            { opacity: 1;    transform: scale(1.1); }
}
</style>
