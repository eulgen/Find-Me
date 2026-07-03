<!--
  @file AuthModal.vue
  @description Composant d'authentification et d'inscription citoyenne findMe Cameroun.
-->

<script setup lang="ts">
	import { ref, watch } from "vue";
	import {
		X,
		ShieldCheck,
		CheckCircle,
		Check,
		Sparkles,
	} from "lucide-vue-next";
	import { useAuth } from "../../composables/useAuth";
	import ButtonUI from "../ui/ButtonUI.vue";

	const props = defineProps<{
		isOpen: boolean;
	}>();

	const emit = defineEmits<{
		(e: "close"): void;
		(e: "success", user: { email: string; username: string }): void;
	}>();

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

	watch(currentUser, (newUser) => {
		if (newUser && authStep.value === "success") {
			emit("success", newUser);
		}
	});

	const handleDone = () => {
		isAuthDoneLoading.value = true;
		setTimeout(() => {
			isAuthDoneLoading.value = false;
			if (currentUser.value) {
				emit("success", currentUser.value);
			}
			resetAuth();
			emit("close");
		}, 900);
	};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 z-50 bg-[#155dfc]/45 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl"
		id="auth-modal-overlay"
	>
		<div
			class="bg-[#F9F7FC] border-4 border-[#155dfc] rounded-[32px] w-full max-w-md p-6 relative shadow-[12px_12px_0px_0px_#FFD5D0]"
			id="auth-modal-dialog"
			role="dialog"
			aria-modal="true"
			aria-label="Portail de Connexion Citoyenne"
		>
			<!-- Fermeture -->
			<button
				@click="emit('close')"
				class="absolute top-4 right-4 text-[#155dfc] hover:text-[#00bc7d] p-1.5 hover:bg-[#F5F2FB] rounded-full cursor-pointer z-10 focus:outline-none"
				aria-label="Fermer le dialogue"
				id="auth-close-btn"
			>
				<X class="w-5 h-5" />
			</button>

			<div v-if="authStep === 'login'" class="space-y-4" id="auth-form-wrapper">
				<div class="space-y-1 mt-2" id="auth-header-texts">
					<div
						class="w-11 h-11 rounded-2xl bg-[#00bc7d]/10 border border-[#00bc7d]/20 flex items-center justify-center mb-4"
					>
						<ShieldCheck class="w-6 h-6 text-[#00bc7d]" />
					</div>
					<h3 class="text-xl font-extrabold text-[#155dfc]">Espace Citoyen</h3>
					<p class="text-xs text-[#155dfc]/70 leading-relaxed font-normal">
						Gérez, partagez ou réclamez votre plaque municipale findMe.
					</p>
				</div>

				<!-- Basculeur Connexion / Compte -->
				<div
					class="flex border-b border-[#155dfc]/10"
					id="auth-tabbar"
					role="tablist"
					aria-label="Type de connexion"
				>
					<button
						@click="authMode = 'signin'"
						role="tab"
						:aria-selected="authMode === 'signin'"
						class="flex-1 pb-3 text-sm font-black transition-all border-b-3 focus:outline-none"
						:class="
							authMode === 'signin'
								? 'border-[#155dfc] text-[#155dfc]'
								: 'border-transparent text-[#155dfc]/55 hover:text-[#155dfc]'
						"
						id="tab-signin-toggle"
					>
						Se connecter
					</button>
					<button
						@click="authMode = 'signup'"
						role="tab"
						:aria-selected="authMode === 'signup'"
						class="flex-1 pb-3 text-sm font-black transition-all border-b-3 focus:outline-none"
						:class="
							authMode === 'signup'
								? 'border-[#155dfc] text-[#155dfc]'
								: 'border-transparent text-[#155dfc]/55 hover:text-[#155dfc]'
						"
						id="tab-signup-toggle"
					>
						Créer un compte
					</button>
				</div>

				<!-- Google Auth -->
				<div id="google-auth-wrapper">
					<ButtonUI
						variant="outline"
						:loading="isGoogleLoading"
						:disabled="isGoogleLoading || isAuthSubmitLoading"
						@click="handleGoogleAuth"
						class="w-full flex items-center justify-center"
						id="google-signin-btn"
					>
						<span>
							{{
								isGoogleLoading
									? "Accès Google..."
									: authMode === "signin"
										? "Se connecter avec Google"
										: "S'inscrire avec Google"
							}}
						</span>
					</ButtonUI>

					<div class="flex items-center my-4" id="auth-divider-row">
						<div class="flex-1 h-0.5 bg-[#155dfc]/10" />
						<span
							class="px-3.5 text-[10px] text-[#155dfc]/50 font-black uppercase tracking-wider"
						>
							Ou par mot de passe
						</span>
						<div class="flex-1 h-0.5 bg-[#155dfc]/10" />
					</div>
				</div>

				<form
					@submit="handleSimulatedClaim"
					class="space-y-4"
					id="auth-form-body"
				>
					<div
						v-if="authMode === 'signup'"
						class="space-y-1.5"
						id="auth-input-username-group"
					>
						<label
							class="text-[10px] font-black uppercase text-[#155dfc]/80 tracking-wider"
						>
							Nom d'utilisateur
						</label>
						<input
							type="text"
							required
							class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#155dfc]/20 bg-white text-[#155dfc] font-bold focus:border-[#00bc7d] focus:outline-none"
							placeholder="Takam Jules"
							v-model="authUsername"
						/>
					</div>

					<div class="space-y-1.5" id="auth-input-email-group">
						<label
							class="text-[10px] font-black uppercase text-[#155dfc]/80 tracking-wider"
						>
							Adresse email
						</label>
						<input
							type="email"
							required
							class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#155dfc]/20 bg-white text-[#155dfc] font-bold focus:border-[#00bc7d] focus:outline-none"
							placeholder="mail@gmail.com"
							v-model="authEmail"
						/>
					</div>

					<div class="space-y-1.5" id="auth-input-password-group">
						<label
							class="text-[10px] font-black uppercase text-[#155dfc]/80 tracking-wider flex justify-between"
						>
							<span>Mot de passe</span>
							<span
								class="text-[9px] text-[#00bc7d] cursor-pointer hover:underline font-bold"
							>
								oublié ?
							</span>
						</label>
						<input
							type="password"
							required
							class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#155dfc]/20 bg-white text-[#155dfc] font-bold focus:border-[#00bc7d] focus:outline-none"
							placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
							v-model="authPassword"
						/>
					</div>

					<ButtonUI
						type="submit"
						variant="primary"
						:loading="isAuthSubmitLoading"
						:disabled="isAuthSubmitLoading"
						:icon="CheckCircle"
						class="w-full h-11"
						id="auth-submit-btn"
					>
						<span>
							{{
								authMode === "signin"
									? "Se connecter"
									: "Créer mon compte citoyen"
							}}
						</span>
					</ButtonUI>
				</form>

				<p class="text-[10px] text-[#155dfc]/50 text-center leading-relaxed">
					En vous connectant ou vous inscrivant, vous acceptez les conditions de
					findMe Cameroun et la protection des données civiques.
				</p>
			</div>

			<!-- Écran Réussite -->
			<div v-else class="text-center py-6 space-y-6" id="auth-success-screen">
				<div
					class="mx-auto w-16 h-16 rounded-full bg-[#00bc7d]/10 flex items-center justify-center border-2 border-[#00bc7d]/30"
				>
					<Check class="w-8 h-8 text-[#00bc7d] stroke-[3]" />
				</div>

				<div class="space-y-2">
					<h3 class="text-2xl font-black text-[#155dfc]">
						{{ authMode === "signin" ? "Réseau Connecté !" : "Compte créé !" }}
					</h3>
					<p class="text-xs text-[#155dfc]/85 leading-relaxed font-normal">
						Bienvenue Ã  {{ authUsername || authEmail || "Citoyen findMe" }}. Vos
						adresses pour la parcelle de Bastos (Yaoundé) sont maintenant
						chargées avec succès.
					</p>
					<div
						v-if="googleUser"
						class="inline-flex items-center space-x-1.5 bg-[#4285F4]/10 text-[#4285F4] text-[10px] font-bold px-3 py-1 rounded-full border border-[#4285F4]/20"
					>
						<span class="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
						<span>Espace Authentifié avec Google</span>
					</div>
				</div>

				<ButtonUI
					variant="primary"
					:loading="isAuthDoneLoading"
					:disabled="isAuthDoneLoading"
					:icon="Sparkles"
					@click="handleDone"
					class="w-full"
					id="auth-done-btn"
				>
					<span>Continuer vers ma Console</span>
				</ButtonUI>
			</div>
		</div>
	</div>
</template>
