<!--
  @file pages/index.vue
  @description Vue de la page d'accueil principale de findMe Cameroun.
  Assemble les sections de présentation, l'Espace Citoyen et l'ensemble des modaux.
-->

<script setup lang="ts">
import { useAddresses } from '../composables/useAddresses'
import { useNavigation } from '../composables/useNavigation'
import { useAuth } from '../composables/useAuth'

// Shared composable singletons
const { address, isCreateAddressOpen } = useAddresses()
const { currentView, scrollToSection } = useNavigation()
const { currentUser } = useAuth()
</script>

<template>
  <div id="index-page-root" class="w-full">
    
    <!-- Séquence des sections de l'Accueil générale -->
    <template v-if="currentView === 'home'">
      <Hero 
        @scroll-to-step="scrollToSection" 
        @create-address-click="isCreateAddressOpen = true"
        id="hero-banner"
      />

      <HowItWorks 
        v-model:address="address"
        id="how-it-works-module"
      />

      <Features 
        id="features-highlights"
      />

      <Testimonials 
        id="testimonials-block"
      />

      <Faq 
        id="accordion-faq"
      />

      <PromoCtaSection />
    </template>

    <!-- Espace Citoyen Privé (Liste, Cartographie, Gestion) -->
    <CitizenSpace v-else-if="currentView === 'citizen-space' && currentUser" />

    <!-- Espace Administrateur Privé (CRUD des utilisateurs et tracking adresses) -->
    <AdminSpace v-else-if="currentView === 'admin-space' && currentUser && currentUser.role === 'admin'" />

  </div>
</template>
