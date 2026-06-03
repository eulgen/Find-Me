<!--
  @file FormUserInfoFields.vue
  @description Composant du formulaire d'adressage: Saisie d'identité et de contact.
-->

<script setup lang="ts">
const props = defineProps<{
  fullName: string
  phone: string
  errors: { fullName: string; phone: string }
}>()

const emit = defineEmits<{
  (e: 'update:fullName', val: string): void
  (e: 'update:phone', val: string): void
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="address-form-user-identity">
    <!-- Nom complet -->
    <div>
      <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-owner-name">Nom complet du propriétaire ou Villa :</label>
      <input 
        id="form-owner-name"
        :value="fullName"
        @input="emit('update:fullName', ($event.target as HTMLInputElement).value)"
        type="text" 
        placeholder="Ex: Brice Ndeng"
        class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] placeholder-[#1A237E]/40 focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
      />
      <p v-if="errors.fullName" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.fullName }}</p>
    </div>

    <!-- Téléphone -->
    <div>
      <label class="block text-xs font-bold text-[#1A237E] mb-1.5" for="form-owner-phone">Téléphone d'orientation (raccordé) :</label>
      <input 
        id="form-owner-phone"
        :value="phone"
        @input="emit('update:phone', ($event.target as HTMLInputElement).value)"
        type="text" 
        placeholder="Ex: +237 677 88 99 00"
        class="w-full bg-white border-2 border-[#1A237E] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A237E] placeholder-[#1A237E]/40 focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/20 shadow-[2px_2px_0px_0px_#1A237E]"
      />
      <p v-if="errors.phone" class="text-rose-600 text-[10px] font-bold mt-1">{{ errors.phone }}</p>
    </div>
  </div>
</template>
