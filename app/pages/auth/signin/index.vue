<!--
  @file SignInPage.vue
  @description Page de connexion findMe — design premium, glassmorphism, mobile-first.
-->

<script setup lang="ts">
	import { ref, watch } from "vue";
	import {
		ShieldCheck,
		Check,
		Eye,
		EyeOff,
		ArrowLeft,
		MapPin,
		Users,
		CheckCircle,
	} from "lucide-vue-next";
	import { useAuth } from "~/composables/useAuth";
	import GoogleButtonUI from "~/components/ui/GoogleButtonUI.vue";
	import ButtonUI from "~/components/ui/ButtonUI.vue";
	import ICloudButtonUI from "~/components/ui/ICloudButtonUI.vue";
	import ForgotPassword from "~/components/ui/ForgotPassword.vue";
	import FindMeLogo from "~/components/ui/FindMeLogo.vue";

    definePageMeta({
        layout: 'auth'
    })

	const {
		authStep,
		authEmail,
		authPassword,
		googleUser,
		isAuthSubmitLoading,
		handleSimulatedClaim,
		currentUser,
	} = useAuth();

	// Redirect to user space upon successful login
	watch(currentUser, (newUser) => {
		if (newUser && authStep.value === "success") {
			setTimeout(() => {
				if (newUser.rule === "admin") {
					navigateTo("/admin");
				} else {
					navigateTo(`/users/${newUser.id}`);
				}
			}, 1200);
		}
	}, { immediate: true });

	const recoveryView = ref<"signin" | "forgot">("signin");
	const showPassword = ref<boolean>(false);

	const onRecoverySuccess = (userData: { email: string; password?: string }) => {
		if (userData.email) authEmail.value = userData.email;
		if (userData.password) authPassword.value = userData.password;
		recoveryView.value = "signin"; 
	};
</script>

<template>
	<div class="w-full max-w-[400px] mx-auto relative flex flex-col justify-center h-full min-h-0 py-4" id="signin-interactive-area">
		<FindMeLogo size="140" class="mb-4 mx-auto cursor-pointer transition-all" @click="navigateTo('/')" />
		<transition name="slide-fade" mode="out-in">

			<!-- ── ÉTAT LOGIN ── -->
			<div v-if="authStep === 'login' && recoveryView === 'signin'" key="login-form" class="w-full">
				<!-- En-tête -->
				<div class="mb-4 text-center" id="signin-header-texts">
					<h1 class="text-2xl font-black text-slate-900 dark:text-[#0f172b] leading-tight tracking-tight mb-1.5">
						Content de vous revoir
					</h1>
					<p class="text-xs text-slate-500 dark:text-slate-600 leading-relaxed font-medium">
						Connectez-vous pour accéder à vos adresses officielles findMe.
					</p>
				</div>

				<!-- Social auth -->
				<div id="social-auth-wrapper-signup" class="space-y-2 mb-5">
					<GoogleButtonUI />
					<ICloudButtonUI />
				</div>

				<!-- Séparateur -->
				<div class="flex items-center gap-4 mb-5" id="signin-divider-row">
					<div class="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
					<span class="text-[11px] text-slate-400 font-black uppercase tracking-widest">ou avec votre email</span>
					<div class="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
				</div>

				<!-- Formulaire -->
				<form @submit.prevent="handleSimulatedClaim" class="space-y-4" id="signin-form-body">
					<!-- Email -->
					<div class="space-y-2 group">
						<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
							Adresse email
						</label>
						<input
							type="email"
							required
							v-model="authEmail"
							placeholder="exemple@email.com"
							class="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 shadow-sm backdrop-blur-sm"
						/>
					</div>

					<!-- Mot de passe -->
					<div class="space-y-2 group">
						<label class="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
							<span>Mot de passe</span>
							<button
								type="button"
								@click="recoveryView = 'forgot'"
								class="normal-case tracking-normal hover:cursor-pointer hover:underline text-emerald-600 dark:text-[#0f172b] hover:text-emerald-700 dark:hover:text-emerald-300 font-bold transition-colors"
							>
								Oublié ?
							</button>
						</label>
						<div class="relative">
							<input
								:type="showPassword ? 'text' : 'password'"
								required
								v-model="authPassword"
								placeholder="••••••••••"
								class="w-full px-4 py-2.5 pr-12 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 shadow-sm backdrop-blur-sm"
							/>
							<button
								type="button"
								@click="showPassword = !showPassword"
								class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
							>
								<Eye v-if="!showPassword" class="w-4 h-4" />
								<EyeOff v-else class="w-4 h-4" />
							</button>
						</div>
					</div>

					<!-- Bouton submit -->
					<button
						type="submit"
						:disabled="isAuthSubmitLoading"
						class="group relative w-full h-12 mt-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white overflow-hidden transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-500"
					>
						<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-2">
							<CheckCircle class="w-5 h-5" />
							Se Connecter
						</span>
						<span v-else class="relative z-10 flex items-center justify-center gap-2">
							<span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Connexion...
						</span>
					</button>
				</form>

				<!-- Lien inscription -->
				<p class="text-center text-sm font-medium text-slate-500 dark:text-slate-600 mt-6">
					Nouveau sur findMe ?
					<NuxtLink to="/auth/signup" class="text-emerald-600 dark:text-[#0f172b] font-black hover:text-emerald-700 dark:hover:text-emerald-300 ml-1 transition-colors underline decoration-2 decoration-emerald-500/30 hover:decoration-emerald-500 underline-offset-4">
						Créer un compte
					</NuxtLink>
				</p>
			</div>

			<!-- ── MOT DE PASSE OUBLIÉ ── -->
			<div v-else-if="authStep === 'login' && recoveryView === 'forgot'" key="forgot-password" class="w-full">
				<ForgotPassword
					:initialEmail="authEmail"
					@cancel="recoveryView = 'signin'"
					@success="onRecoverySuccess"
				/>
			</div>

			<!-- ── SUCCÈS ── -->
			<div v-else key="success-screen" class="text-center space-y-8 py-10 flex flex-col items-center justify-center h-full w-full">
				<div class="relative w-28 h-28 flex items-center justify-center mx-auto">
					<div class="absolute inset-0 rounded-full bg-emerald-500 shadow-2xl shadow-emerald-500/40 animate-success-pop" />
					<div class="absolute inset-0 rounded-full border-4 border-emerald-400/40 animate-ping-slow" />
					<Check class="w-14 h-14 text-white relative z-10" />
				</div>
				<div class="space-y-3">
					<h2 class="text-3xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight">Connexion réussie !</h2>
					<p class="text-base text-slate-500 dark:text-slate-600 font-medium">
						Ravi de vous revoir,
						<span class="text-emerald-600 dark:text-[#0f172b] font-bold block mt-1 text-lg">{{ authEmail || "Citoyen findMe" }}</span>
					</p>
					<div v-if="googleUser" class="inline-flex items-center gap-2 bg-[#4285F4]/10 text-[#4285F4] text-[11px] font-black uppercase tracking-wider px-5 py-2 rounded-full border border-[#4285F4]/20 mt-4 shadow-sm mx-auto">
						<span class="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
						Authentifié via Google
					</div>
				</div>
			</div>

		</transition>
	</div>
</template>

<style scoped>
/* ── Transitions formulaires ── */
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
	position: absolute;
}

/* ── Success animation ── */
@keyframes successPop {
	65% { opacity: 1; }
	100% { opacity: 1; }
}
.animate-success-pop { animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

.animate-ping-slow {
	animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse-slow {
	animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
