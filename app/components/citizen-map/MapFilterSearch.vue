<!--
  @file MapFilterSearch.vue
  @description Composant de filtrage cartographique: Saisie libre et filtrage par métropole.
-->

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, MapPin } from 'lucide-vue-next'

const props = defineProps<{
  searchQuery: string
  selectedCity: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedCity', val: string): void
}>()

const onInput = (e: Event) => {
  emit('update:searchQuery', (e.target as HTMLInputElement).value)
}

const onCityChange = (e: Event) => {
  emit('update:selectedCity', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border-2 border-[#1A237E]/10 p-3 rounded-2xl" id="map-search-bar">
    <!-- Barre de saisie brute -->
    <div class="relative md:col-span-2">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none" aria-hidden="true">
        <Search class="w-4 h-4 text-[#1A237E]/40" />
      </div>
      <input 
        type="text" 
        :value="searchQuery"
        @input="onInput"
        placeholder="Rechercher par nom, code (ex: FM-YDE), ou repère..."
        class="w-full bg-white border border-[#1A237E]/20 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-[#1A237E] placeholder-[#1A237E]/40 focus:outline-none focus:border-[#2E7D32]"
        aria-label="Rechercher une adresse"
      />
    </div>

    <!-- Filtrage par métropoles -->
    <div class="relative">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none" aria-hidden="true">
        <MapPin class="w-4 h-4 text-[#2E7D32]" />
      </div>
      <select 
        :value="selectedCity"
        @change="onCityChange"
        class="w-full bg-white border border-[#1A237E]/20 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-[#1A237E] appearance-none focus:outline-none focus:border-[#2E7D32]"
        aria-label="Filtrer par métropole"
      >
        <option value="All">Toutes les métropoles</option>
        <option value="Yaoundé">Yaoundé</option>
        <option value="Douala">Douala</option>
        <option value="Bafoussam">Bafoussam</option>
        <option value="Garoua">Garoua</option>
        <option value="Kribi">Kribi</option>
      </select>
    </div>
  </div>
</template>
