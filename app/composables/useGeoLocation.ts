// composables/useGeoLocation.ts
import { ref } from "vue";

export const useGeoLocation = () => {
	const config = useRuntimeConfig();
	const adresseId = ref({
		region: "",
		departement: "",
		ville: "",
		quartier: "",
	});
	const enChargement = ref(false);
	const erreur = ref("");

	// 1. Forcer le GPS à chercher la position la plus précise possible
	const obtenirCoordonnees = (): Promise<{
		latitude: number;
		longitude: number;
	}> => {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation)
				return reject("Géolocalisation non supportée.");

			navigator.geolocation.getCurrentPosition(
				(pos) =>
					resolve({
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
					}),
				() => reject("Accès à la position refusé."),
				{
					enableHighAccuracy: true, // 🌟 CRUCIAL : Force l'utilisation du vrai GPS (ou puce mobile) plutôt que l'IP internet
					timeout: 15000, // Laisse 15 secondes au GPS pour se caler précisément
					maximumAge: 0, // Force à récupérer une position fraîche, pas une ancienne en cache
				},
			);
		});
	};

	// 2. Interroger Mapbox avec un filtrage de précision
	const recupererAdresse = async () => {
		enChargement.value = true;
		erreur.value = "";

		try {
			const position = await obtenirCoordonnees();
			const token = config.public.mapboxToken;

			console.log(
				"Longitude : ",
				position.longitude,
				"  Latitude : ",
				position.latitude,
			);

			if (!token) throw new Error("Token Mapbox manquant.");

			// Dans votre composables/useGeoLocation.ts
			// On appelle l'API locale qu'on vient de créer, plus aucun risque de CORS !
			const reponse: any = await $fetch("/api/geocoding", {
				query: {
					longitude: position.longitude,
					latitude: position.latitude,
				},
			});

			if (reponse && reponse.features && reponse.features.length > 0) {
				const principal = reponse.features[0];
				const context = principal.context; // Le contexte est directement ici en v5

				let quartierDetecte = principal.text; // Souvent le lieu ou quartier le plus proche
				let villeDetectee = "";
				let departementDetecte = "";
				let regionDetectee = "";

				if (context) {
					for (const item of context) {
						if (
							item.id.includes("neighborhood") ||
							item.id.includes("locality")
						) {
							quartierDetecte = item.text;
						}
						if (item.id.includes("place")) {
							villeDetectee = item.text;
						}
						if (item.id.includes("district")) {
							departementDetecte = item.text;
						}
						if (item.id.includes("region")) {
							regionDetectee = item.text;
						}
					}
				}

				adresseId.value = {
					region: regionDetectee,
					departement: departementDetecte,
					ville: villeDetectee,
					quartier: quartierDetecte !== villeDetectee ? quartierDetecte : "",
				};
			} else {
				throw new Error("Aucune adresse trouvée.");
			}
		} catch (err: any) {
			erreur.value = err.message || "Erreur de géocodage.";
		} finally {
			enChargement.value = false;
		}
	};

	return {
		adresseId,
		enChargement,
		erreur,
		recupererAdresse,
	};
};
