/**
 * @file useUserProfile.ts
 * @description Composable gérant la logique métier du profil utilisateur.
 *
 * Connecté au backend Spring Boot :
 *   GET /api/users/me           → Profil courant (Bearer token)
 *   PUT /api/users/me  body: { fullName, phoneNumber }  → 200 OK (Bearer token)
 */

import { ref } from "vue";
import { useAuth, getAccessToken } from "./useAuth";
import { useToasts } from "./useToasts";

export function useUserProfile() {
	const { currentUser, initSession } = useAuth();
	const { addToast } = useToasts();

	// ── État réactif du formulaire de profil ──────────────────────────────
	const profileForm = ref({
		fullName: currentUser.value?.fullName || "",
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
			const token = getAccessToken();
			const headers: Record<string, string> = { "Content-Type": "application/json" };
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
			const updated = await ($api as any)<any>("/api/users/me", {
				method: "PUT",
				headers,
				body: {
					fullName: profileForm.value.fullName.trim(),
					phoneNumber: profileForm.value.phone.trim() || undefined,
				},
			});

			// Mettre à jour l'état réactif local
			if (currentUser.value) {
				currentUser.value.fullName = updated?.fullName || profileForm.value.fullName;
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
	 * Téléverse l'image au backend via POST /api/users/me/profile-image (multipart/form-data)
	 * et met à jour l'état réactif `currentUser`.
	 */
	const handleProfilePhotoUpload = async (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file || !currentUser.value) return;

		isUpdatingProfile.value = true;
		try {
			const { $api } = useNuxtApp();
			const token = getAccessToken();
			const headers: Record<string, string> = {};
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
			const formData = new FormData();
			formData.append("file", file);

			const updatedUser = await ($api as any)<any>("/api/users/me/profile-image", {
				method: "POST",
				headers,
				body: formData,
			});

			if (updatedUser?.profileImage) {
				currentUser.value.profileImage = updatedUser.profileImage;
			}
			addToast("📸 Photo de profil téléversée et enregistrée avec succès !", "success");
		} catch (err: any) {
			const msg =
				err?.data?.message ||
				err?.data?.detail ||
				"Impossible de téléverser la photo de profil.";
			addToast(`⚠️ ${msg}`, "error");
			console.error("[useUserProfile] handleProfilePhotoUpload error:", err);
		} finally {
			isUpdatingProfile.value = false;
		}
	};

	/**
	 * Synchronise les champs du formulaire avec les données actuelles de l'utilisateur.
	 * À appeler si `currentUser` est mis à jour de manière externe.
	 */
	const syncProfileForm = () => {
		if (currentUser.value) {
			profileForm.value.fullName = currentUser.value.fullName || "";
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
