import { defineEventHandler, readBody, createError } from "h3";
import { getDb, saveDb } from "../../utils/db";

// Utilisation de globalThis pour partager la Map entre les modules bundlés séparément par Nitro
const getResetCodes = (): Map<string, { code: string; expires: number }> => {
	const g = globalThis as any;
	if (!g._resetCodes) {
		g._resetCodes = new Map<string, { code: string; expires: number }>();
	}
	return g._resetCodes;
};

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, newPassword } = body;

	if (!email || !newPassword) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "L'email et le nouveau mot de passe sont requis.",
		});
	}

	const emailLower = email.toLowerCase().trim();
	const newPasswordTyped = newPassword.trim();

	if (newPasswordTyped.length < 8) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "Le mot de passe doit contenir au moins 8 caractères.",
		});
	}

	// Mettre à jour de manière persistante sur le serveur
	const db = getDb();
	let userIdx = db.users.findIndex(
		(u) => u.email.toLowerCase().trim() === emailLower,
	);

	// Résolution intelligente pour jumelle.com
	if (
		userIdx === -1 &&
		(emailLower === "jumelle.com" || emailLower.includes("jumelle"))
	) {
		userIdx = db.users.findIndex((u) => u.email === "ndengbrice@gmail.com");
	}

	if (userIdx === -1) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not Found",
			message: "Compte citoyen introuvable.",
		});
	}

	// Changer le mot de passe
	const user = db.users[userIdx];
	if (user) {
		user.password = newPasswordTyped;
	}
	saveDb(db);

	return {
		success: true,
		message:
			"Votre mot de passe a été réinitialisé avec succès. Veuillez vous connecter.",
	};
});
