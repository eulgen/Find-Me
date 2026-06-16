export default defineNuxtRouteMiddleware((to, from) => {
	// 1. Récupérer le cookie qui stocke le token ou la session de l'utilisateur
	// Remplacez 'auth_token' par le nom du cookie généré par Firebase ou votre système
	const authToken = useCookie("findme_session");

	// 2. Vérifier si le cookie existe et a une valeur
	if (!authToken.value) {
		// Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
		// 'to.path' permet d'éviter une boucle infinie si la page cible est déjà /login
		if (to.path !== "/auth/signin") {
			return navigateTo("/auth/signin", { external: true });
		}
	}
});
