/**
 * @file useForgotPassword.ts
 * @description Composable gérant la réinitialisation de mot de passe via OTP.
 *
 * Respecte strictement le contrat Postman :
 *   Étape 1 : POST /api/auth/forgot-password  body: { email }  → 200 OK
 *   Étape 2 : POST /api/auth/reset-password   body: { email, code, newPassword }  → 200 OK
 */

import { ref, watch } from "vue";
import type { User } from "~/types/types";

/**
 * @param initialEmail  - Email pré-rempli (depuis la props du composant parent)
 * @param onSuccess     - Callback déclenché après réinitialisation réussie
 */
export function useForgotPassword(
	initialEmail: string = "",
	onSuccess?: (payload: { email: string; password: string }) => void,
) {
	const { addToast } = useToasts();

	// ── États ──────────────────────────────────────────────────────────────
	const email = ref(initialEmail);
	const isEmailSent = ref(false);
	const isRecoveryLoading = ref(false);
	const otpCode = ref("");
	const newPassword = ref("");

	// ── Critères visuels de mot de passe ───────────────────────────────────
	const hasMinLength = ref(false);
	const hasUppercase = ref(false);
	const hasNumber = ref(false);

	watch(newPassword, (val) => {
		hasMinLength.value = val.length >= 8;
		hasUppercase.value = /[A-Z]/.test(val);
		hasNumber.value = /[0-9]/.test(val);
	});

	// ── Étape 1 : Envoi OTP ────────────────────────────────────────────────
	/**
	 * Envoie un code OTP de réinitialisation par email.
	 * Contrat : POST /api/auth/forgot-password  body: { email }  → 200 OK
	 * Le backend renvoie 200 systématiquement (anti-account enumeration).
	 */
	const handleSendRecoveryLink = async (e?: Event) => {
		if (e) e.preventDefault();
		const { $api } = useNuxtApp();

		const emailVal = email.value.trim();
		if (!emailVal) {
			addToast("Veuillez saisir votre adresse e-mail.", "info");
			return;
		}

		isRecoveryLoading.value = true;
		try {
			await ($api as any)<void>("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: { email: emailVal },
			});

			// Backend retourne 200 systématiquement (même si email inconnu)
			addToast(
				`Un e-mail de réinitialisation a été envoyé à ${emailVal}. Consultez vos mails.`,
				"success",
			);
			isEmailSent.value = true;
		} catch (err: any) {
			const msg =
				err?.data?.message ||
				"Une erreur est survenue lors de l'envoi du code de récupération.";
			addToast(msg, "error");
		} finally {
			isRecoveryLoading.value = false;
		}
	};

	// ── Étape 2 : Réinitialisation du mot de passe ────────────────────────
	/**
	 * Réinitialise le mot de passe avec le code OTP reçu par mail.
	 * Contrat : POST /api/auth/reset-password  body: { email, code, newPassword }  → 200 OK
	 * Révoque tous les refresh tokens existants de l'utilisateur.
	 */
	const handleResetSubmit = async (e: Event) => {
		e.preventDefault();
		const { $api } = useNuxtApp();

		if (!email.value || !otpCode.value || !newPassword.value) {
			addToast("Veuillez renseigner tous les champs requis.", "info");
			return;
		}

		if (!hasMinLength.value || !hasUppercase.value || !hasNumber.value) {
			addToast(
				"Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.",
				"info",
			);
			return;
		}

		isRecoveryLoading.value = true;
		try {
			await ($api as any)<void>("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: {
					email: email.value.trim(),
					code: otpCode.value.trim(),
					newPassword: newPassword.value,
				},
			});

			addToast("🎉 Mot de passe réinitialisé avec succès !", "success");

			const typedPass = newPassword.value;
			setTimeout(() => {
				addToast("Vous allez être redirigé vers la page de connexion.", "info");
			}, 1200);

			setTimeout(() => {
				onSuccess?.({ email: email.value, password: typedPass });
			}, 2000);
		} catch (err: any) {
			const msg =
				err?.data?.message ||
				"Code OTP invalide ou expiré. Veuillez recommencer.";
			addToast(msg, "error");
		} finally {
			isRecoveryLoading.value = false;
		}
	};

	return {
		// État
		email,
		isEmailSent,
		otpCode,
		isRecoveryLoading,
		newPassword,
		// Critères mot de passe
		hasMinLength,
		hasUppercase,
		hasNumber,
		// Actions
		handleSendRecoveryLink,
		handleResetSubmit,
	};
}
