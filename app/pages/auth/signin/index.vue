<!--
  @file SignInPage.vue
  @description Page de connexion findMe — Design ultra-compact tenant sur 100vh sans scroll.
-->

<script setup lang="ts">
	import { ref, watch, onMounted } from "vue";
	import {
		CheckCircle,
		Check,
		Eye,
		EyeOff,
		Lock
	} from "lucide-vue-next";
	import { useAuth, redirectBasedOnRole } from "~/composables/useAuth";
	import GoogleButtonUI from "~/components/ui/GoogleButtonUI.vue";
	import ICloudButtonUI from "~/components/ui/ICloudButtonUI.vue";
	import ForgotPassword from "~/components/ui/ForgotPassword.vue";
	import FindMeLogo from "~/components/ui/FindMeLogo.vue";

    definePageMeta({
        layout: 'auth'
    })

	const {
		authStep,
		authMode,
		authEmail,
		authPassword,
		googleUser,
		isAuthSubmitLoading,
		handleSignIn,
		currentUser,
		resetAuth,
	} = useAuth();

	onMounted(() => {
		resetAuth();
		authMode.value = "signin";
	});

	// Redirect to appropriate space upon successful login
	watch(currentUser, (newUser) => {
		if (newUser && authStep.value === "success") {
			setTimeout(() => {
				redirectBasedOnRole(newUser);
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
	<div class="flex flex-col justify-between w-full max-w-[390px] mx-auto h-full max-h-screen py-2 font-sans overflow-hidden" id="signin-interactive-area">
		
		<!-- Header Logo -->
		<div class="flex-shrink-0 text-center">
			<FindMeLogo size="140" class="mx-auto cursor-pointer transition-all hover:scale-105" @click="navigateTo('/')" />
		</div>

		<transition name="slide-fade" mode="out-in">

			<!-- ── ÉTAT LOGIN ── -->
			<div v-if="authStep === 'login' && recoveryView === 'signin'" key="login-form" class="w-full space-y-2.5 flex-1 flex flex-col justify-center my-auto">
				
				<!-- En-tête Éditorial -->
				<div class="text-center space-y-0.5" id="signin-header-texts">
					<h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-tight">
						Content de vous revoir
					</h1>
					<p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
						Connectez-vous pour accéder à vos adresses officielles.
					</p>
				</div>

				<!-- Social Auth -->
				<div id="social-auth-wrapper-signin" class="space-y-1.5">
					<GoogleButtonUI />
					<ICloudButtonUI />
				</div>

				<!-- Séparateur -->
				<div class="flex items-center gap-3 py-0.5" id="signin-divider-row">
					<div class="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
					<span class="text-[9px] text-slate-400 font-black uppercase tracking-widest">ou avec votre email</span>
					<div class="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
				</div>

				<!-- Formulaire -->
				<form @submit.prevent="handleSignIn()" class="space-y-2" id="signin-form-body">
					<!-- Email -->
					<div class="space-y-0.5 group">
						<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
							Adresse email
						</label>
						<input
							type="email"
							required
							v-model="authEmail"
							placeholder="exemple@email.com"
							class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
						/>
					</div>

					<!-- Mot de passe -->
					<div class="space-y-0.5 group">
						<div class="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
							<span>Mot de passe</span>
							<button
								type="button"
								@click="recoveryView = 'forgot'"
								class="normal-case tracking-normal text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition-colors"
							>
								Oublié ?
							</button>
						</div>
						<div class="relative">
							<input
								:type="showPassword ? 'text' : 'password'"
								required
								v-model="authPassword"
								placeholder="••••••••••"
								class="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
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

					<!-- Bouton submit -->
					<button
						type="submit"
						:disabled="isAuthSubmitLoading"
						class="group relative w-full h-11 mt-1 rounded-full font-black text-xs uppercase tracking-[0.12em] text-white overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800"
					>
						<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-1.5">
							<CheckCircle class="w-4 h-4 text-emerald-400 dark:text-slate-950" />
							Se Connecter
						</span>
						<span v-else class="relative z-10 flex items-center justify-center gap-2">
							<span class="w-3.5 h-3.5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
							Connexion...
						</span>
					</button>
				</form>

				<!-- Reassurance Footer -->
				<div class="flex items-center justify-center gap-1.5 pt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
					<Lock class="w-3.5 h-3.5 text-emerald-500" />
					<span>Connexion sécurisée & chiffrée SSL</span>
				</div>

				<!-- Lien Inscription -->
				<div class="pt-2 text-center border-t border-slate-200/60 dark:border-slate-800">
					<span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Nouveau sur findMe ?</span>
					<NuxtLink to="/auth/signup" class="text-xs font-black text-slate-900 dark:text-white hover:text-emerald-600 ml-1.5 underline decoration-2 decoration-emerald-500 underline-offset-4 transition-colors">
						Créer un compte
					</NuxtLink>
				</div>
			</div>

			<!-- ── MOT DE PASSE OUBLIÉ ── -->
			<div v-else-if="authStep === 'login' && recoveryView === 'forgot'" key="forgot-password" class="w-full flex-1 flex flex-col justify-center my-auto">
				<ForgotPassword
					:initialEmail="authEmail"
					@cancel="recoveryView = 'signin'"
					@success="onRecoverySuccess"
				/>
			</div>

			<!-- ── SUCCÈS ── -->
			<div v-else key="success-screen" class="text-center py-4 flex flex-col items-center justify-center h-full w-full space-y-4 my-auto">
				<div class="relative w-20 h-20 flex items-center justify-center mx-auto">
					<div class="absolute inset-0 rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/40 animate-success-pop" />
					<Check class="w-10 h-10 text-white relative z-10" />
				</div>
				<div class="space-y-1">
					<h2 class="text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">Connexion réussie !</h2>
					<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
						Ravi de vous revoir,
						<span class="text-slate-900 dark:text-white font-bold block mt-0.5 text-sm">{{ authEmail || "Citoyen findMe" }}</span>
					</p>
				</div>
			</div>

		</transition>

		<!-- Footer Spacing filler -->
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

@keyframes successPop {
	0% { transform: scale(0.8); opacity: 0; }
	60% { transform: scale(1.1); opacity: 1; }
	100% { transform: scale(1); opacity: 1; }
}
.animate-success-pop { animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
</style>
