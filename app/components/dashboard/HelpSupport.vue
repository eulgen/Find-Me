<!--
  @file app/components/dashboard/HelpSupport.vue
  @description Onglet "Aide & Support" — formulaire de contact support, catégories
  fréquentes, contact téléphonique et ressources avec design glassmorphism à ton uni émeraude et squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { ref } from "vue";
import {
	Send, Search, MapPin, CheckCircle, AlertCircle, Phone, FileText, Users, Shield, HelpCircle, Mail,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
import { useSupportForm, SUPPORT_SUBJECTS } from "~/composables/useSupportForm";

const {
	supportForm, supportErrors, isSubmittingSupport, isSupportSent, submitSupport,
} = useSupportForm();

const categories = [
	{ icon: MapPin, label: "Création d'adresse", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
	{ icon: CheckCircle, label: "Processus de validation", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
	{ icon: AlertCircle, label: "Signaler une erreur", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
] as const;

const resources = [
	{ icon: FileText, title: "Documentation", desc: "Consultez nos guides détaillés pour maîtriser l'app.", hover: "group-hover:text-emerald-600 group-hover:bg-emerald-500/10" },
	{ icon: Users, title: "Communauté", desc: "Rejoignez d'autres utilisateurs FindMe Cameroun.", hover: "group-hover:text-emerald-600 group-hover:bg-emerald-500/10" },
	{ icon: Shield, title: "Confidentialité", desc: "Comment nous protégeons vos données de géolocalisation.", hover: "group-hover:text-emerald-600 group-hover:bg-emerald-500/10" },
] as const;

const searchQuery = ref("");
</script>

<template>
	<div class="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 dark:text-white" id="help-support-section">

		<!-- En-tête de page -->
		<div class="flex items-start justify-between gap-6 flex-wrap">
			<div class="flex-1">
				<div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 shadow-xs">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Centre d'Assistance
				</div>
				<h1 class="text-3xl md:text-4xl font-black font-serif text-slate-900 dark:text-white mb-3 tracking-tight">Aide & Support</h1>
				<p class="text-[15px] font-medium text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
					Besoin d'un coup de main avec FindMe ? Notre équipe est là pour vous accompagner
					dans la gestion de vos adresses urbaines au Cameroun.
				</p>
			</div>
			<!-- Illustration décorative -->
			<div class="shrink-0 relative w-28 h-28 flex items-center justify-center">
				<div class="relative w-full h-full bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-lg shadow-emerald-600/20">
					<HelpCircle class="w-12 h-12 text-white drop-shadow-sm" />
				</div>
			</div>
		</div>

		<!-- Layout à 2 colonnes -->
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

			<!-- COLONNE GAUCHE : Formulaire de contact -->
			<div class="lg:col-span-3 space-y-6">
				<div class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl overflow-hidden">
					<div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800">
						<div>
							<h2 class="text-xl font-black font-serif text-slate-900 dark:text-white">Envoyez-nous un message</h2>
							<p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Notre équipe vous répond sous 24 heures ouvrées.</p>
						</div>
						<div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
							<Mail class="w-5 h-5" />
						</div>
					</div>

					<div v-if="isSupportSent" class="py-12 text-center space-y-4">
						<div class="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
							<CheckCircle class="w-8 h-8" />
						</div>
						<h3 class="text-xl font-black font-serif text-slate-900 dark:text-white">Message transmis avec succès !</h3>
						<p class="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
							Votre ticket a bien été enregistré. Notre support client traitera votre demande dans les plus brefs délais.
						</p>
					</div>

					<div v-else-if="isSubmittingSupport" class="py-12 space-y-6">
						<SkeletonUI height="h-12" rounded="rounded-2xl" />
						<SkeletonUI height="h-12" rounded="rounded-2xl" />
						<SkeletonUI height="h-32" rounded="rounded-2xl" />
						<SkeletonUI height="h-12" rounded="rounded-full" />
					</div>

					<form v-else @submit.prevent="submitSupport" class="space-y-5">
						<!-- Sujet -->
						<div class="space-y-2">
							<label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
								Sujet de la demande
							</label>
							<select
								v-model="supportForm.subject"
								class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
							>
								<option v-for="subj in SUPPORT_SUBJECTS" :key="subj.value" :value="subj.value">
									{{ subj.label }}
								</option>
							</select>
						</div>

						<!-- Email contact -->
						<div class="space-y-2">
							<label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
								Votre adresse Email
							</label>
							<input
								v-model="supportForm.email"
								type="email"
								placeholder="exemple@domaine.cm"
								class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
							/>
							<p v-if="supportErrors.email" class="text-xs text-rose-500 font-bold">{{ supportErrors.email }}</p>
						</div>

						<!-- Message -->
						<div class="space-y-2">
							<label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
								Message / Description du problème
							</label>
							<textarea
								v-model="supportForm.message"
								rows="5"
								placeholder="Décrivez précisément votre demande..."
								class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
							></textarea>
							<p v-if="supportErrors.message" class="text-xs text-rose-500 font-bold">{{ supportErrors.message }}</p>
						</div>

						<button
							type="submit"
							:disabled="isSubmittingSupport"
							class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
						>
							<Send class="w-4 h-4" />
							Envoyer le message
						</button>
					</form>
				</div>
			</div>

			<!-- COLONNE DROITE : Ressources & FAQ -->
			<div class="lg:col-span-2 space-y-6">
				<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xl space-y-4">
					<h3 class="text-lg font-black font-serif text-slate-900 dark:text-white">Ressources Utiles</h3>
					<div class="space-y-3">
						<div v-for="(res, i) in resources" :key="i" class="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 group hover:border-emerald-500/40 transition-colors">
							<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
								<component :is="res.icon" class="w-5 h-5" />
							</div>
							<div>
								<h4 class="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ res.title }}</h4>
								<p class="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{{ res.desc }}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-slate-900 dark:bg-[#0A0D1A] rounded-[32px] p-7 overflow-hidden relative shadow-xl border border-slate-800 text-white">
					<div class="flex items-center gap-4 mb-4">
						<div class="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
							<Phone class="w-6 h-6" />
						</div>
						<div>
							<h3 class="text-lg font-black font-serif">Support Téléphonique</h3>
							<p class="text-xs text-slate-300 font-medium">Lundi - Vendredi (8h - 18h)</p>
						</div>
					</div>
					<p class="text-xl font-black font-mono text-emerald-400 tracking-wider">+237 600 00 00 00</p>
				</div>
			</div>

		</div>

	</div>
</template>
