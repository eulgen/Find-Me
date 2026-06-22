/**
 * @file useUserProfile.ts
 * @description Composable gérant la logique métier du profil utilisateur :
 * formulaire de mise à jour des informations personnelles et upload/compression
 * de la photo de profil. Séparé du composable principal pour respecter
 * le principe de responsabilité unique (SRP).
 */

import { ref } from "vue";
import { useAuth } from "./useAuth";
import { useToasts } from "./useToasts";

export function useUserProfile() {
	const { currentUser } = useAuth();
	const { addToast } = useToasts();

	// ─── État réactif du formulaire de profil ──────────────────────────────
	const profileForm = ref({
		firstName: currentUser.value?.username?.split(" ")[0] || "",
		lastName: currentUser.value?.username?.split(" ").slice(1).join(" ") || "",
		phone: currentUser.value?.phone || "",
	});

	/** Indique si une mise à jour est en cours (pour l'état loading du bouton) */
	const isUpdatingProfile = ref(false);

	// ─── Actions ──────────────────────────────────────────────────────────

	/**
	 * Met à jour le nom complet et le téléphone de l'utilisateur connecté.
	 * Les changements sont appliqués localement (état réactif) avec retour
	 * utilisateur via un toast de succès.
	 */
	const updateProfile = () => {
		if (!currentUser.value) return;

		isUpdatingProfile.value = true;

		// Simulation d'un délai réseau pour le feedback UX
		setTimeout(() => {
			if (currentUser.value) {
				const fullName = `${profileForm.value.firstName} ${profileForm.value.lastName}`.trim();
				currentUser.value.username = fullName || currentUser.value.username;
				currentUser.value.phone = profileForm.value.phone;
				addToast("✅ Profil mis à jour avec succès", "success");
			}
			isUpdatingProfile.value = false;
		}, 800);
	};

	/**
	 * Gère l'upload d'une photo de profil.
	 * La photo est lue en base64, compressée via canvas (max 512px, qualité 0.8)
	 * et stockée dans `currentUser.photo`.
	 * @param e - Événement de changement du champ file input
	 */
	const handleProfilePhotoUpload = (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				// Compression : redimensionnement max 512px
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				const maxDim = 512;
				let { width, height } = img;
				if (width > maxDim || height > maxDim) {
					if (width > height) {
						height = Math.round((height * maxDim) / width);
						width = maxDim;
					} else {
						width = Math.round((width * maxDim) / height);
						height = maxDim;
					}
				}
				canvas.width = width;
				canvas.height = height;
				ctx?.drawImage(img, 0, 0, width, height);

				if (currentUser.value) {
					currentUser.value.photo = canvas.toDataURL("image/jpeg", 0.8);
					addToast("📸 Photo de profil mise à jour", "success");
				}
			};
			img.src = event.target?.result as string;
		};
		reader.readAsDataURL(file);
	};

	/**
	 * Synchronise les champs du formulaire avec les données actuelles de l'utilisateur.
	 * À appeler si `currentUser` est mis à jour de manière externe.
	 */
	const syncProfileForm = () => {
		if (currentUser.value) {
			profileForm.value.firstName = currentUser.value.username?.split(" ")[0] || "";
			profileForm.value.lastName = currentUser.value.username?.split(" ").slice(1).join(" ") || "";
			profileForm.value.phone = currentUser.value.phone || "";
		}
	};

	return {
		profileForm,
		isUpdatingProfile,
		updateProfile,
		handleProfilePhotoUpload,
		syncProfileForm,
	};
}
