<!--
  @file Footer.vue
  @description Pied de page de l'application findMe Cameroun.
  Affiche les liens d'exploration rapide, les spécifications réglementaires
  administratives et les coordonnées de contact officiel.
-->

<script setup lang="ts">
	import { computed } from "vue";
	import { Mail, Phone, MapPin, Globe, Shield } from "lucide-vue-next";
	import FindMeLogo from "./FindMeLogo.vue";

	const emit = defineEmits<{
		(e: "scroll-to-step", stepId: string): void;
	}>();

	const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
	<footer
		class="bg-[#1A237E] text-[#FBF8FF] pt-16 pb-8 border-t-4 border-[#2E7D32]"
		id="app-footer"
	>
		<div
			class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10"
			id="footer-gird"
		>
			<!-- Identifiant de marque -->
			<div class="md:col-span-1 space-y-4" id="footer-brand-info">
				<div
					class="inline-block transition-transform hover:scale-105 duration-200"
				>
					<FindMeLogo
						size="120"
						variant="footer"
						id="footer-logo"
						@click="navigateTo('/', { external: true })"
					/>
				</div>
				<p class="text-xs text-[#FBF8FF]/70 leading-relaxed font-normal">
					findMe est l'infrastructure civique d'adressage du Cameroun, bâtie
					dans un style alliant rigueur technique et convivialité africaine pour
					que plus aucun foyer ne soit invisible.
				</p>
				<!-- Drapeau Camerounais de Soutien -->
				<div class="flex items-center space-x-1" id="country-tag">
					<div class="w-4 h-3 bg-green-600 rounded-sm" />
					<div
						class="w-4 h-3 bg-red-600 rounded-sm relative flex items-center justify-center"
					>
						<div class="w-1 h-1 bg-yellow-400 rounded-full" />
					</div>
					<div class="w-4 h-3 bg-yellow-400 rounded-sm" />
					<span
						class="text-[10px] uppercase font-bold tracking-widest text-[#FBF8FF]/80 ml-1"
					>
						Douala • Yaoundé • Cameroun
					</span>
				</div>
			</div>

			<!-- Navigation rapide -->
			<div class="space-y-4" id="footer-quick-navigation">
				<h4
					class="font-extrabold text-sm uppercase tracking-wider text-[#FFD5D0]"
				>
					Navigation
				</h4>
				<ul class="space-y-2 text-xs text-[#FBF8FF]/80">
					<li>
						<button
							@click="emit('scroll-to-step', 'comment-ca-marche')"
							aria-label="Aller à la section Comment ça fonctionne"
							class="hover:text-[#FFD5D0] hover:underline cursor-pointer text-left"
						>
							Comment ça fonctionne
						</button>
					</li>
					<li>
						<button
							@click="emit('scroll-to-step', 'benefices')"
							aria-label="Aller à la section Avantages et Impact"
							class="hover:text-[#FFD5D0] hover:underline cursor-pointer text-left"
						>
							Avantages & Impact
						</button>
					</li>
					<li>
						<button
							@click="emit('scroll-to-step', 'demonstration')"
							aria-label="Aller au Simulateur d’Adressage interactif"
							class="hover:text-[#FFD5D0] hover:underline cursor-pointer text-left"
						>
							Simulateur Adressage
						</button>
					</li>
					<li>
						<button
							@click="emit('scroll-to-step', 'faq')"
							aria-label="Aller aux Questions fréquentes"
							class="hover:text-[#FFD5D0] hover:underline cursor-pointer text-left"
						>
							Questions fréquentes
						</button>
					</li>
				</ul>
			</div>

			<!-- Normes de conformité technique -->
			<div class="space-y-4" id="footer-standards">
				<h4
					class="font-extrabold text-sm uppercase tracking-wider text-[#FFD5D0]"
				>
					Normes Nationales
				</h4>
				<ul class="space-y-2.5 text-xs text-[#FBF8FF]/70">
					<li class="flex items-start space-x-2">
						<Shield class="w-3.5 h-3.5 mt-0.5 text-[#4CAF50] shrink-0" />
						<span
							>Format Géocodé standardisé universel conforme aux
							ministères.</span
						>
					</li>
					<li class="flex items-start space-x-2">
						<Globe class="w-3.5 h-3.5 mt-0.5 text-[#4CAF50] shrink-0" />
						<span
							>Génération de QR Codes immatriculés de haute redondance.</span
						>
					</li>
				</ul>
			</div>

			<!-- Contacts et adresses directes -->
			<div class="space-y-4" id="footer-contact">
				<h4
					class="font-extrabold text-sm uppercase tracking-wider text-[#FFD5D0]"
				>
					Contactez-nous
				</h4>
				<ul class="space-y-2.5 text-xs text-[#FBF8FF]/80">
					<li class="flex items-center space-x-2.5">
						<Phone class="w-4 h-4 text-[#4CAF50]" />
						<span>+237 677 88 99 00</span>
					</li>
					<li class="flex items-center space-x-2.5">
						<Mail class="w-4 h-4 text-[#4CAF50]" />
						<span>contact@findme.cm</span>
					</li>
					<li class="flex items-start space-x-2.5">
						<MapPin class="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
						<span
							>Immeuble findMe, Avenue Charles de Gaulle, Akwa, Douala,
							Cameroun</span
						>
					</li>
				</ul>
			</div>
		</div>

		<!-- Copyright -->
		<div
			class="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#FBF8FF]/10 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FBF8FF]/50"
			id="copyright-bar"
		>
			<span>
				© {{ currentYear }} findMe CM. Tous droits réservés. Système d'Adressage
				National.
			</span>
			<div class="flex space-x-6">
				<a href="#cgu" class="hover:text-[#FFD5D0] transition-colors"
					>CGU & Confidentialité</a
				>
				<a href="#support" class="hover:text-[#FFD5D0] transition-colors"
					>Support</a
				>
				<a href="#contact" class="hover:text-[#FFD5D0] transition-colors"
					>Admin</a
				>
			</div>
		</div>
	</footer>
</template>
