/**
 * @file useCitizenSpacePage.ts
 * @description Composable centralisant la logique métier de la page Espace Citoyen
 * (formulaire d'adresse, carte, géolocalisation, brouillon, actions CRUD).
 */

import { ref, computed, onMounted, watch } from "vue";
import { useAuth } from "./useAuth";
import { useToasts } from "./useToasts";
import { useShare } from "./useShare";
import { useAddresses } from "./useAddresses";
import { useNavigation } from "./useNavigation";

const DEFAULT_FORM_STATE = () => ({
	country: "Cameroun",
	city: "Yaoundé",
	neighborhood: "",
	street: "",
	houseNumber: "",
	postalCode: "",
	lat: "3.8480",
	lng: "11.5021",
	photo: "",
	photoStats: null as { compressed: string; ratio: string } | null,
});

const COUNTRIES = ["Cameroun", "Côte d'Ivoire", "Sénégal", "Gabon", "Congo"];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
	"Cameroun": ["Yaoundé", "Douala", "Bafoussam", "Garoua", "Kribi"],
	"Côte d'Ivoire": ["Abidjan", "Yamoussoukro", "Bouaké", "San-Pédro"],
	"Sénégal": ["Dakar", "Thiès", "Mbour", "Saint-Louis"],
	"Gabon": ["Libreville", "Port-Gentil", "Franceville"],
	"Congo": ["Brazzaville", "Pointe-Noire"],
};

const DRAFT_FORM_KEY = "findme_address_form_draft";

export function useCitizenSpacePage() {
	const { currentUser } = useAuth();
	const { addToast } = useToasts();
	const { handleShareLink } = useShare();

	const {
		addressesList,
		openAddressDetails,
		confirmDeleteAddress,
		downloadAddressPDF,
		handleAddressCreated,
		handleAddressUpdated,
		executeDeleteAddress,
		showDeleteConfirm,
		canAddMore,
		MAX_ADDRESSES,
		draftsList,
	} = useAddresses();

	const { handleGoHome } = useNavigation();

	const localTab = ref<"list" | "map">("list");

	const isFormOpen = ref(false);
	const formStep = ref(1);
	const editIndex = ref<number | null>(null);
	const currentDraftId = ref<string | null>(null);

	const formState = ref(DEFAULT_FORM_STATE());

	const formErrors = ref({
		neighborhood: "",
		street: "",
		houseNumber: "",
		photo: "",
	});

	const countries = COUNTRIES;

	const availableCities = computed(() => {
		return CITIES_BY_COUNTRY[formState.value.country] || [];
	});

	watch(() => formState.value.country, (newCountry) => {
		const cities = CITIES_BY_COUNTRY[newCountry];
		formState.value.city = cities && cities[0] ? cities[0] : "";
	});

	const baseCoords = computed(() => {
		if (formState.value.city === "Douala") return { lat: 4.0511, lng: 9.7679 };
		if (formState.value.city === "Bafoussam") return { lat: 5.4778, lng: 10.4178 };
		if (formState.value.city === "Garoua") return { lat: 9.3000, lng: 13.4000 };
		if (formState.value.city === "Kribi") return { lat: 2.9333, lng: 9.9167 };
		if (formState.value.city === "Abidjan") return { lat: 5.3600, lng: -4.0083 };
		if (formState.value.city === "Yamoussoukro") return { lat: 6.8276, lng: -5.2893 };
		if (formState.value.city === "Dakar") return { lat: 14.7167, lng: -17.4677 };
		if (formState.value.city === "Libreville") return { lat: 0.4162, lng: 9.4673 };
		if (formState.value.city === "Brazzaville") return { lat: -4.2634, lng: 15.2832 };

		return { lat: 3.8480, lng: 11.5021 };
	});

	const markerPos = computed(() => {
		const latVal = parseFloat(formState.value.lat) || baseCoords.value.lat;
		const lngVal = parseFloat(formState.value.lng) || baseCoords.value.lng;
		const latDiff = latVal - baseCoords.value.lat;
		const lngDiff = lngVal - baseCoords.value.lng;
		const x = Math.max(5, Math.min(95, (lngDiff / 0.03 + 0.5) * 100));
		const y = Math.max(5, Math.min(95, (0.5 - latDiff / 0.03) * 100));
		return { x, y };
	});

	const handleMapClick = async (e: MouseEvent) => {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const clickY = e.clientY - rect.top;
		const pctX = clickX / rect.width;
		const pctY = clickY / rect.height;

		const newLng = baseCoords.value.lng + (pctX - 0.5) * 0.03;
		const newLat = baseCoords.value.lat + (0.5 - pctY) * 0.03;

		formState.value.lat = newLat.toFixed(6);
		formState.value.lng = newLng.toFixed(6);

		try {
			const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&accept-language=fr`);
			const data = await res.json();
			if (data && data.address) {
				if (data.address.country) formState.value.country = data.address.country;
				const city = data.address.city || data.address.town || data.address.village || data.address.county;
				if (city) formState.value.city = city;
				const neighborhood = data.address.suburb || data.address.neighbourhood || data.address.residential;
				if (neighborhood) formState.value.neighborhood = neighborhood;
				if (data.address.road) formState.value.street = data.address.road;
			}
		} catch (error) {
			console.error("Erreur de géocodage inverse", error);
		}
	};

	const geolocateUser = () => {
		if (!navigator.geolocation) {
			addToast("La géolocalisation n'est pas supportée par votre navigateur.", "error");
			return;
		}

		addToast("🛰️ Obtention des coordonnées satellite...", "info");
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				formState.value.lat = position.coords.latitude.toFixed(6);
				formState.value.lng = position.coords.longitude.toFixed(6);
				addToast("📍 Position GPS synchronisée !", "success");

				try {
					addToast("🔍 Analyse de l'adresse...", "info");
					const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=fr`);
					const data = await res.json();
					if (data && data.address) {
						if (data.address.country) formState.value.country = data.address.country;
						const city = data.address.city || data.address.town || data.address.village || data.address.county;
						if (city) formState.value.city = city;
						const neighborhood = data.address.suburb || data.address.neighbourhood || data.address.residential;
						if (neighborhood) formState.value.neighborhood = neighborhood;
						if (data.address.road) formState.value.street = data.address.road;
						addToast("✅ Adresse pré-remplie avec succès", "success");
					}
				} catch (error) {
					console.error("Erreur de géocodage inverse", error);
				}
			},
			() => {
				addToast("⚠️ Impossible d'obtenir la position GPS automatiquement. Veuillez entrer les coordonnées ou cliquer sur la carte.", "info");
			},
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	};

	const handlePhotoUpload = (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				const maxDim = 720;
				let width = img.width;
				let height = img.height;
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

				const compressedBase64 = canvas.toDataURL("image/jpeg", 0.72);
				const origSizeKB = Math.round(file.size / 1024);
				const compSizeKB = Math.round((compressedBase64.length * 3) / 4 / 1024);
				const ratio = Math.round(((origSizeKB - compSizeKB) / origSizeKB) * 100);

				formState.value.photo = compressedBase64;
				formState.value.photoStats = {
					compressed: `${compSizeKB} KB`,
					ratio: ratio > 0 ? ratio.toString() : "0",
				};
				addToast(`⚡ Photo optimisée : ${compSizeKB} KB (-${ratio}% de poids)`, "success");
			};
			img.src = event.target?.result as string;
		};
		reader.readAsDataURL(file);
	};

	const saveFormDraft = () => {
		if (typeof window !== "undefined" && currentDraftId.value) {
			if (!Array.isArray(draftsList.value)) {
				draftsList.value = [];
			}
			const index = draftsList.value.findIndex((d: any) => d.id === currentDraftId.value);
			const draftData = {
				id: currentDraftId.value,
				form: formState.value,
				step: formStep.value,
				editIndex: editIndex.value,
				updatedAt: Date.now()
			};
			if (index !== -1) {
				draftsList.value[index] = draftData;
			} else {
				draftsList.value.push(draftData);
			}
		}
	};

	const resumeDraft = (id: string) => {
		if (typeof window !== "undefined") {
			navigateTo(`/users/${currentUser.value?.id}/adresses/create?draftId=${id}`);
		}
	};

	const clearFormDraft = () => {
		if (typeof window !== "undefined" && currentDraftId.value) {
			draftsList.value = draftsList.value.filter(d => d.id !== currentDraftId.value);
			currentDraftId.value = null;
		}
	};

	const deleteDraft = (id: string) => {
		draftsList.value = draftsList.value.filter(d => d.id !== id);
		addToast("🗑️ Brouillon supprimé", "success");
	};

	watch(formState, () => {
		if (isFormOpen.value) {
			saveFormDraft();
		}
	}, { deep: true });

	const openCreateForm = () => {
		const currentDraftsCount = Array.isArray(draftsList.value) ? draftsList.value.length : 0;
		if (currentDraftsCount >= 2) {
			addToast(`❌ Limite atteinte : vous ne pouvez avoir que 2 brouillons en cours.`, "error");
			return;
		}
		currentDraftId.value = `draft-${Date.now()}`;
		formState.value = DEFAULT_FORM_STATE();
		formStep.value = 1;
		editIndex.value = null;
		isFormOpen.value = true;
		
		if (typeof window !== "undefined") {
			navigateTo(`/users/${currentUser.value?.id}/adresses/create`);
		}
	};

	const openEditForm = (idx: number) => {
		const target = addressesList.value[idx];
		if (!target) return;
		editIndex.value = idx;
		currentDraftId.value = `edit-${idx}-${Date.now()}`;
		formState.value = {
			country: target.country || "Cameroun",
			city: target.city,
			neighborhood: target.neighborhood,
			street: target.streetName || "",
			houseNumber: target.housePlateNumber || "",
			postalCode: target.postalCode || "",
			lat: target.coordinates?.lat?.toString() || "3.8480",
			lng: target.coordinates?.lng?.toString() || "11.5021",
			photo: target.photoRaw || "",
			photoStats: target.photoStats || null,
		};
		formStep.value = 1;
		isFormOpen.value = true;
	};

	const cancelForm = () => {
		isFormOpen.value = false;
		clearFormDraft();
	};

	const validateStep = (step: number) => {
		let valid = true;
		if (step === 2) {
			if (!formState.value.neighborhood.trim()) {
				formErrors.value.neighborhood = "Le quartier est requis.";
				valid = false;
			} else {
				formErrors.value.neighborhood = "";
			}
			if (!formState.value.street.trim()) {
				formErrors.value.street = "La rue est requise.";
				valid = false;
			} else {
				formErrors.value.street = "";
			}
			if (!formState.value.houseNumber.trim()) {
				formErrors.value.houseNumber = "Le numéro est requis.";
				valid = false;
			} else {
				formErrors.value.houseNumber = "";
			}
		} else if (step === 3) {
			if (!formState.value.photo) {
				formErrors.value.photo = "Une photo du bâtiment est obligatoire.";
				valid = false;
			} else {
				formErrors.value.photo = "";
			}
		}
		return valid;
	};

	const nextStep = () => {
		if (validateStep(formStep.value)) {
			formStep.value++;
		}
	};

	const prevStep = () => {
		if (formStep.value > 1) {
			formStep.value--;
		}
	};

	const submitForm = () => {
		if (!validateStep(formStep.value)) return;

		const cityAbbr = formState.value.city.substring(0, 3).toUpperCase();
		const qAbbr = formState.value.neighborhood.substring(0, 3).toUpperCase().replace(/\s/g, "");
		const addrCode = `FM-${cityAbbr}-${qAbbr}-${formState.value.houseNumber}`;

		const addressPayload = {
			fullName: currentUser.value?.username || "Citoyen",
			phone: currentUser.value?.phoneNumber || "+237 600 00 00 00",
			country: formState.value.country,
			city: formState.value.city,
			neighborhood: formState.value.neighborhood,
			streetName: formState.value.street,
			housePlateNumber: formState.value.houseNumber,
			postalCode: formState.value.postalCode,
			coordinates: {
				lat: parseFloat(formState.value.lat),
				lng: parseFloat(formState.value.lng),
			},
			addressCode: addrCode,
			photoRaw: formState.value.photo || "/assets/images/cameroon_house_address_1780109511639.png",
			photoStats: formState.value.photoStats || { compressed: "194 KB", ratio: "84" },
		};

		if (editIndex.value !== null) {
			handleAddressUpdated(editIndex.value, addressPayload);
			isFormOpen.value = false;
			clearFormDraft();
		} else {
			const success = handleAddressCreated(addressPayload);
			if (success) {
				isFormOpen.value = false;
				clearFormDraft();
			}
		}
	};

	onMounted(() => {
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0 });
		}
	});

	return {
		currentUser,
		handleGoHome,
		handleShareLink,
		addressesList,
		MAX_ADDRESSES,
		canAddMore,
		openAddressDetails,
		downloadAddressPDF,
		confirmDeleteAddress,
		executeDeleteAddress,
		showDeleteConfirm,
		localTab,
		isFormOpen,
		formStep,
		editIndex,
		formState,
		formErrors,
		countries,
		availableCities,
		markerPos,
		handleMapClick,
		geolocateUser,
		handlePhotoUpload,
		openCreateForm,
		openEditForm,
		cancelForm,
		nextStep,
		prevStep,
		submitForm,
		draftsList,
		resumeDraft,
		deleteDraft,
	};
}
