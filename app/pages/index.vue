<!--
  @file pages/index.vue
  @description Page d'accueil principale findMe Cameroun — redesign world-class.
  Séquence immersive : Hero → Stats/Partners → HowItWorks → Features → CTA → Testimonials → FAQ → Contact
-->

<script setup lang="ts">
import { useAddresses } from "../composables/useAddresses";
import { useNavigation } from "../composables/useNavigation";
import Hero from "~/components/ui/Hero.vue";
import Features from "~/components/ui/Features.vue";
import Testimonials from "~/components/ui/Testimonials.vue";
import Faq from "~/components/ui/Faq.vue";
import HowItWorks from "~/components/ui/HowItWorks.vue";
import ContactSupport from "~/components/ui/ContactSupport.vue";
import Partners from "~/components/ui/Partners.vue";
import CtaBold from "~/components/ui/CtaBold.vue";

useHead({
  title: "findMe Cameroun — Votre adresse officielle, précise & partageable",
  meta: [
    { name: "description", content: "Créez votre adresse officielle au Cameroun avec findMe. Code structuré, QR Code GPS, certifié municipal. Gratuit pour tous les citoyens à Douala et Yaoundé." },
    { property: "og:title", content: "findMe Cameroun — Adressage officiel" },
    { property: "og:description", content: "Votre adresse précise en moins de 3 minutes. QR Code, GPS, certifiée." },
  ]
});

const { address } = useAddresses();
const { currentView, scrollToSection } = useNavigation();
</script>

<template>
  <div id="index-page-root" class="w-full">
    <template v-if="currentView === 'home'">

      <!-- 1. Hero cinématique — occupe 100vh -->
      <Hero
        @scroll-to-step="scrollToSection"
        @create-address-click="navigateTo('/creer-mon-adresse')"
        id="hero-banner"
      />

      <!-- 2. Stats-band + Partenaires -->
      <Partners id="partners-section" />

      <!-- 3. Comment ça marche — 3 étapes interactives -->
      <HowItWorks v-model:address="address" id="how-it-works-module" />

      <!-- 4. Avantages — grille bento + bannière impact -->
      <Features id="features-highlights" />

      <!-- 5. CTA Bold — section de conversion sombre et immersive -->
      <CtaBold id="cta-bold-conversion" />

      <!-- 6. Témoignages citoyens -->
      <Testimonials id="testimonials-block" />

      <!-- 7. FAQ -->
      <Faq id="accordion-faq" />

      <!-- 8. Support Contact -->
      <ContactSupport />

    </template>
  </div>
</template>
