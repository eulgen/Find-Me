/**
 * @file useAddresses.ts
 * @description Composable centralisant l'état réactif et les opérations CRUD sur les adresses.
 *
 * Connecté au backend Spring Boot via l'API REST (contrat Postman) :
 *   GET    /api/addresses?page=0&size=10      → Liste paginée
 *   POST   /api/addresses                     → Création
 *   GET    /api/addresses/{id}                → Détail
 *   PUT    /api/addresses/{id}                → Mise à jour
 *   DELETE /api/addresses/{id}                → Suppression
 *   POST   /api/addresses/{id}/photo          → Upload photo (multipart)
 *   GET    /api/addresses/{id}/export         → Données pour PDF
 *   GET    /api/files/addresses/{filename}    → URL publique de la photo
 */

import { ref, computed } from "vue";
import type { AddressData, CreateAddressPayload } from "../types/types";
import { useToasts } from "./useToasts";
import { useAuth } from "./useAuth";
import { useAddressExporter } from "./useAddressExporter";

const BACKEND_URL = "http://localhost:8080";

// ── État global réactif ───────────────────────────────────────────────────
const addressesList = ref<any[]>([]);
const isLoadingAddresses = ref<boolean>(false);
const selectedAddressDetails = ref<any | null>(null);
const selectedAddressDetailsIndex = ref<number | null>(null);
const showDetailsModal = ref<boolean>(false);
const showDeleteConfirm = ref<boolean>(false);
const addressToDeleteIndex = ref<number | null>(null);
const isCreateAddressOpen = ref<boolean>(false);

const MAX_ADDRESSES = 4;

// ── Helpers de normalisation ───────────────────────────────────────────────
/**
 * Normalise une adresse backend (snake_case / camelCase backend)
 * vers le format AddressData du frontend.
 */
const normalizeAddress = (addr: any): any => {
	return {
		...addr,
		// Mapping backend → frontend
		city: addr.city || "",
		neighborhood: addr.district || addr.neighborhood || "",
		streetName: addr.street || addr.streetName || "",
		housePlateNumber: addr.houseNumber || addr.housePlateNumber || "",
		coordinates: {
			lat: addr.gps?.latitude ?? addr.coordinates?.lat ?? 0,
			lng: addr.gps?.longitude ?? addr.coordinates?.lng ?? 0,
		},
		gps: addr.gps || {
			latitude: addr.coordinates?.lat ?? 0,
			longitude: addr.coordinates?.lng ?? 0,
		},
		// Photo publique via /api/files/addresses/{filename}
		photoRaw: addr.photoUrl
			? `${BACKEND_URL}/api/files/addresses/${addr.photoUrl.split("/").pop()}`
			: addr.photoRaw || null,
		addressCode: addr.addressCode || `FM-${addr.id || Date.now()}`,
	};
};

/**
 * Convertit un AddressData frontend vers le payload attendu par le backend.
 */
const toCreatePayload = (addr: any): CreateAddressPayload => ({
	country: addr.country || "Cameroun",
	city: addr.city,
	district: addr.neighborhood || addr.district || "",
	postalCode: addr.postalCode || undefined,
	street: addr.streetName || addr.street || "",
	houseNumber: addr.housePlateNumber || addr.houseNumber || undefined,
	gps: {
		latitude: addr.coordinates?.lat ?? addr.gps?.latitude ?? 0,
		longitude: addr.coordinates?.lng ?? addr.gps?.longitude ?? 0,
	},
});

export function useAddresses() {
	const { addToast } = useToasts();
	const { currentUser } = useAuth();
	const { downloadAddressFile, downloadAddressPDF } = useAddressExporter();
	const { $api } = useNuxtApp();

	// ── Lecture ────────────────────────────────────────────────────────────
	/**
	 * Charge la liste des adresses de l'utilisateur connecté.
	 * Contrat : GET /api/addresses?page=0&size=10 (Bearer token requis)
	 */
	const fetchAddresses = async (page = 0, size = 10) => {
		isLoadingAddresses.value = true;
		try {
			const res = await ($api as any)<any>(`/api/addresses?page=${page}&size=${size}`);
			// Spring Boot renvoie une Page<T> avec .content[]
			const items = res?.content ?? (Array.isArray(res) ? res : []);
			addressesList.value = items.map(normalizeAddress);
		} catch (err: any) {
			const msg = err?.data?.message || "Impossible de charger vos adresses.";
			console.error("[useAddresses] fetchAddresses error:", err);
			addToast(`⚠️ ${msg}`, "error");
		} finally {
			isLoadingAddresses.value = false;
		}
	};

	// ── Création ───────────────────────────────────────────────────────────
	/**
	 * Crée une nouvelle adresse.
	 * Contrat : POST /api/addresses  body: CreateAddressPayload  → 201 + adresse créée
	 * Limite : max 4 adresses par utilisateur (rejet 400 côté backend).
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
			const payload = toCreatePayload(newAddress);
			const created = await ($api as any)<any>("/api/addresses", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: payload,
			});

			addressesList.value = [normalizeAddress(created), ...addressesList.value];
			addToast("🎉 Votre adresse FindMe a été créée avec succès !", "success");
			return true;
		} catch (err: any) {
			const msg = err?.data?.message || "Impossible de créer cette adresse.";
			addToast(`⚠️ ${msg}`, "error");
			return false;
		}
	};

	// ── Mise à jour ────────────────────────────────────────────────────────
	/**
	 * Met à jour une adresse existante.
	 * Contrat : PUT /api/addresses/{id}  body: CreateAddressPayload  → adresse mise à jour
	 * Note : Tous les champs obligatoires (country, city, gps) doivent être fournis.
	 */
	const handleAddressUpdated = async (idx: number, updatedAddress: any) => {
		const target = addressesList.value[idx];
		if (!target?.id) {
			addToast("⚠️ Adresse introuvable.", "error");
			return;
		}

		try {
			const payload = toCreatePayload({ ...target, ...updatedAddress });
			const updated = await ($api as any)<any>(`/api/addresses/${target.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: payload,
			});

			addressesList.value[idx] = normalizeAddress(updated);
			addToast("✏️ Adresse mise à jour avec succès.", "success");
		} catch (err: any) {
			const msg = err?.data?.message || "Impossible de mettre à jour cette adresse.";
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
			await ($api as any)(`/api/addresses/${target.id}`, { method: "DELETE" });

			if (selectedAddressDetails.value === target) {
				selectedAddressDetails.value = null;
				selectedAddressDetailsIndex.value = null;
				showDetailsModal.value = false;
			}

			addressesList.value = addressesList.value.filter((_, i) => i !== addressToDeleteIndex.value);
			addToast(`🗑️ L'adresse (${target.addressCode}) a été supprimée.`, "success");
		} catch (err: any) {
			const msg = err?.data?.message || "Impossible de supprimer cette adresse.";
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
	const uploadAddressPhoto = async (addressId: number, file: File): Promise<string | null> => {
		try {
			const formData = new FormData();
			formData.append("photo", file);

			const res = await ($api as any)<{ photoUrl: string }>(
				`/api/addresses/${addressId}/photo`,
				{
					method: "POST",
					body: formData,
				},
			);

			if (res?.photoUrl) {
				const filename = res.photoUrl.split("/").pop();
				const publicUrl = `${BACKEND_URL}/api/files/addresses/${filename}`;

				// Mettre à jour localement
				const idx = addressesList.value.findIndex((a) => a.id === addressId);
				if (idx !== -1) {
					addressesList.value[idx].photoRaw = publicUrl;
					addressesList.value[idx].photoUrl = res.photoUrl;
				}
				addToast("📸 Photo mise à jour avec succès.", "success");
				return publicUrl;
			}
			return null;
		} catch (err: any) {
			const msg = err?.data?.message || "Impossible d'uploader la photo.";
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
