/**
 * @file middleware/auth.ts
 * @description Middleware de protection des routes authentifiées.
 *
 * Vérifie la présence de l'accessToken JWT dans localStorage.
 * Si absent, redirige vers /auth/signin.
 */
export default defineNuxtRouteMiddleware((to) => {
	// localStorage n'est disponible que côté client
	if (typeof window === "undefined") return;

	const accessToken = localStorage.getItem("accessToken");

	if (!accessToken) {
		if (to.path !== "/auth/signin") {
			return navigateTo("/auth/signin");
		}
	}
});
