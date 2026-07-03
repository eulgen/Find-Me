<!--
  @file CreateAddressForm.vue
  @description Boîte de dialogue (Modale) d'immatriculation d'adresse municipale findMe Cameroun.
  Elle intègre de concert les composants modulaires de saisie d'identité, de géophysique
  et de prise de photo.
-->

<script setup lang="ts">
	import { ref, watch } from "vue";
	import {
		PlusCircle,
		X,
		CheckSquare,
		ShieldCheck,
		Sparkles,
	} from "lucide-vue-next";
	import { useValidation } from "../../composables/useValidation";
	import FormUserInfoFields from "../address-form/FormUserInfoFields.vue";
	import FormCityFields from "../address-form/FormCityFields.vue";
	import FormLocationFields from "../address-form/FormLocationFields.vue";
	import FormPhotoCapture from "../address-form/FormPhotoCapture.vue";
	import ButtonUI from "./ButtonUI.vue";

	const props = defineProps<{
		isOpen: boolean;
	}>();

	const emit = defineEmits<{
		(e: "close"): void;
		(e: "success", newAddress: any): void;
	}>();

	const { validateCameroonHouseNumber, validateCameroonPostalCode } =
		useValidation();

	const formFullName = ref("");
	const formPhone = ref("");
	const formCity = ref<"Yaoundé" | "Douala" | "Bafoussam" | "Garoua" | "Kribi">(
		"Yaoundé",
	);
	const formArrondissement = ref("Yaoundé I");
	const formQuartier = ref("");
	const formPostalCode = ref("00237");
	const formHouseNumber = ref("");
	const formLat = ref("3.8480");
	const formLng = ref("11.5021");
	const formLandmark = ref("");
	const formPhoto = ref<{
		raw: string;
		stats: { compressed: string; ratio: string };
	} | null>(null);

	const isSubmitting = ref(false);

	const errors = ref({
		fullName: "",
		phone: "",
		city: "",
		arrondissement: "",
		quartier: "",
		postalCode: "",
		houseNumber: "",
		lat: "",
		lng: "",
		landmark: "",
	});

	const hints = ref({
		postalCode: "",
		houseNumber: "",
	});

	// Validation réactive au fil de l'eau
	watch(formHouseNumber, (newVal) => {
		const res = validateCameroonHouseNumber(newVal);
		errors.value.houseNumber = res.message;
		hints.value.houseNumber = res.hint || "";
	});

	watch(formPostalCode, (newVal) => {
		const res = validateCameroonPostalCode(newVal);
		errors.value.postalCode = res.message;
		hints.value.postalCode = res.hint || "";
	});

	watch(formCity, (newCity) => {
		if (newCity === "Yaoundé") {
			formArrondissement.value = "Yaoundé I";
			formLat.value = "3.8480";
			formLng.value = "11.5021";
		} else if (newCity === "Douala") {
			formArrondissement.value = "Douala I";
			formLat.value = "4.0511";
			formLng.value = "9.7679";
		} else if (newCity === "Bafoussam") {
			formArrondissement.value = "Bafoussam I";
			formLat.value = "5.4778";
			formLng.value = "10.4178";
		} else if (newCity === "Garoua") {
			formArrondissement.value = "Garoua I";
			formLat.value = "9.3000";
			formLng.value = "13.4000";
		} else if (newCity === "Kribi") {
			formArrondissement.value = "Kribi I";
			formLat.value = "2.9333";
			formLng.value = "9.9167";
		}
	});

	const handleFormSubmit = (e: Event) => {
		e.preventDefault();

		// Validation simple des champs obligatoires
		errors.value.fullName = !formFullName.value.trim()
			? "Le nom complet est obligatoire."
			: "";
		errors.value.phone = !formPhone.value.trim()
			? "Le téléphone de raccord est obligatoire."
			: "";
		errors.value.quartier = !formQuartier.value.trim()
			? "Le quartier de raccord est obligatoire."
			: "";

		const houseCheck = validateCameroonHouseNumber(formHouseNumber.value);
		errors.value.houseNumber = houseCheck.message;

		const zipCheck = validateCameroonPostalCode(formPostalCode.value);
		errors.value.postalCode = zipCheck.message;

		if (
			errors.value.fullName ||
			errors.value.phone ||
			errors.value.quartier ||
			errors.value.houseNumber ||
			errors.value.postalCode
		) {
			return;
		}

		isSubmitting.value = true;

		setTimeout(() => {
			const cityCompact =
				formCity.value === "Douala"
					? "DLA"
					: formCity.value === "Yaoundé"
						? "YDE"
						: formCity.value === "Bafoussam"
							? "BFM"
							: formCity.value === "Garoua"
								? "GAR"
								: "KRI";
			const block = formQuartier.value
				.substring(0, 3)
				.toUpperCase()
				.replace(/\s/g, "");
			const finalCode = `FM-${cityCompact}-${block}-${formHouseNumber.value || "SPlate"}`;

			const newAddr = {
				fullName: formFullName.value,
				phone: formPhone.value,
				city: formCity.value,
				arrondissement: formArrondissement.value,
				neighborhood: formQuartier.value,
				postalCode: formPostalCode.value || "00237",
				housePlateNumber: formHouseNumber.value,
				streetName: "Axe principal de quartier",
				landmark: formLandmark.value,
				coordinates: {
					lat: parseFloat(formLat.value) || 3.848,
					lng: parseFloat(formLng.value) || 11.5021,
				},
				addressCode: finalCode,
				photoRaw:
					formPhoto.value?.raw ||
					"/assets/images/cameroon_house_address_1780109511639.png",
				photoStats: {
					compressed: formPhoto.value?.stats?.compressed || "184 KB",
					ratio: formPhoto.value?.stats?.ratio || "84",
				},
			};

			isSubmitting.value = false;
			emit("success", newAddr);
		}, 1400);
	};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="address-form-modal-title"
		id="address-modal-mask"
	>
		<div
			class="relative w-full max-w-4xl bg-white border-4 border-[#155dfc] rounded-[32px] shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
		>
			<!-- Bouton de fermeture de modale -->
			<button
				@click="emit('close')"
				class="absolute top-4 right-4 p-2 rounded-xl border border-[#155dfc]/20 text-[#155dfc] hover:bg-[#F5F2FB] hover:border-[#155dfc]"
				title="Fermer le formulaire de création d'adresse"
				id="close-modal-top-btn"
			>
				<X class="w-5 h-5 stroke-[2.5]" />
			</button>

			<!-- En-tête -->
			<div class="text-left space-y-2">
				<h2
					id="address-form-modal-title"
					class="text-2xl md:text-3xl font-black text-[#155dfc] flex items-center space-x-2"
				>
					<PlusCircle class="w-7 h-7 text-[#00bc7d]" />
					<span>Immatriculer mon Adresse</span>
				</h2>
				<p
					class="text-[11px] font-bold text-[#155dfc]/60 flex items-center space-x-1.5 uppercase tracking-wider"
				>
					<ShieldCheck class="w-4 h-4 text-[#00bc7d]" />
					<span>Norme Municipale homologuée par findMe Cameroun</span>
				</p>
			</div>

			<!-- Corps du formulaire -->
			<form
				@submit="handleFormSubmit"
				class="space-y-6"
				id="creation-address-core-form"
			>
				<FormUserInfoFields
					v-model:fullName="formFullName"
					v-model:phone="formPhone"
					:errors="errors"
				/>

				<FormCityFields
					v-model:city="formCity"
					v-model:arrondissement="formArrondissement"
					v-model:quartier="formQuartier"
					v-model:postalCode="formPostalCode"
					v-model:houseNumber="formHouseNumber"
					:hints="hints"
					:errors="errors"
				/>

				<FormLocationFields
					v-model:lat="formLat"
					v-model:lng="formLng"
					v-model:landmark="formLandmark"
					:errors="errors"
				/>

				<FormPhotoCapture @photo-loaded="(img) => (formPhoto = img)" />

				<!-- Soumission -->
				<div
					class="pt-4 flex justify-end space-x-3 border-t border-[#155dfc]/10"
					id="form-submit-footer"
				>
					<ButtonUI type="button" variant="outline" @click="emit('close')">
						Annuler
					</ButtonUI>

					<ButtonUI
						type="submit"
						variant="primary"
						:loading="isSubmitting"
						:disabled="isSubmitting"
						id="modal-sumbit-btn"
					>
						Valider & Enregistrer
					</ButtonUI>
				</div>
			</form>
		</div>
	</div>
</template>
