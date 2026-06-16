/**
 * @file useContactSupport.ts
 * @description Composable gérant la logique métier du formulaire de Support Client FindMe.
 * Encapsule les champs du formulaire, la validation, et la soumission vers l'API.
 */

import { ref, computed } from "vue";
import useApi from "./useApi";

const { api } = useApi();

export function useContactSupport() {
	// -------------------------
	// Form Fields
	// -------------------------
	const name = ref("");
	const email = ref("");
	const message = ref("");
	const category = ref<"assistance" | "technical">("assistance");

	// -------------------------
	// States
	// -------------------------
	const isSubmitting = ref(false);
	const submitSuccess = ref(false);
	const errorFeedback = ref("");
	const ticketInfo = ref<any>(null);

	// -------------------------
	// Touch / Validation states
	// -------------------------
	const nameTouched = ref(false);
	const emailTouched = ref(false);
	const messageTouched = ref(false);

	// Regular expression for strict email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// -------------------------
	// Computed validation properties
	// -------------------------
	const isNameValid = computed(() => name.value.trim().length >= 2);

	const isEmailValid = computed(() => emailRegex.test(email.value.trim()));

	const isMessageValid = computed(() => message.value.trim().length >= 15);

	const isFormValid = computed(
		() => isNameValid.value && isEmailValid.value && isMessageValid.value,
	);

	// -------------------------
	// Actions
	// -------------------------

	const handleCategorySelect = (type: "assistance" | "technical") => {
		category.value = type;
	};

	const submitSupportMessage = async () => {
		const $api = await api();

		nameTouched.value = true;
		emailTouched.value = true;
		messageTouched.value = true;

		if (!isFormValid.value) {
			errorFeedback.value =
				"Veuillez corriger les erreurs avant d'envoyer votre demande.";
			return;
		}

		isSubmitting.value = true;
		errorFeedback.value = "";

		try {
			const response = (await $api("/api/support", {
				method: "POST",
				body: {
					name: name.value,
					email: email.value,
					message: message.value,
					category: category.value,
				},
			})) as any;

			if (response && response.success) {
				submitSuccess.value = true;
				ticketInfo.value = response.ticket;

				// Reset form fields and touch states
				name.value = "";
				email.value = "";
				message.value = "";
				nameTouched.value = false;
				emailTouched.value = false;
				messageTouched.value = false;
			} else {
				errorFeedback.value =
					"Une erreur s'est produite lors de la transmission. Veuillez réessayer.";
			}
		} catch (error: any) {
			console.error("Support submission error:", error);
			errorFeedback.value =
				error.data?.message ||
				"Impossible de joindre le serveur de support FindMe.";
		} finally {
			isSubmitting.value = false;
		}
	};

	const resetAfterSuccess = () => {
		submitSuccess.value = false;
		ticketInfo.value = null;
	};

	return {
		// Fields
		name,
		email,
		message,
		category,
		// States
		isSubmitting,
		submitSuccess,
		errorFeedback,
		ticketInfo,
		// Touch states
		nameTouched,
		emailTouched,
		messageTouched,
		// Computed
		isNameValid,
		isEmailValid,
		isMessageValid,
		isFormValid,
		// Actions
		handleCategorySelect,
		submitSupportMessage,
		resetAfterSuccess,
	};
}
