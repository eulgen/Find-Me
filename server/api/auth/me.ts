import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler((event) => {
	const sessionCookie = getCookie(event, "findme_session");

	if (!sessionCookie) {
		return { user: null };
	}

	try {
		const user = JSON.parse(sessionCookie);
		return { user };
	} catch (error) {
		return { user: null };
	}
});
