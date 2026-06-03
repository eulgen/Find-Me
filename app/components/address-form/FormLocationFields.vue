<!--
  @file FormLocationFields.vue
  @description Composant du formulaire d'adressage: Affichage et régulation manuelle des coordonnées satellites GPS.
-->

<script setup lang="ts">
import { Sliders } from 'lucide-vue-next'

const props = defineProps<{
  lat: string
  lng: string
  landmark: string
  errors: { lat: string; lng: string; landmark: string }
}>()

const emit = defineEmits<{
  (e: 'update:lat', val: string): void
  (e: 'update:lng', val: string): void
  (e: 'update:landmark', val: string): void
}>()
</script>

<template>
  <div class="space-y-4" id="address-form-gps-coordinating">
    <div class="p-4 bg-[#F5F2FB] border-2 border-[#1A237E]/10 rounded-2xl">
      <h3 class="text-xs font-black tracking-widest text-[#1A237E]/60 uppercase mb-4.5 flex items-center space-x-1.5">
        <Sliders class="w-4 h-4 text-[#2E7D32]" />
        <span>RÉGLAGES MICROMÉTRIQUES GPS</span>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Latitude -->
        <div>
          <label class="block text-xs font-bold text-[#1A237E] mb-1">Latitude d’orientation (°N) :</label>
          <div class="flex items-center space-x-2">
            <input 
              :value="lat"
              @input="emit('update:lat', ($event.target as HTMLInputElement).value)"
              type="text" 
              class="w-24 bg-white border-2 border-[#1A237E] rounded-xl px-2 py-1.5 text-xs font-mono font-bold text-[#1A237E]"
            />
            <input 
              type="range" 
              min="1.5000" 
              max="14.0000" 
              step="0.0001" 
              :value="parseFloat(lat) || 3.8480"
              @input="emit('update:lat', ($event.target as HTMLInputElement).value)"
              class="flex-1 accent-[#2E7D32] h-1.5 bg-[#1A237E]/10 rounded-lg cursor-pointer"
            />
          </div>
          <p v-if="errors.lat" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.lat }}</p>
        </div>

        <!-- Longitude -->
        <div>
          <label class="block text-xs font-bold text-[#1A237E] mb-1">Longitude d’orientation (°E) :</label>
          <div class="flex items-center space-x-2">
            <input 
              :value="lng"
              @input="emit('update:lng', ($event.target as HTMLInputElement).value)"
              type="text" 
              class="w-24 bg-white border-2 border-[#1A237E] rounded-xl px-2 py-1.5 text-xs font-mono font-bold text-[#1A237E]"
            />
            <input 
              type="range" 
              min="8.0000" 
              max="17.0000" 
              step="0.0001" 
              :value="parseFloat(lng) || 11.5021"
              @input="emit('update:lng', ($event.target as HTMLInputElement).value)"
              class="flex-1 accent-[#2E7D32] h-1.5 bg-[#1A237E]/10 rounded-lg cursor-pointer"
            />
          </div>
          <p v-if="errors.lng" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.lng }}</p>
        </div>
      </div>
    </div>

    <!-- Point de repère verbal -->
    <div>
      <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-landmark">
        Point de repère ou description visuelle libre (facilite la recherche) :
      </label>
      <input 
        id="form-landmark"
        :value="landmark"
        @input="emit('update:landmark', ($event.target as HTMLInputElement).value)"
        type="text" 
        placeholder="Ex: Face à la pharmacie de l'Europe, portail vert à côté du manguier"
        class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] placeholder-[#1A237E]/40 focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
      />
      <p v-if="errors.landmark" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.landmark }}</p>
    </div>
  </div>
</template>
