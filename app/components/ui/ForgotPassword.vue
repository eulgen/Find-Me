<!--
  @file ForgotPassword.vue
  @description Composant dédié à la réinitialisation de mot de passe sécurisée findMe Cameroun.
-->

<script setup lang="ts">
	import { ref } from "vue";
	import {
		ArrowLeft,
		Key,
		Lock,
		Mail,
		Send,
		CheckCircle,
		Eye,
		EyeOff,
		CircleCheck,
	} from "lucide-vue-next";
	import ButtonUI from "./ButtonUI.vue";
	import { useForgotPassword } from "#imports";

	const props = defineProps({
		initialEmail: {
			type: String,
			default: "",
		},
	});

	const emit = defineEmits(["cancel", "success"]);

	const showPassword = ref<boolean>(false);

	const {
		email,
		step,
		isRecoveryLoading,
		newPassword,
		hasMinLength,
		hasUppercase,
		hasNumber,
		handleSendRecoveryLink,
		handleResetSubmit,
	} = useForgotPassword(props.initialEmail, (payload) =>
		emit("success", payload),
	);


</script>

<template>
	<div class="space-y-6 h-full" id="forgot-password-component-root">
		<!-- 1. ÉCRAN SAISIE EMAIL OU DÉMARRAGE DE RÉCUPÉRATION -->
		<div v-if="step === 'email'" class="space-y-6" id="forgot-step-email">
			<div class="space-y-2" id="forgot-email-header">
				<button
					@click="emit('cancel')"
					class="inline-flex items-center space-x-1.5 text-xs text-[#1A237E]/60 dark:text-gray-400 hover:text-[#1A237E] font-bold transition-colors cursor-pointer mb-2"
				>
					<ArrowLeft class="w-3.5 h-3.5" />
					<span>Retour à la connexion</span>
				</button>

				<div
					class="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center mb-2"
				>
					<Key class="w-7 h-7 text-amber-500" />
				</div>

				<h3
					class="text-2xl font-black text-[#1A237E] dark:text-white tracking-tight leading-none"
				>
					Récupérer mon compte
				</h3>

				<p
					class="text-xs text-[#1A237E]/75 dark:text-gray-300 leading-relaxed font-semibold"
				>
					Saisissez l'adresse mail liée à votre espace findMe pour recevoir
					votre lien de restauration immédiat.
				</p>
			</div>

			<form
				@submit="handleSendRecoveryLink"
				class="space-y-4"
				id="forgot-email-form"
			>
				<div class="space-y-1.5" id="forgot-email-form-group">
					<label
						class="text-[10px] font-black uppercase text-[#1A237E]/80 dark:text-gray-300 tracking-wider"
					>
						Adresse de messagerie (Email)
					</label>
					<div class="relative">
						<span
							class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
						>
							<Mail class="w-4 h-4 text-gray-400" />
						</span>
						<input
							type="text"
							required
							class="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white dark:bg-slate-900 text-[#1A237E] dark:text-white font-extrabold focus:border-[#2E7D32] focus:outline-none transition-colors shadow-sm"
							placeholder="takam@exemple.com"
							v-model="email"
						/>
					</div>
				</div>

				<ButtonUI
					type="submit"
					variant="primary"
					:loading="isRecoveryLoading"
					:disabled="isRecoveryLoading"
					:icon="Send"
					class="w-full h-12 text-sm uppercase tracking-wider font-extrabold mt-3 shadow-md"
					id="forgot-email-submit-btn"
				>
					<span>Envoyer le lien de récupération</span>
				</ButtonUI>
			</form>
		</div>

		<!-- 2. ÉCRAN CONFIGURATION NOUVEAU MOT DE PASSE -->
		<div v-else class="space-y-6" id="forgot-step-reset">
			<div class="space-y-2" id="forgot-reset-header">
				<button
					@click="step = 'email'"
					class="inline-flex items-center space-x-1.5 text-xs text-[#1A237E]/60 dark:text-gray-400 hover:text-[#1A237E] font-bold transition-colors cursor-pointer mb-2"
				>
					<ArrowLeft class="w-3.5 h-3.5" />
					<span>Changer l'adresse e-mail</span>
				</button>

				<div
					class="w-12 h-12 rounded-2xl bg-[#2E7D32]/10 border-2 border-[#2E7D32]/20 flex items-center justify-center mb-2"
				>
					<Lock class="w-7 h-7 text-[#2E7D32]" />
				</div>

				<h3
					class="text-2xl font-black text-[#1A237E] dark:text-white tracking-tight leading-none"
				>
					Réinitialisation sécurisée
				</h3>

				<p
					class="text-xs text-[#1A237E]/75 dark:text-gray-300 leading-relaxed font-semibold"
				>
					Configurez immédiatement le nouveau mot de passe pour
					<span class="text-[#2E7D32] dark:text-emerald-400 font-extrabold">{{
						email
					}}</span
					>.
				</p>
			</div>

			<form
				@submit="handleResetSubmit"
				class="space-y-4"
				id="forgot-reset-form"
			>
				<!-- Champ nouveau mot de passe -->
				<div class="space-y-1.5" id="forgot-reset-password-group">
					<label
						class="text-[10px] font-black uppercase text-[#1A237E]/80 dark:text-gray-300 tracking-wider"
					>
						Nouveau mot de passe
					</label>
					<div class="relative">
						<span
							class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
						>
							<Lock class="w-4 h-4 text-gray-400" />
						</span>
						<div>
							<input
								:type="showPassword ? 'text' : 'password'"
								required
								class="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white dark:bg-slate-900 text-[#1A237E] dark:text-white font-extrabold focus:border-[#2E7D32] focus:outline-none transition-colors shadow-sm"
								placeholder="••••••••"
								v-model="newPassword"
							/>
							<button
								type="button"
								class="absolute inset-y-0 right-4 flex items-center justify-center text-[#1A237E]/50 hover:text-[#1A237E] dark:text-slate-400 dark:hover:text-white focus:outline-none cursor-pointer"
								@click="showPassword = !showPassword"
								aria-label="Afficher ou masquer le mot de passe"
								id="toggle-password-visibility-btn"
							>
								<Eye v-if="!showPassword" class="w-4 h-4" />
								<EyeOff v-else class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				<!-- Critères de validation visuelle -->
				<div
					class="pt-1.5 space-y-1 text-[10px]"
					id="password-strength-indicators"
				>
					<div class="flex items-center space-x-1.5">
						<div
							class="transition-colors font-bold flex items-center gap-2"
							:class="
								hasMinLength
									? 'text-emerald-600 dark:text-emerald-400'
									: 'text-[#1A237E]/75 dark:text-slate-500'
							"
						>
							<CircleCheck class="w-4 h-4" v-if="hasMinLength" />
							<!-- <CircleDot class="w-4 h-4" v-else /> -->
							<span>Minimum 8 caractères</span>
						</div>
					</div>
					<div class="flex items-center space-x-1.5">
						<div
							class="transition-colors font-bold flex items-center gap-2"
							:class="
								hasUppercase
									? 'text-emerald-600 dark:text-emerald-400'
									: 'text-[#1A237E]/75 dark:text-slate-500'
							"
						>
							<CircleCheck class="w-4 h-4" v-if="hasUppercase" />
							<!-- <CircleDot class="w-4 h-4" v-else /> -->
							<span>Au moins une lettre majuscule (A-Z)</span>
						</div>
					</div>
					<div class="flex items-center space-x-1.5">
						<div
							class="transition-colors font-bold flex items-center gap-2"
							:class="
								hasNumber
									? 'text-emerald-600 dark:text-emerald-400'
									: 'text-[#1A237E]/75 dark:text-slate-500'
							"
						>
							<CircleCheck class="w-4 h-4" v-if="hasNumber" />
							<!-- <CircleDot class="w-4 h-4" v-else /> -->
							<span>Au moins un chiffre (0-9)</span>
						</div>
					</div>
				</div>

				<ButtonUI
					type="submit"
					variant="primary"
					:loading="isRecoveryLoading"
					:disabled="isRecoveryLoading"
					:icon="CheckCircle"
					class="w-full h-12 text-sm uppercase tracking-wider font-extrabold mt-3 shadow-md"
					id="forgot-reset-submit-btn"
				>
					<span>Enregistrer le mot de passe</span>
				</ButtonUI>
			</form>
		</div>
	</div>
</template>
