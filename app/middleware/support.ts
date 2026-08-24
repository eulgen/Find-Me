/**
 * @file middleware/support.ts
 * @description Middleware de protection des routes d'agent de support.
 *
 * Vérifie la présence du JWT et que l'utilisateur courant a le rôle SUPPORT_AGENT ou ADMIN.
 * Si non, redirige vers /auth/signin ou /.
 */
export default defineNuxtRouteMiddleware(async (to) => {
	if (typeof window === "undefined") return;

	const accessToken = localStorage.getItem("accessToken");

	if (!accessToken) {
		if (to.path !== "/auth/signin") {
			return navigateTo("/auth/signin");
		}
		return;
	}

	const { currentUser, isSessionLoaded, initSession } = useAuth();

	if (!isSessionLoaded.value) {
		await initSession();
	}

	const user = currentUser.value;
	const role = (user?.role || "").toUpperCase();

	if (!user || (role !== "SUPPORT_AGENT" && role !== "ADMIN")) {
		return navigateTo("/");
	}
});
