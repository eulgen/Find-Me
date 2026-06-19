<!--
  @file HowItWorks.vue
  @description Section 3 étapes findMe — redesign premium avec timeline verticale
  et illustrations interactives. Logique métier conservée.
-->

<script setup lang="ts">
import { ref, computed } from "vue";
import steps from "~/data/steps.json";
import { ClipboardList, Send, Map, type LucideIcon } from "lucide-vue-next";
import { type AddressData } from "../../types/types";

const props = defineProps<{ address: AddressData }>();
const emit = defineEmits<{ (e: "update:address", value: AddressData): void }>();

const stepIcons = [ClipboardList, Send, Map] as LucideIcon[];
const activeStep = ref<number>(0);
const activeStepData = computed(() => (steps[activeStep.value] || steps[0]) as (typeof steps)[0]);
</script>

<template>
  <section
    class="py-24 px-6 relative overflow-hidden bg-[#F7F6FF] dark:bg-[#0C0F1C]"
    id="comment-ca-marche"
  >
    <!-- Décor fond -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-0 left-0 right-0 h-px"
        style="background: linear-gradient(90deg, transparent, #1A237E 40%, #2E7D32 60%, transparent)"
      />
      <div
        class="absolute bottom-0 left-0 right-0 h-px"
        style="background: linear-gradient(90deg, transparent, #2E7D32 40%, #1A237E 60%, transparent)"
      />
      <div
        class="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style="background: radial-gradient(circle, #2E7D32, transparent 70%)"
      />
    </div>

    <div class="relative max-w-7xl mx-auto" id="comment-how-grid-container">

      <!-- En-tête -->
      <div class="text-center max-w-2xl mx-auto mb-16" id="wizard-heading-meta">
        <span class="inline-flex items-center gap-2 bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
          Accompagnement Citoyen
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-[#1A237E] dark:text-white tracking-tight leading-tight">
          Créez votre adresse<br />en <span class="text-[#2E7D32]">3 étapes</span>
        </h2>
        <p class="mt-4 text-sm md:text-base text-[#1A237E]/65 dark:text-slate-400 max-w-lg mx-auto font-normal leading-relaxed">
          Une procédure fluide et assistée de bout en bout pour géolocaliser votre barrière et obtenir votre certificat findMe.
        </p>
      </div>

      <!-- Grid double volet -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- VOLET GAUCHE — étapes interactives avec timeline -->
        <div class="lg:col-span-6 relative" id="steps-selector-side">
          <!-- Ligne verticale de timeline -->
          <div class="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-[#2E7D32] via-[#1A237E]/30 to-transparent hidden md:block" aria-hidden="true" />

          <div class="space-y-4">
            <div
              v-for="step in steps"
              :key="step.id"
              @click="activeStep = step.id"
              class="relative flex items-start gap-5 p-5 md:pl-14 rounded-2xl transition-all duration-300 cursor-pointer group"
              :class="
                activeStep === step.id
                  ? 'bg-white dark:bg-[#191D3C] shadow-lg shadow-[#1A237E]/8 border border-[#2E7D32]/30'
                  : 'bg-transparent hover:bg-white/70 dark:hover:bg-[#191D3C]/60 border border-transparent'
              "
              :id="`step-option-card-${step.id}`"
            >
              <!-- Icône numérotée (remplace le dot de timeline) -->
              <div
                class="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 md:absolute md:left-0"
                :class="
                  activeStep === step.id
                    ? 'bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/40'
                    : 'bg-white dark:bg-slate-800 text-[#1A237E] dark:text-slate-300 border border-[#1A237E]/10 dark:border-slate-700 group-hover:border-[#2E7D32]/40'
                "
              >
                <component :is="stepIcons[step.id]" class="w-5 h-5" />
              </div>

              <!-- Contenu -->
              <div class="flex-1 space-y-1 md:pl-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="activeStep === step.id ? 'text-[#2E7D32]' : 'text-[#2E7D32]/60'">
                    {{ step.badgeFr }}
                  </span>
                  <span v-if="activeStep === step.id" class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-ping" />
                </div>
                <h3 class="text-base font-black leading-snug" :class="activeStep === step.id ? 'text-[#1A237E] dark:text-white' : 'text-[#1A237E]/80 dark:text-slate-300'">
                  {{ step.titleFr }}
                </h3>
                <p class="text-xs text-[#1A237E]/60 dark:text-slate-400 leading-relaxed font-normal">
                  {{ step.descFr }}
                </p>
              </div>

              <!-- Indicateur actif -->
              <div v-if="activeStep === step.id" class="shrink-0 w-2 h-2 rounded-full bg-[#2E7D32] mt-2" />
            </div>
          </div>
        </div>

        <!-- VOLET DROIT — illustration active -->
        <div class="lg:col-span-6 flex flex-col justify-center relative" id="steps-illustrations-viewpanel">
          <div class="relative rounded-3xl overflow-hidden bg-[#1A237E]/5 dark:bg-[#191D3C] border border-[#1A237E]/8 shadow-xl aspect-[4/3]">
            <transition name="fade" mode="out-in">
              <NuxtImg
                :key="activeStep"
                :src="activeStepData.img"
                :alt="activeStepData.tagFr"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
                :id="`step-active-img-${activeStep}`"
              />
            </transition>

            <!-- Overlay tag -->
            <div class="absolute bottom-4 left-4 right-4 bg-[#1A237E]/85 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <component :is="stepIcons[activeStep]" class="w-4 h-4 text-[#4CAF50] shrink-0" />
              <div>
                <p class="text-[9px] font-black uppercase tracking-widest text-white/50">{{ activeStepData.badgeFr }}</p>
                <p class="text-xs font-bold text-white">{{ activeStepData.titleFr }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from { opacity: 0; transform: scale(0.98) translateY(6px); }
.fade-leave-to   { opacity: 0; transform: scale(1.02) translateY(-6px); }
</style>
