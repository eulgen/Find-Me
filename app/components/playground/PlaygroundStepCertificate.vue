<!--
  @file PlaygroundStepCertificate.vue
  @description Étape 3 du simulateur: Visualisation et impression/partage de la plaque réglementaire.
-->

<script setup lang="ts">
import { ref } from 'vue'
import { type AddressData } from '../../types'
import { Printer, Share2, Check, Smartphone, Monitor } from 'lucide-vue-next'

const props = defineProps<{
  address: AddressData
}>()

const emit = defineEmits<{
  (e: 'print'): void
  (e: 'share'): void
}>()

const devicePreview = ref<'mobile' | 'desktop'>('mobile')
</script>

<template>
  <div class="space-y-6" id="playground-step2-certificate">
    <!-- Basculeur d'affichage d'appareil -->
    <div class="flex items-center justify-center space-x-2 bg-[#1A237E]/5 p-1 rounded-xl w-fit mx-auto" id="playground-device-adjuster">
      <button 
        @click="devicePreview = 'mobile'"
        class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#1A237E]"
        :class="devicePreview === 'mobile' ? 'bg-white shadow-sm ring-1 ring-[#1A237E]/10' : 'opacity-60'"
        title="Vue sur Téléphone"
      >
        <Smartphone class="w-3.5 h-3.5" />
        <span>Mobile</span>
      </button>
      <button 
        @click="devicePreview = 'desktop'"
        class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#1A237E]"
        :class="devicePreview === 'desktop' ? 'bg-white shadow-sm ring-1 ring-[#1A237E]/10' : 'opacity-60'"
        title="Vue sur Écran d'Orientation"
      >
        <Monitor class="w-3.5 h-3.5" />
        <span>Ordinateur</span>
      </button>
    </div>

    <!-- Rendu de la Plaque Municipale d'Habitation -->
    <div 
      class="border-4 border-[#1A237E] rounded-[24px] bg-white overflow-hidden shadow-[6px_6px_0px_0px_#1A237E] transition-all max-w-sm mx-auto p-6 text-center space-y-4"
      :class="devicePreview === 'mobile' ? 'scale-100' : 'scale-102'"
      id="mock-house-plate-rendering"
    >
      <div class="bg-[#1A237E] text-white p-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase">
        PLAQUE HOMOLOGUÉE FINDME
      </div>
      
      <div class="space-y-1">
        <span class="text-[9px] font-black uppercase text-[#2E7D32] tracking-wider">{{ address.neighborhood }} • {{ address.city }}</span>
        <h2 class="text-3xl font-black text-[#1A237E]">N° {{ address.housePlateNumber || '28B' }}</h2>
        <span class="text-[10px] text-[#1A237E]/60 font-semibold block italic">{{ address.fullName }}</span>
      </div>

      <!-- Code d'adressage unifié code-barres -->
      <div class="bg-[#FAF8FD] border-2 border-dashed border-[#1A237E]/15 py-3 rounded-2xl">
        <span class="text-[8px] font-black tracking-widest text-[#2E7D32] uppercase block mb-1">CODE D'ADRESSAGE NUMÉRIQUE</span>
        <span class="font-mono font-black text-sm text-[#1A237E] tracking-wider uppercase block">{{ address.addressCode }}</span>
      </div>

      <!-- Actions de démonstration -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <button 
          @click="emit('print')"
          class="flex items-center justify-center space-x-1 border border-[#1A237E] hover:bg-[#F5F2FB] text-[#1A237E] text-xs font-black py-2.5 px-3 rounded-xl transition-all cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>Fiche PDF</span>
        </button>
        <button 
          @click="emit('share')"
          class="flex items-center justify-center space-x-1 bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white text-xs font-black py-2.5 px-3 rounded-xl transition-all cursor-pointer"
        >
          <Share2 class="w-3.5 h-3.5" />
          <span>Partager</span>
        </button>
      </div>
    </div>
  </div>
</template>
