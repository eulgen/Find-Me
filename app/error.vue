<!--
  @file app/error.vue
  @description Page d'erreur 404 findMe — Image en opacité sur fond blanc/chaud, lisibilité parfaite et style Gainlove.
-->

<script setup lang="ts">
import type { NuxtError } from "#app";
import { Home, Compass, MapPin, ShieldCheck, ArrowRight } from "lucide-vue-next";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";

const props = defineProps<{
	error: NuxtError;
}>();

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
	<div
		class="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#FAF8F5] dark:bg-[#0A0D1A] text-slate-900 dark:text-white font-sans selection:bg-emerald-500/20"
	>
		<!-- 1. IMAGE EN OPACITÉ SUR FOND BLANC / CHAUD -->
		<div class="absolute inset-0 z-0 overflow-hidden">
			<!-- Image avec transparence sur fond clair -->
			<img
				src="/assets/images/error_404_city_search.png"
				alt="Recherche d'adresse à Yaoundé et Douala"
				class="w-full h-full object-cover object-center opacity-90 dark:opacity-20 transform scale-105 transition-transform duration-1000 mix-blend-multiply dark:mix-blend-overlay"
			/>
			
			<!-- Surcouche de dégradé blanc chaud pour fondre l'image en douceur -->
			<div
				class="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-[#FAF8F5]/60 dark:from-[#0A0D1A] dark:via-[#0A0D1A]/90 dark:to-[#0A0D1A]/60"
			></div>
			<div
				class="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/80 dark:from-[#0A0D1A] dark:via-transparent to-[#0A0D1A]/80"
			></div>
		</div>

		<!-- 2. EN-TÊTE LOGO (Z-Index Supérieur) -->
		<header class="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between shrink-0">
			<FindMeLogo
				size="160"
				@click="handleError"
				class="cursor-pointer hover:scale-105 transition-transform duration-300"
			/>
			<NuxtLink
				to="/auth/signin"
				class="px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all"
			>
				Se connecter
			</NuxtLink>
		</header>

		<!-- 3. CONTENU PRINCIPAL (Centré et remonté pour que tout tienne parfaitement sur la page) -->
		<main class="relative z-20 flex-1 max-w-4xl mx-auto px-6 py-6 lg:py-12 flex flex-col justify-center items-center text-center w-full my-auto">
			<div class="max-w-2xl space-y-6 flex flex-col items-center text-center mx-auto">
				
				<!-- Badge de statut -->
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider shadow-2xs">
					<Compass class="w-4 h-4 animate-spin-slow text-emerald-600 dark:text-emerald-400" />
					<span>Erreur 404 — Adresse Introuvable</span>
				</div>

				<!-- Titre Éditorial principal -->
				<h1 class="text-2xl sm:text-2xl lg:text-3xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-[1.15] text-center">
					On a fouillé tout <span class="text-emerald-600 dark:text-emerald-400 italic">Yaoundé</span> et <span class="text-emerald-600 dark:text-emerald-400 italic">Douala</span>, mais cette page reste introuvable.
				</h1>

				<!-- Carte sous-titre & réassurance -->
				<div class="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 text-center max-w-xl mx-auto">
					<p class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
						Pas d'inquiétude, nos agents d'adressage sont sur le coup. En attendant, faites un demi-tour sécurisé ou créez directement la plaque officielle de votre domicile.
					</p>

					<!-- Puces de réassurance -->
					<div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-3 text-xs font-bold text-slate-800 dark:text-slate-200 border-t border-slate-200/60 dark:border-slate-800/80">
						<div class="flex items-center gap-2">
							<ShieldCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
							<span>Certification officielle findMe</span>
						</div>
						<div class="flex items-center gap-2">
							<MapPin class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
							<span>Système national d'adressage</span>
						</div>
					</div>
				</div>

				<!-- Boutons d'Action (Pill style Gainlove) -->
				<div class="flex flex-wrap items-center justify-center gap-4 pt-2 w-full">
					<button
						@click="handleError"
						class="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
					>
						<Home class="w-4 h-4" />
						<span>Retour à l'accueil</span>
					</button>

					<NuxtLink
						to="/creer-mon-adresse"
						class="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200/80 dark:border-slate-800 font-bold text-xs shadow-xs hover:scale-105 transition-all"
					>
						<span>Créer mon adresse</span>
						<ArrowRight class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
					</NuxtLink>
				</div>
			</div>
		</main>

		<!-- 4. PIED DE PAGE -->
		<footer class="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 shrink-0">
			&copy; {{ new Date().getFullYear() }} findMe. L'adressage certifié du Cameroun.
		</footer>
	</div>
</template>

<style scoped>
@keyframes spinSlow {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
.animate-spin-slow {
	animation: spinSlow 12s linear infinite;
}
</style>
