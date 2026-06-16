/**
 * @file useAuth.ts
 * @description Composable régissant l'authentification REST (connexion, inscription, OAuth Google, etc.).
 *
 * Il communique directement avec les endpoints REST du serveur.
 */

import { ref, onMounted } from "vue";
import { useToasts } from "./useToasts";
import { useMemory } from "#imports";
import type { User } from "~/types/types";
import useApi from "./useApi";

const { api } = useApi();
const { saveInStorage, loadInStorage, data, filterInStorage } = useMemory<
	User[]
>("users", []);

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
/**
 * Initialise la session utilisateur au chargement du client.
 *
 * Effectue une requête GET vers `/api/auth/me` pour récupérer les informations
 * de l'utilisateur connecté. Si la réponse contient un objet `user`,
 * la référence réactive `currentUser` est mise à jour, sinon elle devient `null`.
 * En cas d’erreur (réseau ou serveur), la session est également réinitialisée à `null`.
 */
export const initSession = async () => {
	const sessionCookie = useCookie("findme_session");
	const user = sessionCookie.value ? JSON.parse(sessionCookie.value) : null;
	currentUser.value = user;
};

// Function to fetch the full users list from REST API
/**
 * Récupère la liste complète des utilisateurs depuis le serveur.
 *
 * Envoie une requête GET vers `/api/users`. Le résultat est stocké dans le
 * tableau réactif `usersList` et une map `registeredUsers` (email → nom) est
 * reconstruite pour faciliter les recherches locales.
 * En cas d’échec, un message d’erreur est loggé dans la console.
 */
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

/**
 * Composable principal d'authentification.
 *
 * Expose les références réactives (user, modal, états de chargement, etc.)
 * ainsi que les fonctions d’authentification et d’administration.
 * Chaque fonction interne possède sa propre documentation ci‑dessous.
 */
export function useAuth() {
	const mockServerUrl = useRuntimeConfig().public.mockServerUrl;
	const { addToast } = useToasts();

	/**
	 * Réinitialise l’état du formulaire/modal d’authentification.
	 *
	 * - Ferme le modal (`authModalOpen = false`).
	 * - Retourne l’étape à `login` et le mode à `signin`.
	 * - Vide les champs email, username et password.
	 * - Désactive les indicateurs de connexion Google/iCloud.
	 */
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

	/**
	 * Gestionnaire d’événement pour les formulaires d’inscription ou de connexion.
	 *
	 * Selon la valeur de `authMode` (`signin` ou `signup`), il envoie une requête
	 * POST vers `/api/auth/login` ou `/api/auth/signup` avec les données du formulaire.
	 * En cas de succès, met à jour `currentUser`, passe l’étape à `success` et affiche
	 * un *toast* de confirmation. Si l’utilisateur a le rôle `admin`, la liste des
	 * utilisateurs est rafraîchie. En cas d’erreur, le message retourné par le serveur
	 * est affiché dans un *toast* d’information.
	 */
	const handleSimulatedClaim = async (e: Event) => {
		e.preventDefault();
		const $api = await api();
		if (authMode.value === "signin" && !authEmail.value) return;
		if (
			authMode.value === "signup" &&
			(!authEmail.value || !authUsername.value)
		)
			return;

		isAuthSubmitLoading.value = true;

		try {
			if (authMode.value === "signup") {
				const res = await $api("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: {
						email: authEmail.value,
						username: authUsername.value,
						password: authPassword.value,
					},
				});
				if (res) {
					currentUser.value = res as any;
					authStep.value = "success";
					loadInStorage();
					if (data) {
						const existingUser = filterInStorage(
							(item) => item.email === res.email,
						);
						if (existingUser.length === 0) {
							data.value.push(res as any);
							saveInStorage();
						} else {
							addToast("Cet email est déjà utilisé", "error");
							return;
						}
					}
					addToast("🎉 Compte créé avec succès !", "success");
					addToast(
						`Un e-mail de vérification a été envoyé à ${authEmail.value}. Veuillez vérifier votre boîte pour confirmer.`,
						"mail",
					);
				}
			} else {
				// Sign-in

				const res = await $api("/api/auth/signin", {
					method: "POST",
					body: {
						email: authEmail.value,
						password: authPassword.value,
					},
				});

				if (res && res.user) {
					currentUser.value = res.user as User;
					authStep.value = "success";
					addToast(
						`😉 Connexion réussie ! Bienvenue, ${(res.user as User).username}`,
						"success",
					);
				}
			}
		} catch (err: any) {
			const errorMsg =
				err.data?.message ||
				err.data?.statusMessage ||
				err.message ||
				"Une erreur est survenue lors de l'authentification";
			addToast(
				"Oops !!! désolé nous rencontrons un leger soucis à l'authentifcation, veuillez reessayer",
				"info",
			);
		} finally {
			isAuthSubmitLoading.value = false;
		}
	};

	/**
	 * Simule une authentification via Google.
	 *
	 * Après un délai de 1 200 ms, envoie une requête POST `/api/auth/signup`
	 * avec des identifiants factices. Si l’utilisateur existe déjà, la requête
	 * bascule vers `/api/auth/login`. Met à jour `currentUser`, les champs
	 * `authEmail`/`authUsername`, active le flag `googleUser` et passe l’étape à
	 * `success`. Un *toast* de succès est affiché et, si l’utilisateur est admin,
	 * la liste des utilisateurs est rechargée. Gère les états de chargement et les
	 * éventuelles erreurs.
	 */
	const handleGoogleAuth = async () => {
		const $api = await api();
		isGoogleLoading.value = true;
		setTimeout(async () => {
			try {
				const res = await $api("/api/auth/google", {
					method: "POST",
					// headers: {
					// 	"x-mock-response-code": "401",
					// },
					body: {
						provider: "google",
						token: "valid_google_id_token",
					},
				});
				if (res && res.user) {
					currentUser.value = res.user;
					authEmail.value = res.user.email;
					authUsername.value = res.user.username;
					authStep.value = "success";
					googleUser.value = true;
					icloudUser.value = false;
					loadInStorage();
					if (data) {
						const existingUser = filterInStorage(
							(item) => item.email === res.user.email,
						);
						if (existingUser.length === 0) {
							data.value.push(res.user as any);
							saveInStorage();
						}
					}
					addToast(
						`🎉 Connexion Google réussie ! Bienvenue, ${res.user.username}`,
						"success",
					);
					// if (res.user.role === "admin") {
					// 	await fetchUsersList();
					// }
				}
			} catch (e) {
				addToast(
					"Désolé il y a eu un soucis lors du processus d'authentification, veuillez ressayer",
					"info",
				);
			} finally {
				isGoogleLoading.value = false;
			}
		}, 1200);
	};

	/**
	 * Simule une authentification via iCloud.
	 *
	 * Fonctionne de la même façon que `handleGoogleAuth` mais avec des données
	 * factices propres à iCloud. Met à jour `currentUser`, les champs email et
	 * username, active le flag `icloudUser` et indique le succès via un *toast*.
	 * Rafraîchit la liste des utilisateurs pour les admins et gère les états de
	 * chargement ainsi que les erreurs éventuelles.
	 */
	const handleIcloudAuth = async () => {
		const $api = await api();
		isIcloudLoading.value = true;
		setTimeout(async () => {
			try {
				// Simuler la conversion sur le serveur REST en nous connectant / inscrivant
				const res = await $api("/api/auth/icloud", {
					method: "POST",
					headers: {
						"x-mock-response-code": "401",
					},
					body: {
						provider: "apple",
						token: "icloud_oauth_id_token_example",
					},
				});
				if (res && res.user) {
					currentUser.value = res.user;
					authEmail.value = res.user.email;
					authUsername.value = res.user.username;
					authStep.value = "success";
					icloudUser.value = true;
					googleUser.value = false;
					loadInStorage();
					if (data) {
						const existingUser = filterInStorage(
							(item) => item.email === res.user.email,
						);
						if (existingUser.length === 0) {
							data.value.push(res.user as any);
							saveInStorage();
						}
					}

					addToast(
						`🎉 Connexion iCloud réussie ! Bienvenue, ${res.user.username}`,
						"success",
					);
					// if (res.user.role === "admin") {
					// 	await fetchUsersList();
					// }
				}
			} catch (e) {
				addToast(
					"Échec lors de l'authentification iCloud. Veuillez réessayer",
					"error",
				);
			} finally {
				isIcloudLoading.value = false;
			}
		}, 1200);
	};

	/**
	 * Déconnecte l’utilisateur actuel.
	 *
	 * Envoie une requête POST vers `/api/auth/logout`. En cas de succès, réinitialise
	 * `currentUser`, vide les listes locales et appelle `resetAuth` pour remettre le
	 * formulaire à son état initial. Si la requête échoue, effectue quand même la
	 * réinitialisation locale afin de garantir la déconnexion côté client.
	 */
	const handleLogout = () => {
		useCookie("findme_session").value = null;
		currentUser.value = null;
		resetAuth();
	};

	// Admin users CRUD methods
	/**
	 * Crée un nouvel utilisateur (fonctionnalité admin).
	 *
	 * Envoie une requête POST vers `/api/users` avec le `username`, l`email`, le
	 * `phone`, le `role` et un mot de passe par défaut (`DefaultPass123_4`).
	 * En cas de succès, affiche un *toast* de confirmation et rafraîchit la liste des
	 * utilisateurs. En cas d’erreur, le message du serveur est présenté dans un
	 * *toast* d’information.
	 */
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

	/**
	 * Met à jour les informations d’un utilisateur existant (fonction admin).
	 *
	 * Envoie une requête PUT vers `/api/users?id={id}` avec les champs à modifier
	 * fournis dans `updatedData`. En cas de succès, un *toast* indique la mise à jour
	 * et la liste des utilisateurs est rechargée. Les erreurs éventuelles sont
	 * affichées via un *toast* d’information.
	 */
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

	/**
	 * Supprime un utilisateur (fonction admin).
	 *
	 * Envoie une requête DELETE vers `/api/users?id={id}`. Si l’opération réussit,
	 * un *toast* confirme la suppression et la liste des utilisateurs est mise à jour.
	 * En cas d’erreur, le message du serveur est affiché dans un *toast* d’information.
	 */
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
