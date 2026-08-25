<!--
  @file HowItWorks.vue
  @description Section "Comment ça marche" — Inspirée du bloc "Changing Lives with Knowledge" de Gainlove (Image 1)
  avec illustrations d'individus noirs (Images 2 & 3), cadres circulaires superposés et accordéon d'étapes.
-->

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ClipboardList, Map, Send, ArrowRight, CheckCircle2 } from 'lucide-vue-next';
import stepsData from '~/data/steps.json';
import StepIllustration from '~/components/illustrations/StepIllustration.vue';

const steps = ref(stepsData);
const activeStep = ref(0);
const autoplayInterval = ref<NodeJS.Timeout | null>(null);
const isHovered = ref(false);

const stepIcons = [ClipboardList, Map, Send];

const stepBgs = [
  'bg-emerald-100 dark:bg-emerald-900/30',
  'bg-indigo-100 dark:bg-indigo-900/30',
  'bg-amber-100 dark:bg-amber-900/30'
];

const stepTexts = [
  'text-emerald-600 dark:text-emerald-400',
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
  <section class="py-20 md:py-28 px-6 bg-white dark:bg-[#0A0D1A] overflow-hidden" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" id="how-it-works-module">
    <div class="max-w-7xl mx-auto">
      
      <!-- Layout Gainlove (Image 1) : Illustration à gauche avec cadres circulaires, Étapes à droite -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <!-- VOLET GAUCHE : Cadres Circulaires Superposés avec Illustration d'Individu Noir (Gainlove Image 1) -->
        <div class="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div class="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            
            <!-- Grand Cercle Principal avec Illustration de Femme Noire (Image 3) -->
            <div class="w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] rounded-full bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden p-6 flex items-center justify-center relative z-10">
              <img src="/assets/images/black_person_dashboard.png" alt="Illustration Femme Noire avec Téléphone" class="w-full h-full object-contain drop-shadow-lg transform hover:scale-105 transition-transform duration-500" />
            </div>

            <!-- Petit Cercle Superposé Supérieur Droite -->
            <div class="absolute top-2 right-2 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden p-3 z-20 flex items-center justify-center">
              <img src="/assets/images/black_person_phone.png" alt="Illustration Femme Noire" class="w-full h-full object-contain" />
            </div>

            <!-- Badge d'État Interactif Étape -->
            <div class="absolute bottom-4 left-2 z-30 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                <CheckCircle2 class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div class="text-left">
                <span class="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Étape Active</span>
                <p class="text-xs font-black text-slate-900 dark:text-white">{{ steps[activeStep].titleFr }}</p>
              </div>
            </div>

          </div>
        </div>

        <!-- VOLET DROIT : Titre Éditorial Gainlove + Accordéon des 3 étapes -->
        <div class="lg:col-span-6 flex flex-col justify-center space-y-6">
          
          <div>
            <span class="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-3 border border-emerald-200/60 dark:border-emerald-800">
              Comment ça marche
            </span>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
              L'adressage devenu <br />
              <span class="not-italic font-sans text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">simple & autonome.</span>
            </h2>
            <p class="mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base font-medium">
              En seulement 3 étapes guidées, attribuez une adresse géographique certifiée à votre domicile ou commerce.
            </p>
          </div>

          <!-- Accordéon Numéroté (01, 02, 03) -->
          <div class="space-y-3.5 pt-2">
            <div v-for="(step, index) in steps" :key="step.id" 
                 @click="activeStep = index"
                 class="cursor-pointer group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 p-5"
                 :class="activeStep === index ? 'bg-[#FAF8F5] dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 shadow-md' : 'bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:bg-[#FAF8F5]'">
              
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors"
                     :class="activeStep === index ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'">
                  0{{ index + 1 }}
                </div>

                <div class="flex-1">
                  <h3 class="text-base font-black transition-colors"
                      :class="activeStep === index ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-400 group-hover:text-slate-900'">
                    {{ step.titleFr }}
                  </h3>
                  <p v-if="activeStep === index" class="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium leading-relaxed">
                    {{ step.descFr }}
                  </p>
                </div>
              </div>

              <div v-if="activeStep === index" class="absolute bottom-0 left-0 h-1 bg-emerald-500 animate-progress"></div>
            </div>
          </div>

          <!-- Bouton CTA -->
          <div class="pt-4 flex items-center gap-4">
            <NuxtLink to="/creer-mon-adresse"
              class="group inline-flex items-center gap-3 text-sm font-black text-white bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-emerald-400 transition-all px-8 py-4 rounded-full shadow-lg">
              <span>Commencer maintenant</span>
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
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
</style>
