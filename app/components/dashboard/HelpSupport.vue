<!--
  @file app/components/dashboard/HelpSupport.vue
  @description Onglet "Aide & Support" — formulaire de contact support, catégories
  fréquentes, contact téléphonique et ressources. Calqué sur la maquette "aide_support.png".
  Utilise ButtonUI pour tous les boutons.
-->

<script setup lang="ts">
import {
	Send, Search, MapPin, CheckCircle, AlertCircle, Phone, FileText, Users, Shield, HelpCircle, Mail,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import { useSupportForm, SUPPORT_SUBJECTS } from "~/composables/useSupportForm";

// ─── Composable formulaire support ────────────────────────────────────────
const {
	supportForm, supportErrors, isSubmittingSupport, isSupportSent, submitSupport,
} = useSupportForm();

/** Catégories fréquentes affichées dans le panneau de droite */
const categories = [
	{ icon: MapPin, label: "Création d'adresse", color: "text-[#2E7D32]", bg: "bg-[#2E7D32]/10" },
	{ icon: CheckCircle, label: "Processus de validation", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
	{ icon: AlertCircle, label: "Signaler une erreur", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
] as const;

/** Ressources du bas de page */
const resources = [
	{ icon: FileText, title: "Documentation", desc: "Consultez nos guides détaillés pour maîtriser l'app." },
	{ icon: Users, title: "Communauté", desc: "Rejoignez d'autres utilisateurs FindMe Cameroun." },
	{ icon: Shield, title: "Confidentialité", desc: "Comment nous protégeons vos données de géolocalisation." },
] as const;

/** Termes de recherche rapide dans la FAQ */
const searchQuery = ref("");
</script>

<template>
	<div class="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-300" id="help-support-section">

		<!-- ── En-tête de page ── -->
		<div class="flex items-start justify-between gap-6 flex-wrap">
			<div class="flex-1">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full text-[11px] font-black uppercase tracking-wider mb-3">
					Centre d'Assistance
				</div>
				<h1 class="text-2xl md:text-3xl font-black text-gray-800 dark:text-white mb-2">Aide & Support</h1>
				<p class="text-sm text-gray-500 dark:text-slate-400 max-w-lg leading-relaxed">
					Besoin d'un coup de main avec FindMe ? Notre équipe est là pour vous accompagner
					dans la gestion de vos adresses urbaines au Cameroun.
				</p>
			</div>
			<!-- Illustration décorative -->
			<div class="shrink-0 w-32 h-32 bg-gradient-to-br from-[#2E7D32]/10 to-[#1A237E]/10 rounded-2xl flex items-center justify-center">
				<HelpCircle class="w-16 h-16 text-[#2E7D32]/30" />
			</div>
		</div>

		<!-- ── Layout à 2 colonnes ── -->
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE GAUCHE : Formulaire de contact (3/5)       -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="lg:col-span-3">
				<div class="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm p-6 md:p-8">

					<!-- En-tête formulaire -->
					<div class="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
						<div class="w-8 h-8 bg-[#2E7D32]/10 rounded-xl flex items-center justify-center">
							<Mail class="w-4 h-4 text-[#2E7D32]" />
						</div>
						<span class="text-base font-black text-gray-800 dark:text-white">Envoyez-nous un message</span>
					</div>

					<!-- Message de succès après envoi -->
					<Transition
						enter-active-class="transition-all duration-300 ease-out"
						enter-from-class="opacity-0 -translate-y-2"
						enter-to-class="opacity-100 translate-y-0"
					>
						<div v-if="isSupportSent" class="mb-5 p-4 bg-[#2E7D32]/5 border border-[#2E7D32]/20 rounded-2xl flex items-start gap-3">
							<CheckCircle class="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
							<div>
								<p class="text-sm font-bold text-[#2E7D32]">Message envoyé avec succès !</p>
								<p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Notre équipe vous répondra dans les meilleurs délais.</p>
							</div>
						</div>
					</Transition>

					<!-- Formulaire -->
					<form @submit.prevent="submitSupport" class="space-y-5" id="support-form" novalidate>

						<!-- Nom + Email -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<!-- Nom complet -->
							<div class="space-y-1.5">
								<label for="support-name" class="block text-xs font-bold text-gray-600 dark:text-slate-400">Nom Complet</label>
								<input
									id="support-name"
									v-model="supportForm.name"
									type="text"
									placeholder="Ex: Jean Dupont"
									class="w-full bg-gray-50 dark:bg-slate-950 border text-gray-800 dark:text-white rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium placeholder:text-gray-300 dark:placeholder:text-slate-600"
									:class="supportErrors.name
										? 'border-rose-300 dark:border-rose-500/50 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-500/20 focus:border-rose-400'
										: 'border-gray-200 dark:border-slate-800 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20'"
								/>
								<p v-if="supportErrors.name" class="text-rose-500 text-[11px] font-bold flex items-center gap-1">
									<AlertCircle class="w-3 h-3" /> {{ supportErrors.name }}
								</p>
							</div>

							<!-- Email -->
							<div class="space-y-1.5">
								<label for="support-email" class="block text-xs font-bold text-gray-600 dark:text-slate-400">Email</label>
								<input
									id="support-email"
									v-model="supportForm.email"
									type="email"
									placeholder="jean@exemple.com"
									class="w-full bg-gray-50 dark:bg-slate-950 border text-gray-800 dark:text-white rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium placeholder:text-gray-300 dark:placeholder:text-slate-600"
									:class="supportErrors.email
										? 'border-rose-300 dark:border-rose-500/50 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-500/20 focus:border-rose-400'
										: 'border-gray-200 dark:border-slate-800 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20'"
								/>
								<p v-if="supportErrors.email" class="text-rose-500 text-[11px] font-bold flex items-center gap-1">
									<AlertCircle class="w-3 h-3" /> {{ supportErrors.email }}
								</p>
							</div>
						</div>

						<!-- Objet de la demande -->
						<div class="space-y-1.5">
							<label for="support-subject" class="block text-xs font-bold text-gray-600 dark:text-slate-400">Objet de la demande</label>
							<select
								id="support-subject"
								v-model="supportForm.subject"
								class="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all text-sm font-medium"
							>
								<option v-for="subject in SUPPORT_SUBJECTS" :key="subject" :value="subject">
									{{ subject }}
								</option>
							</select>
						</div>

						<!-- Message -->
						<div class="space-y-1.5">
							<label for="support-message" class="block text-xs font-bold text-gray-600 dark:text-slate-400">Message</label>
							<textarea
								id="support-message"
								v-model="supportForm.message"
								rows="5"
								placeholder="Comment pouvons-nous vous aider aujourd'hui ?"
								class="w-full bg-gray-50 dark:bg-slate-950 border text-gray-800 dark:text-white rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium resize-none placeholder:text-gray-300 dark:placeholder:text-slate-600"
								:class="supportErrors.message
									? 'border-rose-300 dark:border-rose-500/50 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-500/20 focus:border-rose-400'
									: 'border-gray-200 dark:border-slate-800 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20'"
							/>
							<div class="flex items-center justify-between">
								<p v-if="supportErrors.message" class="text-rose-500 text-[11px] font-bold flex items-center gap-1">
									<AlertCircle class="w-3 h-3" /> {{ supportErrors.message }}
								</p>
								<span class="text-[10px] text-gray-300 dark:text-slate-600 ml-auto font-semibold">
									{{ supportForm.message.length }} / 1000
								</span>
							</div>
						</div>

						<!-- Bouton d'envoi -->
						<ButtonUI
							type="submit"
							variant="primary"
							:icon="Send"
							:loading="isSubmittingSupport"
							class="w-full shadow-lg shadow-[#2E7D32]/25 py-3"
						>
							Envoyer le message
						</ButtonUI>
					</form>
				</div>
			</div>

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE DROITE : Recherche + Contact (2/5)         -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="lg:col-span-2 space-y-4">

				<!-- ── Recherche rapide ── -->
				<div class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm p-5">
					<div class="flex items-center gap-2 mb-3">
						<Search class="w-4 h-4 text-gray-400" />
						<span class="text-sm font-black text-gray-700 dark:text-white">Rechercher une réponse</span>
					</div>
					<div class="relative">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Ex: Comment enregistrer ma villa ?"
							class="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-white outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
						/>
					</div>
				</div>

				<!-- ── Catégories fréquentes ── -->
				<div class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm p-5">
					<p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Catégories Fréquentes</p>
					<div class="space-y-2">
						<button
							v-for="cat in categories"
							:key="cat.label"
							class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left group"
						>
							<div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="cat.bg">
								<component :is="cat.icon" class="w-4 h-4" :class="cat.color" />
							</div>
							<span class="text-sm font-bold text-gray-700 dark:text-white flex-1">{{ cat.label }}</span>
							<svg class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
							</svg>
						</button>
					</div>
				</div>

				<!-- ── Contact téléphonique ── -->
				<div class="bg-gradient-to-br from-[#1A237E] to-[#0D144A] rounded-[20px] p-5 shadow-xl shadow-[#1A237E]/30 relative overflow-hidden">
					<div class="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
					<div class="relative z-10">
						<p class="text-[10px] font-black text-indigo-300 uppercase tracking-wider mb-1">Besoin d'une réponse immédiate ?</p>
						<p class="text-xs text-indigo-200 mb-3">Appelez le Service Client</p>
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
								<Phone class="w-5 h-5 text-white" />
							</div>
							<span class="text-lg font-black text-white">+237 600 000 000</span>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- ── Ressources du bas de page ── -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div
				v-for="resource in resources"
				:key="resource.title"
				class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
			>
				<div class="w-12 h-12 bg-gray-50 dark:bg-slate-800 group-hover:bg-[#2E7D32]/10 rounded-2xl flex items-center justify-center mb-3 transition-colors">
					<component :is="resource.icon" class="w-6 h-6 text-gray-400 group-hover:text-[#2E7D32] transition-colors" />
				</div>
				<p class="text-sm font-black text-gray-800 dark:text-white mb-1">{{ resource.title }}</p>
				<p class="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">{{ resource.desc }}</p>
			</div>
		</div>

	</div>
</template>
