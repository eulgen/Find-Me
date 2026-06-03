<!--
  @file FormCityFields.vue
  @description Composant du formulaire d'adressage: Sélection géopolitique de la ville, arrondissement, quartier et codes postaux.
-->

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  city: 'Douala' | 'Yaoundé' | 'Bafoussam' | 'Garoua' | 'Kribi'
  arrondissement: string
  quartier: string
  postalCode: string
  houseNumber: string
  errors: { city: string; arrondissement: string; quartier: string; postalCode: string; houseNumber: string }
  hints: { postalCode: string; houseNumber: string }
}>()

const emit = defineEmits<{
  (e: 'update:city', val: string): void
  (e: 'update:arrondissement', val: string): void
  (e: 'update:quartier', val: string): void
  (e: 'update:postalCode', val: string): void
  (e: 'update:houseNumber', val: string): void
}>()

const arrondissementOptions = computed(() => {
  switch (props.city) {
    case 'Douala':
      return ['Douala I', 'Douala II', 'Douala III', 'Douala IV', 'Douala V', 'Douala VI']
    case 'Yaoundé':
      return ['Yaoundé I', 'Yaoundé II', 'Yaoundé III', 'Yaoundé IV', 'Yaoundé V', 'Yaoundé VI', 'Yaoundé VII']
    case 'Bafoussam':
      return ['Bafoussam I', 'Bafoussam II', 'Bafoussam III']
    case 'Garoua':
      return ['Garoua I', 'Garoua II', 'Garoua III']
    case 'Kribi':
      return ['Kribi I', 'Kribi II']
    default:
      return []
  }
})
</script>

<template>
  <div class="space-y-4" id="address-form-cities-fields">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Ville -->
      <div>
        <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-city">Ville :</label>
        <select 
          id="form-city"
          :value="city"
          @change="emit('update:city', ($event.target as HTMLSelectElement).value)"
          class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
        >
          <option value="Yaoundé">Yaoundé</option>
          <option value="Douala">Douala</option>
          <option value="Bafoussam">Bafoussam</option>
          <option value="Garoua">Garoua</option>
          <option value="Kribi">Kribi</option>
        </select>
      </div>

      <!-- Arrondissement -->
      <div>
        <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-arrondissement">Arrondissement :</label>
        <select 
          id="form-arrondissement"
          :value="arrondissement"
          @change="emit('update:arrondissement', ($event.target as HTMLSelectElement).value)"
          class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
        >
          <option v-for="opt in arrondissementOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <p v-if="errors.arrondissement" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.arrondissement }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Quartier -->
      <div>
        <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-quartier">Quartier (bloc / secteur) :</label>
        <input 
          id="form-quartier"
          :value="quartier"
          @input="emit('update:quartier', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Ex: Bastos"
          class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
        />
        <p v-if="errors.quartier" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.quartier }}</p>
      </div>

      <!-- Plaque Municipale -->
      <div>
        <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-house-number">Numéro d'habitation / Plaque :</label>
        <input 
          id="form-house-number"
          :value="houseNumber"
          @input="emit('update:houseNumber', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Ex: 28B"
          class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
        />
        <p v-if="hints.houseNumber && !errors.houseNumber" class="text-[#2E7D32] text-[9px] font-semibold mt-1">{{ hints.houseNumber }}</p>
        <p v-if="errors.houseNumber" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.houseNumber }}</p>
      </div>

      <!-- Code Postal -->
      <div>
        <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-zip">Code Postal :</label>
        <input 
          id="form-zip"
          :value="postalCode"
          @input="emit('update:postalCode', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Ex: 00237"
          class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
        />
        <p v-if="hints.postalCode && !errors.postalCode" class="text-[#2E7D32] text-[9px] font-semibold mt-1">{{ hints.postalCode }}</p>
        <p v-if="errors.postalCode" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.postalCode }}</p>
      </div>
    </div>
  </div>
</template>
