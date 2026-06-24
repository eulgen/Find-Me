/**
 * @file useSupportForm.ts
 * @description Composable gérant la logique métier du formulaire de support :
 * validation stricte des champs, gestion de l'état de soumission et retour
 * utilisateur après envoi. Isolé pour faciliter les tests et la réutilisation.
 */

import { ref } from "vue";
import { useAuth } from "./useAuth";
import { useToasts } from "./useToasts";
import { useMemory } from "./useMemory";

/** Sujets prédéfinis disponibles dans le formulaire de support */
export const SUPPORT_SUBJECTS = [
	"Demande d'assistance",
	"Signalement de problème technique",
	"Demande d'information",
	"Problème de création d'adresse",
	"Problème de validation",
	"Autre demande",
] as const;

export type SupportSubject = (typeof SUPPORT_SUBJECTS)[number];

export function useSupportForm() {
	const { currentUser } = useAuth();
	const { addToast } = useToasts();
	const { data: supportList } = useMemory<any[]>("support", []);

	// ─── État réactif du formulaire ────────────────────────────────────────
	const supportForm = ref({
		name: currentUser.value?.username || "",
		email: currentUser.value?.email || "",
		subject: SUPPORT_SUBJECTS[0] as SupportSubject,
		message: "",
	});

	/** Erreurs de validation par champ */
	const supportErrors = ref({
		name: "",
		email: "",
		message: "",
	});

	/** Indique si l'envoi est en cours */
	const isSubmittingSupport = ref(false);

	/** Indique si le message a été envoyé avec succès (pour afficher un état de confirmation) */
	const isSupportSent = ref(false);

	// ─── Validation ────────────────────────────────────────────────────────

	/**
	 * Valide tous les champs du formulaire de support.
	 * Renseigne `supportErrors` avec les messages d'erreur appropriés.
	 * @returns `true` si le formulaire est valide, `false` sinon
	 */
	const validateSupportForm = (): boolean => {
		let valid = true;
		// Reset des erreurs
		supportErrors.value = { name: "", email: "", message: "" };

		// Validation du nom (requis, min 2 caractères)
		if (!supportForm.value.name.trim() || supportForm.value.name.trim().length < 2) {
			supportErrors.value.name = "Le nom complet est requis (min. 2 caractères).";
			valid = false;
		}

		// Validation de l'email (requis, format valide)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!supportForm.value.email.trim() || !emailRegex.test(supportForm.value.email)) {
			supportErrors.value.email = "Une adresse email valide est requise.";
			valid = false;
		}

		// Validation du message (requis, min 10 caractères)
		if (!supportForm.value.message.trim() || supportForm.value.message.trim().length < 10) {
			supportErrors.value.message = "Le message doit contenir au moins 10 caractères.";
			valid = false;
		}

		return valid;
	};

	// ─── Actions ──────────────────────────────────────────────────────────

	/**
	 * Soumet le formulaire de support après validation.
	 * Sauvegarde le message dans le localStorage via useMemory.
	 */
	const submitSupport = () => {
		if (!validateSupportForm()) return;

		isSubmittingSupport.value = true;

		try {
			if (!Array.isArray(supportList.value)) {
				supportList.value = [];
			}

			const payload = {
				id: `msg_${Math.random().toString(36).substr(2, 5)}`,
				name: supportForm.value.name,
				email: supportForm.value.email,
				message: `[${supportForm.value.subject}] ${supportForm.value.message}`,
				status: "non_traite",
				createdAt: new Date().toISOString()
			};

			supportList.value.push(payload);

			addToast("Merci pour votre feedback, vous serez recontacter dans les plus bref délais", "success");

			// Réinitialisation partielle : on garde nom/email mais on vide le message
			supportForm.value.message = "";
			supportForm.value.subject = SUPPORT_SUBJECTS[0];
			isSupportSent.value = true;

			// Réinitialisation de l'état de succès après 5s
			setTimeout(() => { isSupportSent.value = false; }, 5000);
		} catch (error) {
			console.error(error);
		} finally {
			isSubmittingSupport.value = false;
		}
	};

	/** Réinitialise complètement le formulaire et les erreurs */
	const resetSupportForm = () => {
		supportForm.value = {
			name: currentUser.value?.username || "",
			email: currentUser.value?.email || "",
			subject: SUPPORT_SUBJECTS[0],
			message: "",
		};
		supportErrors.value = { name: "", email: "", message: "" };
		isSupportSent.value = false;
	};

	return {
		supportForm,
		supportErrors,
		isSubmittingSupport,
		isSupportSent,
		SUPPORT_SUBJECTS,
		submitSupport,
		resetSupportForm,
	};
}
