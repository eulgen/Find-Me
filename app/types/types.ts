/**
 * types.ts
 * Type definitions for the findMe Address Platform
 */

export interface AddressData {
	fullName: string;
	phone: string;
	country?: string;
	city: string;
	district?: string;
	neighborhood?: string;
	postalCode?: string;
	streetName?: string;
	street?: string;
	housePlateNumber?: string;
	houseNumber?: string;
	landmark?: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	gps?: {
		latitude: number;
		longitude: number;
	};
	addressCode: string; // Generated e.g., FM-DLA-8392B
	photoUrl?: string;
	photoRaw?: string;
	photoStats?: { compressed: string; ratio: string };
	userId?: string;
	email?: string;
	// Backend fields
	id?: number;
	arrondissement?: string;
}

export interface Testimonial {
	id: number;
	name: string;
	role: string;
	location: string;
	quote: string;
	avatarSeed: string;
}

export interface FAQItem {
	id: number;
	question: string;
	answer: string;
	category: string;
}

export interface Benefit {
	id: number;
	title: string;
	description: string;
	badge: string;
}

/** Modèle utilisateur retourné par le backend Spring Boot */
export interface User {
	id: string | number;
	email: string;
	/** Prénom + nom (fullName côté backend) */
	username: string;
	fullName?: string;
	role?: "USER" | "ADMIN" | "SUPPORT_AGENT";
	/** Rôle local (compatibilité ancienne nomenclature) */
	rule?: "user" | "admin";
	phoneNumber?: string;
	photo?: string;
	createdAt?: string;
	verified?: boolean;
}

/** Réponse de /api/auth/signin et /api/auth/signup du backend Spring Boot */
export interface ResponseSignIn {
	accessToken: string;
	refreshToken: string;
	/** Certains endpoints peuvent inclure l'objet user */
	user?: User;
}

/** Payload de création d'adresse selon le contrat Postman */
export interface CreateAddressPayload {
	country: string;
	city: string;
	district: string;
	postalCode?: string;
	street: string;
	houseNumber?: string;
	gps: {
		latitude: number;
		longitude: number;
	};
}
