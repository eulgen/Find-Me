/**
 * @file useAuth.ts
 * @description Composable régissant l'authentification REST (connexion, inscription, OAuth Google, etc.).
 *
 * Il communique directement avec les endpoints REST du serveur.
 */

import { ref, onMounted } from "vue";
import { useToasts } from "./useToasts";

const currentUser = ref<{
	email: string;
	username: string;
	role?: "citizen" | "admin";
	phone?: string;
} | null>(null);
const usersList = ref<any[]>([]);
const registeredUsers = ref<Record<string, string>>({});

const authModalOpen = ref<boolean>(false);
const authStep = ref<"login" | "success">("login");
const authMode = ref<"signin" | "signup">("signin");
const authEmail = ref<string>("");
const authUsername = ref<string>("");
const authPassword = ref<string>("");
const isGoogleLoading = ref<boolean>(false);
const googleUser = ref<boolean>(false);
const isIcloudLoading = ref<boolean>(false);
const icloudUser = ref<boolean>(false);
const isAuthSubmitLoading = ref<boolean>(false);
const isAuthDoneLoading = ref<boolean>(false);

// Function to pull session state from REST API on startup
export const initSession = async () => {
	try {
		const data = await $fetch<{ user: any }>("/api/auth/me");
		if (data && data.user) {
			currentUser.value = data.user;
		} else {
			currentUser.value = null;
		}
	} catch (e) {
		currentUser.value = null;
	}
};

// Function to fetch the full users list from REST API
export const fetchUsersList = async () => {
	try {
		const users = await $fetch<any[]>("/api/users");
		if (users) {
			usersList.value = users;
			// Rebuild registeredUsers map for local translations
			const map: Record<string, string> = {};
			users.forEach((u: any) => {
				map[u.email.toLowerCase().trim()] = u.username;
			});
			registeredUsers.value = map;
		}
	} catch (e) {
		console.error("Failed to load users list from REST API", e);
	}
};

// Automatically trigger hydration on client boot
if (typeof window !== "undefined") {
	initSession().then(() => {
		if (currentUser.value?.role === "admin") {
			fetchUsersList();
		}
	});
}

export function useAuth() {
	const { addToast } = useToasts();

	const resetAuth = () => {
		authModalOpen.value = false;
		authStep.value = "login";
		authMode.value = "signin";
		authEmail.value = "";
		authUsername.value = "";
		authPassword.value = "";
		googleUser.value = false;
		icloudUser.value = false;
	};

	const handleSimulatedClaim = async (e: Event) => {
		e.preventDefault();
		if (authMode.value === "signin" && !authEmail.value) return;
		if (
			authMode.value === "signup" &&
			(!authEmail.value || !authUsername.value)
		)
			return;

		isAuthSubmitLoading.value = true;

		try {
			if (authMode.value === "signup") {
				const res = await $fetch<{ success: boolean; user: any }>(
					"/api/auth/signup",
					{
						method: "POST",
						body: {
							email: authEmail.value,
							username: authUsername.value,
							password: authPassword.value,
							phone: "",
						},
					},
				);

				if (res && res.success) {
					currentUser.value = res.user;
					authStep.value = "success";
					addToast("✨ Compte créé avec succès !", "success");
					addToast(
						`📧 Un e-mail de vérification a été envoyé à ${authEmail.value}. Veuillez vérifier votre boîte pour confirmer.`,
						"mail",
					);

					// Refresh lists
					await fetchUsersList();
				}
			} else {
				// Sign-in
				const res = await $fetch<{ success: boolean; user: any }>(
					"/api/auth/login",
					{
						method: "POST",
						body: {
							email: authEmail.value,
							password: authPassword.value,
						},
					},
				);

				if (res && res.success) {
					currentUser.value = res.user;
					authStep.value = "success";
					addToast(
						`🎉 Connexion réussie ! Bienvenue, ${res.user.username}`,
						"success",
					);

					if (res.user.role === "admin") {
						await fetchUsersList();
					}
				}
			}
		} catch (err: any) {
			const errorMsg =
				err.data?.message ||
				err.data?.statusMessage ||
				err.message ||
				"Une erreur est survenue lors de l'authentification";
			addToast(`⚠️ Error: ${errorMsg}`, "info");
		} finally {
			isAuthSubmitLoading.value = false;
		}
	};

	const handleGoogleAuth = async () => {
		isGoogleLoading.value = true;
		setTimeout(async () => {
			try {
				const mockEmail = "ndengbrice@gmail.com";
				const mockUsername = "Brice Ndeng";

				// Simuler la conversion sur le serveur REST en nous connectant / inscrivant
				const res = await $fetch<{ success: boolean; user: any }>(
					"/auth/signup",
					{
						method: "POST",
						body: {
							email: mockEmail,
							username: mockUsername,
							password: "google-auth-user-P@ss1",
							phone: "+237 699 12 34 56",
						},
					},
				).catch(async (err) => {
					// Si déjà inscrit, juste login
					return await $fetch<{ success: boolean; user: any }>(
						"/auth/signin",
						{
							method: "POST",
							body: {
								email: mockEmail,
								password: "google-auth-user-P@ss1",
							},
						},
					);
				});

				if (res && res.user) {
					currentUser.value = res.user;
					authEmail.value = res.user.email;
					authUsername.value = res.user.username;
					authStep.value = "success";
					googleUser.value = true;
					icloudUser.value = false;

					addToast(
						`🎉 Connexion Google réussie ! Bienvenue, ${res.user.username}`,
						"success",
					);
					if (res.user.role === "admin") {
						await fetchUsersList();
					}
				}
			} catch (e) {
				addToast("⚠️ Échec de la connexion Google.", "info");
			} finally {
				isGoogleLoading.value = false;
			}
		}, 1200);
	};

	const handleIcloudAuth = async () => {
		isIcloudLoading.value = true;
		setTimeout(async () => {
			try {
				const mockEmail = "ndengbrice@icloud.com";
				const mockUsername = "Brice Ndeng (iCloud)";

				// Simuler la conversion sur le serveur REST en nous connectant / inscrivant
				const res = await $fetch<{ success: boolean; user: any }>(
					"/auth/signup",
					{
						method: "POST",
						body: {
							email: mockEmail,
							username: mockUsername,
							password: "icloud-auth-user-P@ss1",
							phone: "+237 699 12 34 56",
						},
					},
				).catch(async (err) => {
					// Si déjà inscrit, juste login
					return await $fetch<{ success: boolean; user: any }>(
						"/api/auth/login",
						{
							method: "POST",
							body: {
								email: mockEmail,
								password: "icloud-auth-user-P@ss1",
							},
						},
					);
				});

				if (res && res.user) {
					currentUser.value = res.user;
					authEmail.value = res.user.email;
					authUsername.value = res.user.username;
					authStep.value = "success";
					icloudUser.value = true;
					googleUser.value = false;

					addToast(
						`🍏 Connexion iCloud réussie ! Bienvenue, ${res.user.username}`,
						"success",
					);
					if (res.user.role === "admin") {
						await fetchUsersList();
					}
				}
			} catch (e) {
				addToast("⚠️ Échec de la connexion iCloud.", "info");
			} finally {
				isIcloudLoading.value = false;
			}
		}, 1200);
	};

	const handleLogout = async () => {
		try {
			const res = await $fetch<{ success: boolean }>("/api/auth/logout", {
				method: "POST",
			});
			if (res && res.success) {
				currentUser.value = null;
				usersList.value = [];
				registeredUsers.value = {};
				resetAuth();
			}
		} catch (e) {
			// Direct client fallback
			currentUser.value = null;
			resetAuth();
		}
	};

	// Admin users CRUD methods
	const adminCreateUser = async (user: {
		username: string;
		email: string;
		phone: string;
		role: "citizen" | "admin";
	}) => {
		try {
			const res = await $fetch<{ success: boolean; user: any }>("/api/users", {
				method: "POST",
				body: {
					username: user.username,
					email: user.email,
					phone: user.phone,
					role: user.role,
					password: "DefaultPass123_4",
				},
			});

			if (res && res.success) {
				addToast(
					`👤 Utilisateur ${res.user.username} créé avec succès.`,
					"success",
				);
				await fetchUsersList();
			}
		} catch (err: any) {
			const errorMsg =
				err.data?.message ||
				err.data?.statusMessage ||
				err.message ||
				"Impossible de créer l'utilisateur";
			addToast(`⚠️ Error: ${errorMsg}`, "info");
		}
	};

	const adminUpdateUser = async (id: string, updatedData: Partial<any>) => {
		try {
			const res = await $fetch<{ success: boolean; user: any }>(
				`/api/users?id=${id}`,
				{
					method: "PUT",
					body: updatedData,
				},
			);

			if (res && res.success) {
				addToast(
					`💾 Changements enregistrés pour ${res.user.username}.`,
					"success",
				);
				await fetchUsersList();
			}
		} catch (err: any) {
			const errorMsg =
				err.data?.message ||
				err.data?.statusMessage ||
				err.message ||
				"Impossible de modifier l'utilisateur";
			addToast(`⚠️ Error: ${errorMsg}`, "info");
		}
	};

	const adminDeleteUser = async (id: string) => {
		try {
			const res = await $fetch<{ success: boolean; message: string }>(
				`/api/users?id=${id}`,
				{
					method: "DELETE",
				},
			);

			if (res && res.success) {
				addToast(`🗑️ ${res.message || "Utilisateur supprimé."}`, "success");
				await fetchUsersList();
			}
		} catch (err: any) {
			const errorMsg =
				err.data?.message ||
				err.data?.statusMessage ||
				err.message ||
				"Impossible de supprimer l'utilisateur";
			addToast(`⚠️ Error: ${errorMsg}`, "info");
		}
	};

	return {
		currentUser,
		registeredUsers,
		usersList,
		authModalOpen,
		authStep,
		authMode,
		authEmail,
		authUsername,
		authPassword,
		isGoogleLoading,
		googleUser,
		isIcloudLoading,
		icloudUser,
		isAuthSubmitLoading,
		isAuthDoneLoading,
		resetAuth,
		fetchUsersList,
		initSession,
		handleSimulatedClaim,
		handleGoogleAuth,
		handleIcloudAuth,
		handleLogout,
		adminCreateUser,
		adminUpdateUser,
		adminDeleteUser,
	};
}
