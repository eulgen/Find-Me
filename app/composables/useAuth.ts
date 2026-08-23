/**
 * @file useAuth.ts
 * @description Composable régissant l'authentification REST stateless findMe.
 *
 * Conforme au contrat Postman (findme.postman_collection.json) et au backend Spring Boot :
 * - POST /api/auth/signup         → { email, password, fullName } -> 201
 * - POST /api/auth/verify-account  → { email, code } -> 200
 * - POST /api/auth/resend-otp      → { email } -> 200
 * - POST /api/auth/signin         → { email, password } -> { accessToken, refreshToken }
 * - POST /api/auth/refresh        → { refreshToken } -> { accessToken, refreshToken }
 * - POST /api/auth/logout         → { refreshToken } -> 204
 * - POST /api/auth/forgot-password → { email } -> 200
 * - POST /api/auth/reset-password  → { email, code, newPassword } -> 200
 * - POST /api/auth/google          → { idToken } -> { accessToken, refreshToken }
 * - POST /api/auth/apple           → { idToken, fullName? } -> { accessToken, refreshToken }
 * - GET  /api/users/me             → User courant -> { id, email, fullName, phoneNumber, role, status, createdAt, lastLoginAt }
 *
 * Stockage : accessToken + refreshToken dans localStorage (JWT stateless, pas de cookies).
 */

import { ref } from "vue";
import { useToasts } from "./useToasts";
import type { User } from "~/types/types";

// ── État global réactif (singleton) ──────────────────────────────────────────
const currentUser = ref<User | null>(null);
const isSessionLoaded = ref<boolean>(false);

// ── Helpers localStorage (client-side unique) ────────────────────────────────
export const getAccessToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("refreshToken");
};

export const saveTokens = (accessToken: string, refreshToken: string) => {
	if (typeof window === "undefined") return;
	localStorage.setItem("accessToken", accessToken);
	localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
	if (typeof window === "undefined") return;
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
};

/**
 * Charge le profil de l'utilisateur connecté via GET /api/users/me.
 * Normalise les champs (fullName <-> username, role "ADMIN"/"USER" <-> rule "admin"/"user").
 */
export const initSession = async (customToken?: string) => {
	if (typeof window === "undefined") return;

	const token = customToken || getAccessToken();
	if (!token) {
		currentUser.value = null;
		isSessionLoaded.value = true;
		return;
	}

	try {
		const { $api } = useNuxtApp();
		const headers: Record<string, string> = {
			Authorization: `Bearer ${token}`,
		};
		const user = await ($api as any)<User>("/api/users/me", { headers });
		if (user) {
			// Normalisation du nom
			if (!user.username && user.fullName) {
				user.username = user.fullName;
			}
			// Normalisation du rôle (interopérabilité role backend / rule frontend)
			if (user.role && !user.rule) {
				user.rule = user.role === "ADMIN" ? "admin" : "user";
			}
			if (user.rule && !user.role) {
				user.role = user.rule === "admin" ? "ADMIN" : "USER";
			}
			currentUser.value = user;
		} else {
			clearTokens();
			currentUser.value = null;
		}
	} catch {
		clearTokens();
		currentUser.value = null;
	} finally {
		isSessionLoaded.value = true;
	}
};

// ── États réactifs des formulaires / modaux ──────────────────────────────────
const authModalOpen = ref<boolean>(false);
const authStep = ref<"login" | "otp" | "success">("login");
const authMode = ref<"signin" | "signup">("signin");
const authEmail = ref<string>("");
const authFullName = ref<string>("");
const authPassword = ref<string>("");

// États de chargement
const isGoogleLoading = ref<boolean>(false);
const isAppleLoading = ref<boolean>(false);
const isAuthSubmitLoading = ref<boolean>(false);
const isAuthDoneLoading = ref<boolean>(false);
const googleUser = ref<boolean>(false);
const icloudUser = ref<boolean>(false);

/**
 * Extrait le titre ou la description de l'erreur retournée par le backend (RFC 7807 / Problem Details).
 */
const extractErrorMessage = (err: any, fallbackMessage: string = "Une erreur est survenue"): string => {
	return (
		err?.data?.title ||
		err?.data?.detail ||
		err?.data?.message ||
		err?.data?.error ||
		err?.message ||
		fallbackMessage
	);
};

/**
 * Redirige l'utilisateur vers son tableau de bord selon son rôle (ADMIN -> /admin, USER -> /users/:id).
 */
export const redirectBasedOnRole = (user: User | null) => {
	if (!user) return;
	if (user.role === "ADMIN" || user.rule === "admin") {
		navigateTo("/admin");
	} else if (user.id) {
		navigateTo(`/users/${user.id}`);
	} else {
		navigateTo("/");
	}
};

/**
 * Composable principal useAuth
 */
export function useAuth() {
	const { addToast } = useToasts();

	const resetAuth = () => {
		authModalOpen.value = false;
		authStep.value = "login";
		authMode.value = "signin";
		authEmail.value = "";
		authFullName.value = "";
		authPassword.value = "";
		googleUser.value = false;
		icloudUser.value = false;
		isGoogleLoading.value = false;
		isAppleLoading.value = false;
		isAuthSubmitLoading.value = false;
		isAuthDoneLoading.value = false;
	};

	/**
	 * Connexion avec Email / Mot de passe (POST /api/auth/signin)
	 */
	const handleSignIn = async (emailVal?: string, passwordVal?: string) => {
		const targetEmail = emailVal || authEmail.value;
		const targetPassword = passwordVal || authPassword.value;

		if (!targetEmail || !targetPassword) {
			addToast("Veuillez saisir votre adresse email et votre mot de passe.", "error");
			return false;
		}

		isAuthSubmitLoading.value = true;
		try {
			const { $api } = useNuxtApp();
			const res = await ($api as any)<{ accessToken: string; refreshToken: string }>(
				"/api/auth/signin",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: { email: targetEmail, password: targetPassword },
				},
			);

			if (res?.accessToken && res?.refreshToken) {
				saveTokens(res.accessToken, res.refreshToken);
				await initSession(res.accessToken);
				authStep.value = "success";
				addToast(
					`😉 Connexion réussie ! Bienvenue${currentUser.value?.username ? ", " + currentUser.value.username : ""} !`,
					"success",
				);
				// Redirection selon le rôle (ADMIN ou USER)
				redirectBasedOnRole(currentUser.value);
				return true;
			}
			return false;
		} catch (err: any) {
			const errorMsg = extractErrorMessage(err, "Email ou mot de passe incorrect.");
			addToast(`⚠️ ${errorMsg}`, "error");
			return false;
		} finally {
			isAuthSubmitLoading.value = false;
		}
	};

	/**
	 * Inscription Utilisateur (POST /api/auth/signup)
	 */
	const handleSignUp = async (emailVal?: string, passwordVal?: string, fullNameVal?: string) => {
		const targetEmail = emailVal || authEmail.value;
		const targetPassword = passwordVal || authPassword.value;
		const targetFullName = fullNameVal || authFullName.value;

		if (!targetEmail || !targetPassword || !targetFullName) {
			addToast("Veuillez remplir tous les champs obligatoires.", "error");
			return false;
		}

		isAuthSubmitLoading.value = true;
		try {
			const { $api } = useNuxtApp();
			await ($api as any)<void>("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: {
					email: targetEmail,
					password: targetPassword,
					fullName: targetFullName,
				},
			});

			navigateTo("/auth/verify-account");
			addToast("🎉 Compte créé ! Un code OTP vous a été envoyé par email.", "success");
			return true;
		} catch (err: any) {
			const errorMsg = extractErrorMessage(err, "Une erreur est survenue lors de l'inscription.");
			addToast(`⚠️ ${errorMsg}`, "error");
			return false;
		} finally {
			isAuthSubmitLoading.value = false;
		}
	};

	/**
	 * Soumission unifiée (compatibilité formulaires existants)
	 */
	const handleSimulatedClaim = async (e: Event) => {
		e.preventDefault();
		if (authMode.value === "signup") {
			await handleSignUp();
		} else {
			await handleSignIn();
		}
	};

	/**
	 * Vérification du compte via OTP (POST /api/auth/verify-account)
	 */
	const handleVerifyAccount = async (email: string, code: string) => {
		if (!email || !code) {
			addToast("Veuillez renseigner votre email et le code OTP.", "error");
			return false;
		}

		isAuthSubmitLoading.value = true;
		try {
			const { $api } = useNuxtApp();
			await ($api as any)("/api/auth/verify-account", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: { email, code },
			});
			addToast("✅ Compte activé avec succès ! Vous pouvez vous connecter.", "success");
			return true;
		} catch (err: any) {
			const errorMsg = extractErrorMessage(err, "Code OTP invalide ou expiré.");
			addToast(`⚠️ ${errorMsg}`, "error");
			return false;
		} finally {
			isAuthSubmitLoading.value = false;
		}
	};

	/**
	 * Renvoi de l'OTP de vérification de compte (POST /api/auth/resend-otp)
	 */
	const handleResendOtp = async (email: string) => {
		if (!email) {
			addToast("Adresse email requise.", "error");
			return false;
		}

		try {
			const { $api } = useNuxtApp();
			await ($api as any)("/api/auth/resend-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: { email },
			});
			addToast("📧 Nouveau code OTP envoyé avec succès.", "mail");
			return true;
		} catch (err: any) {
			const errorMsg = extractErrorMessage(err, "Impossible de renvoyer le code OTP.");
			addToast(`⚠️ ${errorMsg}`, "error");
			return false;
		}
	};

	/**
	 * Demande de réinitialisation de mot de passe (POST /api/auth/forgot-password)
	 */
	const handleForgotPassword = async (email: string) => {
		if (!email) {
			addToast("Veuillez saisir votre adresse email.", "error");
			return false;
		}

		isAuthSubmitLoading.value = true;
		try {
			const { $api } = useNuxtApp();
			await ($api as any)("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: { email },
			});
			addToast("📩 Si un compte existe avec cet email, un code de réinitialisation vous a été envoyé.", "info");
			return true;
		} catch (err: any) {
			const errorMsg = extractErrorMessage(err, "Erreur lors de la demande de réinitialisation.");
			addToast(`⚠️ ${errorMsg}`, "error");
			return false;
		} finally {
			isAuthSubmitLoading.value = false;
		}
	};

	/**
	 * Réinitialisation du mot de passe avec code OTP (POST /api/auth/reset-password)
	 */
	const handleResetPassword = async (email: string, code: string, newPassword: string) => {
		if (!email || !code || !newPassword) {
			addToast("Tous les champs sont requis pour réinitialiser votre mot de passe.", "error");
			return false;
		}

		isAuthSubmitLoading.value = true;
		try {
			const { $api } = useNuxtApp();
			await ($api as any)("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: { email, code, newPassword },
			});
			addToast("🎉 Mot de passe réinitialisé avec succès ! Connectez-vous.", "success");
			return true;
		} catch (err: any) {
			const errorMsg = extractErrorMessage(err, "Code OTP invalide ou expiré.");
			addToast(`⚠️ ${errorMsg}`, "error");
			return false;
		} finally {
			isAuthSubmitLoading.value = false;
		}
	};

	/**
	 * Connexion Google via ID Token SPA (POST /api/auth/google)
	 */
	const handleGoogleAuth = async (idToken: string) => {
		if (isGoogleLoading.value) return false;

		isGoogleLoading.value = true;
		try {
			const { $api } = useNuxtApp();
			const res = await ($api as any)<{ accessToken: string; refreshToken: string }>(
				"/api/auth/google",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: { idToken },
				},
			);

			if (res?.accessToken && res?.refreshToken) {
				saveTokens(res.accessToken, res.refreshToken);
				await initSession(res.accessToken);
				authStep.value = "success";
				googleUser.value = true;
				addToast(`🎉 Connexion Google réussie !`, "success");
				redirectBasedOnRole(currentUser.value);
				return true;
			}
			return false;
		} catch (e: any) {
			const msg = extractErrorMessage(e, "Échec de l'authentification Google.");
			addToast(`⚠️ ${msg}`, "error");
			return false;
		} finally {
			isGoogleLoading.value = false;
		}
	};

	/**
	 * Connexion Apple via ID Token SPA (POST /api/auth/apple)
	 */
	const handleAppleAuth = async (idToken?: string, fullName?: string) => {
		isAppleLoading.value = true;
		try {
			const { $api } = useNuxtApp();
			const token = idToken || "apple_id_token_placeholder";
			const body: Record<string, string> = { idToken: token };
			if (fullName) body.fullName = fullName;

			const res = await ($api as any)<{ accessToken: string; refreshToken: string }>(
				"/api/auth/apple",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body,
				},
			);

			if (res?.accessToken && res?.refreshToken) {
				saveTokens(res.accessToken, res.refreshToken);
				await initSession(res.accessToken);
				authStep.value = "success";
				icloudUser.value = true;
				addToast(`🎉 Connexion Apple réussie !`, "success");
				redirectBasedOnRole(currentUser.value);
				return true;
			}
			return false;
		} catch (e: any) {
			const msg = extractErrorMessage(e, "Échec de l'authentification Apple.");
			addToast(`⚠️ ${msg}`, "error");
			return false;
		} finally {
			isAppleLoading.value = false;
		}
	};

	/**
	 * Déconnexion (POST /api/auth/logout)
	 */
	const handleLogout = async () => {
		const { $api } = useNuxtApp();
		const refreshToken = getRefreshToken();

		if (refreshToken) {
			try {
				await ($api as any)<void>("/api/auth/logout", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: { refreshToken },
				});
			} catch {
				// Déconnexion locale silencieuse même en cas de coupure réseau
			}
		}

		clearTokens();
		currentUser.value = null;
		resetAuth();
	};

	/**
	 * Admin - Mise à jour du rôle utilisateur (PUT /api/admin/users/{id}/role)
	 */
	const adminUpdateUserRole = async (userId: string | number, roleName: "USER" | "ADMIN" | "SUPPORT_AGENT") => {
		try {
			const { $api } = useNuxtApp();
			await ($api as any)(`/api/admin/users/${userId}/role`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: { roleName },
			});
			addToast(`✅ Rôle mis à jour : ${roleName}`, "success");
			return true;
		} catch (err: any) {
			const msg = err?.data?.message || "Impossible de modifier le rôle.";
			addToast(`⚠️ ${msg}`, "error");
			return false;
		}
	};

	return {
		// État réactif
		currentUser,
		isSessionLoaded,
		authModalOpen,
		authStep,
		authMode,
		authEmail,
		authFullName,
		authUsername: authFullName,
		authPassword,
		isGoogleLoading,
		isAppleLoading,
		isIcloudLoading: isAppleLoading,
		googleUser,
		icloudUser,
		isAuthSubmitLoading,
		isAuthDoneLoading,

		// Actions Authentification
		resetAuth,
		initSession,
		handleSignIn,
		handleSignUp,
		handleSimulatedClaim,
		handleVerifyAccount,
		handleResendOtp,
		handleForgotPassword,
		handleResetPassword,
		handleGoogleAuth,
		handleAppleAuth,
		handleIcloudAuth: handleAppleAuth,
		handleLogout,
		adminUpdateUserRole,

		// Helpers JWT
		getAccessToken,
		getRefreshToken,
		saveTokens,
		clearTokens,
	};
}
