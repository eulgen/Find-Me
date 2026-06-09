<template>
	<div class="login-container">
		<h2>Connexion</h2>

		<div class="google-button-wrapper">
			<ButtonUI type="button" class="mon-bouton-vert">
				S'inscrire avec Google
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
	</div>
</template>

<script setup>
	const { handleGoogleAuth } = useAuth();
	const errorMessage = ref("");
	const router = useRouter();
	const config = useRuntimeConfig();

	// Cette fonction DOIT être accessible globalement pour que Google puisse la trouver
	// car le script HTML pur cherche une fonction dans l'objet 'window'
	onMounted(() => {
		window.handleGoogleAuth = async (response) => {
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

<style scoped>
	.google-button-wrapper {
		position: relative;
		display: inline-block;
		cursor: pointer;
	}

	/* On force le bouton Google HTML à s: ;e mettre pile par-dessus ton bouton vert */
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
	.mon-bouton-vert {
		pointer-events: none; /* Laisse le clic traverser vers le bouton Google derrière/devant */
	}

	.error {
		color: red;
		margin-top: 10px;
	}
</style>
