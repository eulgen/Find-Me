/**
 * @file middleware/admin.ts
 * @description Middleware de protection des routes d'administration.
 *
 * Vérifie la présence du JWT et que l'utilisateur courant a le rôle ADMIN.
 * Si non, redirige vers /auth/signin ou /.
 */
export default defineNuxtRouteMiddleware(async (to) => {
	// localStorage n'est disponible que côté client
	if (typeof window === "undefined") return;

	const accessToken = localStorage.getItem("accessToken");

	if (!accessToken) {
		if (to.path !== "/auth/signin") {
			return navigateTo("/auth/signin");
		}
		return;
	}

	// Vérifier le rôle via l'état réactif global de useAuth
	const { currentUser, isSessionLoaded, initSession } = useAuth();

	// S'assurer que la session est initialisée avant de vérifier le rôle
	if (!isSessionLoaded.value) {
		await initSession();
	}

	const user = currentUser.value;
	if (!user || (user.role !== "ADMIN" && user.rule !== "admin")) {
		return navigateTo("/");
	}
});
