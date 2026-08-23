/**
 * @file useContactSupport.ts
 * @description Composable gérant le formulaire de Support Client FindMe.
 *
 * Connecté au backend Spring Boot :
 *   POST /api/support  body: { name, email, message }  → 200 OK (endpoint public)
 *   Si l'email correspond à un utilisateur existant, la demande lui est rattachée.
 */

import { ref, computed } from "vue";
import { useToasts } from "./useToasts";

export function useContactSupport() {
	const { addToast } = useToasts();

	// ── Champs du formulaire ───────────────────────────────────────────────
	const name = ref("");
	const email = ref("");
	const message = ref("");
	const category = ref<"assistance" | "technical">("assistance");

	// ── États ─────────────────────────────────────────────────────────────
	const isSubmitting = ref(false);
	const submitSuccess = ref(false);
	const errorFeedback = ref("");
	const ticketInfo = ref<any>(null);

	// ── Touch / Validation states ──────────────────────────────────────────
	const nameTouched = ref(false);
	const emailTouched = ref(false);
	const messageTouched = ref(false);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// ── Computed validation ────────────────────────────────────────────────
	const isNameValid = computed(() => name.value.trim().length >= 2);
	const isEmailValid = computed(() => emailRegex.test(email.value.trim()));
	const isMessageValid = computed(() => message.value.trim().length >= 15);
	const isFormValid = computed(
		() => isNameValid.value && isEmailValid.value && isMessageValid.value,
	);

	// ── Actions ────────────────────────────────────────────────────────────
	const handleCategorySelect = (type: "assistance" | "technical") => {
		category.value = type;
	};

	/**
	 * Soumet le message de support.
	 * Contrat : POST /api/support  body: { name, email, message }  → 200 OK (public)
	 */
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
			const { $api } = useNuxtApp();
			const res = await ($api as any)<any>("/api/support", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: {
					name: name.value.trim(),
					email: email.value.trim(),
					message: message.value.trim(),
				},
			});

			submitSuccess.value = true;
			// Le backend peut retourner un id ou un ticketId
			const ticketId = res?.id || res?.ticketId || `msg_${Math.random().toString(36).substr(2, 5)}`;
			ticketInfo.value = { ticketId };

			addToast(
				"Merci pour votre message ! Vous serez recontacté dans les plus brefs délais.",
				"success",
			);

			// Réinitialisation du formulaire
			name.value = "";
			email.value = "";
			message.value = "";
			nameTouched.value = false;
			emailTouched.value = false;
			messageTouched.value = false;
		} catch (error: any) {
			const msg =
				error?.data?.message ||
				"Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.";
			errorFeedback.value = msg;
			addToast(`⚠️ ${msg}`, "error");
			console.error("[useContactSupport] submitSupportMessage error:", error);
		} finally {
			isSubmitting.value = false;
		}
	};

	const resetAfterSuccess = () => {
		submitSuccess.value = false;
		ticketInfo.value = null;
	};

	return {
		// Champs
		name,
		email,
		message,
		category,
		// États
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
