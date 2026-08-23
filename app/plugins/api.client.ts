/**
 * @file api.client.ts
 * @description Plugin Nuxt côté client qui configure l'instance $fetch globale.
 *
 * - baseURL : Spring Boot backend (http://localhost:8080)
 * - Authentification : JWT stateless (accessToken + refreshToken dans localStorage)
 * - Interception 401 : tente un rafraîchissement silencieux du token, sinon déconnecte
 */

export default defineNuxtPlugin((nuxtApp) => {
	const BACKEND_URL = "http://localhost:8080";

	/** Lit l'accessToken depuis le localStorage (client only) */
	const getAccessToken = (): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("accessToken");
	};

	/** Lit le refreshToken depuis le localStorage (client only) */
	const getRefreshToken = (): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("refreshToken");
	};

	/** Sauvegarde les tokens JWT dans le localStorage */
	const saveTokens = (accessToken: string, refreshToken: string) => {
		if (typeof window === "undefined") return;
		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
	};

	/** Supprime les tokens JWT du localStorage (déconnexion) */
	const clearTokens = () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	};

	/**
	 * Tente de rafraîchir l'accessToken via le backend.
	 * Retourne true si le rafraîchissement a réussi, false sinon.
	 */
	const tryRefreshToken = async (): Promise<boolean> => {
		const refreshToken = getRefreshToken();
		if (!refreshToken) return false;

		try {
			const res = await $fetch<{ accessToken: string; refreshToken: string }>(
				"/api/auth/refresh",
				{
					baseURL: BACKEND_URL,
					method: "POST",
					body: { refreshToken },
				},
			);
			if (res.accessToken && res.refreshToken) {
				saveTokens(res.accessToken, res.refreshToken);
				return true;
			}
			return false;
		} catch {
			return false;
		}
	};

	const api = $fetch.create({
		baseURL: BACKEND_URL,
		onRequest({ options }) {
			// Injecter le Bearer Token sur chaque requête si disponible
			const token = getAccessToken();
			if (token) {
				const headers = (options.headers ||= {} as Record<string, string>);
				(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
			}
		},
		async onResponseError({ request, response, options }) {
			// Tentative de refresh silencieux sur 401
			if (response.status === 401) {
				const refreshed = await tryRefreshToken();
				if (refreshed) {
					// Relancer la requête originale avec le nouveau token
					const newToken = getAccessToken();
					const retryOptions = {
						...options,
						headers: {
							...(options.headers as Record<string, string>),
							Authorization: `Bearer ${newToken}`,
						},
					};
					try {
						await $fetch(request, retryOptions);
					} catch {
						// Si le retry échoue aussi, déconnecter
						clearTokens();
					}
				} else {
					// Refresh impossible → déconnecter proprement
					clearTokens();
				}
			}
		},
	});

	// Exposer les helpers JWT pour une utilisation dans les composables
	return {
		provide: {
			api,
			saveTokens,
			clearTokens,
			getAccessToken,
			getRefreshToken,
		},
	};
});
