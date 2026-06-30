<!--
  @file SignInPage.vue
  @description Page de connexion findMe — design premium, charte graphique officielle, mobile-first.
-->

<script setup lang="ts">
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
	<div
		class="relative w-full min-h-[calc(100vh-64px)] flex bg-[#F4F6FF] dark:bg-[#080B18] overflow-hidden"
		id="signin-page-root"
	>
		<!-- ── Décoration fond ── -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
			<div class="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-[#1A237E]/6 dark:bg-[#1A237E]/14 blur-[130px]" />
			<div class="absolute -bottom-48 right-0 w-[600px] h-[600px] rounded-full bg-[#2E7D32]/5 dark:bg-[#2E7D32]/10 blur-[120px]" />
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#1A237E]/3 dark:bg-[#1A237E]/8 blur-[100px]" />
		</div>

		<!-- ── Grille subtile ── -->
		<div
			class="absolute inset-0 pointer-events-none opacity-[0.018] dark:opacity-[0.04]"
			style="background-image: linear-gradient(rgba(26,35,126,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,126,.8) 1px, transparent 1px); background-size: 48px 48px;"
			aria-hidden="true"
		/>

		<!-- ══════════════ PANNEAU FORMULAIRE ══════════════ -->
		<div
			class="relative z-10 w-full lg:w-[500px] xl:w-[540px] flex flex-col px-5 sm:px-8 xl:px-12 py-8 justify-center"
			id="signin-form-side"
		>
			<!-- Header nav -->
			<div class="flex items-center justify-between mb-8">
				<FindMeLogo size="36" id="signin-brand-logo" />
				<button
					@click="navigateTo('/')"
					id="go-home-btn-signin"
					aria-label="Retour à l'accueil"
					class="group flex items-center gap-1.5 text-[#1A237E]/50 dark:text-slate-400 hover:text-[#1A237E] dark:hover:text-white text-xs font-semibold transition-colors"
				>
					<ArrowLeft class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
					Accueil
				</button>
			</div>

			<!-- Formulaire conteneur -->
			<div class="w-full max-w-sm mx-auto" id="signin-interactive-area">

				<!-- ── ÉTAT LOGIN ── -->
				<div
					v-if="authStep === 'login' && recoveryView === 'signin'"
					id="signin-form-wrapper"
				>
					<!-- En-tête -->
					<div class="mb-7" id="signin-header-texts">
						<div class="inline-flex w-11 h-11 rounded-2xl bg-[#1A237E]/10 dark:bg-[#1A237E]/20 items-center justify-center mb-4 border border-[#1A237E]/15 dark:border-[#1A237E]/30">
							<ShieldCheck class="w-5 h-5 text-[#1A237E] dark:text-indigo-400" />
						</div>
						<h1 class="text-2xl sm:text-3xl font-black text-[#1A237E] dark:text-white leading-tight tracking-tight mb-2">
							Se connecter à
							<span class="text-[#2E7D32] dark:text-[#4CAF50]">findMe</span>
						</h1>
						<p class="text-sm text-[#1A237E]/60 dark:text-slate-400 leading-relaxed">
							Accédez à vos adresses certifiées pour Yaoundé &amp; Douala.
						</p>
					</div>

					<!-- Social auth -->
					<div id="social-auth-wrapper-signup" class="space-y-2.5 mb-5">
						<GoogleButtonUI />
						<ICloudButtonUI />
					</div>

					<!-- Séparateur -->
					<div class="flex items-center gap-3 mb-5" id="signin-divider-row">
						<div class="flex-1 h-px bg-[#1A237E]/10 dark:bg-slate-700" />
						<span class="text-[10px] text-[#1A237E]/40 dark:text-slate-500 font-bold uppercase tracking-widest">ou par email</span>
						<div class="flex-1 h-px bg-[#1A237E]/10 dark:bg-slate-700" />
					</div>

					<!-- Formulaire -->
					<form @submit="handleSimulatedClaim" class="space-y-4" id="signin-form-body" aria-label="Formulaire de connexion">

						<!-- Email -->
						<div class="space-y-1.5" id="signin-input-email-group">
							<label class="block text-[10px] font-black uppercase tracking-wider text-[#1A237E]/70 dark:text-slate-400">
								Adresse email
							</label>
							<input
								type="email"
								required
								v-model="authEmail"
								placeholder="exemple@email.com"
								class="w-full px-4 py-3 rounded-xl border-2 border-[#1A237E]/15 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-[#1A237E] dark:text-white text-sm font-semibold placeholder:text-[#1A237E]/25 dark:placeholder:text-slate-600 outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:ring-2 focus:ring-[#2E7D32]/10 dark:focus:ring-[#4CAF50]/10 transition-all shadow-sm"
							/>
						</div>

						<!-- Mot de passe -->
						<div class="space-y-1.5" id="signin-input-password-group">
							<label class="flex justify-between text-[10px] font-black uppercase tracking-wider text-[#1A237E]/70 dark:text-slate-400">
								<span>Mot de passe</span>
								<button
									type="button"
									@click="recoveryView = 'forgot'"
									id="signin-forgot-password-link"
									class="normal-case tracking-normal text-[#2E7D32] dark:text-[#4CAF50] hover:text-[#1B5E20] dark:hover:text-[#66BB6A] font-semibold transition-colors"
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
									class="w-full px-4 py-3 pr-12 rounded-xl border-2 border-[#1A237E]/15 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-[#1A237E] dark:text-white text-sm font-semibold placeholder:text-[#1A237E]/25 dark:placeholder:text-slate-600 outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:ring-2 focus:ring-[#2E7D32]/10 dark:focus:ring-[#4CAF50]/10 transition-all shadow-sm"
								/>
								<button
									type="button"
									@click="showPassword = !showPassword"
									id="signin-toggle-password-btn"
									:aria-label="showPassword ? 'Masquer' : 'Afficher'"
									class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1A237E]/30 dark:text-slate-500 hover:text-[#1A237E] dark:hover:text-slate-300 transition-colors"
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
							id="signin-submit-btn"
							aria-label="Se connecter"
							class="group relative w-full h-12 mt-1 rounded-xl font-black text-sm text-white overflow-hidden transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
							style="background: linear-gradient(135deg, #1A237E 0%, #283593 50%, #2E7D32 100%);"
						>
							<!-- shimmer hover -->
							<span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 pointer-events-none" aria-hidden="true" />
							<span v-if="!isAuthSubmitLoading" class="relative flex items-center justify-center gap-2">
								<CheckCircle class="w-4 h-4" />
								Accéder à ma Console
							</span>
							<span v-else class="relative flex items-center justify-center gap-2">
								<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Connexion...
							</span>
						</button>
					</form>

					<!-- Lien inscription -->
					<p class="text-center text-xs text-[#1A237E]/50 dark:text-slate-500 mt-5" id="toggle-to-signup">
						Nouveau sur findMe ?
						<NuxtLink to="/auth/signup" id="signup-redirect-btn" class="text-[#2E7D32] dark:text-[#4CAF50] font-black hover:text-[#1B5E20] dark:hover:text-[#66BB6A] ml-1 transition-colors">
							Créer un compte →
						</NuxtLink>
					</p>
				</div>

				<!-- ── MOT DE PASSE OUBLIÉ ── -->
				<ForgotPassword
					v-else-if="authStep === 'login' && recoveryView === 'forgot'"
					:initialEmail="authEmail"
					@cancel="recoveryView = 'signin'"
					@success="onRecoverySuccess"
				/>

				<!-- ── SUCCÈS ── -->
				<div v-else class="text-center space-y-6 py-4" id="signin-success-screen">
					<div class="relative mx-auto w-20 h-20">
						<div class="absolute inset-0 rounded-full bg-[#2E7D32] shadow-xl shadow-[#2E7D32]/40 animate-success-pop" />
						<div class="absolute inset-0 rounded-full border-4 border-[#4CAF50]/40 animate-ping" />
						<div class="absolute inset-0 flex items-center justify-center">
							<Check class="w-10 h-10 text-white" />
						</div>
					</div>
					<div class="space-y-2">
						<h2 class="text-2xl font-black text-[#1A237E] dark:text-white">Connexion réussie !</h2>
						<p class="text-sm text-[#1A237E]/60 dark:text-slate-400">
							Ravi de vous revoir,
							<span class="text-[#2E7D32] dark:text-[#4CAF50] font-bold">{{ authEmail || "Citoyen findMe" }}</span>
						</p>
						<div v-if="googleUser" class="inline-flex items-center gap-2 bg-[#4285F4]/10 text-[#4285F4] text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full border border-[#4285F4]/20 mt-2">
							<span class="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-pulse" />
							Authentifié via Google
						</div>
					</div>
					<ButtonUI
						variant="primary"
						class="w-full font-black text-sm h-12"
						@click="navigateTo(currentUser?.rule === 'admin' ? '/admin' : `/users/${currentUser?.id}`)"
					>
						Accéder à mon espace →
					</ButtonUI>
				</div>

			</div>

			<!-- Trust bar mobile -->
			<div class="lg:hidden flex items-center justify-center gap-5 mt-10 text-[10px] font-semibold text-[#1A237E]/35 dark:text-slate-600">
				<div class="flex items-center gap-1.5"><ShieldCheck class="w-3 h-3 text-[#2E7D32]/60" /><span>Certifié DGSN</span></div>
				<div class="w-px h-3 bg-[#1A237E]/10" />
				<div class="flex items-center gap-1.5"><Users class="w-3 h-3 text-[#2E7D32]/60" /><span>+12 000 citoyens</span></div>
				<div class="w-px h-3 bg-[#1A237E]/10" />
				<div class="flex items-center gap-1.5"><MapPin class="w-3 h-3 text-[#2E7D32]/60" /><span>2 villes</span></div>
			</div>
		</div>

		<!-- ══════════════ PANNEAU ILLUSTRATION (desktop) ══════════════ -->
		<div
			class="hidden lg:flex flex-1 relative overflow-hidden"
			id="signin-preview-panel"
		>
			<!-- Image de fond -->
			<NuxtImg
				src="/assets/images/signin.png"
				alt="findMe — adressage certifié Cameroun"
				class="absolute inset-0 w-full h-full object-cover"
			/>
			<!-- Overlays de couleur charte -->
			<div class="absolute inset-0" style="background: linear-gradient(to right, #F4F6FF 0%, transparent 35%)" />
			<div class="absolute inset-0 dark:block hidden" style="background: linear-gradient(to right, #080B18 0%, transparent 35%)" />
			<div class="absolute inset-0" style="background: linear-gradient(to top, rgba(26,35,126,0.75) 0%, rgba(26,35,126,0.1) 50%, transparent 100%)" />

			<!-- Contenu brand en bas -->
			<div class="absolute bottom-0 left-0 right-0 p-10 xl:p-12">
				<!-- Stats -->
				<div class="flex items-center gap-4 mb-6">
					<div class="bg-white/90 dark:bg-[#1A237E]/80 backdrop-blur-md border border-[#1A237E]/15 dark:border-white/10 rounded-2xl px-4 py-3 text-center shadow-lg">
						<p class="text-xl font-black text-[#1A237E] dark:text-white">12K+</p>
						<p class="text-[9px] text-[#1A237E]/50 dark:text-white/50 font-bold uppercase tracking-wider mt-0.5">Citoyens</p>
					</div>
					<div class="bg-white/90 dark:bg-[#1A237E]/80 backdrop-blur-md border border-[#1A237E]/15 dark:border-white/10 rounded-2xl px-4 py-3 text-center shadow-lg">
						<p class="text-xl font-black text-[#2E7D32] dark:text-[#4CAF50]">2</p>
						<p class="text-[9px] text-[#1A237E]/50 dark:text-white/50 font-bold uppercase tracking-wider mt-0.5">Villes</p>
					</div>
					<div class="bg-white/90 dark:bg-[#1A237E]/80 backdrop-blur-md border border-[#1A237E]/15 dark:border-white/10 rounded-2xl px-4 py-3 text-center shadow-lg">
						<p class="text-xl font-black text-[#2E7D32] dark:text-[#4CAF50]">100%</p>
						<p class="text-[9px] text-[#1A237E]/50 dark:text-white/50 font-bold uppercase tracking-wider mt-0.5">Certifié</p>
					</div>
				</div>

				<!-- Carte de proposition de valeur -->
				<div class="bg-white/90 dark:bg-[#0D1020]/90 backdrop-blur-xl border border-[#1A237E]/15 dark:border-[#1A237E]/30 rounded-2xl p-6 max-w-sm shadow-2xl">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-7 h-7 rounded-lg bg-[#2E7D32] flex items-center justify-center shadow-md">
							<MapPin class="w-3.5 h-3.5 text-white" />
						</div>
						<span class="text-[#1A237E] dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">Adressage Officiel</span>
					</div>
					<h2 class="text-base font-black text-[#1A237E] dark:text-white leading-tight mb-2">
						Votre adresse, votre identité numérique.
					</h2>
					<p class="text-[#1A237E]/55 dark:text-slate-400 text-xs leading-relaxed">
						Rejoignez les citoyens de Yaoundé et Douala qui ont officialisé leur adresse avec findMe Cameroun.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* ── Boutons sociaux adaptés au fond clair ── */
:deep(.google-button-wrapper .mon-bouton-vert),
:deep(.icloud-button-wrapper button) {
	background: #fff !important;
	border-color: rgba(26, 35, 126, 0.15) !important;
	color: #1A237E !important;
	box-shadow: 0 1px 4px rgba(26,35,126,0.08) !important;
}
:deep(.google-button-wrapper .mon-bouton-vert:hover),
:deep(.icloud-button-wrapper button:hover) {
	border-color: rgba(26, 35, 126, 0.35) !important;
	background: #f8f9ff !important;
}
/* Dark mode overrides */
:global(.dark) :deep(.google-button-wrapper .mon-bouton-vert),
:global(.dark) :deep(.icloud-button-wrapper button) {
	background: rgba(255,255,255,0.05) !important;
	border-color: rgba(255,255,255,0.12) !important;
	color: rgba(255,255,255,0.85) !important;
}
:global(.dark) :deep(.google-button-wrapper .mon-bouton-vert:hover),
:global(.dark) :deep(.icloud-button-wrapper button:hover) {
	background: rgba(255,255,255,0.08) !important;
	border-color: rgba(255,255,255,0.2) !important;
}

/* ── Success animation ── */
@keyframes successPop {
	0% { transform: scale(0.4); opacity: 0; }
	65% { transform: scale(1.1); opacity: 1; }
	100% { transform: scale(1); }
}
.animate-success-pop { animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
</style>
