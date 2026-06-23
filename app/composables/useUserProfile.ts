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
import { useMemory } from "./useMemory";

export function useUserProfile() {
	const { currentUser } = useAuth();
	const { addToast } = useToasts();

	// ─── État réactif du formulaire de profil ──────────────────────────────
	const profileForm = ref({
		username: currentUser.value?.username?.split(" ")[0] || "",
		phone: currentUser.value?.phoneNumber || "",
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
				const fullName = `${profileForm.value.username}`.trim();
				currentUser.value.username = fullName || currentUser.value.username;
				currentUser.value.phoneNumber = profileForm.value.phone;
				
				// Sauvegarder dans localStorage "users" sous le compte correspondant
				const { data: usersData, saveInStorage } = useMemory<any[]>("users", []);
				let userInList = usersData.value.find(
					(u: any) => u.email?.toLowerCase().trim() === currentUser.value?.email?.toLowerCase().trim()
				);
				if (userInList) {
					userInList.username = currentUser.value.username;
					userInList.phoneNumber = currentUser.value.phoneNumber;
				} else {
					userInList = {
						...currentUser.value,
					};
					usersData.value.push(userInList);
				}
				saveInStorage();

				// Mettre à jour le cookie de session findme_session
				const sessionCookie = useCookie<any>("findme_session");
				if (sessionCookie.value) {
					const cookieVal = typeof sessionCookie.value === "string"
						? JSON.parse(sessionCookie.value)
						: sessionCookie.value;
					cookieVal.username = currentUser.value.username;
					cookieVal.phoneNumber = currentUser.value.phoneNumber;
					sessionCookie.value = cookieVal;
				}

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
					const photoUrl = canvas.toDataURL("image/jpeg", 0.8);
					currentUser.value.photo = photoUrl;

					// Sauvegarder dans localStorage "users" sous le compte correspondant
					const { data: usersData, saveInStorage } = useMemory<any[]>("users", []);
					let userInList = usersData.value.find(
						(u: any) => u.email?.toLowerCase().trim() === currentUser.value?.email?.toLowerCase().trim()
					);
					if (userInList) {
						userInList.photo = photoUrl;
					} else {
						userInList = {
							...currentUser.value,
							photo: photoUrl
						};
						usersData.value.push(userInList);
					}
					saveInStorage();

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
			profileForm.value.username = currentUser.value.username?.split(" ")[0] || "";
			profileForm.value.phone = currentUser.value.phoneNumber || "";
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
