import { OAuth2Client } from "google-auth-library";

// Initialisation du client de validation Google
const client = new OAuth2Client(process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID);

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const token = body.token;

	if (!token) {
		throw createError({ statusCode: 400, statusMessage: "Token manquant" });
	}

	try {
		// Vérification du token auprès de Google
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		// Si le token est valide, vous avez accès aux informations de l'utilisateur
		// payload.email, payload.name, payload.picture, etc.
		return {
			success: true,
			user: {
				email: payload?.email,
				name: payload?.name,
				avatar: payload?.picture,
			},
		};
	} catch (error) {
		throw createError({
			statusCode: 401,
			statusMessage: "Token Google invalide",
		});
	}
});
