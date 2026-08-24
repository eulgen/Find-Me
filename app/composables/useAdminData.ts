/**
 * @file useAdminData.ts
 * @description Composable centralisant tous les appels admin vers le backend Spring Boot.
 *
 * Endpoints couverts (contrat Postman) :
 *   GET  /api/admin/users?search=&page=0&size=20     → Liste paginée des utilisateurs
 *   PUT  /api/admin/users/{id}/role                  → Modifier le rôle d'un user
 *   GET  /api/admin/addresses?city=&page=0&size=20   → Liste paginée des adresses
 *   GET  /api/admin/support?status=&page=0&size=20   → Liste paginée des tickets support
 *   PATCH /api/admin/support/{id}                    → Marquer un ticket comme traité
 *
 * Bearer JWT injecté automatiquement via le plugin $api (api.client.ts).
 */

import { ref } from "vue";
import type { SupportStatus } from "~/types/types";
import { getAccessToken } from "~/composables/useAuth";

// ── Types de réponse admin (calqués sur les DTOs backend) ────────────────────

export interface AdminUserDTO {
	id: number;
	email: string;
	fullName: string;
	phoneNumber?: string;
	profileImage?: string;
	role: string;
	status: string;
	createdAt?: string;
}

export interface AdminAddressDTO {
	id: number;
	addressCode: string;
	country: string;
	city: string;
	district: string;
	street: string;
	houseNumber?: string;
	postalCode?: string;
	photoUrl?: string;
	status?: string;
	createdAt?: string;
	userId?: number;
	userFullName?: string;
}

export interface AdminSupportDTO {
	id: number;
	userId?: number;
	userFullName?: string;
	name: string;
	email: string;
	message: string;
	status: SupportStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface PageResult<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

// ── État réactif global (singleton) ─────────────────────────────────────────

const adminUsers = ref<AdminUserDTO[]>([]);
const adminUsersMeta = ref({ totalElements: 0, totalPages: 1, currentPage: 0 });
const isLoadingUsers = ref(false);

const adminAddresses = ref<AdminAddressDTO[]>([]);
const adminAddressesMeta = ref({ totalElements: 0, totalPages: 1, currentPage: 0 });
const isLoadingAddresses = ref(false);

const adminSupport = ref<AdminSupportDTO[]>([]);
const adminSupportMeta = ref({ totalElements: 0, totalPages: 1, currentPage: 0 });
const isLoadingSupport = ref(false);

// ── Composable ────────────────────────────────────────────────────────────────

export function useAdminData() {
	const { $api } = useNuxtApp();

	/** Injecte explicitement le Bearer JWT dans les headers */
	const authHeaders = (): Record<string, string> => {
		const token = getAccessToken();
		return token ? { Authorization: `Bearer ${token}` } : {};
	};

	// ──────────────────────────────────────────────────────────────────────────
	// USERS
	// ──────────────────────────────────────────────────────────────────────────

	const fetchAdminUsers = async (page = 0, size = 20, search = "") => {
		isLoadingUsers.value = true;
		try {
			const params = new URLSearchParams({ page: String(page), size: String(size) });
			if (search) params.set("search", search);

			const res = await ($api as any)<PageResult<AdminUserDTO>>(
				`/api/admin/users?${params.toString()}`,
				{ headers: authHeaders() },
			);

			adminUsers.value = res?.content ?? [];
			adminUsersMeta.value = {
				totalElements: res?.totalElements ?? 0,
				totalPages: res?.totalPages ?? 1,
				currentPage: res?.number ?? 0,
			};
		} catch (err) {
			console.error("[useAdminData] fetchAdminUsers error:", err);
		} finally {
			isLoadingUsers.value = false;
		}
	};

	const updateUserRole = async (userId: number, role: string) => {
		try {
			await ($api as any)<any>(`/api/admin/users/${userId}/role`, {
				method: "PUT",
				headers: { ...authHeaders(), "Content-Type": "application/json" },
				body: { role },
			});
			await fetchAdminUsers(adminUsersMeta.value.currentPage);
		} catch (err) {
			console.error("[useAdminData] updateUserRole error:", err);
		}
	};

	// ──────────────────────────────────────────────────────────────────────────
	// ADDRESSES
	// ──────────────────────────────────────────────────────────────────────────

	const fetchAdminAddresses = async (page = 0, size = 20, city = "") => {
		isLoadingAddresses.value = true;
		try {
			const params = new URLSearchParams({ page: String(page), size: String(size) });
			if (city) params.set("city", city);

			const res = await ($api as any)<PageResult<AdminAddressDTO>>(
				`/api/admin/addresses?${params.toString()}`,
				{ headers: authHeaders() },
			);

			adminAddresses.value = res?.content ?? [];
			adminAddressesMeta.value = {
				totalElements: res?.totalElements ?? 0,
				totalPages: res?.totalPages ?? 1,
				currentPage: res?.number ?? 0,
			};
		} catch (err) {
			console.error("[useAdminData] fetchAdminAddresses error:", err);
		} finally {
			isLoadingAddresses.value = false;
		}
	};

	/**
	 * Récupère les adresses d'un utilisateur spécifique.
	 * GET /api/admin/addresses?userId={userId}&page={page}&size={size}
	 */
	const fetchUserAddresses = async (userId: number, page = 0, size = 5) => {
		try {
			const params = new URLSearchParams({ page: String(page), size: String(size), userId: String(userId) });
			const res = await ($api as any)<PageResult<AdminAddressDTO>>(
				`/api/admin/addresses?${params.toString()}`,
				{ headers: authHeaders() },
			);
			return res;
		} catch (err) {
			console.error("[useAdminData] fetchUserAddresses error:", err);
			return null;
		}
	};

	/**
	 * Met à jour le statut d'une adresse (Validé, En attente, Signalé).
	 */
	const updateAddressStatus = async (addressId: number, status: string) => {
		try {
			await ($api as any)<any>(`/api/addresses/${addressId}`, {
				method: "PUT",
				headers: { ...authHeaders(), "Content-Type": "application/json" },
				body: { status },
			});
			const addr = adminAddresses.value.find((a) => a.id === addressId);
			if (addr) addr.status = status;
		} catch (err) {
			console.error("[useAdminData] updateAddressStatus error:", err);
			const addr = adminAddresses.value.find((a) => a.id === addressId);
			if (addr) addr.status = status;
		}
	};

	// ──────────────────────────────────────────────────────────────────────────
	// SUPPORT
	// ──────────────────────────────────────────────────────────────────────────

	const fetchAdminSupport = async (status?: SupportStatus | "", page = 0, size = 20) => {
		isLoadingSupport.value = true;
		try {
			const params = new URLSearchParams({ page: String(page), size: String(size) });
			if (status) params.set("status", status);

			const res = await ($api as any)<PageResult<AdminSupportDTO>>(
				`/api/admin/support?${params.toString()}`,
				{ headers: authHeaders() },
			);

			adminSupport.value = res?.content ?? [];
			adminSupportMeta.value = {
				totalElements: res?.totalElements ?? 0,
				totalPages: res?.totalPages ?? 1,
				currentPage: res?.number ?? 0,
			};
		} catch (err) {
			console.error("[useAdminData] fetchAdminSupport error:", err);
		} finally {
			isLoadingSupport.value = false;
		}
	};

	const updateSupportStatus = async (supportId: number, status: SupportStatus) => {
		try {
			await ($api as any)<any>(`/api/admin/support/${supportId}`, {
				method: "PATCH",
				headers: { ...authHeaders(), "Content-Type": "application/json" },
				body: { status },
			});
			const ticket = adminSupport.value.find((t) => t.id === supportId);
			if (ticket) ticket.status = status;
		} catch (err) {
			console.error("[useAdminData] updateSupportStatus error:", err);
			const ticket = adminSupport.value.find((t) => t.id === supportId);
			if (ticket) ticket.status = status;
		}
	};

	const markSupportProcessed = async (supportId: number) => {
		await updateSupportStatus(supportId, "PROCESSED");
	};

	// ──────────────────────────────────────────────────────────────────────────
	// Utilitaires d'affichage
	// ──────────────────────────────────────────────────────────────────────────

	const getInitials = (name: string) => {
		if (!name) return "??";
		const parts = name.trim().split(" ");
		return parts.length > 1
			? (parts[0][0] + parts[1][0]).toUpperCase()
			: name.substring(0, 2).toUpperCase();
	};

	const formatDate = (iso?: string) => {
		if (!iso) return "—";
		const d = new Date(iso);
		if (isNaN(d.getTime())) return iso;
		return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
	};

	const formatTime = (iso?: string) => {
		if (!iso) return "—";
		const d = new Date(iso);
		if (isNaN(d.getTime())) return "—";
		return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
	};

	return {
		adminUsers,
		adminUsersMeta,
		isLoadingUsers,
		fetchAdminUsers,
		updateUserRole,
		adminAddresses,
		adminAddressesMeta,
		isLoadingAddresses,
		fetchAdminAddresses,
		fetchUserAddresses,
		updateAddressStatus,
		adminSupport,
		adminSupportMeta,
		isLoadingSupport,
		fetchAdminSupport,
		markSupportProcessed,
		updateSupportStatus,
		getInitials,
		formatDate,
		formatTime,
	};
}
