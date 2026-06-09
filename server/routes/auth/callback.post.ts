export default defineEventHandler(async (event) => {
	// 1. Google envoie le token dans un format de formulaire (Form Data) nommé 'credential'
	const body = await readFormData(event);
	const idToken = body.get("credential");

	if (!idToken) {
		return sendRedirect(event, "/auth/signin?error=missing_token");
	}

	try {
		// 2. Envoie ce token directement à ton API de vérification existante
		const verification = await $fetch(
			"http://localhost:3000/api/auth/google-verify",
			{
				method: "POST",
				body: { token: idToken },
			},
		);

		// 3. Si tout est bon, on redirige l'utilisateur vers le dashboard
		return sendRedirect(event, "/");
	} catch (error) {
		// En cas d'échec, on le renvoie à la page de connexion avec un message
		return sendRedirect(event, "/auth/signin?error=auth_failed");
	}
});
