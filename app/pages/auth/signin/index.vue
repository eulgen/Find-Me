<!--
  @file SignInPage.vue
  @description Page de connexion citoyenne findMe Cameroun en plein écran.
-->

<script setup lang="ts">
	import { onMounted, watch } from "vue";
	import { ShieldCheck, CheckCircle, Check, Sparkles } from "lucide-vue-next";
	import { useAuth } from "~/composables/useAuth";
	import { useNavigation } from "~/composables/useNavigation";

	const {
		authStep,
		authMode,
		authEmail,
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

	// Configuration de la page en mode connexion
	onMounted(() => {
		resetAuth();
		authMode.value = "signin";
	});

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
		id="signin-page-root"
	>
		<div
			class="w-full bg-white dark:bg-[#141627] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
			id="signin-page-container"
		>
			<!-- ÉLÉMENT GAUCHE : FORMULAIRE DE CONNEXION -->
			<div
				class="lg:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-between space-y-8"
				id="signin-form-side"
			>
				<!-- Breadcrumb / Retour à l'accueil -->
				<div
					class="flex items-center space-x-2 text-xs md:text-sm"
					id="signin-page-breadcrumbs"
				>
					<ButtonUI
						variant="outline"
						size="sm"
						@click="navigateTo('/')"
						id="go-home-btn-signin"
					>
						&larr; Retour à l'accueil
					</ButtonUI>
					<span class="text-[#1A237E]/40 font-bold">/</span>
					<span class="text-[#1A237E]/70 dark:text-slate-300 font-extrabold"
						>Connexion</span
					>
				</div>

				<!-- Formulaire principal -->
				<div
					class="flex-1 flex flex-col justify-center max-w-md w-full mx-auto"
					id="signin-interactive-area"
				>
					<!-- Saisie d'identifiants -->
					<div
						v-if="authStep === 'login'"
						class="space-y-6"
						id="signin-form-wrapper"
					>
						<div class="space-y-2" id="signin-header-texts">
							<div
								class="w-12 h-12 rounded-2xl bg-[#2E7D32]/10 border-2 border-[#2E7D32]/20 flex items-center justify-center mb-2"
							>
								<ShieldCheck class="w-7 h-7 text-[#2E7D32]" />
							</div>

							<h3
								class="text-2xl font-black text-[#1A237E] dark:text-white tracking-tight leading-none"
							>
								Se connecter à findMe
							</h3>

							<p
								class="text-xs text-[#1A237E]/75 dark:text-gray-300 leading-relaxed font-semibold"
							>
								Accédez à vos plaques d'adressage municipales existantes pour
								Yaoundé et Douala.
							</p>
						</div>

						<!-- Connexion Google Intégrée -->
						<div id="google-auth-wrapper-signin">
							<ButtonUI
								variant="outline"
								:loading="isGoogleLoading"
								:disabled="isGoogleLoading || isAuthSubmitLoading"
								@click="handleGoogleAuth"
								class="w-full flex items-center justify-center h-12"
								id="google-signin-btn-signin"
							>
								<span class="flex items-center space-x-2">
									<span>
										{{
											isGoogleLoading
												? "Connexion sécurisée en cours..."
												: "Se connecter avec Google"
										}}
									</span>
								</span>
							</ButtonUI>

							<!-- Séparateur horizontal chic -->
							<div class="flex items-center my-5" id="signin-divider-row">
								<div class="flex-1 h-0.5 bg-[#1A237E]/10 dark:bg-slate-800" />
								<span
									class="px-3.5 text-[10px] text-[#1A237E]/50 dark:text-gray-400 font-extrabold uppercase tracking-widest"
								>
									Ou adresse mail & mot de passe
								</span>
								<div class="flex-1 h-0.5 bg-[#1A237E]/10 dark:bg-slate-800" />
							</div>
						</div>

						<!-- Formulaire par identifiants -->
						<form
							@submit="handleSimulatedClaim"
							class="space-y-4"
							id="signin-form-body"
						>
							<!-- Champ Adresse Mail -->
							<div class="space-y-1.5" id="signin-input-email-group">
								<label
									class="text-[10px] font-black uppercase text-[#1A237E]/80 dark:text-gray-300 tracking-wider"
								>
									Adresse de messagerie (Email)
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
							<div class="space-y-1.5" id="signin-input-password-group">
								<label
									class="text-[10px] font-black uppercase text-[#1A237E]/80 dark:text-gray-300 tracking-wider flex justify-between"
								>
									<span>Mot de passe</span>
									<span
										class="text-[9px] text-[#2E7D32] dark:text-emerald-400 cursor-pointer hover:underline font-bold"
									>
										Oublié ?
									</span>
								</label>
								<input
									type="password"
									required
									class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white dark:bg-slate-900 text-[#1A237E] dark:text-white font-extrabold focus:border-[#2E7D32] focus:outline-none transition-colors shadow-sm"
									placeholder="••••••••"
									v-model="authPassword"
								/>
							</div>

							<!-- Bouton de validation de connexion -->
							<ButtonUI
								type="submit"
								variant="primary"
								:loading="isAuthSubmitLoading"
								:disabled="isAuthSubmitLoading"
								:icon="CheckCircle"
								class="w-full h-12 text-sm uppercase tracking-wider font-extrabold mt-3 shadow-md"
								id="signin-submit-btn"
							>
								<span>Accéder à ma Console Citoyenne</span>
							</ButtonUI>
						</form>

						<!-- Redirection vers l'inscription -->
						<div class="text-center pt-2" id="toggle-to-signup">
							<span
								class="text-xs text-[#1A237E]/70 dark:text-gray-400 font-semibold"
							>
								Nouveau sur findMe ?
							</span>
							<NuxtLink
								class="text-xs text-[#2E7D32] dark:text-emerald-400 font-black hover:underline focus:outline-none ml-1 cursor-pointer"
								id="signup-redirect-btn"
								to="/auth/signup"
							>
								Créer un compte citoyen &rarr;
							</NuxtLink>
						</div>
					</div>

					<!-- ÉCRAN DE SUCCÈS : Connecté avec succès -->
					<div
						v-else
						class="text-center py-8 space-y-6"
						id="signin-success-screen"
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
								Réseau Citoyen Connecté !
							</h3>

							<p
								class="text-xs md:text-sm text-[#1A237E]/80 dark:text-slate-300 leading-relaxed font-semibold max-w-sm mx-auto"
							>
								Ravi de vous revoir
								<span class="text-[#2E7D32] dark:text-emerald-400 font-black">{{
									authEmail || "Citoyen findMe"
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
							id="signin-done-btn"
						>
							<span>Accéder au Tableau de Bord</span>
						</ButtonUI>
					</div>
				</div>
			</div>

			<!-- ÉLÉMENT DROIT : BANNER D'ILLUSTRATION (Masqué sur mobile) -->
			<div
				class="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#1A237E] via-[#0D123F] to-[#0A0D2E] text-white p-12 flex-col justify-between relative border-l-4 border-[#1A237E]"
				id="signin-preview-panel"
			>
				<NuxtImg
					src="/assets/images/signin.png"
					alt="Connect to your account"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>
	</div>
</template>
