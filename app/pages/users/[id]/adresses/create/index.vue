<!--
  @file app/pages/creer-mon-adresse/index.vue
  @description Page pleine page dédiée à la création d'adresse en plusieurs étapes.
-->

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import ButtonUI from '~/components/ui/ButtonUI.vue'
import AddressStepper from '~/components/address-form/AddressStepper.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'auth',
  layout:"dashboard"
})

const { currentUser } = useAuth()
const router = useRouter()

const goBack = () => {
  if (currentUser.value) {
    router.push(`/users/${currentUser.value.username || 'me'}?section=addresses`)
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
        <span>Retour au tableau de bord</span>
      </button>

      <!-- Stepper Component -->
      <AddressStepper />
    </div>
  </div>
</template>
