<!--
  @file GoogleButtonUI.vue
  @description Composant de bouton Google Sign-In avec état de chargement.
-->

<script setup lang="ts">
	const errorMessage = ref("");
	const router = useRouter();
	const config = useRuntimeConfig();
	const {
		isGoogleLoading,
		isAuthSubmitLoading,
		handleGoogleAuth,
		isIcloudLoading,
	} = useAuth();
	// Cette fonction DOIT être accessible globalement pour que Google puisse la trouver
	// car le script HTML pur cherche une fonction dans l'objet 'window'
	onMounted(() => {
		(window as any).handleGoogleAuth = async (response: any) => {
			const idToken = response.credential;

			try {
				const data = await $fetch("/api/auth/google-verify", {
					method: "POST",
					body: { token: idToken },
				});

				console.log("Connexion réussie !", data);
				router.push("/");
			} catch (err) {
				errorMessage.value = "Erreur lors de la vérification avec le serveur.";
			}
		};
	});
</script>

<template>
	<div class="google-button-wrapper">
		<ButtonUI
			variant="outline"
			:loading="isGoogleLoading"
			:disabled="isGoogleLoading || isIcloudLoading || isAuthSubmitLoading"
			@click="handleGoogleAuth"
			class="mon-bouton-vert w-full flex items-center justify-center h-12 border-[#1A237E]/20 hover:border-[#1A237E]"
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
		<div
			class="g_id_signin"
			data-type="standard"
			data-shape="rectangular"
			data-theme="outline"
			data-text="signin_with"
			data-size="large"
			data-logo_alignment="left"
		></div>

		<div
			id="g_id_onload"
			:data-client_id="config.public.googleSignIn?.clientId"
			data-context="signin"
			data-ux_mode="redirect"
			:data-login_uri="config.public.publicUrl + '/auth/callback'"
			data-auto_prompt="false"
		></div>
	</div>
	<p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</template>

<style scoped>
	.fade-overlay-enter-active,
	.fade-overlay-leave-active {
		transition: opacity 0.2s ease;
	}
	.fade-overlay-enter-from,
	.fade-overlay-leave-to {
		opacity: 0;
	}

	.google-button-wrapper {
		position: relative;
		width: 100%;
		display: inline-block;
		cursor: pointer;
	}

	/* On force le bouton Google HTML à se mettre pile par-dessus ton bouton vert */
	.g_id_signin {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0; /* Totalement invisible */
		z-index: 10;
	}

	/* Optionnel : Assure-toi que ton bouton vert prend bien toute la place disponible */
	/* .mon-bouton-vert {
		pointer-events: none; Laisse le clic traverser vers le bouton Google derrière/devant
	} */

	.error {
		color: red;
		margin-top: 10px;
	}
</style>
