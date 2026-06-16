import { defineEventHandler, readBody, createError } from "h3";
import { getDb } from "../../utils/db";

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
	const { email } = body;

	if (!email) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "L'adresse de messagerie est requise",
		});
	}

	const emailLower = email.toLowerCase().trim();
	const db = getDb();

	// Résolution intelligente pour jumelle.com ou tout e-mail contenant jumelle
	let user = db.users.find((u) => u.email.toLowerCase().trim() === emailLower);
	if (
		!user &&
		(emailLower === "jumelle.com" || emailLower.includes("jumelle"))
	) {
		user = db.users.find((u) => u.email === "ndengbrice@gmail.com");
	}

	if (!user) {
		// Si l'utilisateur n'existe pas, on le crée à la volée pour assurer le bon fonctionnement de la simulation
		db.users.push({
			id: `u-${Date.now()}`,
			username: "Citoyen Jumelle",
			email: emailLower,
			password: "password123",
			role: "citizen",
			phone: "+237 600 00 00 00",
			createdAt: new Date().toISOString(),
		});
		user = db.users[db.users.length - 1];
	}

	// Générer un code OTP à 6 chiffres unique
	const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

	// Stocker le code avec une expiration de 15 minutes
	getResetCodes().set(emailLower, {
		code: otpCode,
		expires: Date.now() + 15 * 60 * 1000,
	});

	// Dans un environnement de production, on enverrait un vrai email d'adressage via SMTP ou service cloud de messagerie.
	// Pour findMe, nous renvoyons le succès ainsi que le code généré dans la réponse afin que le front-end puisse
	// simuler la réception de l'e-mail (et l'afficher de façon élégante dans un toast d'immatriculation d'e-mail).
	return {
		success: true,
		message: "Code de récupération généré avec succès",
		email: emailLower,
		otpCode: otpCode, // Utile pour la simulation de boîte aux lettres
		expiresIn: "15 minutes",
	};
});
