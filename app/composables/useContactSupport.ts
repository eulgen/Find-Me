/**
 * @file useContactSupport.ts
 * @description Composable gérant la logique métier du formulaire de Support Client FindMe.
 * Encapsule les champs du formulaire, la validation, et la soumission vers l'API.
 */

import { ref, computed } from "vue";
import { useMemory } from "./useMemory";
import { useToasts } from "./useToasts";

export function useContactSupport() {
	const { data: supportList } = useMemory<any[]>("support", []);
	const { addToast } = useToasts();
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
		nameTouched.value = true;
		emailTouched.value = true;
		messageTouched.value = true;

		if (!isFormValid.value) {
			errorFeedback.value = "Veuillez corriger les erreurs avant d'envoyer votre demande.";
			return;
		}

		isSubmitting.value = true;
		errorFeedback.value = "";

		try {
			// Save using useMemory
			if (!Array.isArray(supportList.value)) {
				supportList.value = [];
			}

			const payload = {
				id: `msg_${Math.random().toString(36).substr(2, 5)}`,
				name: name.value,
				email: email.value,
				message: message.value,
				status: "non_traite",
				createdAt: new Date().toISOString()
			};

			supportList.value.push(payload);

			submitSuccess.value = true;
			ticketInfo.value = { ticketId: payload.id };
			
			addToast("Merci pour votre feedback, vous serez recontacter dans les plus bref délais", "success");

			// Reset form fields and touch states
			name.value = "";
			email.value = "";
			message.value = "";
			nameTouched.value = false;
			emailTouched.value = false;
			messageTouched.value = false;
		} catch (error: any) {
			console.error("Support submission error:", error);
			errorFeedback.value = "Une erreur est survenue lors de l'enregistrement de votre message.";
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
