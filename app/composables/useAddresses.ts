/**
 * @file useAddresses.ts
 * @description Composable centralisant l'état réactif et les opérations CRUD simples sur les adresses citoyennes.
 *
 * Les validations ont été déléguées à `useValidation.ts` et les téléchargements
 * de certificats PDF ou SVG ont été délégués à `useAddressExporter.ts`.
 */

import { ref, computed } from "vue";
import { type AddressData } from "../types/types";
import { useToasts } from "./useToasts";
import { useAuth } from "./useAuth";
import { useAddressExporter } from "./useAddressExporter";
import { useMemory } from "./useMemory";

const defaultAddress: AddressData = {
	fullName: "Famille Ndeng Brice",
	phone: "+237 699 12 34 56",
	city: "Yaoundé",
	neighborhood: "Bastos",
	streetName: "Rue de la Joie",
	housePlateNumber: "28B",
	landmark: "En face de la Pharmacie de l'Europe, près du grand manguier",
	coordinates: {
		lat: 3.848,
		lng: 11.5021,
	},
	addressCode: "FM-YDE-BAS-28B",
};

const address = ref<AddressData>({ ...defaultAddress });
const isCreateAddressOpen = ref<boolean>(false);

const { data: addressesList } = useMemory<any[]>("adresses", [
	{
		fullName: "Brice Ndeng",
		phone: "+237 699 12 34 56",
		city: "Yaoundé",
		arrondissement: "Yaoundé I",
		neighborhood: "Bastos",
		postalCode: "00237",
		housePlateNumber: "28B",
		streetName: "Rue de la Joie",
		landmark: "En face de la Pharmacie de l'Europe, près du grand manguier",
		coordinates: {
			lat: 3.848,
			lng: 11.5021,
		},
		addressCode: "FM-YDE-BAS-28B",
		photoRaw: "/assets/images/cameroon_house_address_1780109511639.png",
		photoStats: {
			compressed: "194 KB",
			ratio: "84",
		},
		userId: "u-1",
		email: "ndengbrice@gmail.com"
	},
]);

const selectedAddressDetails = ref<any | null>(null);
const selectedAddressDetailsIndex = ref<number | null>(null);
const showDetailsModal = ref<boolean>(false);

const showDeleteConfirm = ref<boolean>(false);
const addressToDeleteIndex = ref<number | null>(null);

// ── Draft management (localStorage via useMemory) ──────────────────────────
const { data: draftsList } = useMemory<any[]>("findme_drafts_v2", []);

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_ADDRESSES = 4;

export function useAddresses() {
	const { addToast } = useToasts();
	const { currentUser } = useAuth();
	const { downloadAddressFile, downloadAddressPDF } = useAddressExporter();

	// Filter addresses by current logged-in user
	const filteredUserAddresses = computed(() => {
		if (!currentUser.value) return [];
		return addressesList.value.filter(
			(addr) =>
				addr.userId === currentUser.value?.id ||
				addr.email === currentUser.value?.email ||
				(!addr.userId && currentUser.value?.id === "u-1") // Brice Ndeng fallback
		);
	});

	const canAddMore = computed(() => filteredUserAddresses.value.length < MAX_ADDRESSES);

	const openAddressDetails = (idx: number) => {
		selectedAddressDetailsIndex.value = idx;
		selectedAddressDetails.value = filteredUserAddresses.value[idx];
		showDetailsModal.value = true;
	};

	const handleAddressCreated = (newAddress: any) => {
		// Enforce maximum 4 addresses per user
		if (filteredUserAddresses.value.length >= MAX_ADDRESSES) {
			addToast(
				`❌ Limite atteinte : vous ne pouvez pas enregistrer plus de ${MAX_ADDRESSES} adresses.`,
				"error",
			);
			return false;
		}

		// Set owner info
		newAddress.userId = currentUser.value?.id || "u-1";
		newAddress.email = currentUser.value?.email || "ndengbrice@gmail.com";

		// Uniqueness check (city + neighborhood + housePlateNumber)
		const isDuplicate = filteredUserAddresses.value.some(
			(addr) =>
				addr.city === newAddress.city &&
				addr.neighborhood?.toLowerCase().trim() ===
					newAddress.neighborhood?.toLowerCase().trim() &&
				addr.housePlateNumber?.toLowerCase().trim() ===
					newAddress.housePlateNumber?.toLowerCase().trim(),
		);
		if (isDuplicate) {
			addToast(
				"⚠️ Cette adresse existe déjà dans votre portefeuille citoyen.",
				"info",
			);
			return false;
		}

		addressesList.value = [newAddress, ...addressesList.value];
		address.value = newAddress;

		addToast("🎉 Votre adresse findMe a été créée avec succès !", "success");
		return true;
	};

	const handleAddressUpdated = (idx: number, updatedAddress: any) => {
		const targetAddr = filteredUserAddresses.value[idx];
		if (targetAddr) {
			const globalIdx = addressesList.value.indexOf(targetAddr);
			if (globalIdx !== -1) {
				addressesList.value[globalIdx] = {
					...addressesList.value[globalIdx],
					...updatedAddress,
				};
				addToast("✏️ Adresse mise à jour avec succès.", "success");
			}
		}
	};

	const confirmDeleteAddress = (idx: number) => {
		addressToDeleteIndex.value = idx;
		showDeleteConfirm.value = true;
	};

	const executeDeleteAddress = () => {
		if (addressToDeleteIndex.value !== null) {
			const targetAddr = filteredUserAddresses.value[addressToDeleteIndex.value];
			if (targetAddr) {
				addressesList.value = addressesList.value.filter(
					(addr) => addr !== targetAddr,
				);

				// Réinitialiser la sélection si l'adresse visualisée est celle supprimée
				if (selectedAddressDetails.value === targetAddr) {
					selectedAddressDetails.value = null;
					selectedAddressDetailsIndex.value = null;
					showDetailsModal.value = false;
				}

				addToast(
					`🗑️ L'adresse (${targetAddr.addressCode}) a été retirée définitivement.`,
					"success",
				);
			}
		}
		showDeleteConfirm.value = false;
		addressToDeleteIndex.value = null;
	};

	return {
		address,
		isCreateAddressOpen,
		addressesList: filteredUserAddresses, // Expose filtered list
		selectedAddressDetails,
		selectedAddressDetailsIndex,
		showDetailsModal,
		showDeleteConfirm,
		addressToDeleteIndex,
		canAddMore,
		MAX_ADDRESSES,
		openAddressDetails,
		handleAddressCreated,
		handleAddressUpdated,
		confirmDeleteAddress,
		executeDeleteAddress,
		downloadAddressFile,
		downloadAddressPDF,
		draftsList,
	};
}
