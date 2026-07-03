<!--
  @file SignUpPage.vue
  @description Page d'inscription citoyenne findMe Cameroun en plein écran avec design premium.
-->

<script setup lang="ts">
	import { onMounted, watch, computed, ref } from "vue";
	import {
		ShieldCheck,
		CheckCircle,
		Check,
		Sparkles,
		CircleCheck,
		Eye,
		EyeOff,
		ArrowLeft
	} from "lucide-vue-next";
	import { useAuth } from "~/composables/useAuth";
	import { useNavigation } from "~/composables/useNavigation";
	import ButtonUI from "~/components/ui/ButtonUI.vue";
	import GoogleButtonUI from "~/components/ui/GoogleButtonUI.vue";
	import ICloudButtonUI from "~/components/ui/ICloudButtonUI.vue";
	import FindMeLogo from "~/components/ui/FindMeLogo.vue";


	const {
		authStep,
		authMode,
		authEmail,
		authUsername,
		authPassword,
		isGoogleLoading,
		googleUser,
		isAuthSubmitLoading,
		isAuthDoneLoading,
		handleSimulatedClaim,
		handleGoogleAuth,
		currentUser,
		resetAuth,
	} = useAuth();

	const { currentView, handleGoHome } = useNavigation();

	definePageMeta({
		layout: 'auth'
	});

	// Configuration de la page en mode inscription
	onMounted(() => {
		resetAuth();
		authMode.value = "signup";
	});

	// Password real-time feedback
	const hasMinLength = computed(() => authPassword.value.length >= 8);
	const hasUppercase = computed(() => /[A-Z]/.test(authPassword.value));
	const hasNumber = computed(() => /[0-9]/.test(authPassword.value));
	const showPassword = ref<boolean>(false);

	watch(currentUser, (newUser) => {
		if (newUser && authStep.value === "success") {
			setTimeout(() => {
				navigateTo(`/users/${newUser.id}`);
			}, 2500);
		}
	});

	const handleDone = () => {
		isAuthDoneLoading.value = true;
		setTimeout(() => {
			isAuthDoneLoading.value = false;
			if (currentUser.value) {
				navigateTo(`/users/${currentUser.value.id}`);
			}
			resetAuth();
		}, 900);
	};
</script>

<template>
	<div class="flex flex-col justify-center w-full max-w-[400px] mx-auto h-full min-h-0 py-4">
		<div class="flex items-center justify-center mb-4">
			<FindMeLogo size="140" class="cursor-pointer transition-all" @click="navigateTo('/')" />
		</div>


		<!-- Formulaire principal avec transition -->
		<div class="w-full relative" id="signup-interactive-area">
			<transition name="slide-fade" mode="out-in">
				
				<!-- ── Saisie d'identifiants ── -->
				<div v-if="authStep === 'login'" key="signup-form" class="space-y-4" id="signup-form-wrapper">
					
					<!-- En-tête -->
					<div class="mb-4 text-center" id="signup-header-texts">
						<!-- <FindMeLogo size="140" class="cursor-pointer transition-all" @click="navigateTo('/')" /> -->
						<h3 class="text-2xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight leading-tight mb-1.5">
							Créer un compte
						</h3>
						<p class="text-xs text-slate-500 dark:text-slate-600 leading-relaxed font-medium">
							Inscrivez-vous pour sécuriser et gérer vos adresses.
						</p>
					</div>

					<!-- Social Auth -->
					<div class="space-y-2 mb-4">
						<GoogleButtonUI />
						<ICloudButtonUI />
					</div>

					<!-- Séparateur -->
					<div class="flex items-center gap-4 mb-4" id="signup-divider-row">
						<div class="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
						<span class="text-[11px] text-slate-400 font-black uppercase tracking-widest">ou par email</span>
						<div class="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
					</div>

					<!-- Formulaire manuel -->
					<form @submit.prevent="handleSimulatedClaim" class="space-y-3" id="signup-form-body">
						
						<!-- Nom d'utilisateur -->
						<div class="space-y-1.5 group" id="signup-input-username-group">
							<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
								Nom d'utilisateur
							</label>
							<input
								type="text"
								required
								class="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 shadow-sm backdrop-blur-sm"
								placeholder="John Doe"
								v-model="authUsername"
							/>
						</div>

						<!-- Email -->
						<div class="space-y-1.5 group" id="signup-input-email-group">
							<input
								type="email"
								required
								class="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 shadow-sm backdrop-blur-sm"
								placeholder="exemple@email.com"
								v-model="authEmail"
							/>
						</div>

						<!-- Mot de passe -->
						<div class="space-y-1.5 group" id="signup-input-password-group">
							<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
								Mot de passe
							</label>
							<div class="relative">
								<input
									:type="showPassword ? 'text' : 'password'"
									required
									class="w-full px-4 py-2.5 pr-12 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 shadow-sm backdrop-blur-sm"
									placeholder="••••••••"
									v-model="authPassword"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
									@click="showPassword = !showPassword"
								>
									<Eye v-if="!showPassword" class="w-4 h-4" />
									<EyeOff v-else class="w-4 h-4" />
								</button>
							</div>

							<!-- Indicateurs -->
							<div class="pt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px]" id="password-strength-indicators">
								<div class="flex items-center space-x-1.5 font-bold transition-colors" :class="hasMinLength ? 'text-emerald-600 dark:text-[#0f172b]' : 'text-slate-400'">
									<CircleCheck class="w-3.5 h-3.5" />
									<span>8+ carac.</span>
								</div>
								<div class="flex items-center space-x-1.5 font-bold transition-colors" :class="hasUppercase ? 'text-emerald-600 dark:text-[#0f172b]' : 'text-slate-400'">
									<CircleCheck class="w-3.5 h-3.5" />
									<span>Majuscule</span>
								</div>
								<div class="flex items-center space-x-1.5 font-bold transition-colors" :class="hasNumber ? 'text-emerald-600 dark:text-[#0f172b]' : 'text-slate-400'">
									<CircleCheck class="w-3.5 h-3.5" />
									<span>Chiffre</span>
								</div>
							</div>
						</div>

						<!-- Bouton Submit -->
						<button
							type="submit"
							:disabled="isAuthSubmitLoading"
							class="group relative w-full h-12 mt-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white overflow-hidden transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-500"
						>
							<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-2 transition-transform">
								<CheckCircle class="w-5 h-5" />
								Créer mon Compte
							</span>
							<span v-else class="relative z-10 flex items-center justify-center gap-2">
								<span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Création...
							</span>
						</button>
					</form>

					<!-- Redirection vers la connexion -->
					<div class="text-center pt-4" id="toggle-to-signin">
						<span class="text-sm text-slate-500 dark:text-slate-600 font-medium">
							Déjà membre de findMe ?
						</span>
						<NuxtLink
							to="/auth/signin"
							class="text-emerald-600 dark:text-[#0f172b] font-black hover:text-emerald-700 dark:hover:text-emerald-300 ml-1 transition-colors underline decoration-2 decoration-emerald-500/30 hover:decoration-emerald-500 underline-offset-4"
						>
							Se connecter
						</NuxtLink>
					</div>
				</div>

				<!-- ── ÉCRAN DE SUCCÈS ── -->
				<div v-else key="signup-success" class="text-center py-10 flex flex-col items-center justify-center h-full">
					<div class="relative w-28 h-28 flex items-center justify-center mb-6">
						<div class="absolute inset-0 rounded-full bg-emerald-500 shadow-2xl shadow-emerald-500/40 animate-success-pop" />
						<div class="absolute inset-0 rounded-full border-4 border-emerald-400/40 animate-ping-slow" />
						<Check class="w-14 h-14 text-white relative z-10" />
					</div>

					<div class="space-y-4 mb-10">
						<h3 class="text-3xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight">
							Compte Créé !
						</h3>
						<p class="text-base text-slate-500 dark:text-slate-600 leading-relaxed font-medium max-w-sm mx-auto">
							Bienvenue, 
							<span class="text-emerald-600 dark:text-[#0f172b] font-black block mt-1 text-lg">{{ authUsername || authEmail || "Citoyen findMe" }}</span>
						</p>

						<div v-if="googleUser" class="inline-flex items-center space-x-2 bg-[#4285F4]/10 text-[#4285F4] text-[11px] font-black uppercase tracking-wider px-5 py-2 rounded-full border border-[#4285F4]/20 shadow-sm mt-4">
							<span class="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
							<span>Authentifié via Google</span>
						</div>
					</div>

					<button
						@click="handleDone"
						:disabled="isAuthDoneLoading"
						class="group relative w-full h-14 rounded-2xl font-black text-sm uppercase tracking-wider text-white overflow-hidden transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-500"
					>
						<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<span v-if="!isAuthDoneLoading" class="relative z-10 flex items-center justify-center gap-2 transition-transform">
							<Sparkles class="w-5 h-5" />
							Accéder au Tableau de Bord
						</span>
						<span v-else class="relative z-10 flex items-center justify-center gap-2">
							<span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Chargement...
						</span>
					</button>
				</div>

			</transition>
		</div>
	</div>
</template>

<style scoped>
/* ── Transitions fluides ── */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* ── Success animation ── */
@keyframes successPop {
	0% { opacity: 0; transform: scale(0.8); }
	65% { opacity: 1; transform: scale(1.1); }
	100% { opacity: 1; transform: scale(1); }
}
.animate-success-pop { animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

.animate-ping-slow {
	animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
