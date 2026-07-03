<!--
  @file app/components/dashboard/HelpSupport.vue
  @description Onglet "Aide & Support" — formulaire de contact support, catégories
  fréquentes, contact téléphonique et ressources avec design premium glassmorphism.
-->

<script setup lang="ts">
import {
	Send, Search, MapPin, CheckCircle, AlertCircle, Phone, FileText, Users, Shield, HelpCircle, Mail,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import { useSupportForm, SUPPORT_SUBJECTS } from "~/composables/useSupportForm";

const {
	supportForm, supportErrors, isSubmittingSupport, isSupportSent, submitSupport,
} = useSupportForm();

const categories = [
	{ icon: MapPin, label: "Création d'adresse", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
	{ icon: CheckCircle, label: "Processus de validation", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
	{ icon: AlertCircle, label: "Signaler une erreur", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
] as const;

const resources = [
	{ icon: FileText, title: "Documentation", desc: "Consultez nos guides détaillés pour maîtriser l'app.", hover: "group-hover:text-emerald-500 group-hover:bg-emerald-500/10" },
	{ icon: Users, title: "Communauté", desc: "Rejoignez d'autres utilisateurs FindMe Cameroun.", hover: "group-hover:text-indigo-500 group-hover:bg-indigo-500/10" },
	{ icon: Shield, title: "Confidentialité", desc: "Comment nous protégeons vos données de géolocalisation.", hover: "group-hover:text-blue-500 group-hover:bg-blue-500/10" },
] as const;

const searchQuery = ref("");
</script>

<template>
	<div class="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" id="help-support-section">

		<!-- ── En-tête de page ── -->
		<div class="flex items-start justify-between gap-6 flex-wrap">
			<div class="flex-1">
				<div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 dark:bg-[#0f172b]/20 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-[#0f172b] rounded-full text-[11px] font-black uppercase tracking-widest mb-4 shadow-sm">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Centre d'Assistance
				</div>
				<h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 mb-3 tracking-tight">Aide & Support</h1>
				<p class="text-[15px] font-medium text-slate-500 dark:text-slate-600 max-w-xl leading-relaxed">
					Besoin d'un coup de main avec FindMe ? Notre équipe est là pour vous accompagner
					dans la gestion de vos adresses urbaines au Cameroun.
				</p>
			</div>
			<!-- Illustration décorative -->
			<div class="shrink-0 relative w-32 h-32 flex items-center justify-center group cursor-pointer transition-transform duration-500">
				<div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 blur-xl animate-pulse-slow" />
				<div class="relative w-full h-full bg-white/40 dark:bg-slate-50 backdrop-blur-xl border border-white/60 dark:border-slate-300 rounded-[32px] flex items-center justify-center shadow-xl group-hover:shadow-emerald-500/20 transition-all">
					<HelpCircle class="w-14 h-14 text-emerald-500 drop-shadow-md" />
				</div>
			</div>
		</div>

		<!-- ── Layout à 2 colonnes ── -->
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE GAUCHE : Formulaire de contact (3/5)       -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="lg:col-span-3">
				<div class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 overflow-hidden group">
					<div class="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700"></div>

					<!-- En-tête formulaire -->
					<div class="flex items-center gap-4 mb-8 relative z-10">
						<div class="w-12 h-12 bg-white/60 dark:bg-slate-50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/40 dark:border-slate-300 shadow-sm">
							<Mail class="w-5 h-5 text-emerald-600 dark:text-[#0f172b]" />
						</div>
						<div>
							<h3 class="text-xl font-black text-slate-800 dark:text-[#0f172b] leading-tight">Envoyez-nous un message</h3>
							<p class="text-[13px] font-medium text-slate-500 dark:text-slate-600">Nous répondons généralement sous 24h.</p>
						</div>
					</div>

					<!-- Message de succès après envoi -->
					<Transition
						enter-active-class="transition-all duration-500 ease-out"
						enter-from-class="opacity-0 translate-y-4"
						enter-to-class="opacity-100 translate-y-0"
					>
						<div v-if="isSupportSent" class="mb-8 p-5 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-2xl flex items-start gap-4 shadow-inner relative z-10">
							<div class="bg-emerald-500 rounded-full p-1 mt-0.5 shadow-md">
								<CheckCircle class="w-4 h-4 text-white shrink-0" />
							</div>
							<div>
								<p class="text-[15px] font-black text-emerald-600 dark:text-[#0f172b]">Message envoyé avec succès !</p>
								<p class="text-[13px] font-medium text-slate-500 dark:text-emerald-500/70 mt-1">Notre équipe vous répondra dans les meilleurs délais sur votre boîte mail.</p>
							</div>
						</div>
					</Transition>

					<!-- Formulaire -->
					<form @submit.prevent="submitSupport" class="space-y-6 relative z-10" id="support-form" novalidate>

						<!-- Nom + Email -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<!-- Nom complet -->
							<div class="space-y-2">
								<label for="support-name" class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Nom Complet</label>
								<input
									id="support-name"
									v-model="supportForm.name"
									type="text"
									placeholder="Ex: Jean Dupont"
									class="w-full bg-white/50 dark:bg-white backdrop-blur-sm text-slate-800 dark:text-[#0f172b] rounded-2xl px-5 py-3.5 outline-none transition-all font-bold shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600 border"
									:class="supportErrors.name
										? 'border-rose-400 focus:ring-4 focus:ring-rose-500/20'
										: 'border-white/60 dark:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'"
								/>
								<Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
									<p v-if="supportErrors.name" class="text-rose-500 text-[11px] font-bold flex items-center gap-1.5 pl-2">
										<AlertCircle class="w-3 h-3" /> {{ supportErrors.name }}
									</p>
								</Transition>
							</div>

							<!-- Email -->
							<div class="space-y-2">
								<label for="support-email" class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Email</label>
								<input
									id="support-email"
									v-model="supportForm.email"
									type="email"
									placeholder="jean@exemple.com"
									class="w-full bg-white/50 dark:bg-white backdrop-blur-sm text-slate-800 dark:text-[#0f172b] rounded-2xl px-5 py-3.5 outline-none transition-all font-bold shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600 border"
									:class="supportErrors.email
										? 'border-rose-400 focus:ring-4 focus:ring-rose-500/20'
										: 'border-white/60 dark:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'"
								/>
								<Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
									<p v-if="supportErrors.email" class="text-rose-500 text-[11px] font-bold flex items-center gap-1.5 pl-2">
										<AlertCircle class="w-3 h-3" /> {{ supportErrors.email }}
									</p>
								</Transition>
							</div>
						</div>

						<!-- Objet de la demande -->
						<div class="space-y-2">
							<label for="support-subject" class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Objet de la demande</label>
							<select
								id="support-subject"
								v-model="supportForm.subject"
								class="w-full bg-white/50 dark:bg-white backdrop-blur-sm border border-white/60 dark:border-slate-300 text-slate-800 dark:text-[#0f172b] rounded-2xl px-5 py-3.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold shadow-inner cursor-pointer"
							>
								<option v-for="subject in SUPPORT_SUBJECTS" :key="subject" :value="subject">
									{{ subject }}
								</option>
							</select>
						</div>

						<!-- Message -->
						<div class="space-y-2">
							<div class="flex items-center justify-between pl-2 pr-1">
								<label for="support-message" class="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Message</label>
								<span class="text-[10px] font-bold" :class="supportForm.message.length > 900 ? 'text-amber-500' : 'text-slate-400'">
									{{ supportForm.message.length }} / 1000
								</span>
							</div>
							<textarea
								id="support-message"
								v-model="supportForm.message"
								rows="5"
								placeholder="Comment pouvons-nous vous aider aujourd'hui ?"
								class="w-full bg-white/50 dark:bg-white backdrop-blur-sm text-slate-800 dark:text-[#0f172b] rounded-2xl px-5 py-4 outline-none transition-all font-medium resize-none shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600 border"
								:class="supportErrors.message
									? 'border-rose-400 focus:ring-4 focus:ring-rose-500/20'
									: 'border-white/60 dark:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'"
							/>
							<Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
								<p v-if="supportErrors.message" class="text-rose-500 text-[11px] font-bold flex items-center gap-1.5 pl-2 mt-1">
									<AlertCircle class="w-3 h-3" /> {{ supportErrors.message }}
								</p>
							</Transition>
						</div>

						<!-- Bouton d'envoi -->
						<ButtonUI
							type="submit"
							variant="primary"
							:icon="Send"
							:loading="isSubmittingSupport"
							class="w-full shadow-[0_8px_24px_rgba(16,185,129,0.25)] py-4 text-[15px] bg-gradient-to-r from-emerald-500 to-teal-600 border-none transition-transform"
						>
							Envoyer le message
						</ButtonUI>
					</form>
				</div>
			</div>

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE DROITE : Recherche + Contact (2/5)         -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="lg:col-span-2 space-y-6">

				<!-- ── Recherche rapide ── -->
				<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-50 flex items-center justify-center shadow-inner">
							<Search class="w-4 h-4 text-slate-500" />
						</div>
						<span class="text-[15px] font-black text-slate-800 dark:text-[#0f172b]">Rechercher une réponse</span>
					</div>
					<div class="relative group">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search class="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
						</div>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Ex: Comment enregistrer ma villa ?"
							class="w-full bg-white/60 dark:bg-white backdrop-blur-md border border-white/40 dark:border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-[13px] font-bold text-slate-800 dark:text-[#0f172b] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner placeholder:text-slate-400"
						/>
					</div>
				</div>

				<!-- ── Catégories fréquentes ── -->
				<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6">
					<p class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 pl-2">Catégories Fréquentes</p>
					<div class="space-y-3">
						<button
							v-for="cat in categories"
							:key="cat.label"
							class="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/30 dark:bg-white hover:bg-white/70 dark:hover:bg-slate-800/70 border border-transparent hover:border-white/60 dark:hover:border-slate-700/50 transition-all text-left group shadow-sm hover:shadow-md"
						>
							<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-inner transition-transform" :class="cat.bg">
								<component :is="cat.icon" class="w-4 h-4" :class="cat.color" />
							</div>
							<span class="text-[13px] font-bold text-slate-700 dark:text-[#0f172b] flex-1">{{ cat.label }}</span>
							<div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors">
								<svg class="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/>
								</svg>
							</div>
						</button>
					</div>
				</div>

				<!-- ── Contact téléphonique ── -->
				<div class="bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-black dark:to-slate-900 rounded-[32px] p-6 shadow-xl shadow-slate-900/20 relative overflow-hidden group transition-transform duration-500">
					<div class="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
					<div class="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
					
					<div class="relative z-10">
						<p class="text-[11px] font-black text-indigo-300 uppercase tracking-widest mb-1.5">Assistance Immédiate</p>
						<p class="text-[13px] font-medium text-slate-400 mb-5">Appelez notre Service Client</p>
						
						<div class="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-inner">
							<div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 transition-transform shadow-lg">
								<Phone class="w-5 h-5 text-indigo-400" />
							</div>
							<span class="text-xl font-black text-white tracking-tight">+237 600 000 000</span>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- ── Ressources du bas de page ── -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
			<div
				v-for="resource in resources"
				:key="resource.title"
				class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group"
			>
				<div class="w-14 h-14 bg-white/60 dark:bg-slate-50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/40 dark:border-slate-300 shadow-inner transition-colors duration-500" :class="resource.hover">
					<component :is="resource.icon" class="w-6 h-6 text-slate-500 dark:text-slate-600 transition-colors duration-500" />
				</div>
				<p class="text-[15px] font-black text-slate-800 dark:text-[#0f172b] mb-2">{{ resource.title }}</p>
				<p class="text-[13px] font-medium text-slate-500 dark:text-slate-600 leading-relaxed px-2">{{ resource.desc }}</p>
			</div>
		</div>

	</div>
</template>

<style scoped>
.animate-pulse-slow {
	animation: pulseBg 6s ease-in-out infinite;
}
@keyframes pulseBg {
	0%, 100% { opacity: 0.2; }
	50% { opacity: 0.4; }
}
</style>
