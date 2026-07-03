<!--
  @file HowItWorks.vue
  @description Section "Comment ça marche" — Apple Style Accordion & SVG Showcase
-->

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ClipboardList, Map, Send, ArrowRight } from 'lucide-vue-next';
import stepsData from '~/data/steps.json';
import StepIllustration from '~/components/illustrations/StepIllustration.vue';

const steps = ref(stepsData);
const activeStep = ref(0);
const autoplayInterval = ref<NodeJS.Timeout | null>(null);
const isHovered = ref(false);

const stepIcons = [ClipboardList, Map, Send];

// Couleurs par étape
const stepBgs = [
  'bg-emerald-100 dark:bg-emerald-900/30',
  'bg-indigo-100 dark:bg-indigo-900/30',
  'bg-amber-100 dark:bg-amber-900/30'
];

const stepTexts = [
  'text-emerald-600 dark:text-[#0f172b]',
  'text-indigo-600 dark:text-indigo-400',
  'text-amber-600 dark:text-amber-400'
];

const startAutoplay = () => {
  if (autoplayInterval.value) clearInterval(autoplayInterval.value);
  autoplayInterval.value = setInterval(() => {
    if (!isHovered.value) {
      activeStep.value = (activeStep.value + 1) % steps.value.length;
    }
  }, 6000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

const handleMouseEnter = () => { isHovered.value = true; };
const handleMouseLeave = () => { isHovered.value = false; };

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <section class="py-12 md:py-16 px-6 bg-slate-50 dark:bg-[#0A0D1A] overflow-hidden" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="max-w-7xl mx-auto">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <span class="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800">
          Fonctionnement
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight leading-tight">
          L'adressage devenu<br />
          <span class="text-[#00bc7d]">évident.</span>
        </h2>
        <p class="mt-4 text-slate-600 dark:text-slate-600 text-lg">
          En seulement trois étapes, générez une adresse fiable et certifiée pour votre domicile ou votre commerce.
        </p>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
        
        <!-- VOLET GAUCHE — Accordéon des étapes -->
        <div class="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div v-for="(step, index) in steps" :key="step.id" 
               @click="activeStep = index"
               class="cursor-pointer group relative overflow-hidden rounded-[2rem] border-2 transition-all duration-500 p-6 md:p-8"
               :class="activeStep === index ? 'bg-white dark:bg-white border-emerald-500 dark:border-emerald-500/50 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'">
            
            <!-- Header -->
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500"
                   :class="activeStep === index ? stepBgs[index % 3] : 'bg-slate-100 dark:bg-slate-50'">
                <component :is="stepIcons[index % 3]" class="w-7 h-7" :class="activeStep === index ? stepTexts[index % 3] : 'text-slate-400'" />
              </div>
              <div>
                <h3 class="text-xl font-bold transition-colors duration-500"
                    :class="activeStep === index ? 'text-slate-900 dark:text-[#0f172b]' : 'text-slate-500 dark:text-slate-600 group-hover:text-slate-700'">
                  {{ step.titleFr }}
                </h3>
              </div>
            </div>
            


            <!-- Progress Bar (Active state indicator) -->
            <div v-if="activeStep === index" class="absolute bottom-0 left-0 h-1 bg-emerald-500 animate-progress"></div>
          </div>

          <!-- CTA -->
          <div class="pt-8 pl-4">
            <NuxtLink to="/creer-mon-adresse"
              class="group inline-flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-[#0f172b] hover:text-[#00bc7d] transition-colors bg-white dark:bg-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl border border-slate-100 dark:border-slate-200">
              <span>Commencer maintenant</span>
              <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center transition-transform">
                <ArrowRight class="w-4 h-4 text-[#00bc7d] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- VOLET DROIT — Showcase SVG Flottant + Dock d'Information -->
        <div class="lg:col-span-7 flex flex-col justify-center relative mt-10 lg:mt-0">
          <div class="relative w-full flex flex-col items-center justify-center">
            
            <!-- Glow Background Dynamique -->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-50 dark:opacity-30 blur-3xl transition-colors duration-1000"
                 :class="activeStep === 0 ? 'from-emerald-500/30' : activeStep === 1 ? 'from-indigo-500/30' : 'from-amber-500/30'"></div>

            <!-- SVG Illustration -->
            <div class="w-full max-w-[320px] md:max-w-[380px] z-10 relative flex items-center justify-center mb-0">
              <StepIllustration :step="activeStep" class="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" />
            </div>
            
            <!-- Information Text (Sans Box, unifié avec l'illustration) -->
            <transition name="slide-up-dock" mode="out-in">
              <div :key="activeStep" class="w-full max-w-[320px] md:max-w-[380px] z-20 flex flex-col items-center text-center mt-2">
                <span class="inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm border border-white/50 dark:border-slate-200"
                      :class="[stepBgs[activeStep % 3], stepTexts[activeStep % 3]]">
                  {{ steps[activeStep].badgeFr }}
                </span>
                <p class="text-slate-700 dark:text-[#0f172b] text-sm md:text-base leading-relaxed font-medium">
                  {{ steps[activeStep].descFr }}
                </p>
              </div>
            </transition>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}
.animate-progress {
  animation: progress 6s linear forwards;
}

.slide-up-dock-enter-active, .slide-up-dock-leave-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-up-dock-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.slide-up-dock-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
</style>
