<script setup>
	import { ref } from "vue";

	// Import de notre composable
	const { adresseId, enChargement, erreur, recupererAdresse } =
		useGeoLocation();

	// Les variables liées aux champs de votre formulaire
	const etape = ref(1);
	const formulaire = ref({
		ville: "",
		departement: "",
		quartier: "",
		nomDomicile: "",
	});

	// Fonction pour déclencher la détection
	const autoRemplir = async () => {
		await recupererAdresse();

		if (!erreur.value) {
			// On injecte les données récupérées dans notre formulaire
			formulaire.value.ville = adresseId.value.ville;
			formulaire.value.departement = adresseId.value.departement;
			formulaire.value.quartier = adresseId.value.quartier;
		}
	};
</script>

<template>
	<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
		<h1 class="text-2xl font-bold text-center mb-6">
			FindMe - Localiser mon domicile
		</h1>

		<div
			class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
		>
			<p class="text-sm text-blue-700 mb-3">
				Gagnez du temps en préremplissant les informations grâce à votre
				position actuelle.
			</p>
			<button
				@click="autoRemplir"
				type="button"
				:disabled="enChargement"
				class="bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm hover:bg-blue-700 disabled:bg-blue-300 transition"
			>
				{{
					enChargement
						? "Localisation en cours..."
						: "📍 Me localiser et préremplir"
				}}
			</button>
			<p v-if="erreur" class="text-xs text-red-500 mt-2 font-semibold">
				{{ erreur }}
			</p>
		</div>

		<form @submit.prevent="soumettreFormulaire">
			<div v-if="etape === 1" class="space-y-4">
				<h2 class="text-lg font-semibold">Étape 1 : Région & Ville</h2>

				<div>
					<label class="block text-sm font-medium">Département / Région</label>
					<input
						v-model="formulaire.departement"
						type="text"
						class="w-full border p-2 rounded mt-1"
						placeholder="Ex: Wouri"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium">Ville</label>
					<input
						v-model="formulaire.ville"
						type="text"
						class="w-full border p-2 rounded mt-1"
						placeholder="Ex: Douala"
					/>
				</div>

				<button
					@click="etape = 2"
					type="button"
					class="w-full bg-gray-800 text-white p-2 rounded mt-4"
				>
					Suivant
				</button>
			</div>

			<div v-if="etape === 2" class="space-y-4">
				<h2 class="text-lg font-semibold">Étape 2 : Votre Zone</h2>

				<div>
					<label class="block text-sm font-medium">Quartier</label>
					<input
						v-model="formulaire.quartier"
						type="text"
						class="w-full border p-2 rounded mt-1"
						placeholder="Ex: Akwa, Bonamoussadi"
					/>
				</div>

				<div class="flex space-x-2 mt-4">
					<button
						@click="etape = 1"
						type="button"
						class="w-1/2 bg-gray-300 p-2 rounded"
					>
						Retour
					</button>
					<button
						@click="etape = 3"
						type="button"
						class="w-1/2 bg-gray-800 text-white p-2 rounded"
					>
						Suivant
					</button>
				</div>
			</div>

			<div v-if="etape === 3" class="space-y-4">
				<h2 class="text-lg font-semibold">Étape 3 : Description</h2>
				<div>
					<label class="block text-sm font-medium"
						>Donnez un nom à ce lieu</label
					>
					<input
						v-model="formulaire.nomDomicile"
						type="text"
						class="w-full border p-2 rounded mt-1"
						placeholder="Ex: Chez Papa"
					/>
				</div>
				<div class="flex space-x-2 mt-4">
					<button
						@click="etape = 2"
						type="button"
						class="w-1/2 bg-gray-300 p-2 rounded"
					>
						Retour
					</button>
					<button
						type="submit"
						class="w-1/2 bg-green-600 text-white p-2 rounded"
					>
						Enregistrer
					</button>
				</div>
			</div>
		</form>
	</div>
</template>
