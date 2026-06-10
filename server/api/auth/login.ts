import { defineEventHandler, readBody, setCookie, createError } from "h3";
import { getDb } from "../../utils/db";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email, password } = body;

	if (!email || !password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad Request",
			message: "Email and password are required",
		});
	}

	const emailLower = email.toLowerCase().trim();
	const passwordTyped = password.trim();

	const db = getDb();
	const user = db.users.find(
		(u) =>
			u.email.toLowerCase().trim() === emailLower &&
			u.password === passwordTyped,
	);

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
			message: "Identifiants incorrects. Veuillez réessayer",
		});
	}

	const sessionUser = {
		email: user.email,
		username: user.username,
		role: user.role,
		phone: user.phone || "",
	};

	// Set standard httpOnly-like cookie for REST compliance
	setCookie(event, "findme_session", JSON.stringify(sessionUser), {
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 1 week
	});

	return {
		success: true,
		user: sessionUser,
	};
});
