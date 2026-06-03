<!--
  @file AddressItemsList.vue
  @description Composant du quartier générale: Rendu des vignettes de propriété des citoyennes filtrées.
-->

<script setup lang="ts">
import { MapPin, Printer, Share2, Trash2, ShieldCheck, Eye } from 'lucide-vue-next'

const props = defineProps<{
  addresses: any[]
}>()

const emit = defineEmits<{
  (e: 'select', idx: number): void
  (e: 'share', code: string): void
  (e: 'download', addr: any): void
  (e: 'delete', idx: number): void
}>()
</script>

<template>
  <div class="space-y-4" id="addresses-interactive-cards-list">
    <!-- Liste vide -->
    <div v-if="addresses.length === 0" class="text-center p-8 bg-white border-2 border-dashed border-[#1A237E]/10 rounded-2xl">
      <span class="text-xs font-bold text-[#1A237E]/50">Aucune adresse enregistrée ou ne correspond aux critères.</span>
    </div>

    <!-- Éléments d'adresse individuels -->
    <div 
      v-for="(addr, idx) in addresses"
      :key="idx"
      class="bg-[#FDFCF2] border-3 border-[#1A237E] rounded-[24px] p-5 relative hover:shadow-[4px_4px_0px_0px_#1A237E] hover:translate-y-[-2px] transition-all"
      :id="`address-card-row-${idx}`"
    >
      <div class="flex items-start justify-between">
        <div class="text-left space-y-1">
          <span class="bg-[#2E7D32]/10 text-[#2E7D32] text-[9px] font-black uppercase px-2.5 py-1 rounded-full inline-block">
            {{ addr.city }} • {{ addr.catalog || addr.neighborhood }}
          </span>
          <h4 class="font-extrabold text-sm text-[#1A237E] pt-1">
            {{ addr.fullName }}
          </h4>
          <span class="font-mono font-black text-xs text-[#1A237E] tracking-wider block">
            {{ addr.addressCode }}
          </span>
          <div class="flex items-center space-x-1 text-[10px] text-[#1A237E]/65 pt-1">
            <MapPin class="w-3.5 h-3.5" />
            <span>N° {{ addr.housePlateNumber || '28B' }}, {{ addr.streetName || 'Raccord principal' }}</span>
          </div>
        </div>

        <!-- Décor de vérification findMe -->
        <ShieldCheck class="w-6 h-6 text-[#2E7D32]" />
      </div>

      <!-- Actions rapides au pied de la carte -->
      <div class="flex items-center justify-between border-t border-[#1A237E]/10 pt-3.5 mt-3.5" id="card-foot-triggers">
        <button 
          @click="emit('select', idx)"
          class="flex items-center space-x-1 bg-[#1A237E] hover:bg-[#1A237E]/90 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
        >
          <Eye class="w-3.5 h-3.5" />
          <span>Fiche</span>
        </button>

        <div class="flex items-center space-x-1.5">
          <!-- Télécharger -->
          <button 
            @click="emit('download', addr)"
            class="w-7 h-7 rounded-md border border-[#1A237E]/20 hover:bg-white flex items-center justify-center text-[#1A237E] cursor-pointer"
            title="Télécharger le certificat"
            aria-label="Télécharger le certificat publique et la fiche SVG"
          >
            <Printer class="w-3.5 h-3.5" />
          </button>

          <!-- Partager -->
          <button 
            @click="emit('share', addr.addressCode)"
            class="w-7 h-7 rounded-md border border-[#1A237E]/20 hover:bg-white flex items-center justify-center text-[#1A237E] cursor-pointer"
            title="Partager mon itinéraire"
            aria-label="Partager les directions par messagerie"
          >
            <Share2 class="w-3.5 h-3.5" />
          </button>

          <!-- Supprimer -->
          <button 
            @click="emit('delete', idx)"
            class="w-7 h-7 rounded-md border border-rose-600/20 hover:bg-rose-50 flex items-center justify-center text-rose-600 cursor-pointer"
            title="Effacer cette adresse"
            aria-label="Effacer définitivement l'adresse civique"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
