<!--
  @file HowItWorks.vue
  @description Section 3 étapes findMe — Light Mode Premium (Minimaliste & Clair)
-->

<script setup lang="ts">
import { ref, computed } from "vue";
import steps from "~/data/steps.json";
import { ClipboardList, Send, Map, type LucideIcon, ArrowRight } from "lucide-vue-next";
import { type AddressData } from "../../types/types";

const props = defineProps<{ address: AddressData }>();
const emit = defineEmits<{ (e: "update:address", value: AddressData): void }>();

const stepIcons = [ClipboardList, Send, Map] as LucideIcon[];
const activeStep = ref<number>(0);
const activeStepData = computed(() => (steps[activeStep.value] || steps[0]) as (typeof steps)[0]);

// Couleurs douces pour le light mode
const stepAccents = ["#10B981", "#6366F1", "#F59E0B"];
const stepBgs = ["bg-emerald-50 dark:bg-emerald-900/20", "bg-indigo-50 dark:bg-indigo-900/20", "bg-amber-50 dark:bg-amber-900/20"];
const stepTexts = ["text-emerald-600 dark:text-emerald-400", "text-indigo-600 dark:text-indigo-400", "text-amber-600 dark:text-amber-400"];
const stepGradients = ["from-emerald-600 to-teal-500", "from-indigo-600 to-blue-500", "from-amber-500 to-orange-500"];
</script>

<template>
  <section class="py-32 px-6 relative overflow-hidden bg-slate-50/50 dark:bg-[#0A0D1A]" id="comment-ca-marche">

    <!-- Décor fond -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Numéro décoratif très clair en fond -->
      <div class="absolute right-[5%] top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none overflow-hidden">
        <span class="text-[300px] md:text-[400px] font-black text-slate-100 dark:text-slate-800/30 leading-none transition-all duration-700 ease-in-out opacity-60">
          {{ activeStep + 1 }}
        </span>
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto z-10">

      <!-- En-tête -->
      <div class="text-center max-w-3xl mx-auto mb-20">
        <span class="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-extrabold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-6 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Mode d'emploi
        </span>
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Votre adresse officielle en<br />
          <span class="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent inline-block mt-2">3 étapes simples</span>
        </h2>
      </div>

      <!-- Grid double volet -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

        <!-- VOLET GAUCHE — Tabs interactifs -->
        <div class="lg:col-span-5 relative space-y-6">
          <div v-for="(step, index) in steps" :key="step.id"
            @click="activeStep = step.id"
            class="relative p-6 md:p-8 rounded-[2rem] transition-all duration-500 cursor-pointer group flex items-center gap-6"
            :class="activeStep === step.id
              ? 'bg-white dark:bg-slate-900 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800'
              : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent opacity-70 hover:opacity-100'">

            <!-- Icône numérotée -->
            <div class="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm"
              :class="activeStep === step.id ? stepBgs[index % 3] : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'">
              <component :is="stepIcons[step.id % 3]" class="w-7 h-7" :class="activeStep === step.id ? stepTexts[index % 3] : 'text-slate-400'" />
            </div>

            <!-- Contenu -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] transition-colors"
                  :class="activeStep === step.id ? stepTexts[index % 3] : 'text-slate-400'">
                  Étape {{ index + 1 }}
                </span>
              </div>
              <h3 class="text-xl font-black leading-snug transition-colors"
                :class="activeStep === step.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-500'">
                {{ step.titleFr }}
              </h3>
            </div>
            
            <!-- Flèche indicateur -->
            <div class="hidden md:block opacity-0 -translate-x-4 transition-all duration-500"
                 :class="{ 'opacity-100 translate-x-0': activeStep === step.id }">
               <ArrowRight class="w-6 h-6" :class="stepTexts[index % 3]" />
            </div>
          </div>

          <!-- CTA -->
          <div class="pt-8 pl-4">
            <NuxtLink to="/creer-mon-adresse"
              class="group inline-flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors bg-white dark:bg-slate-900 px-8 py-4 rounded-full shadow-lg hover:shadow-xl border border-slate-100 dark:border-slate-800">
              <span>Commencer maintenant</span>
              <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center transition-transform">
                <ArrowRight class="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- VOLET DROIT — illustration active -->
        <div class="lg:col-span-7 flex flex-col justify-center relative">
          <div class="relative rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)] aspect-[4/3] md:aspect-[16/11] bg-slate-100 group border-8 border-white dark:border-slate-800">

            <!-- Image avec Zoom doux -->
            <transition name="fade-scale" mode="out-in">
              <NuxtImg
                :key="activeStep"
                :src="activeStepData.img"
                :alt="activeStepData.tagFr"
                class="w-full h-full object-cover transition-transform duration-[10s] "
                referrerpolicy="no-referrer"
              />
            </transition>
            
            <!-- Dégradé protecteur pour le texte -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <!-- Overlay card (Description sur l'image) -->
            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <transition name="slide-up" mode="out-in">
                <div :key="activeStep" class="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl transform transition-all duration-500">
                  <div class="flex items-start gap-5">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-white/20">
                      <component :is="stepIcons[activeStep % 3]" class="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                    <div>
                      <p class="text-[11px] font-black uppercase tracking-[0.15em] text-white/70 mb-2">{{ activeStepData.badgeFr }}</p>
                      <h4 class="text-2xl font-bold text-white mb-3">{{ activeStepData.titleFr }}</h4>
                      <p class="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                        {{ activeStepData.descFr }}
                      </p>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

          </div>

          <!-- Decorative elements -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-dots-pattern opacity-30" aria-hidden="true" />
          <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl -z-10 transition-colors duration-700"
               :class="stepBgs[activeStep % 3]" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Fade for images */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 0.5s ease;
}
.fade-scale-enter-from { opacity: 0; }
.fade-scale-leave-to   { opacity: 0; }

/* Slide Up for text overlay */
.slide-up-enter-active, .slide-up-leave-active {
  transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1);
}
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to   { opacity: 0; transform: translateY(-20px); }

.bg-dots-pattern {
  background-image: radial-gradient(currentColor 2px, transparent 2px);
  background-size: 16px 16px;
  color: #94A3B8;
}
</style>
