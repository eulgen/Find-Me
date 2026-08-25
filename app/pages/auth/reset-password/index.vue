<!--
  @file app/pages/auth/reset-password/index.vue
  @description Page de réinitialisation du mot de passe par OTP — Design éditorial Gainlove, ultra-compact (100vh).
-->

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { KeyRound, Mail, Eye, EyeOff, Lock, ArrowLeft, CheckCircle, CircleCheck } from "lucide-vue-next";
import { useAuth } from "~/composables/useAuth";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";
import ThemeToggle from "~/components/ui/ThemeToggle.vue";

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
	<div class="flex flex-col justify-between w-full max-w-[390px] mx-auto h-full max-h-screen py-2 font-sans overflow-hidden">
		
		<!-- Logo -->
		<div class="flex-shrink-0 flex items-center justify-between w-full px-2">
			<div class="w-10"></div>
			<FindMeLogo size="130" class="mx-auto cursor-pointer transition-all hover:scale-105" @click="navigateTo('/')" />
			<ThemeToggle />
		</div>

		<div class="w-full relative flex-1 flex flex-col justify-center my-auto">
			<transition name="slide-fade" mode="out-in">
				<!-- ── FORMULAIRE RÉINITIALISATION ── -->
				<div v-if="!isSuccess" key="reset-form" class="space-y-2.5 w-full">
					
					<!-- En-tête Éditorial -->
					<div class="text-center space-y-0.5">
						<div class="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
							<KeyRound class="w-6 h-6" />
						</div>
						<h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-tight">
							Nouveau mot de passe
						</h1>
						<p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
							Entrez votre code OTP et choisissez un nouveau mot de passe.
						</p>
					</div>

					<form @submit.prevent="onSubmitReset" class="space-y-2">
						<!-- Adresse email -->
						<div class="space-y-0.5 group">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Adresse email
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<Mail class="w-3.5 h-3.5" />
								</span>
								<input
									type="email"
									required
									v-model="email"
									placeholder="exemple@email.com"
									class="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
								/>
							</div>
						</div>

						<!-- Code OTP -->
						<div class="space-y-0.5 group">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Code OTP reçu par email
							</label>
							<input
								type="text"
								required
								maxlength="6"
								v-model="otpCode"
								placeholder="123456"
								class="w-full text-center tracking-[0.25em] text-lg font-black px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
							/>
						</div>

						<!-- Nouveau Mot de passe -->
						<div class="space-y-0.5 group">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Nouveau mot de passe
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<Lock class="w-3.5 h-3.5" />
								</span>
								<input
									:type="showPassword ? 'text' : 'password'"
									required
									v-model="newPassword"
									placeholder="••••••••••••"
									class="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
								/>
								<button
									type="button"
									@click="showPassword = !showPassword"
									class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
								>
									<Eye v-if="!showPassword" class="w-3.5 h-3.5" />
									<EyeOff v-else class="w-3.5 h-3.5" />
								</button>
							</div>
						</div>

						<!-- Critères de mot de passe -->
						<div class="pt-0.5 flex items-center justify-between text-[9px]">
							<div class="flex items-center space-x-1 font-bold transition-colors" :class="hasMinLength ? 'text-emerald-600' : 'text-slate-400'">
								<CircleCheck class="w-3 h-3" />
								<span>8+ carac.</span>
							</div>
							<div class="flex items-center space-x-1 font-bold transition-colors" :class="hasUppercase ? 'text-emerald-600' : 'text-slate-400'">
								<CircleCheck class="w-3 h-3" />
								<span>Majuscule</span>
							</div>
							<div class="flex items-center space-x-1 font-bold transition-colors" :class="hasNumber ? 'text-emerald-600' : 'text-slate-400'">
								<CircleCheck class="w-3 h-3" />
								<span>Chiffre</span>
							</div>
						</div>

						<!-- Bouton de soumission -->
						<button
							type="submit"
							:disabled="isAuthSubmitLoading || !isFormValid"
							class="group relative w-full h-11 mt-1 rounded-full font-black text-xs uppercase tracking-[0.12em] text-white overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800"
						>
							<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-1.5">
								<CheckCircle class="w-4 h-4 text-emerald-400 dark:text-slate-950" />
								Mettre à jour
							</span>
							<span v-else class="relative z-10 flex items-center justify-center gap-2">
								<span class="w-3.5 h-3.5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
								Enregistrement...
							</span>
						</button>
					</form>

					<!-- Navigation -->
					<div class="pt-1 text-center">
						<NuxtLink
							to="/auth/signin"
							class="inline-flex items-center space-x-1 font-bold text-xs text-slate-500 hover:text-emerald-600 transition-colors"
						>
							<ArrowLeft class="w-3.5 h-3.5" />
							<span>Retour à la connexion</span>
						</NuxtLink>
					</div>
				</div>

				<!-- ── ÉCRAN DE SUCCÈS ── -->
				<div v-else key="reset-success" class="text-center space-y-4 py-4 my-auto">
					<div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
						<CheckCircle class="w-8 h-8 text-white" />
					</div>
					<div class="space-y-1">
						<h2 class="text-2xl font-black text-slate-900 dark:text-white font-serif">Mot de passe mis à jour !</h2>
						<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
							Redirection vers la connexion...
						</p>
					</div>
				</div>
			</transition>
		</div>

		<div class="flex-shrink-0"></div>
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
	opacity: 0;
	transform: translateX(10px);
}
.slide-fade-leave-to {
	opacity: 0;
	transform: translateX(-10px);
}
</style>
