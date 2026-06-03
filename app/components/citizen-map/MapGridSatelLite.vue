<!--
  @file MapGridSatelLite.vue
  @description Cadran de carte géospatiale interactive optimisé pour l'accessibilité vocale (lecteurs d'écran).
  Il intègre des balises "sr-only" de l'itinéraire, des plaques d'habitats et des coordonnées satellites.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Navigation, Eye } from 'lucide-vue-next'

const props = defineProps<{
  addresses: any[]
  selectedCity: string
}>()

const emit = defineEmits<{
  (e: 'select-address', idx: number): void
}>()

const baseCoords = computed(() => {
  switch (props.selectedCity) {
    case 'Douala':
      return { lat: 4.0511, lng: 9.7679 }
    case 'Bafoussam':
      return { lat: 5.4778, lng: 10.4178 }
    default:
      return { lat: 3.8480, lng: 11.5021 } // Yaoundé
  }
})

const getMarkerTop = (coords: { lat: number; lng: number }) => {
  const diff = coords.lat - baseCoords.value.lat
  const percentage = ((diff / 0.03) + 0.5) * 100
  return Math.max(8, Math.min(92, percentage))
}

const getMarkerLeft = (coords: { lat: number; lng: number }) => {
  const diff = coords.lng - baseCoords.value.lng
  const percentage = ((diff / 0.03) + 0.5) * 100
  return Math.max(8, Math.min(92, percentage))
}
</script>

<template>
  <div 
    class="relative bg-[#FAF8FD] border-3 border-[#1A237E] rounded-[32px] overflow-hidden shadow-inner min-h-[400px] flex items-center justify-center p-4"
    id="satellite-map-unified-viewport"
    role="region"
    aria-label="Carte interactive d’orientation de findMe Cameroun"
  >
    <!-- Descriptif global d'accessibilité sonore pour aveugles/malvoyants (sr-only) -->
    <div class="sr-only" id="accessibility-speech-description">
      Cette carte interactive présente {{ addresses.length }} points d'adresses municipales localisés.
      Vous pouvez parcourir les adresses raccordées géospatialement à la grille de navigation.
      Le flux d'axe principal est tracé par de larges bandes horizontales figurant les rues structurées.
    </div>

    <!-- Réseau routier de quartier / Lignes d'orientation (avec étiquettes d'accessibilité vocale) -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <!-- Ligne de rue 1 -->
      <path 
        d="M 10,200 L 780,200" 
        stroke="#1A237E" 
        stroke-opacity="0.12" 
        stroke-width="24" 
        fill="none" 
      />
      <text x="30" y="194" fill="#1A237E" font-size="8" font-family="monospace" letter-spacing="1">AXE PRINCIPAL DE QUARTIER (YAOUNDÉ)</text>
      
      <!-- Ligne de rue 2 -->
      <path 
        d="M 300,10 L 300,590" 
        stroke="#1A237E" 
        stroke-opacity="0.08" 
        stroke-width="14" 
        fill="none" 
        stroke-dasharray="8 8" 
      />
    </svg>

    <!-- Zone de secours d'informations audibles sur la ligne de rue -->
    <div class="sr-only">
      Ligne de rue principale traversant d'Est en Ouest à mi-hauteur de la carte.
      Raccordement perpendiculaire d'axe secondaire orienté Nord-Sud.
    </div>

    <!-- Rendu dynamique des marqueurs d'adresse raccordés -->
    <div class="w-full h-full relative" id="markers-grid-container">
      <div 
        v-for="(addr, idx) in addresses"
        :key="idx"
        class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
        :style="{ top: `${getMarkerTop(addr.coordinates)}%`, left: `${getMarkerLeft(addr.coordinates)}%` }"
        @click="emit('select-address', idx)"
        :id="`map-interactive-pin-${idx}`"
        role="button"
        tabindex="0"
        @keydown.enter="emit('select-address', idx)"
        @keydown.space.prevent="emit('select-address', idx)"
        :aria-label="`Marqueur d'adresse de ${addr.fullName}, code unique ${addr.addressCode} à ${addr.city}`"
      >
        <!-- Info bulle discrète au survol -->
        <div class="bg-white border-2 border-[#1A237E] rounded-xl px-2.5 py-1 text-[9px] font-black tracking-wide text-[#1A237E] shadow-md mb-1 absolute bottom-full left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform origin-bottom duration-200 pointer-events-none whitespace-nowrap">
          {{ addr.fullName }} ({{ addr.housePlateNumber || '28B' }})
        </div>

        <div class="flex flex-col items-center">
          <!-- Icône du repère GPS -->
          <MapPin 
            class="w-8 h-8 text-[#2E7D32] stroke-[2.5] hover:scale-115 transition-transform duration-200" 
            :aria-hidden="true"
          />
          <div class="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse -mt-1" />
        </div>

        <!-- Description sonore de positionnement du repère -->
        <div class="sr-only">
          Marqueur posé à l'adresse de {{ addr.fullName }}. Coordonnées de position : latitude {{ addr.coordinates.lat }} et longitude {{ addr.coordinates.lng }}. Repère visuel : {{ addr.landmark || 'Près du chemin d\'accès principal' }}.
        </div>
      </div>
    </div>
  </div>
</template>
