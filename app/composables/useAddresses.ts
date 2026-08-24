/**
 * @file useAddresses.ts
 * @description Composable centralisant l'état réactif et les opérations CRUD sur les adresses.
 *
 * Connecté au backend Spring Boot via l'API REST OpenAPI (api-docs.json) :
 *   GET    /api/addresses?page=0&size=10      → Liste paginée (PageAddressResponseDTO)
 *   POST   /api/addresses                     → Création (AddressRequestDTO -> AddressResponseDTO)
 *   GET    /api/addresses/{id}                → Détail
 *   PUT    /api/addresses/{id}                → Mise à jour (AddressRequestDTO -> AddressResponseDTO)
 *   DELETE /api/addresses/{id}                → Suppression (204 No Content)
 *   POST   /api/addresses/{id}/photo          → Upload photo (multipart/form-data)
 *   GET    /api/addresses/{id}/export         → Données pour PDF
 *   GET    /api/files/addresses/{filename}    → URL publique de la photo
 */

import { ref, computed } from "vue";
import type { AddressData, AddressRequestDTO, AddressResponseDTO, PageAddressResponseDTO } from "../types/types";
import { useToasts } from "./useToasts";
import { useAuth, getAccessToken } from "./useAuth";
import { useAddressExporter } from "./useAddressExporter";

const BACKEND_URL = "http://localhost:8080";

// ── État global réactif ───────────────────────────────────────────────────
const addressesList = ref<AddressData[]>([]);
const isLoadingAddresses = ref<boolean>(false);
const selectedAddressDetails = ref<AddressData | null>(null);
const selectedAddressDetailsIndex = ref<number | null>(null);
const showDetailsModal = ref<boolean>(false);
const showDeleteConfirm = ref<boolean>(false);
const addressToDeleteIndex = ref<number | null>(null);
const isCreateAddressOpen = ref<boolean>(false);

const MAX_ADDRESSES = 4;

/** Helper d'erreur RFC 7807 */
const extractMsg = (err: any, fallback: string): string => {
	return (
		err?.data?.title ||
		err?.data?.detail ||
		err?.data?.message ||
		err?.message ||
		fallback
	);
};

// ── Helpers de normalisation ───────────────────────────────────────────────

/**
 * Normalise un DTO backend (AddressResponseDTO) vers l'interface réactive AddressData du frontend.
 */
export const normalizeAddress = (addr: AddressResponseDTO | any): AddressData => {
	const filename = addr.photoUrl ? addr.photoUrl.split("/").pop() : null;
	const photoPublicUrl = filename
		? `${BACKEND_URL}/api/files/addresses/${filename}`
		: addr.photoRaw || addr.photoUrl || null;

	const lat = addr.gps?.latitude ?? addr.coordinates?.lat ?? 0;
	const lng = addr.gps?.longitude ?? addr.coordinates?.lng ?? 0;

	return {
		id: addr.id,
		addressCode: addr.addressCode || `FM-${addr.id || Date.now()}`,
		country: addr.country || "Cameroun",
		city: addr.city || "",
		district: addr.district || addr.neighborhood || "",
		neighborhood: addr.district || addr.neighborhood || "",
		street: addr.street || addr.streetName || "",
		streetName: addr.street || addr.streetName || "",
		houseNumber: addr.houseNumber || addr.housePlateNumber || "",
		housePlateNumber: addr.houseNumber || addr.housePlateNumber || "",
		postalCode: addr.postalCode || "",
		gps: { latitude: lat, longitude: lng },
		coordinates: { lat, lng },
		photoUrl: addr.photoUrl,
		photoRaw: photoPublicUrl,
		createdAt: addr.createdAt,
		updatedAt: addr.updatedAt,
	};
};

/**
 * Convertit un objet AddressData frontend vers le DTO officiel AddressRequestDTO.
 */
export const toAddressRequestDTO = (addr: any): AddressRequestDTO => ({
	country: addr.country || "Cameroun",
	city: addr.city || "Yaoundé",
	district: addr.district || addr.neighborhood || "Centre-ville",
	street: addr.street || addr.streetName || "Avenue de l'Indépendance",
	houseNumber: addr.houseNumber || addr.housePlateNumber || undefined,
	postalCode: addr.postalCode || undefined,
	photoUrl: addr.photoUrl || "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
	gps: {
		latitude: Number(addr.gps?.latitude ?? addr.coordinates?.lat ?? 3.8480),
		longitude: Number(addr.gps?.longitude ?? addr.coordinates?.lng ?? 11.5021),
	},
});

export function useAddresses() {
	const { addToast } = useToasts();
	const { currentUser } = useAuth();
	const { downloadAddressFile, downloadAddressPDF } = useAddressExporter();

	// ── Lecture ────────────────────────────────────────────────────────────
	/**
	 * Charge la liste des adresses de l'utilisateur connecté.
	 * Contrat : GET /api/addresses?page=0&size=10 (Bearer token requis)
	 */
	const fetchAddresses = async (page = 0, size = 10) => {
		isLoadingAddresses.value = true;
		try {
			const { $api } = useNuxtApp();
			const res = await ($api as any)<PageAddressResponseDTO>(`/api/addresses?page=${page}&size=${size}`);
			const items = res?.content ?? (Array.isArray(res) ? res : []);
			addressesList.value = items.map(normalizeAddress);
		} catch (err: any) {
			const msg = extractMsg(err, "Impossible de charger vos adresses.");
			addToast(`⚠️ ${msg}`, "error");
		} finally {
			isLoadingAddresses.value = false;
		}
	};

	// ── Création ───────────────────────────────────────────────────────────
	/**
	 * Crée une nouvelle adresse.
	 * Contrat : POST /api/addresses  body: AddressRequestDTO  → 201 + AddressResponseDTO
	 */
	const handleAddressCreated = async (newAddress: any): Promise<boolean> => {
		if (addressesList.value.length >= MAX_ADDRESSES) {
			addToast(
				`❌ Limite atteinte : vous ne pouvez pas enregistrer plus de ${MAX_ADDRESSES} adresses.`,
				"error",
			);
			return false;
		}

		try {
			const { $api } = useNuxtApp();
			const payload = toAddressRequestDTO(newAddress);
			const token = getAccessToken();
			const headers: Record<string, string> = { "Content-Type": "application/json" };
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}
			const created = await ($api as any)<AddressResponseDTO>("/api/addresses", {
				method: "POST",
				headers,
				body: payload,
			});

			let normalized = normalizeAddress(created);

			const photoToUpload = newAddress.photoRaw || newAddress.photo;
			if (photoToUpload && created?.id) {
				const publicPhotoUrl = await uploadAddressPhoto(created.id, photoToUpload);
				if (publicPhotoUrl) {
					normalized.photoRaw = publicPhotoUrl;
				}
			}

			addressesList.value = [normalized, ...addressesList.value];
			addToast("🎉 Votre adresse FindMe a été créée avec succès !", "success");
			return true;
		} catch (err: any) {
			const msg = extractMsg(err, "Impossible de créer cette adresse.");
			addToast(`⚠️ ${msg}`, "error");
			return false;
		}
	};

	// ── Mise à jour ────────────────────────────────────────────────────────
	/**
	 * Met à jour une adresse existante.
	 * Contrat : PUT /api/addresses/{id}  body: AddressRequestDTO  → AddressResponseDTO
	 */
	const handleAddressUpdated = async (idx: number, updatedAddress: any) => {
		const target = addressesList.value[idx];
		if (!target?.id) {
			addToast("⚠️ Adresse introuvable.", "error");
			return;
		}

		try {
			const { $api } = useNuxtApp();
			const payload = toAddressRequestDTO({ ...target, ...updatedAddress });
			const updated = await ($api as any)<AddressResponseDTO>(`/api/addresses/${target.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: payload,
			});

			addressesList.value[idx] = normalizeAddress(updated);
			addToast("✏️ Adresse mise à jour avec succès.", "success");
		} catch (err: any) {
			const msg = extractMsg(err, "Impossible de mettre à jour cette adresse.");
			addToast(`⚠️ ${msg}`, "error");
		}
	};

	// ── Suppression ────────────────────────────────────────────────────────
	const confirmDeleteAddress = (idx: number) => {
		addressToDeleteIndex.value = idx;
		showDeleteConfirm.value = true;
	};

	/**
	 * Supprime une adresse.
	 * Contrat : DELETE /api/addresses/{id}  → 204 No Content
	 */
	const executeDeleteAddress = async () => {
		if (addressToDeleteIndex.value === null) return;
		const target = addressesList.value[addressToDeleteIndex.value];

		if (!target?.id) {
			addToast("⚠️ Adresse introuvable.", "error");
			showDeleteConfirm.value = false;
			return;
		}

		try {
			const { $api } = useNuxtApp();
			await ($api as any)(`/api/addresses/${target.id}`, { method: "DELETE" });

			if (selectedAddressDetails.value === target) {
				selectedAddressDetails.value = null;
				selectedAddressDetailsIndex.value = null;
				showDetailsModal.value = false;
			}

			addressesList.value = addressesList.value.filter((_, i) => i !== addressToDeleteIndex.value);
			addToast(`🗑️ L'adresse (${target.addressCode}) a été supprimée.`, "success");
		} catch (err: any) {
			const msg = extractMsg(err, "Impossible de supprimer cette adresse.");
			addToast(`⚠️ ${msg}`, "error");
		} finally {
			showDeleteConfirm.value = false;
			addressToDeleteIndex.value = null;
		}
	};

	// ── Upload photo ───────────────────────────────────────────────────────
	/**
	 * Téléverse une photo pour une adresse.
	 * Contrat : POST /api/addresses/{id}/photo  multipart/form-data field: photo
	 */
	const uploadAddressPhoto = async (addressId: number, fileOrBase64: File | string): Promise<string | null> => {
		try {
			const { $api } = useNuxtApp();
			const formData = new FormData();

			if (typeof fileOrBase64 === "string") {
				if (fileOrBase64.startsWith("data:")) {
					const fetchRes = await fetch(fileOrBase64);
					const blob = await fetchRes.blob();
					formData.append("photo", blob, `address_${addressId}.jpg`);
				} else {
					return fileOrBase64;
				}
			} else {
				formData.append("photo", fileOrBase64);
			}

			const token = getAccessToken();
			const headers: Record<string, string> = {};
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}

			const res = await ($api as any)<AddressResponseDTO>(
				`/api/addresses/${addressId}/photo`,
				{
					method: "POST",
					headers,
					body: formData,
				},
			);

			if (res?.photoUrl) {
				const filename = res.photoUrl.split("/").pop();
				const publicUrl = `${BACKEND_URL}/api/files/addresses/${filename}`;

				const idx = addressesList.value.findIndex((a) => a.id === addressId);
				if (idx !== -1) {
					addressesList.value[idx].photoRaw = publicUrl;
					addressesList.value[idx].photoUrl = res.photoUrl;
				}
				return publicUrl;
			}
			return null;
		} catch (err: any) {
			const msg = extractMsg(err, "Impossible d'uploader la photo.");
			addToast(`⚠️ ${msg}`, "error");
			return null;
		}
	};

	// ── Helpers UI ─────────────────────────────────────────────────────────
	const openAddressDetails = (idx: number) => {
		selectedAddressDetailsIndex.value = idx;
		selectedAddressDetails.value = addressesList.value[idx];
		showDetailsModal.value = true;
	};

	const canAddMore = computed(() => addressesList.value.length < MAX_ADDRESSES);

	return {
		// État
		addressesList,
		isLoadingAddresses,
		isCreateAddressOpen,
		selectedAddressDetails,
		selectedAddressDetailsIndex,
		showDetailsModal,
		showDeleteConfirm,
		addressToDeleteIndex,
		canAddMore,
		MAX_ADDRESSES,
		// Actions
		fetchAddresses,
		openAddressDetails,
		handleAddressCreated,
		handleAddressUpdated,
		confirmDeleteAddress,
		executeDeleteAddress,
		uploadAddressPhoto,
		downloadAddressFile,
		downloadAddressPDF,
	};
}
