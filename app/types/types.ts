/**
 * @file types.ts
 * @description Modèles et DTOs stricts calqués à 100% sur l'API OpenAPI Spring Boot (api-docs.json)
 * et la collection Postman findMe.
 */

// ── 1. DTOs d'Authentification & Utilisateur ───────────────────────────────

/** Rôles système officiels Spring Boot */
export type UserRole = "USER" | "ADMIN" | "SUPPORT_AGENT";

/** Statuts utilisateur système */
export type UserStatus = "ACTIVE" | "PENDING_VERIFICATION" | "BLOCKED" | string;

/**
 * UserProfileDTO - Profil utilisateur retourné par GET /api/users/me et POST /api/auth/signup
 */
export interface UserProfileDTO {
	id: number;
	email: string;
	fullName: string;
	phoneNumber?: string;
	profileImage?: string;
	role: UserRole;
	status?: UserStatus;
	createdAt?: string;
	lastLoginAt?: string;
}

/**
 * User - Interface d'utilisation frontend (exactement alignée sur UserProfileDTO)
 */
export interface User extends UserProfileDTO {
	verified?: boolean;
}

/** AuthResponseDTO - Réponse de /api/auth/signin, /api/auth/google, /api/auth/apple, /api/auth/refresh */
export interface AuthResponseDTO {
	accessToken: string;
	refreshToken: string;
	expiresIn?: number;
}

/** SignUpRequestDTO - Payload POST /api/auth/signup */
export interface SignUpRequestDTO {
	email: string;
	password: string;
	fullName: string;
}

/** SignInRequestDTO - Payload POST /api/auth/signin */
export interface SignInRequestDTO {
	email: string;
	password: string;
}

/** VerifyOtpRequestDTO - Payload POST /api/auth/verify-account */
export interface VerifyOtpRequestDTO {
	email: string;
	code: string;
}

/** ResetPasswordRequestDTO - Payload POST /api/auth/reset-password */
export interface ResetPasswordRequestDTO {
	email: string;
	code: string;
	newPassword: string;
	token?: string;
}

/** UpdateProfileRequestDTO - Payload PUT /api/users/me */
export interface UpdateProfileRequestDTO {
	fullName: string;
	phoneNumber?: string;
	profileImage?: string;
}


// ── 2. DTOs d'Adresses ─────────────────────────────────────────────────────

/** Coordonnées GPS standardisées */
export interface GpsCoordinateDTO {
	latitude: number;
	longitude: number;
}

/** AddressRequestDTO - Payload POST /api/addresses et PUT /api/addresses/{id} */
export interface AddressRequestDTO {
	country: string;
	city: string;
	district: string;
	street: string;
	houseNumber?: string;
	postalCode?: string;
	photoUrl: string;
	gps: GpsCoordinateDTO;
}

/** AddressResponseDTO - Objet adresse retourné par les endpoints /api/addresses */
export interface AddressResponseDTO {
	id: number;
	addressCode: string;
	country: string;
	city: string;
	district: string;
	street: string;
	houseNumber?: string;
	postalCode?: string;
	photoUrl?: string;
	gps: GpsCoordinateDTO;
	createdAt?: string;
	updatedAt?: string;
}

/** AddressData - Alias réactif frontend pour l'affichage dans les composants */
export interface AddressData extends AddressResponseDTO {
	/** Alias de quartier */
	neighborhood?: string;
	/** Alias de rue */
	streetName?: string;
	/** Alias de numéro de concession */
	housePlateNumber?: string;
	/** Coordonnées format Leaflet { lat, lng } */
	coordinates?: {
		lat: number;
		lng: number;
	};
	photoRaw?: string;
	photoStats?: { compressed: string; ratio: string };
	type?: "home" | "work" | "family" | "other";
}

/** PageAddressResponseDTO - Pagination d'adresses */
export interface PageAddressResponseDTO {
	content: AddressResponseDTO[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}


// ── 3. DTOs de Support Client ──────────────────────────────────────────────

export type SupportStatus = "PENDING" | "PROCESSED";

export interface CreateSupportRequestDTO {
	name: string;
	email: string;
	message: string;
}

export interface SupportResponseDTO {
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


// ── 4. Erreurs RFC 7807 (Problem Details) ──────────────────────────────────

export interface ProblemDetailsDTO {
	type?: string;
	title: string;
	status: number;
	detail?: string;
	instance?: string;
}
