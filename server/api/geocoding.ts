// server/api/geocoding.ts
export default defineEventHandler(async (event) => {
	// 1. Récupérer la longitude et la latitude envoyées par le composable
	const { longitude, latitude } = getQuery(event);

	// 2. Récupérer le token Mapbox directement depuis le serveur Nuxt
	const config = useRuntimeConfig();
	const token = config.public.mapboxToken;

	try {
		// 3. Le serveur Nuxt appelle Mapbox (Pas de problème de CORS ici !)
		const data = await $fetch(
			`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${token}&language=fr&limit=3&country=cm`,
		);

		console.log("Data : ", data);

		return data;
	} catch (error: any) {
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: "Erreur lors de l'appel à Mapbox API",
		});
	}
});
