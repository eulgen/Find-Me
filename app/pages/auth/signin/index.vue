<!--
  @file SignInPage.vue
  @description Page de connexion citoyenne findMe Cameroun en plein écran.
-->

<script setup lang="ts">
	import { onMounted, watch, ref } from "vue";
	import { ShieldCheck, CheckCircle, Check, Sparkles } from "lucide-vue-next";
	import { useAuth } from "~/composables/useAuth";
	import { useNavigation } from "~/composables/useNavigation";
	import GoogleButtonUI from "~/components/ui/GoogleButtonUI.vue";

	const config = useRuntimeConfig();
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
		isIcloudLoading,
		handleIcloudAuth,
	} = useAuth();
	const errorMessage = ref("");
	const router = useRouter();

	// Configuration de la page en mode connexion
	// onMounted(() => {
	// 	resetAuth();
	// 	authMode.value = "signin";
	// });

	// watch(currentUser, (newUser) => {
	// 	if (newUser && authStep.value === "success") {
	// 		// Session ouverte conjointe
	// 	}
	// });

	// const handleDone = () => {
	// 	isAuthDoneLoading.value = true;
	// 	setTimeout(() => {
	// 		isAuthDoneLoading.value = false;
	// 		if (currentUser.value) {
	// 			if (currentUser.value.role === "admin") {
	// 				currentView.value = "admin-space";
	// 			} else {
	// 				currentView.value = "citizen-space";
	// 			}
	// 		}
	// 		resetAuth();
	// 	}, 900);
	// };

	// onMounted(() => {
	// 	// On vérifie régulièrement si l'objet 'google' injecté par le module est prêt
	// 	const checkGoogleInterval = setInterval(() => {
	// 		if (window.google) {
	// 			clearInterval(checkGoogleInterval);

	// 			// Initialisation du flux Google avec ton ID Client
	// 			window.google.accounts.id.initialize({
	// 				client_id:
	// 					config.public.googleSignIn?.clientId || "VOTRE_ID_CLIENT_GOOGLE",
	// 				callback: handleCredentialResponse,
	// 			});
	// 		}
	// 	}, 100);
	// });

	// // Cette fonction reçoit le jeton (token) sécurisé envoyé par Google après le clic
	// const handleCredentialResponse = async (response: any) => {
	// 	const idToken = response.credential;

	// 	try {
	// 		const data = await $fetch("/api/auth/google-verify", {
	// 			method: "POST",
	// 			body: { token: idToken },
	// 		});

	// 		console.log("Authentification réussie !", data);
	// 		router.push("/dashboard"); // Ou ta page de redirection
	// 	} catch (err) {
	// 		errorMessage.value = "Erreur lors de la vérification avec le serveur.";
	// 		console.error(err);
	// 	}
	// };

	// // Fonction déclenchée au clic sur ton ButtonUI
	// const loginWithGoogle = () => {
	// 	if (window.google) {
	// 		// Cette fonction ouvre la boîte de dialogue officielle de sélection de compte Google
	// 		window.google.accounts.id.prompt();
	// 	} else {
	// 		errorMessage.value =
	// 			"Le service Google est en cours de chargement, réessayez dans un instant.";
	// 	}
	// };

	const handleSignupSuccess = async (response: any) => {
		const idToken = response.credential; // C'est le jeton sécurisé fourni par Google

		try {
			// On envoie ce jeton à notre API Nuxt pour créer le compte
			const result = await $fetch("/api/auth/register", {
				method: "POST",
				body: { token: idToken },
			});

			if ((result as any).success) {
				// Compte créé et utilisateur connecté ! On redirige vers le tableau de bord
				router.push("/dashboard");
			}
		} catch (error) {
			errorMessage.value =
				(error as any).data?.message ||
				"Une erreur est survenue lors de l'inscription.";
		}
	};

	const handleSignupError = () => {
		errorMessage.value = "L'inscription via Google a échoué ou a été annulée.";
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
							<div id="social-auth-wrapper-signup" class="space-y-3">
								<!-- <ButtonUI
										variant="outline"
										:loading="isGoogleLoading"
										:disabled="
											isGoogleLoading || isIcloudLoading || isAuthSubmitLoading
										"
										@click="handleGoogleAuth"
										class="w-full flex items-center justify-center h-12 border-[#1A237E]/20 hover:border-[#1A237E]"
										id="google-signin-btn-signup"
									>
										<span class="flex items-center space-x-2.5 font-bold">
											<svg
												class="w-5 h-5 shrink-0"
												viewBox="0 0 24 24"
												width="24"
												height="24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													fill="#4285F4"
												/>
												<path
													d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													fill="#34A853"
												/>
												<path
													d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"
													fill="#FBBC05"
												/>
												<path
													d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
													fill="#EA4335"
												/>
											</svg>
											<span>
												{{
													isGoogleLoading
														? "Sécurisation Google en cours..."
														: "S'inscrire avec Google"
												}}
											</span>
										</span>
									</ButtonUI>
								-->
								<GoogleSignInButton
									@success="handleSignupSuccess"
									@error="handleSignupError"
									class="google-signin-btn grid"
								/>

								<!-- <GoogleButtonUI
									:loading="isGoogleLoading"
									@success="handleSignupSuccess"
									@error="handleSignupError"
								>
									Sign in with Google
								</GoogleButtonUI> -->

								<ButtonUI
									variant="outline"
									:loading="isIcloudLoading"
									:disabled="
										isGoogleLoading || isIcloudLoading || isAuthSubmitLoading
									"
									@click="handleIcloudAuth"
									class="w-full flex items-center justify-center h-12 border-[#1A237E]/20 hover:border-[#1A237E]"
									id="icloud-signin-btn-signup"
								>
									<span class="flex items-center space-x-2.5 font-bold">
										<svg
											class="w-5 h-5 fill-current text-slate-800 dark:text-white shrink-0"
											viewBox="0 0 170 170"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.36-6.13-2.92-2.38-6.73-6.93-11.45-13.67-4.71-6.73-8.58-13.67-11.59-20.82-3.01-7.15-5.29-14.39-6.83-21.72-1.53-7.32-2.3-14.28-2.3-20.89 0-16.24 3.81-29.35 11.43-39.31 7.62-9.96 17-14.99 28.16-15.09 4.58 0 9.69 1.25 15.34 3.74 5.65 2.5 9.21 3.74 10.66 3.74 1.17 0 4.8-.97 10.87-2.9 6.07-1.93 11-2.9 14.79-2.9 10.51 0 19.34 3.1 26.5 9.3 5.31 4.58 9.3 10.15 11.97 16.71-11.55 7.02-17.26 16.14-17.13 27.36.13 8.35 3.01 15.3 8.65 20.82 5.64 5.51 12.39 8.71 20.25 9.6-2.58 7.42-5.61 14.43-9.1 21.05zM119.22 34.62c0-8.19-2.86-15.22-8.57-21.1C105 7.65 97.94 4.52 89.47 4.52c-.13 1.05-.13 1.94-.13 2.68 0 8.01 2.97 14.93 8.92 20.76 5.95 5.84 12.91 8.95 20.89 9.35.07-.8.07-1.61.07-2.69z"
											/>
										</svg>
										<span>
											{{
												isIcloudLoading
													? "Sécurisation iCloud en cours..."
													: "S'inscrire avec iCloud"
											}}
										</span>
									</span>
								</ButtonUI>

								<!-- Séparateur horizontal chic -->
								<div class="flex items-center my-5" id="signup-divider-row">
									<div class="flex-1 h-0.5 bg-[#1A237E]/10 dark:bg-slate-800" />
									<span
										class="px-3.5 text-[10px] text-[#1A237E]/50 dark:text-gray-400 font-extrabold uppercase tracking-widest text-center"
									>
										Ou par mot de passe
									</span>
									<div class="flex-1 h-0.5 bg-[#1A237E]/10 dark:bg-slate-800" />
								</div>
							</div>

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

						<!-- <ButtonUI
							variant="primary"
							:loading="isAuthDoneLoading"
							:disabled="isAuthDoneLoading"
							:icon="Sparkles"
							@click="handleDone"
							class="w-full h-12 uppercase tracking-widest text-xs font-black shadow-lg"
							id="signin-done-btn"
						>
							<span>Accéder au Tableau de Bord</span>
						</ButtonUI> -->
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

<style scoped>
	.google-signin-btn {
		width: 100% !important;
		background: red !important;
	}
</style>
