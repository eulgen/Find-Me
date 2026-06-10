<!--
  @file SignUpPage.vue
  @description Page d'inscription citoyenne findMe Cameroun en plein écran.
-->

<script setup lang="ts">
	import { onMounted, watch, computed } from "vue";
	import {
		ShieldCheck,
		CheckCircle,
		Check,
		Sparkles,
		CircleCheck,
		Eye,
		EyeOff,
	} from "lucide-vue-next";
	import { useAuth } from "~/composables/useAuth";
	import { useNavigation } from "~/composables/useNavigation";
	import ButtonUI from "~/components/ui/ButtonUI.vue";
	import GoogleButtonUI from "~/components/ui/GoogleButtonUI.vue";
	import ICloudButtonUI from "~/components/ui/ICloudButtonUI.vue";

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
			// Session ouverte conjointe
		}
	});

	const handleDone = () => {
		isAuthDoneLoading.value = true;
		setTimeout(() => {
			isAuthDoneLoading.value = false;
			if (currentUser.value) {
				if (currentUser.value.role === "admin") {
					currentView.value = "admin-space";
				} else {
					currentView.value = "citizen-space";
				}
			}
			resetAuth();
		}, 900);
	};
</script>

<template>
	<div
		class="w-full min-h-[calc(100vh-80px)] sm:px-6 bg-gradient-to-br from-[#FAF8FD] to-[#EDF2FA] dark:from-[#0D0F1A] dark:to-[#141732] flex items-center justify-center"
		id="signup-page-root"
	>
		<div
			class="w-full bg-white dark:bg-[#141627] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
			id="signup-page-container"
		>
			<!-- ÉLÉMENT GAUCHE : FORMULAIRE D'INSCRIPTION -->
			<div
				class="lg:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-between space-y-8"
				id="signup-form-side"
			>
				<!-- Breadcrumb / Retour à l'accueil -->
				<div
					class="flex items-center space-x-2 text-xs md:text-sm"
					id="signup-page-breadcrumbs"
				>
					<ButtonUI
						variant="outline"
						size="sm"
						@click="navigateTo('/')"
						id="go-home-btn-signup"
					>
						&larr; Retour à l'accueil
					</ButtonUI>
					<span class="text-[#1A237E]/40 font-bold">/</span>
					<span class="text-[#1A237E]/70 dark:text-slate-300 font-extrabold"
						>Inscription</span
					>
				</div>

				<!-- Formulaire principal -->
				<div
					class="flex-1 flex flex-col justify-center max-w-md w-full mx-auto"
					id="signup-interactive-area"
				>
					<!-- Saisie d'identifiants -->
					<div
						v-if="authStep === 'login'"
						class="space-y-4"
						id="signup-form-wrapper"
					>
						<div class="space-y-2" id="signup-header-texts">
							<div
								class="w-12 h-12 rounded-2xl bg-[#2E7D32]/10 border-2 border-[#2E7D32]/20 flex items-center justify-center mb-2"
							>
								<ShieldCheck class="w-7 h-7 text-[#2E7D32]" />
							</div>
							<h3
								class="text-2xl font-black text-[#1A237E] dark:text-white tracking-tight leading-none"
							>
								Créer un compte findMe
							</h3>
							<p
								class="text-xs text-[#1A237E]/75 dark:text-gray-300 leading-relaxed font-semibold"
							>
								Inscrivez-vous gratuitement pour sécuriser vos plaques
								d'adressage et exporter vos badges d'itinéraires.
							</p>
						</div>

						<!-- Inscription Google Intégrée -->
						<!-- <ButtonUI
							variant="outline"
							:loading="isGoogleLoading"
							:disabled="isGoogleLoading || isAuthSubmitLoading"
							@click="handleGoogleAuth"
							class="w-full flex items-center justify-center h-12 mb-10"
							id="google-signin-btn-signup"
						>
							<span class="flex items-center space-x-2">
								<span>
									{{
										isGoogleLoading
											? "Sécurisation Google en cours..."
											: "S'inscrire avec Google"
									}}
								</span>
							</span>
						</ButtonUI> -->
						<GoogleButtonUI />
						<ICloudButtonUI />

						<!-- Séparateur horizontal chic -->
						<div
							class="flex items-center h-10 my-10 mx-10"
							id="signup-divider-row"
						>
							<div class="flex-1 h-0.5 bg-[#1A237E]/10 dark:bg-slate-800" />
							<span
								class="px-3.5 text-[10px] text-[#1A237E]/50 dark:text-gray-400 font-extrabold uppercase tracking-widest"
							>
								Ou par mot de passe
							</span>
							<div class="flex-1 h-0.5 bg-[#1A237E]/10 dark:bg-slate-800" />
						</div>

						<!-- Formulaire par identifiants -->
						<form
							@submit="handleSimulatedClaim"
							class="space-y-4"
							id="signup-form-body"
						>
							<!-- Champ Nom de l'utilisateur -->
							<div class="space-y-1.5" id="signup-input-username-group">
								<label
									class="text-[10px] font-black uppercase text-[#1A237E]/80 dark:text-gray-300 tracking-wider"
								>
									Nom d'utilisateur
								</label>
								<input
									type="text"
									required
									class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white dark:bg-slate-900 text-[#1A237E] dark:text-white font-extrabold focus:border-[#2E7D32] focus:outline-none transition-colors shadow-sm"
									placeholder="Brice Ndeng"
									v-model="authUsername"
								/>
							</div>

							<!-- Champ Adresse Mail -->
							<div class="space-y-1.5" id="signup-input-email-group">
								<label
									class="text-[10px] font-black uppercase text-[#1A237E]/80 dark:text-gray-300 tracking-wider"
								>
									Email
								</label>
								<input
									type="email"
									required
									class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white dark:bg-slate-900 text-[#1A237E] dark:text-white font-extrabold focus:border-[#2E7D32] focus:outline-none transition-colors shadow-sm"
									placeholder="ndengbrice@gmail.com"
									v-model="authEmail"
								/>
							</div>

							<!-- Champ Mot de passe -->
							<div class="space-y-1.5" id="signup-input-password-group">
								<label
									class="text-[10px] font-black uppercase text-[#1A237E]/80 dark:text-gray-300 tracking-wider"
								>
									Mot de passe
								</label>
								<div class="relative w-full">
									<input
										:type="showPassword ? 'text' : 'password'"
										required
										class="w-full text-xs px-3.5 pr-10 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white dark:bg-slate-900 text-[#1A237E] dark:text-white font-extrabold focus:border-[#2E7D32] focus:outline-none transition-colors shadow-sm"
										placeholder="••••••••"
										v-model="authPassword"
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

								<!-- Indicateurs de sécurité du mot de passe en temps réel -->
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
							</div>

							<!-- Bouton de validation d'inscription -->
							<ButtonUI
								type="submit"
								variant="primary"
								:loading="isAuthSubmitLoading"
								:disabled="isAuthSubmitLoading"
								:icon="CheckCircle"
								class="w-full h-12 text-sm uppercase tracking-wider font-extrabold mt-3 shadow-md"
								id="signup-submit-btn"
							>
								<span>Créer mon Compte Citoyen</span>
							</ButtonUI>
						</form>

						<!-- Redirection vers la connexion -->
						<div class="text-center pt-2" id="toggle-to-signin">
							<span
								class="text-xs text-[#1A237E]/70 dark:text-gray-400 font-semibold"
							>
								Déjà membre de findMe ?
							</span>
							<NuxtLink
								class="text-xs text-[#2E7D32] dark:text-emerald-400 font-black hover:underline focus:outline-none ml-1 cursor-pointer"
								id="signin-redirect-btn"
								to="/auth/signin"
							>
								Se connecter &rarr;
							</NuxtLink>
						</div>
					</div>

					<!-- ÉCRAN DE SUCCÈS : Connecté avec succès -->
					<div
						v-else
						class="text-center py-8 space-y-6"
						id="signup-success-screen"
					>
						<div
							class="mx-auto w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-[#2E7D32]/20 flex items-center justify-center border-2 border-[#2E7D32]"
						>
							<Check class="w-8 h-8 text-[#2E7D32]" />
						</div>

						<div class="space-y-3">
							<h3
								class="text-2xl font-black text-[#1A237E] dark:text-white md:text-3xl"
							>
								Compte Citoyen Validé !
							</h3>

							<p
								class="text-xs md:text-sm text-[#1A237E]/80 dark:text-slate-300 leading-relaxed font-semibold max-w-sm mx-auto"
							>
								Bienvenue dans la communauté,
								<span class="text-[#2E7D32] dark:text-emerald-400 font-black">{{
									authUsername || authEmail || "Citoyen findMe"
								}}</span
								>. Votre catalogue d'adresses pour Douala et Bastos (Yaoundé) a
								été chargé sur votre console.
							</p>

							<div
								v-if="googleUser"
								class="inline-flex items-center space-x-2 bg-[#4285F4]/10 text-[#4285F4] text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full border border-[#4285F4]/20 shadow-sm mt-2"
							>
								<span class="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
								<span>Espace Authentifié via Google Secure</span>
							</div>
						</div>

						<ButtonUI
							variant="primary"
							:loading="isAuthDoneLoading"
							:disabled="isAuthDoneLoading"
							:icon="Sparkles"
							@click="handleDone"
							class="w-full h-12 uppercase tracking-widest text-xs font-black shadow-lg"
							id="signup-done-btn"
						>
							<span>Accéder au Tableau de Bord</span>
						</ButtonUI>
					</div>
				</div>
			</div>

			<!-- ÉLÉMENT DROIT : BANNER D'ILLUSTRATION (Masqué sur mobile) -->
			<div
				class="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#1A237E] via-[#0D123F] to-[#0A0D2E] text-white p-12 justify-between items-center relative border-l-4 border-[#1A237E]"
				id="signup-preview-panel"
			>
				<NuxtImg
					src="/assets/images/signup.png"
					alt="Create your account"
					class="w-180 h-180 object-cover"
				/>
			</div>
		</div>
	</div>
</template>
