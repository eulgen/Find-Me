<!--
  @file pages/index.vue
  @description Vue de la page d'accueil principale de findMe Cameroun.
  Assemble les sections de présentation, la section partenaires et les modaux.
-->

<script setup lang="ts">
	import { useAddresses } from "../composables/useAddresses";
	import { useNavigation } from "../composables/useNavigation";
	import { useAuth } from "../composables/useAuth";
	import Hero from "~/components/ui/Hero.vue";
	import Features from "~/components/ui/Features.vue";
	import Testimonials from "~/components/ui/Testimonials.vue";
	import Faq from "~/components/ui/Faq.vue";
	import HowItWorks from "~/components/ui/HowItWorks.vue";
	import ContactSupport from "~/components/ui/ContactSupport.vue";
	import Partners from "~/components/ui/Partners.vue";

	// Shared composable singletons
	const { address } = useAddresses();
	const { currentView, scrollToSection } = useNavigation();
</script>

<template>
	<div id="index-page-root" class="w-full">
		<!-- Séquence des sections de l'Accueil générale -->
		<template v-if="currentView === 'home'">
			<Hero
				@scroll-to-step="scrollToSection"
				@create-address-click="navigateTo('/creer-mon-adresse')"
				id="hero-banner"
			/>

			<!-- Section partenaires — juste après le Hero pour crédibilité immédiate -->
			<Partners id="partners-section" />

			<HowItWorks v-model:address="address" id="how-it-works-module" />

			<Features id="features-highlights" />

			<Testimonials id="testimonials-block" />

			<Faq id="accordion-faq" />

			<ContactSupport />
		</template>
	</div>
</template>
