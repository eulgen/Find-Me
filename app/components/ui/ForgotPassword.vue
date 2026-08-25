<!--
  @file ForgotPassword.vue
  @description Composant dédié à la réinitialisation de mot de passe — Design éditorial Gainlove.
-->

<script setup lang="ts">
import {
	ArrowLeft,
	Key,
	Mail,
	Send,
	CheckCircle2,
} from "lucide-vue-next";
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
	<div class="h-full relative overflow-hidden font-sans flex flex-col justify-center my-auto" id="forgot-password-component-root">
		<div class="space-y-3" id="forgot-step-email">
			
			<!-- En-tête -->
			<div class="space-y-1 text-center" id="forgot-email-header">
				<button
					@click="emit('cancel')"
					class="group inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-emerald-600 font-bold transition-all duration-300 cursor-pointer mb-1"
				>
					<ArrowLeft class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
					<span>Retour à la connexion</span>
				</button>

				<div
					class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 mb-1"
				>
					<Key class="w-6 h-6" />
				</div>

				<h3
					class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-tight"
				>
					Récupérer mon compte
				</h3>

				<p
					class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight font-medium max-w-xs mx-auto"
				>
					Saisissez l'adresse mail liée à votre espace findMe pour recevoir votre lien de réinitialisation.
				</p>
			</div>

			<!-- Message de confirmation si l'e-mail a été envoyé -->
			<div
				v-if="isEmailSent"
				class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1 text-slate-700 dark:text-emerald-200 text-left animate-fadeIn"
			>
				<div class="flex items-center gap-2 font-black text-emerald-800 dark:text-emerald-400 text-xs">
					<CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
					<span>E-mail envoyé avec succès !</span>
				</div>
				<p class="text-[11px] leading-relaxed font-medium">
					Un lien a été envoyé à <strong class="underline decoration-emerald-500">{{ email }}</strong>. Veuillez ouvrir vos mails et cliquer sur le lien pour procéder.
				</p>
			</div>

			<form
				@submit.prevent="handleSendRecoveryLink"
				class="space-y-3"
				id="forgot-email-form"
			>
				<div class="space-y-0.5 text-left group" id="forgot-email-form-group">
					<label
						class="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-[0.1em]"
					>
						Adresse email
					</label>
					<div class="relative">
						<span
							class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"
						>
							<Mail class="w-3.5 h-3.5" />
						</span>
						<input
							type="email"
							required
							class="w-full text-xs pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs outline-none"
							placeholder="exemple@email.com"
							v-model="email"
						/>
					</div>
				</div>

				<button
					type="submit"
					:disabled="isRecoveryLoading"
					class="group relative w-full h-11 flex items-center justify-center gap-1.5 rounded-full text-xs font-black uppercase tracking-[0.12em] text-white bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
				>
					<Send v-if="!isRecoveryLoading" class="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
					<div v-else class="w-3.5 h-3.5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin relative z-10"></div>
					<span class="relative z-10">{{ isEmailSent ? 'Renvoyer le lien' : 'Envoyer le lien de récupération' }}</span>
				</button>
			</form>
		</div>
	</div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
