<!--
  @file ContactSupport.vue
  @description Composant de formulaire de Support Client pour findMe Cameroun.
  Permet aux citoyens de contacter l'assistance ou de signaler un problème technique.
-->

<script setup lang="ts">
	import {
		Send,
		CheckCircle,
		AlertCircle,
		User,
		Mail,
		MessageSquare,
		LifeBuoy,
		Ghost,
		Bug,
	} from "lucide-vue-next";
	import ButtonUI from "./ButtonUI.vue";
	import { useContactSupport } from "~/composables/useContactSupport";

	const {
		name,
		email,
		message,
		category,
		isSubmitting,
		submitSuccess,
		errorFeedback,
		ticketInfo,
		nameTouched,
		emailTouched,
		messageTouched,
		isNameValid,
		isEmailValid,
		isMessageValid,
		isFormValid,
		handleCategorySelect,
		submitSupportMessage,
		resetAfterSuccess,
	} = useContactSupport();
</script>

<template>
	<section
		class="py-24 px-6 bg-[#F7F6FF] dark:bg-[#0C0F1C] relative overflow-hidden"
		id="contact-support-section"
	>
		<!-- Décor fond -->
		<div class="absolute inset-0 pointer-events-none" aria-hidden="true">
			<div
				class="absolute top-0 left-0 right-0 h-px"
				style="background: linear-gradient(90deg, transparent, #1A237E 40%, #2E7D32 60%, transparent)"
			/>
			<div
				class="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.04]"
				style="background: radial-gradient(circle, #2E7D32, transparent 70%)"
			/>
		</div>

		<div class="relative max-w-4xl mx-auto" id="support-inner-box">

			<!-- En-tête -->
			<div class="text-center mb-10" id="support-meta-block">
				<span
					class="inline-flex items-center gap-2 bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
					Support Client
				</span>
				<h2
					class="text-3xl md:text-4xl font-black text-[#1A237E] dark:text-white tracking-tight leading-tight"
					id="support-title"
				>
					Comment pouvons-nous vous aider ?
				</h2>
			</div>

			<!-- Carte principale -->
			<div
				class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm transition-colors relative"
				id="support-form-card"
			>
				<!-- Success State View -->
				<div
					v-if="submitSuccess"
					class="text-center py-8 space-y-6 animate-fade-in"
					id="support-success-view"
				>
					<div
						class="w-20 h-20 bg-emerald-50 dark:bg-slate-950 border-4 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#2E7D32]"
					>
						<CheckCircle class="w-10 h-10 text-emerald-500" />
					</div>

					<div class="space-y-3">
						<h3
							class="text-2xl font-black text-[#1A237E] dark:text-white"
							id="success-message-header"
						>
							Votre demande a été reçue !
						</h3>
						<p
							class="text-xs text-slate-500 dark:text-gray-400 font-bold max-w-md mx-auto"
						>
							Merci, <span class="text-[#2E7D32]">{{ ticketInfo?.name }}</span
							>. Notre support analyse le signalement sous 2h ouvrées. Un e-mail
							de suivi vous a été envoyé.
						</p>
					</div>

					<!-- Ticket Summary Details Box -->
					<div
						v-if="ticketInfo"
						class="bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-[#1A237E]/20 rounded-2xl p-5 text-left text-xs max-w-md mx-auto space-y-2 font-mono"
						id="support-success-ticket-box"
					>
						<div
							class="flex justify-between border-b pb-2 border-slate-200 dark:border-slate-800"
						>
							<span class="text-slate-400 font-bold">TICKET ID:</span>
							<span class="text-[#1A237E] dark:text-emerald-400 font-black">{{
								ticketInfo.id
							}}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-slate-400 font-bold">CATÉGORIE:</span>
							<span
								class="font-black uppercase text-slate-700 dark:text-slate-300"
							>
								{{
									ticketInfo.category === "assistance"
										? "Demande d'Assistance 🇨🇲"
										: "Problème Technique 🛠️"
								}}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-slate-400 font-bold">DATE:</span>
							<span class="font-bold text-slate-600 dark:text-slate-300">{{
								ticketInfo.createdAt
							}}</span>
						</div>
						<div
							class="pt-2 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 break-words leading-relaxed font-sans font-medium italic"
						>
							"{{ ticketInfo.message }}"
						</div>
					</div>

					<div class="pt-4">
						<button
							type="button"
							@click="resetAfterSuccess"
							class="inline-flex items-center space-x-2 bg-[#1A237E] hover:bg-[#0d123f] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
							id="support-success-reset-btn"
						>
							<span>Envoyer une autre demande</span>
						</button>
					</div>
				</div>

				<!-- Form State View -->
				<form
					v-else
					@submit.prevent="submitSupportMessage"
					class="space-y-8"
					id="support-contact-form"
				>
					<!-- TYPE DE DEMANDE (CATEGORY) -->
					<div class="space-y-2" id="support-category-selection">
						<label for="support-category" class="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
							Objet de votre demande <span class="text-rose-500">*</span>
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
								<LifeBuoy class="h-4.5 w-4.5 text-slate-400" />
							</div>
							<select
								id="support-category"
								v-model="category"
								class="w-full text-[13px] pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
								:class="category ? 'focus:border-[#2E7D32] focus:ring-[#2E7D32]/20' : 'focus:border-[#2E7D32] focus:ring-[#2E7D32]/20 text-slate-500'"
								required
							>
								<option value="" disabled selected>Sélectionnez un motif...</option>
								<option value="assistance" class="text-slate-800 dark:text-slate-200 font-semibold">Demande d'Assistance (Compte, Immatriculation)</option>
								<option value="technique" class="text-slate-800 dark:text-slate-200 font-semibold">Problème Technique (Bugs, Erreurs)</option>
							</select>
							<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
							</div>
						</div>
					</div>

					<!-- Fields Grid -->
					<div
						class="grid grid-cols-1 md:grid-cols-2 gap-6"
						id="support-fields-core-grid"
					>
						<!-- NOM COMPLET -->
						<div class="space-y-2" id="support-field-name-wrapper">
							<label
								for="support-name"
								class="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider"
							>
								Nom Complet <span class="text-rose-500">*</span>
							</label>
							<div class="relative">
								<div
									class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
								>
									<User class="h-4.5 w-4.5 text-slate-400" />
								</div>
								<input
									type="text"
									id="support-name"
									v-model="name"
									@blur="nameTouched = true"
									class="w-full text-[13px] pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm"
									:class="
										nameTouched && !isNameValid
											? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
											: 'focus:border-[#2E7D32] focus:ring-[#2E7D32]/20'
									"
									placeholder="Ex: Jean-Noël Essomba"
									required
								/>
							</div>
							<p
								v-if="nameTouched && !isNameValid"
								class="text-rose-600 text-[11px] font-bold mt-1"
								id="err-support-name"
							>
								Veuillez fournir un nom complet d'au moins 2 lettres.
							</p>
						</div>

						<!-- ADRESSE EMAIL -->
						<div class="space-y-2" id="support-field-email-wrapper">
							<label
								for="support-email"
								class="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider"
							>
								E-mail de Réaction <span class="text-rose-500">*</span>
							</label>
							<div class="relative">
								<div
									class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
								>
									<Mail class="h-4.5 w-4.5 text-slate-400" />
								</div>
								<input
									type="email"
									id="support-email"
									v-model="email"
									@blur="emailTouched = true"
									class="w-full text-[13px] pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm"
									:class="
										emailTouched && !isEmailValid
											? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
											: 'focus:border-[#2E7D32] focus:ring-[#2E7D32]/20'
									"
									placeholder="Ex: jean.essomba@gmail.com"
									required
								/>
							</div>
							<p
								v-if="emailTouched && !isEmailValid"
								class="text-rose-600 text-[10px] font-bold mt-1"
								id="err-support-email"
							>
								Veuillez saisir une adresse email valide.
							</p>
						</div>
					</div>

					<!-- DETAILED MESSAGE -->
					<div class="space-y-2 mt-6" id="support-field-msg-wrapper">
						<label
							for="support-message"
							class="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider"
						>
							Message d'Explication <span class="text-rose-500">*</span>
						</label>
						<div class="relative">
							<div
								class="absolute top-4 left-3.5 flex items-start pointer-events-none"
							>
								<MessageSquare class="h-4.5 w-4.5 text-slate-400" />
							</div>
							<textarea
								id="support-message"
								v-model="message"
								@blur="messageTouched = true"
								rows="5"
								class="w-full text-[13px] pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm resize-none"
								:class="
									messageTouched && !isMessageValid
										? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
										: 'focus:border-[#2E7D32] focus:ring-[#2E7D32]/20'
								"
								placeholder="Décrivez votre demande en précisant votre quartier d'immatriculation ou les symptômes du problème technique..."
								required
							></textarea>
						</div>
						<div
							class="flex justify-between items-center text-[10px] font-bold mt-1"
						>
							<p
								v-if="messageTouched && !isMessageValid"
								class="text-rose-600"
								id="err-support-message"
							>
								Veuillez écrire un descriptif d'au moins 15 caractères.
							</p>
							<div v-else />
							<span
								:class="isMessageValid ? 'text-emerald-600' : 'text-slate-400'"
								class="ml-auto"
								id="support-char-indicator"
							>
								{{ message.trim().length }} / 15+ caractères
							</span>
						</div>
					</div>

					<!-- Error Alert Banner -->
					<div
						v-if="errorFeedback"
						class="bg-rose-50 dark:bg-rose-950/20 border-3 border-rose-500 rounded-xl p-4 flex items-center space-x-3 text-rose-600 dark:text-rose-450 animate-shake"
						id="support-error-banner"
					>
						<AlertCircle class="w-5 h-5 shrink-0" />
						<span class="text-xs font-extrabold">{{ errorFeedback }}</span>
					</div>

					<!-- Submit Button -->
					<div class="pt-6 flex justify-end" id="support-submit-container">
						<button
							type="submit"
							:disabled="isSubmitting || !isFormValid"
							class="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#256c28] disabled:bg-slate-300 disabled:cursor-not-allowed text-white uppercase tracking-widest text-xs font-black shadow-md px-10 rounded-xl transition-all select-none"
							id="support-submit-btn"
						>
							<span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
							<Send v-else class="w-4 h-4" />
							<span>Envoyer ma demande</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</section>
</template>

<style scoped>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	.animate-shake {
		animation: shake 0.2s ease-in-out 0s 2;
	}
	.animate-fade-in {
		animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
