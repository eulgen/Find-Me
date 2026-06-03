<!--
  @file PlaygroundStepMap.vue
  @description Étape 2 du simulateur: Positionnement satellite précis du repère sur la carte interactive locale.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { type AddressData } from '../../types'
import { MapPin, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  address: AddressData
}>()

const emit = defineEmits<{
  (e: 'update:address', val: AddressData): void
}>()

const localAddress = computed({
  get() { return props.address },
  set(val) { emit('update:address', val) }
})

const pinTop = computed(() => {
  if (!localAddress.value || !localAddress.value.coordinates) return 50
  const latBase = localAddress.value.city === 'Douala' ? 4.0511 : 
                 localAddress.value.city === 'Yaoundé' ? 3.8480 : 5.4778
  const top = ((localAddress.value.coordinates.lat - latBase) / 0.02 + 0.5) * 100
  return Math.max(5, Math.min(95, top))
})

const pinLeft = computed(() => {
  if (!localAddress.value || !localAddress.value.coordinates) return 50
  const lngBase = localAddress.value.city === 'Douala' ? 9.7679 : 
                 localAddress.value.city === 'Yaoundé' ? 11.5021 : 10.4178
  const left = ((localAddress.value.coordinates.lng - lngBase) / 0.02 + 0.5) * 100
  return Math.max(5, Math.min(95, left))
})

const handleMapClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const latBase = localAddress.value.city === 'Douala' ? 4.0511 : 
                 localAddress.value.city === 'Yaoundé' ? 3.8480 : 5.4778
  const lngBase = localAddress.value.city === 'Douala' ? 9.7679 : 
                 localAddress.value.city === 'Yaoundé' ? 11.5021 : 10.4178
                 
  const latSim = latBase + (y / rect.height - 0.5) * 0.02
  const lngSim = lngBase + (x / rect.width - 0.5) * 0.02

  localAddress.value = {
    ...localAddress.value,
    coordinates: {
      lat: parseFloat(latSim.toFixed(5)),
      lng: parseFloat(lngSim.toFixed(5))
    }
  }
}

const adjustCoordinates = (direction: 'up' | 'down' | 'left' | 'right') => {
  if (!localAddress.value || !localAddress.value.coordinates) return
  const stepSize = 0.0005
  const currentCoords = { ...localAddress.value.coordinates }
  
  if (direction === 'up') currentCoords.lat += stepSize
  else if (direction === 'down') currentCoords.lat -= stepSize
  else if (direction === 'left') currentCoords.lng -= stepSize
  else if (direction === 'right') currentCoords.lng += stepSize

  localAddress.value = {
    ...localAddress.value,
    coordinates: {
      lat: parseFloat(Math.max(1.5, Math.min(14.0, currentCoords.lat)).toFixed(5)),
      lng: parseFloat(Math.max(8.0, Math.min(17.0, currentCoords.lng)).toFixed(5))
    }
  }
}
</script>

<template>
  <div class="space-y-4" id="playground-step1-map bg-white">
    <!-- Zone de Carte Interactive Svg Clignotante -->
    <div class="relative bg-[#FAF8FD] rounded-3xl border-3 border-[#1A237E] overflow-hidden shadow-inner h-[280px]">
      
      <!-- Arrière-plan quadrillage géodésique -->
      <div class="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-20">
        <div v-for="i in 36" :key="i" class="border border-[#1A237E]" />
      </div>

      <div 
        class="w-full h-full cursor-crosshair relative"
        @click="handleMapClick"
        id="playground-interactive-map-frame"
      >
        <!-- Fleuve / Route de repère -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <path d="M 0,140 Q 150,110 300,165 T 600,130" stroke="#1A237E" stroke-opacity="0.1" stroke-width="40" fill="none" />
          <path d="M 120,0 V 400" stroke="#1A237E" stroke-opacity="0.1" stroke-width="4" fill="none" stroke-dasharray="8 8" />
        </svg>

        <!-- Repère d'adresse Pinpoint -->
        <div 
          class="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none flex flex-col items-center z-10"
          :style="{ top: `${pinTop}%`, left: `${pinLeft}%` }"
        >
          <div class="bg-[#2E7D32] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1">
            {{ address.housePlateNumber || 'N° 28B' }}
          </div>
          <MapPin class="w-8 h-8 text-[#2E7D32] stroke-[2.5]" />
          <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping -mt-1.5" />
        </div>
      </div>
    </div>

    <!-- Contrôles micrométriques (D-pad) -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 bg-white border-2 border-[#1A237E]/10 rounded-2xl">
      <div class="text-left space-y-0.5">
        <span class="text-[9px] font-black uppercase text-[#2E7D32] tracking-wider block">Coordonnées GPS capturées</span>
        <h4 class="font-mono text-xs font-black text-[#1A237E]">
          LAT: {{ address.coordinates?.lat || '-' }} °N • LNG: {{ address.coordinates?.lng || '-' }} °E
        </h4>
      </div>
      
      <!-- Pavé directionnel bouton micro-adjust -->
      <div class="flex items-center space-x-1.5 shrink-0" role="group" aria-label="Micro-ajustement d'itinéraires">
        <button @click="adjustCoordinates('left')" class="w-8 h-8 rounded-lg bg-[#F5F2FB] border border-[#1A237E]/15 hover:border-[#1A237E] flex items-center justify-center text-[#1A237E]" title="Déplacer vers l'Ouest"><ArrowLeft class="w-4 h-4" /></button>
        <div class="flex flex-col space-y-1">
          <button @click="adjustCoordinates('up')" class="w-8 h-8 rounded-lg bg-[#F5F2FB] border border-[#1A237E]/15 hover:border-[#1A237E] flex items-center justify-center text-[#1A237E]" title="Déplacer vers le Nord"><ArrowUp class="w-4 h-4" /></button>
          <button @click="adjustCoordinates('down')" class="w-8 h-8 rounded-lg bg-[#F5F2FB] border border-[#1A237E]/15 hover:border-[#1A237E] flex items-center justify-center text-[#1A237E]" title="Déplacer vers le Sud"><ArrowDown class="w-4 h-4" /></button>
        </div>
        <button @click="adjustCoordinates('right')" class="w-8 h-8 rounded-lg bg-[#F5F2FB] border border-[#1A237E]/15 hover:border-[#1A237E] flex items-center justify-center text-[#1A237E]" title="Déplacer vers l'Est"><ArrowRight class="w-4 h-4" /></button>
      </div>
    </div>
  </div>
</template>
