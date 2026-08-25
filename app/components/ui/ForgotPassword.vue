<!--
  @file ForgotPassword.vue
  @description Composant dédié à la réinitialisation de mot de passe sécurisée findMe Cameroun.
-->

<script setup lang="ts">
import {
	ArrowLeft,
	Key,
	Mail,
	Send,
	CheckCircle2,
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

const {
	email,
	isEmailSent,
	isRecoveryLoading,
	handleSendRecoveryLink,
} = useForgotPassword(props.initialEmail, (payload) =>
	emit("success", payload),
);
</script>

<template>
	<div class="h-full relative overflow-hidden" id="forgot-password-component-root">
		<div class="space-y-6" id="forgot-step-email">
			<div class="space-y-3" id="forgot-email-header">
				<button
					@click="emit('cancel')"
					class="group inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 font-bold transition-all duration-300 cursor-pointer mb-2"
				>
					<ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
					<span>Retour à la connexion</span>
				</button>

				<div
					class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center mb-4 transform transition-transform"
				>
					<Key class="w-7 h-7 text-white" />
				</div>

				<h3
					class="text-3xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight leading-none"
				>
					Récupérer mon compte
				</h3>

				<p
					class="text-sm text-slate-500 dark:text-slate-600 leading-relaxed font-medium"
				>
					Saisissez l'adresse mail liée à votre espace findMe pour recevoir
					votre lien de réinitialisation.
				</p>
			</div>

			<!-- Message de confirmation si l'e-mail a été envoyé -->
			<div
				v-if="isEmailSent"
				class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 space-y-2 text-slate-700 dark:text-emerald-200 animate-fadeIn"
			>
				<div class="flex items-center gap-2.5 font-black text-emerald-800 dark:text-emerald-400 text-sm">
					<CheckCircle2 class="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
					<span>E-mail envoyé avec succès !</span>
				</div>
				<p class="text-xs leading-relaxed font-medium">
					Un lien de modification de mot de passe a été envoyé à <strong class="underline decoration-emerald-500">{{ email }}</strong>. Veuillez ouvrir vos mails et cliquer sur le lien pour procéder.
				</p>
			</div>

			<form
				@submit.prevent="handleSendRecoveryLink"
				class="space-y-5"
				id="forgot-email-form"
			>
				<div class="space-y-2 group" id="forgot-email-form-group">
					<label
						class="text-[11px] font-black uppercase text-slate-700 dark:text-slate-700 tracking-[0.1em] transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400"
					>
						Adresse de messagerie (Email)
					</label>
					<div class="relative">
						<span
							class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500"
						>
							<Mail class="w-5 h-5 text-slate-400 dark:text-slate-500" />
						</span>
						<input
							type="email"
							required
							class="w-full text-sm pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/50 dark:bg-white text-slate-900 dark:text-[#0f172b] font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 shadow-sm outline-none backdrop-blur-sm"
							placeholder="takam@exemple.com"
							v-model="email"
						/>
					</div>
				</div>

				<button
					type="submit"
					:disabled="isRecoveryLoading"
					class="group relative w-full h-14 flex items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-500 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:translate-y-0 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
				>
					<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					<Send v-if="!isRecoveryLoading" class="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
					<div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
					<span class="relative z-10">{{ isEmailSent ? 'Renvoyer le lien' : 'Envoyer le lien de récupération' }}</span>
				</button>
			</form>
		</div>
	</div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-enter-from {
  transform: translateY(15px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}
</style>
