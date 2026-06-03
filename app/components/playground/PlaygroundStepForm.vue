<!--
  @file PlaygroundStepForm.vue
  @description Étape 1 du simulateur d'adressage: Saisie des informations civiles du foyer.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { type AddressData } from '../../types'
import { MapPin } from 'lucide-vue-next'

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

const onCityChange = (newCity: string) => {
  let lat = 3.8480
  let lng = 11.5021
  if (newCity === 'Douala') {
    lat = 4.0511
    lng = 9.7679
  } else if (newCity === 'Bafoussam') {
    lat = 5.4778
    lng = 10.4178
  }
  
  localAddress.value = {
    ...localAddress.value,
    city: newCity as any,
    coordinates: { lat, lng }
  }
}
</script>

<template>
  <div class="space-y-6" id="playground-step0-form">
    <div class="p-5 bg-white border-2 border-[#1A237E]/10 rounded-2xl">
      <h3 class="text-xs font-black tracking-widest text-[#2E7D32] uppercase mb-4 flex items-center space-x-1.5">
        <MapPin class="w-4 h-4 text-[#2E7D32]" />
        <span>FORMULAIRE CIVIL SIMULÉ</span>
      </h3>

      <div class="space-y-4">
        <!-- Sélection Ville -->
        <div>
          <label class="block text-xs font-bold text-[#1A237E] mb-1.5">1. Choisissez votre Ville :</label>
          <select 
            :value="localAddress.city" 
            @change="onCityChange(($event.target as HTMLSelectElement).value)"
            class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2 text-xs font-bold text-[#1A237E]"
          >
            <option value="Yaoundé">Yaoundé (Capitale Politique)</option>
            <option value="Douala">Douala (Capitale Économique)</option>
            <option value="Bafoussam">Bafoussam (Région de l'Ouest)</option>
          </select>
        </div>

        <!-- Saisie Quartier -->
        <div>
          <label class="block text-xs font-bold text-[#1A237E] mb-1.5">2. Quartier de résidence :</label>
          <input 
            v-model="localAddress.neighborhood"
            type="text" 
            placeholder="Ex: Bastos, Akwa, Bonapriso, Deido"
            class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2 text-xs font-bold text-[#1A237E]"
          />
        </div>

        <!-- Saisie Plaque Municipale -->
        <div>
          <label class="block text-xs font-bold text-[#1A237E] mb-1.5">3. Numéro de Plaque Municipale (Habitation) :</label>
          <input 
            v-model="localAddress.housePlateNumber"
            type="text" 
            placeholder="Ex: 28B, Villa 4, M-104"
            class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2 text-xs font-bold text-[#1A237E]"
          />
        </div>
        
        <!-- Saisie Description Libre d'aide Visuelle -->
        <div>
          <label class="block text-xs font-bold text-[#1A237E] mb-1.5">4. Repère visuel (optionnel) :</label>
          <textarea
            v-model="localAddress.landmark"
            placeholder="Ex: Près du manguier géant ou face à la gendarmerie locale"
            rows="2"
            class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2 text-xs font-bold text-[#1A237E] resize-none"
          />
        </div>
      </div>
    </div>
  </div>
</template>
