<!--
  @file PromoCtaSection.vue
  @description Section promotionnelle finale avec boutons d'appels à l'action bilingues.
-->

<script setup lang="ts">
import { Sparkles, ShieldCheck } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'
import { useNavigation } from '../composables/useNavigation'
import { useAddresses } from '../composables/useAddresses'
import { useAuth } from '../composables/useAuth'

const { currentLang } = useLanguage()
const { isCreateAddressOpen } = useAddresses()
const { authModalOpen } = useAuth()
const {
  isFinalCtaLoading,
  isFinalDemoLoading
} = useNavigation()

const handleFinalCtaClick = () => {
  isFinalCtaLoading.value = true
  setTimeout(() => {
    isFinalCtaLoading.value = false
    isCreateAddressOpen.value = true
  }, 600)
}

const handleFinalDemoClick = () => {
  isFinalDemoLoading.value = true
  setTimeout(() => {
    isFinalDemoLoading.value = false
    authModalOpen.value = true
  }, 1000)
}
</script>

<template>
  <section class="py-20 px-6 max-w-5xl mx-auto text-center space-y-8" id="final-cta-promo">
    <div class="bg-white dark:bg-slate-900 rounded-[36px] border-4 border-[#1A237E] dark:border-[#2E7D32] p-10 md:p-14 shadow-[10px_10px_0px_0px_#2E7D32] space-y-6" id="promo-box">
      <span class="bg-[#FFD5D0] border-2 border-[#1A237E] text-[#1A237E] uppercase text-xs font-black tracking-widest px-4 py-1.5 rounded-full inline-block">
        {{ currentLang === 'FR' ? 'Accès Citoyen' : 'Public Access' }}
      </span>

      <h2 class="text-3xl md:text-5xl font-black text-[#1A237E] dark:text-white tracking-tight max-w-xl mx-auto leading-tight">
        {{ currentLang === 'FR' 
          ? 'Prêt à rendre votre adresse visible au monde entier ?' 
          : 'Empower your household with a standardized address today.' }}
      </h2>

      <p class="text-[#1A237E]/80 dark:text-gray-300 text-sm md:text-base max-w-lg mx-auto font-normal">
        {{ currentLang === 'FR'
          ? 'Rejoignez les centaines de Camerounais qui simplifient la livraison de colis, la venue de taxis et les interventions de secours à Douala et Yaoundé.'
          : 'Join proud citizens securing their last-mile navigation codes in under 3 minutes.' }}
      </p>

      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4" id="promo-buttons">
        <ButtonUI
          variant="primary"
          :loading="isFinalCtaLoading"
          :disabled="isFinalCtaLoading || isFinalDemoLoading"
          :icon="Sparkles"
          @click="handleFinalCtaClick"
          class="w-full sm:w-auto"
          id="final-cta-btn-green"
        >
          {{ currentLang === 'FR' ? 'Créer mon adresse maintenant' : 'Generate my Address Now' }}
        </ButtonUI>

        <ButtonUI
          variant="secondary"
          :loading="isFinalDemoLoading"
          :disabled="isFinalDemoLoading || isFinalCtaLoading"
          :icon="ShieldCheck"
          @click="handleFinalDemoClick"
          class="w-full sm:w-auto"
          id="final-demo-btn"
        >
          {{ currentLang === 'FR' ? 'Se connecter' : 'Citizen Dashboard' }}
        </ButtonUI>
      </div>
    </div>
  </section>
</template>
