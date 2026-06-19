<!--
  @file PromoCtaSection.vue
  @description Section CTA finale findMe — redesign premium avec fond dégradé
  et cartes en relief. Logique métier conservée à l'identique.
-->

<script setup lang="ts">
import { Sparkles, LogIn, ArrowRight } from "lucide-vue-next";
import { useNavigation } from "../../composables/useNavigation";
import { useAddresses } from "../../composables/useAddresses";
import { useAuth } from "../../composables/useAuth";
import ButtonUI from "./ButtonUI.vue";

const { isCreateAddressOpen } = useAddresses();
const { authModalOpen } = useAuth();
const { isFinalCtaLoading, isFinalDemoLoading } = useNavigation();

const handleFinalCtaClick = () => {
  isFinalCtaLoading.value = true;
  setTimeout(() => {
    isFinalCtaLoading.value = false;
    navigateTo("/creer-mon-adresse");
  }, 600);
};

const handleFinalDemoClick = () => {
  isFinalDemoLoading.value = true;
  setTimeout(() => {
    isFinalDemoLoading.value = false;
    authModalOpen.value = true;
  }, 1000);
};
</script>

<template>
  <section
    class="relative py-24 px-6 overflow-hidden"
    id="final-cta-promo"
    style="background: linear-gradient(135deg, #1A237E 0%, #0d1554 50%, #152819 100%)"
  >
    <!-- Décor fond -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
        style="background: radial-gradient(circle, #2E7D32, transparent 65%)"
      />
      <div
        class="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-8"
        style="background: radial-gradient(circle, #FF6D00, transparent 65%)"
      />
      <svg class="absolute inset-0 w-full h-full opacity-[0.04]">
        <defs>
          <pattern id="cta-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-grid)"/>
      </svg>
    </div>

    <div class="relative max-w-5xl mx-auto" id="promo-box">

      <!-- Badge -->
      <div class="text-center mb-8">
        <span class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
          <Sparkles class="w-3.5 h-3.5 text-[#FF6D00]" />
          Accès Citoyen · Gratuit
        </span>
      </div>

      <!-- Titre -->
      <div class="text-center max-w-3xl mx-auto space-y-5">
        <h2 class="text-3xl md:text-5xl lg:text-[3.5rem] font-black text-white tracking-tight leading-[1.1]">
          Prêt à rendre votre adresse<br />
          <span class="text-[#4CAF50]">visible au monde entier&nbsp;?</span>
        </h2>
        <p class="text-base text-white/60 font-normal leading-relaxed max-w-xl mx-auto">
          Rejoignez les centaines de Camerounais qui simplifient la livraison de colis,
          la venue de taxis et les interventions de secours à Douala et Yaoundé.
        </p>
      </div>

      <!-- Boutons -->
      <div
        class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        id="promo-buttons"
      >
        <ButtonUI
          variant="primary"
          :loading="isFinalCtaLoading"
          :disabled="isFinalCtaLoading || isFinalDemoLoading"
          :icon="ArrowRight"
          iconPosition="right"
          @click="handleFinalCtaClick"
          class="w-full sm:w-auto"
          id="final-cta-btn-green"
        >
          Créer mon adresse maintenant
        </ButtonUI>

        <ButtonUI
          variant="outline"
          :loading="isFinalDemoLoading"
          :disabled="isFinalDemoLoading || isFinalCtaLoading"
          :icon="LogIn"
          @click="handleFinalDemoClick"
          class="w-full sm:w-auto !text-white !border-white/25 hover:!bg-white/10"
          id="final-demo-btn"
        >
          Se connecter
        </ButtonUI>
      </div>

      <!-- Stats de réassurance -->
      <div class="mt-12 flex flex-wrap items-center justify-center gap-8">
        <div
          v-for="item in [
            { value: '100%', label: 'Gratuit pour les citoyens' },
            { value: '< 3 min', label: 'Pour créer votre adresse' },
            { value: '+500', label: 'Foyers déjà enregistrés' },
          ]"
          :key="item.label"
          class="text-center"
        >
          <p class="text-2xl font-black text-white">{{ item.value }}</p>
          <p class="text-xs text-white/45 font-medium mt-0.5">{{ item.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
