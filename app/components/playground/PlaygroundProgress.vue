<!--
  @file PlaygroundProgress.vue
  @description Indicateur d'Ã©tapes visuel pour le simulateur interactif findMe.
-->

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  activeStep: number
}>()

const stepsInfo = computed(() => [
  {
    id: 0,
    label: '1. Je crÃ©e mon adresse',
    desc: 'Remplissez vos repÃ¨res rÃ©els'
  },
  {
    id: 1,
    label: '2. Je localise sur la carte',
    desc: 'Ajustez le repÃ¨re satellite'
  },
  {
    id: 2,
    label: "3. J'exporte mon PDF",
    desc: 'Votre certificat officiel prÃªt'
  }
])
</script>

<template>
  <div 
    class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-3 border-[#155dfc] p-6 rounded-3xl shadow-[5px_5px_0px_0px_#155dfc] mb-12"
    id="playground-progress-stepper"
  >
    <div 
      v-for="step in stepsInfo"
      :key="step.id"
      class="flex items-center space-x-3 w-full md:w-auto"
      :id="`progress-step-${step.id}`"
    >
      <div 
        class="w-8 h-8 rounded-full border-2 font-black text-xs flex items-center justify-center shrink-0 transition-colors"
        :class="activeStep === step.id
          ? 'bg-[#00bc7d] border-[#00bc7d] text-white animate-pulse'
          : activeStep > step.id
            ? 'bg-[#155dfc] border-[#155dfc] text-white'
            : 'bg-white border-[#155dfc]/20 text-[#155dfc]/40'"
      >
        <span>{{ step.id + 1 }}</span>
      </div>
      <div class="text-left">
        <h4 
          class="text-xs font-black transition-colors"
          :class="activeStep >= step.id ? 'text-[#155dfc]' : 'text-[#155dfc]/40'"
        >
          {{ step.label }}
        </h4>
        <p class="text-[10px] text-[#155dfc]/60 font-semibold leading-tight">
          {{ step.desc }}
        </p>
      </div>
    </div>
  </div>
</template>
