/**
 * @file useUserProfile.ts
 * @description Composable gérant la logique métier du profil utilisateur.
 *
 * Connecté au backend Spring Boot :
 *   GET /api/users/me           → Profil courant (Bearer token)
 *   PUT /api/users/me  body: { fullName, phoneNumber }  → 200 OK (Bearer token)
 */

import { ref } from "vue";
import { useAuth } from "./useAuth";
import { useToasts } from "./useToasts";

export function useUserProfile() {
	const { currentUser, initSession } = useAuth();
	const { addToast } = useToasts();

	// ── État réactif du formulaire de profil ──────────────────────────────
	const profileForm = ref({
		fullName: currentUser.value?.fullName || currentUser.value?.username || "",
		phone: currentUser.value?.phoneNumber || "",
	});

	/** Indique si une mise à jour est en cours */
	const isUpdatingProfile = ref(false);

	// ── Actions ────────────────────────────────────────────────────────────

	/**
	 * Met à jour le profil de l'utilisateur connecté.
	 * Contrat : PUT /api/users/me  body: { fullName, phoneNumber }  → 200 OK
	 */
	const updateProfile = async () => {
		if (!currentUser.value) return;
		const { $api } = useNuxtApp();

		isUpdatingProfile.value = true;
		try {
			const updated = await ($api as any)<any>("/api/users/me", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: {
					fullName: profileForm.value.fullName.trim(),
					phoneNumber: profileForm.value.phone.trim() || undefined,
				},
			});

			// Mettre à jour l'état réactif local
			if (currentUser.value) {
				currentUser.value.fullName = updated?.fullName || profileForm.value.fullName;
				currentUser.value.username = updated?.fullName || profileForm.value.fullName;
				currentUser.value.phoneNumber = updated?.phoneNumber || profileForm.value.phone;
			}

			addToast("✅ Profil mis à jour avec succès", "success");
		} catch (err: any) {
			const msg =
				err?.data?.message ||
				"Impossible de mettre à jour votre profil. Veuillez réessayer.";
			addToast(`⚠️ ${msg}`, "error");
			console.error("[useUserProfile] updateProfile error:", err);
		} finally {
			isUpdatingProfile.value = false;
		}
	};

	/**
	 * Gère l'upload d'une photo de profil.
	 * La photo est lue en base64, compressée via canvas (max 512px, qualité 0.8)
	 * et stockée localement dans `currentUser.photo` (affichage immédiat).
	 * Note : Le backend ne dispose pas d'endpoint dédié à la photo de profil utilisateur.
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
					addToast("📸 Photo de profil mise à jour (localement)", "success");
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
			profileForm.value.fullName =
				currentUser.value.fullName || currentUser.value.username || "";
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
