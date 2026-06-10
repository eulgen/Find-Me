import { defineEventHandler, readBody, setCookie, createError } from "h3";
import { getDb, saveDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, username, password, phone } = body;

	if (!email || !username || !password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message:
				"Tous les champs obligatoires (Email, Nom, Mot de passe) sont requis",
		});
	}

	const emailLower = email.toLowerCase().trim();
	const passwordTyped = password.trim();

	const db = getDb();

	// 1. Unique email check
	const isEmailTaken = db.users.some(
		(u) => u.email.toLowerCase().trim() === emailLower,
	);
	if (isEmailTaken) {
		throw createError({
			statusCode: 409,
			statusMessage: "Conflict",
			message: "Cette adresse e-mail est déjà utilisée dans le système.",
		});
	}

	// 2. Password complexity check
	const hasMinLength = passwordTyped.length >= 8;
	const hasUppercase = /[A-Z]/.test(passwordTyped);
	const hasNumber = /[0-9]/.test(passwordTyped);

	if (!hasMinLength || !hasUppercase || !hasNumber) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message:
				"Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule et un chiffre.",
		});
	}

	// 3. Create user
	const newUser = {
		id: "u-" + Date.now(),
		username: username.trim(),
		email: emailLower,
		password: passwordTyped,
		role: "citizen" as const,
		phone: phone ? phone.trim() : "+237 600 00 00 00",
		createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
	};

	db.users.push(newUser);
	saveDb(db);

	const sessionUser = {
		email: newUser.email,
		username: newUser.username,
		role: newUser.role,
		phone: newUser.phone,
	};

	// Log user in automatically
	setCookie(event, "findme_session", JSON.stringify(sessionUser), {
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 1 week
	});

	return {
		success: true,
		user: sessionUser,
	};
});
