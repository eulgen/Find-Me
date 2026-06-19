<!--
  @file Footer.vue
  @description Pied de page de l'application findMe Cameroun.
  Affiche les liens d'exploration rapide, les spécifications réglementaires
  administratives et les coordonnées de contact officiel.
-->

<script setup lang="ts">
	import { computed, ref } from "vue";
	import {
		Mail,
		Phone,
		MapPin,
		Globe,
		Shield,
		Facebook,
		Twitter,
		Linkedin,
		Instagram,
		Search,
	} from "lucide-vue-next";
	import FindMeLogo from "./FindMeLogo.vue";

	const emit = defineEmits<{
		(e: "scroll-to-step", stepId: string): void;
	}>();

	const currentYear = computed(() => new Date().getFullYear());
	const searchQuery = ref("");
</script>

<template>
	<footer
		class="bg-[#0D3B2E] text-white"
		id="app-footer"
	>
		<!-- Main footer grid -->
		<div
			class="max-w-7xl mx-auto px-6 md:px-8 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
			id="footer-grid"
		>
			<!-- Col 1: Identifiant de marque -->
			<div class="space-y-5 sm:col-span-2 lg:col-span-1" id="footer-brand-info">
				<div class="cursor-pointer inline-block hover:opacity-80 transition-opacity duration-200">
					<FindMeLogo
						size="120"
						variant="footer"
						id="footer-logo"
						@click="navigateTo('/', { external: true })"
					/>
				</div>
				<p class="text-[13px] text-white/65 leading-relaxed font-normal max-w-[240px]">
					findMe est l'infrastructure civique d'adressage du Cameroun, bâtie
					dans un style alliant rigueur technique et convivialité africaine pour
					que plus aucun foyer ne soit invisible.
				</p>

				<!-- Réseaux sociaux -->
				<div class="flex items-center gap-3" id="footer-socials">
					<a
						href="#"
						aria-label="Facebook"
						class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#2E7D32] hover:text-white transition-all duration-200"
					>
						<Facebook class="w-4 h-4" />
					</a>
					<a
						href="#"
						aria-label="Twitter"
						class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#2E7D32] hover:text-white transition-all duration-200"
					>
						<Twitter class="w-4 h-4" />
					</a>
					<a
						href="#"
						aria-label="LinkedIn"
						class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#2E7D32] hover:text-white transition-all duration-200"
					>
						<Linkedin class="w-4 h-4" />
					</a>
					<a
						href="#"
						aria-label="Instagram"
						class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#2E7D32] hover:text-white transition-all duration-200"
					>
						<Instagram class="w-4 h-4" />
					</a>
				</div>
			</div>

			<!-- Col 2: Navigation Produit -->
			<div class="space-y-5" id="footer-product-nav">
				<h4 class="font-bold text-[11px] uppercase tracking-widest text-white/50">
					Produit
				</h4>
				<ul class="space-y-3">
					<li>
						<button
							@click="emit('scroll-to-step', 'comment-ca-marche')"
							aria-label="Aller à la section Comment ça fonctionne"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							Comment ça fonctionne
						</button>
					</li>
					<li>
						<button
							@click="emit('scroll-to-step', 'features-highlights')"
							aria-label="Aller à la section Tarification"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							Tarification
						</button>
					</li>
					<li>
						<button
							@click="emit('scroll-to-step', 'testimonials-block')"
							aria-label="Aller aux témoignages"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							Témoignages
						</button>
					</li>
					<li>
						<button
							@click="emit('scroll-to-step', 'accordion-faq')"
							aria-label="Aller aux Questions fréquentes"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							FAQ
						</button>
					</li>
					<li>
						<button
							@click="navigateTo('/creer-mon-adresse')"
							aria-label="Créer mon adresse"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							Créer mon adresse
						</button>
					</li>
				</ul>
			</div>

			<!-- Col 3: Entreprise -->
			<div class="space-y-5" id="footer-company-nav">
				<h4 class="font-bold text-[11px] uppercase tracking-widest text-white/50">
					Entreprise
				</h4>
				<ul class="space-y-3">
					<li>
						<button
							@click="emit('scroll-to-step', 'contact-support')"
							aria-label="À propos"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							À propos
						</button>
					</li>
					<li>
						<a
							href="#careers"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							Carrières
						</a>
					</li>
					<li>
						<a
							href="#blog"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							Blog & Actualités
						</a>
					</li>
					<li>
						<a
							href="#cgu"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							CGU & Confidentialité
						</a>
					</li>
					<li>
						<button
							@click="emit('scroll-to-step', 'contact-support')"
							aria-label="Contact"
							class="text-[13px] text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left block"
						>
							Contact
						</button>
					</li>
				</ul>
			</div>

			<!-- Col 4: Notre adresse + Recherche -->
			<div class="space-y-5" id="footer-contact">
				<h4 class="font-bold text-[11px] uppercase tracking-widest text-white/50">
					Notre Adresse
				</h4>
				<ul class="space-y-3">
					<li class="flex items-start gap-2.5">
						<MapPin class="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
						<span class="text-[13px] text-white/75 leading-relaxed">
							Immeuble findMe, Avenue Charles de Gaulle, Akwa, Douala, Cameroun
						</span>
					</li>
					<li class="flex items-center gap-2.5">
						<Phone class="w-4 h-4 text-[#4CAF50] shrink-0" />
						<span class="text-[13px] text-white/75">+237 677 88 99 00</span>
					</li>
					<li class="flex items-center gap-2.5">
						<Mail class="w-4 h-4 text-[#4CAF50] shrink-0" />
						<span class="text-[13px] text-white/75">contact@findme.cm</span>
					</li>
				</ul>

				<!-- Barre de recherche -->
				<div class="pt-2">
					<label class="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
						Rechercher une adresse
					</label>
					<div class="relative flex items-center">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Rechercher..."
							class="w-full bg-white/10 border border-white/15 rounded-lg pl-3 pr-10 py-2.5 text-[13px] text-white placeholder-white/35 focus:outline-none focus:border-[#4CAF50]/60 focus:bg-white/15 transition-all"
							id="footer-search-input"
							aria-label="Rechercher une adresse findMe"
						/>
						<button
							class="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/50 hover:text-[#4CAF50] transition-colors cursor-pointer"
							aria-label="Lancer la recherche"
						>
							<Search class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Séparateur -->
		<div class="max-w-7xl mx-auto px-6 md:px-8">
			<div class="h-px bg-white/10" />
		</div>

		<!-- Copyright bar -->
		<div
			class="max-w-7xl mx-auto px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/40"
			id="copyright-bar"
		>
			<span>
				© {{ currentYear }} findMe CM. Tous droits réservés. Système d'Adressage National.
			</span>
			<div class="flex items-center gap-5">
				<a href="#cgu" class="hover:text-white/70 transition-colors">CGU & Confidentialité</a>
				<a href="#support" class="hover:text-white/70 transition-colors">Support</a>
				<a href="#contact" class="hover:text-white/70 transition-colors">Admin</a>
			</div>
		</div>
	</footer>
</template>
