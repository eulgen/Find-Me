<!--
  @file app/pages/creer-mon-adresse.vue
  @description Page publique dédiée à la création d'adresse pour tout citoyen (connecté ou non).
-->

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import AddressStepper from '~/components/address-form/AddressStepper.vue'
import { useAuth } from '~/composables/useAuth'

useHead({
  title: 'Créer mon adresse — findMe Cameroun',
  meta: [
    { name: 'description', content: 'Créez votre adresse officielle en 3 étapes simples et obtenez votre QR Code.' }
  ]
})

const { currentUser } = useAuth()
const router = useRouter()

const goBack = () => {
  if (currentUser.value) {
    router.push(`/users/${currentUser.value.id}/adresses`)
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 px-4 sm:px-6">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Bouton de retour -->
      <button 
        @click="goBack" 
        class="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-[#155dfc] dark:text-slate-400 dark:hover:text-white transition-colors group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{{ currentUser ? 'Retour au tableau de bord' : 'Retour à l\'accueil' }}</span>
      </button>

      <!-- Stepper Component -->
      <AddressStepper />
    </div>
  </div>
</template>
