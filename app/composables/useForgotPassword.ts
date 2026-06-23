import { ref, watch, onMounted } from "vue";
import useApi from "./useApi";
import type { User } from "~/types/types";
import { useMemory } from "#imports";

const { api } = useApi();
const { saveInStorage, loadInStorage, data, filterInStorage } = useMemory<
	User[]
>("users", []);

/**
 * Composable gérant la logique métier de la réinitialisation de mot de passe findMe.
 *
 * @param initialEmail  - Email pré-rempli (depuis la props du composant parent)
 * @param onSuccess     - Callback déclenché après réinitialisation réussie, avec { email, password }
 */
export function useForgotPassword(
	initialEmail: string = "",
	onSuccess?: (payload: { email: string; password: string }) => void,
) {
	const { addToast } = useToasts();
	// ── États ──────────────────────────────────────────────────────────────
	const email = ref(initialEmail);
	const step = ref<"email" | "reset">("email"); // 'email' = envoi lien, 'reset' = saisie nouveau mdp
	const isRecoveryLoading = ref(false);
	const newPassword = ref("");

	// ── Critères visuels de mot de passe ───────────────────────────────────
	const hasMinLength = ref(false);
	const hasUppercase = ref(false);
	const hasNumber = ref(false);

	watch(newPassword, (newVal) => {
		hasMinLength.value = newVal.length >= 8;
		hasUppercase.value = /[A-Z]/.test(newVal);
		hasNumber.value = /[0-9]/.test(newVal);
	});

	// ── Envoi du lien/code de récupération ─────────────────────────────────
	const handleSendRecoveryLink = async (e?: Event) => {
		if (e) e.preventDefault();
		const $api = await api();

		const emailVal = email.value.trim();
		if (!emailVal) {
			// Par défaut si vide, simuler avec takam@exemple.com
			email.value = "takam@exemple.com";
		}

		isRecoveryLoading.value = true;
		try {
			const res = await $api<any>("/api/auth/password-reset", {
				method: "POST",
				body: {
					email: email.value,
				},
			});

			if (res.message) {
				addToast(
					`Un lien de réinitialisation de mot de passe a été envoyé à votre boîte mail (${email.value}) !`,
					"success",
				);

				// Passer à l'écran de changement de mot de passe
				step.value = "reset";
			}
		} catch (err: any) {
			addToast(
				`Désolé, il semblerait que nous ayons un souci au niveau de l'envoi du mail de reinitialisation`,
				"info",
			);
		} finally {
			isRecoveryLoading.value = false;
		}
	};

	// ── Réinitialisation finale du mot de passe ────────────────────────────
	const handleResetSubmit = async (e: Event) => {
		e.preventDefault();
		const $api = await api();

		if (!email.value || !newPassword.value) {
			addToast("Veuillez saisir votre nouveau mot de passe.", "info");
			return;
		}

		if (newPassword.value.length < 8) {
			addToast("Le mot de passe doit faire au moins 8 caractères.", "info");
			return;
		}

		isRecoveryLoading.value = true;
		try {
			const recoveryToken = "secure_reset_token_example";
			const res = await $api<any>("/api/auth/password-reset/confirm", {
				method: "POST",
				// headers: {
				// 	"x-mock-response-code": "401",
				// },
				body: {
					token: recoveryToken,
					newPassword: newPassword.value,
				},
			});
			if (res.message) {
				addToast(
					"🎉 Excellent ! Votre mot de passe a été réinitialisé avec succès.",
					"success",
				);

				// Confirmation par toast différé
				const typedPass = newPassword.value;
				loadInStorage();
				if (data) {
					const existingUser = filterInStorage(
						(item) => item.email === email.value,
					);
					existingUser[0].password = typedPass;
					saveInStorage();
				}
				setTimeout(() => {
					addToast(`Vous serez redirigé vers la page connexion`, "info");
				}, 1200);

				// Émettre le succès pour préremplir sur la page de connexion
				setTimeout(() => {
					onSuccess?.({ email: email.value, password: typedPass });
				}, 2000);
			}
		} catch (err: any) {
			addToast(
				`Oops visiblement il y a un soucis au niveau de la réinitialisation du mot de passe , veillez revenir à la page de connexion et réessayer`,
				"info",
			);
		} finally {
			isRecoveryLoading.value = false;
		}
	};

	// ── Déclenchement automatique pour takam@exemple.com ──────────────────
	onMounted(() => {
		if (email.value === "takam@exemple.com") {
			handleSendRecoveryLink();
		}
	});

	return {
		// État
		email,
		step,
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
