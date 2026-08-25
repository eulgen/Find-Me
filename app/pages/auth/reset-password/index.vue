<!--
  @file app/pages/auth/reset-password/index.vue
  @description Page de réinitialisation du mot de passe par OTP — Design premium findMe.
-->

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { KeyRound, Mail, Eye, EyeOff, Lock, ArrowLeft, CheckCircle, CircleCheck } from "lucide-vue-next";
import { useAuth } from "~/composables/useAuth";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";

definePageMeta({
	layout: "auth",
});

const route = useRoute();
const { handleResetPassword, isAuthSubmitLoading, authEmail } = useAuth();

const email = ref<string>("");
const otpCode = ref<string>("");
const newPassword = ref<string>("");
const showPassword = ref<boolean>(false);
const isSuccess = ref<boolean>(false);

onMounted(() => {
	if (route.query.email) {
		email.value = String(route.query.email);
	} else if (authEmail.value) {
		email.value = authEmail.value;
	}
	if (route.query.code) {
		otpCode.value = String(route.query.code);
	} else if (route.query.otp) {
		otpCode.value = String(route.query.otp);
	}
});

// Indicateurs en temps réel du mot de passe
const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value));
const hasNumber = computed(() => /[0-9]/.test(newPassword.value));

const isFormValid = computed(() => {
	return (
		email.value.includes("@") &&
		otpCode.value.length >= 6 &&
		hasMinLength.value &&
		hasUppercase.value &&
		hasNumber.value
	);
});

const onSubmitReset = async () => {
	if (!isFormValid.value) return;
	const success = await handleResetPassword(email.value, otpCode.value, newPassword.value);
	if (success) {
		isSuccess.value = true;
		setTimeout(() => {
			navigateTo("/auth/signin");
		}, 2200);
	}
};
</script>

<template>
	<div class="flex flex-col justify-center w-full max-w-[400px] mx-auto h-full min-h-0 py-4">
		<!-- Logo -->
		<div class="flex items-center justify-center mb-6">
			<FindMeLogo size="140" class="cursor-pointer transition-all" @click="navigateTo('/')" />
		</div>

		<div class="w-full relative">
			<transition name="slide-fade" mode="out-in">
				<!-- ── FORMULAIRE RÉINITIALISATION ── -->
				<div v-if="!isSuccess" key="reset-form" class="space-y-5">
					<!-- En-tête -->
					<div class="text-center space-y-2">
						<div class="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mb-3 shadow-inner">
							<KeyRound class="w-7 h-7" />
						</div>
						<h1 class="text-2xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight leading-tight">
							Nouveau mot de passe
						</h1>
						<p class="text-xs text-slate-500 dark:text-slate-600 leading-relaxed font-medium">
							Saisissez le code OTP reçu par email et définissez votre nouveau mot de passe.
						</p>
					</div>

					<form @submit.prevent="onSubmitReset" class="space-y-4">
						<!-- Adresse email -->
						<div class="space-y-1.5 group">
							<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700">
								Adresse email
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
									<Mail class="w-4 h-4" />
								</span>
								<input
									type="email"
									required
									v-model="email"
									placeholder="exemple@email.com"
									class="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm"
								/>
							</div>
						</div>

						<!-- Code OTP -->
						<div class="space-y-1.5 group">
							<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700">
								Code de réinitialisation (OTP)
							</label>
							<input
								type="text"
								required
								maxlength="6"
								v-model="otpCode"
								placeholder="123456"
								class="w-full text-center tracking-[0.3em] text-xl font-black px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/80 dark:bg-white text-slate-900 dark:text-[#0f172b] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm"
							/>
						</div>

						<!-- Nouveau Mot de passe -->
						<div class="space-y-1.5 group">
							<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700">
								Nouveau mot de passe
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
									<Lock class="w-4 h-4" />
								</span>
								<input
									:type="showPassword ? 'text' : 'password'"
									required
									v-model="newPassword"
									placeholder="••••••••••••"
									class="w-full pl-11 pr-12 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm"
								/>
								<button
									type="button"
									@click="showPassword = !showPassword"
									class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
								>
									<Eye v-if="!showPassword" class="w-4 h-4" />
									<EyeOff v-else class="w-4 h-4" />
								</button>
							</div>
						</div>

						<!-- Critères de mot de passe -->
						<div class="p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl space-y-1.5 text-[11px]">
							<div class="flex items-center space-x-2" :class="hasMinLength ? 'text-emerald-600 font-bold' : 'text-slate-400'">
								<CircleCheck class="w-3.5 h-3.5 shrink-0" />
								<span>Au moins 8 caractères</span>
							</div>
							<div class="flex items-center space-x-2" :class="hasUppercase ? 'text-emerald-600 font-bold' : 'text-slate-400'">
								<CircleCheck class="w-3.5 h-3.5 shrink-0" />
								<span>Au moins une majuscule</span>
							</div>
							<div class="flex items-center space-x-2" :class="hasNumber ? 'text-emerald-600 font-bold' : 'text-slate-400'">
								<CircleCheck class="w-3.5 h-3.5 shrink-0" />
								<span>Au moins un chiffre</span>
							</div>
						</div>

						<!-- Bouton de soumission -->
						<button
							type="submit"
							:disabled="isAuthSubmitLoading || !isFormValid"
							class="group relative w-full h-12 mt-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white overflow-hidden transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-500 cursor-pointer active:scale-[0.98]"
						>
							<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-2">
								<CheckCircle class="w-5 h-5" />
								Mettre à jour le mot de passe
							</span>
							<span v-else class="relative z-10 flex items-center justify-center gap-2">
								<span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Enregistrement...
							</span>
						</button>
					</form>

					<!-- Navigation -->
					<div class="pt-2 text-center">
						<NuxtLink
							to="/auth/signin"
							class="inline-flex items-center space-x-1.5 font-bold text-xs text-slate-500 hover:text-emerald-600 transition-colors"
						>
							<ArrowLeft class="w-3.5 h-3.5" />
							<span>Retour à la connexion</span>
						</NuxtLink>
					</div>
				</div>

				<!-- ── ÉCRAN DE SUCCÈS ── -->
				<div v-else key="reset-success" class="text-center space-y-6 py-6">
					<div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
						<CheckCircle class="w-10 h-10 text-white" />
					</div>
					<div class="space-y-2">
						<h2 class="text-2xl font-black text-slate-900 dark:text-[#0f172b]">Mot de passe mis à jour !</h2>
						<p class="text-xs text-slate-500 dark:text-slate-600 font-medium">
							Votre nouveau mot de passe a été enregistré avec succès. Redirection vers la connexion...
						</p>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
	opacity: 0;
	transform: translateX(20px);
}
.slide-fade-leave-to {
	opacity: 0;
	transform: translateX(-20px);
}
</style>
