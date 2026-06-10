import { defineEventHandler, deleteCookie } from "h3";

export default defineEventHandler((event) => {
	deleteCookie(event, "findme_session", {
		path: "/",
	});
	return {
		success: true,
		message: "Session cleared successfully",
	};
});
