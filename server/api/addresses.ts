import {
	defineEventHandler,
	readBody,
	createError,
	getQuery,
	getMethod,
} from "h3";
import { getDb, saveDb } from "../utils/db";

export default defineEventHandler(async (event) => {
	const method = getMethod(event);
	const db = getDb();

	if (method === "GET") {
		// Return all addresses
		return db.addresses;
	}

	if (method === "POST") {
		const body = await readBody(event);

		// Server-side validation
		const {
			fullName,
			phone,
			city,
			arrondissement,
			neighborhood,
			streetName,
			housePlateNumber,
			coordinates,
			landmark,
			postalCode,
		} = body;

		if (!fullName || !phone || !city || !neighborhood || !streetName) {
			throw createError({
				statusCode: 400,
				statusMessage: "Bad Request",
				message: "Champs requis manquants pour immatriculer l'adresse",
			});
		}

		// Generate plate code on the server for security
		const cityCompact =
			city === "Douala"
				? "DLA"
				: city === "Yaoundé"
					? "YDE"
					: city === "Bafoussam"
						? "BFM"
						: city === "Garoua"
							? "GAR"
							: "KRI";

		const qClean = neighborhood.trim().toUpperCase();
		const block = qClean
			? qClean.substring(0, 3).replace(/[^A-Z0-9]/g, "")
			: "XXX";
		const plate = (housePlateNumber || "SPlate")
			.trim()
			.toUpperCase()
			.replace(/[^A-Z0-9-]/g, "");

		const calculatedAddressCode = `FM-${cityCompact}-${block}-${plate}`;

		const newAddress = {
			fullName: fullName.trim(),
			phone: phone.trim(),
			city,
			arrondissement: arrondissement || `${city} I`,
			neighborhood: neighborhood.trim(),
			postalCode: postalCode || "00237",
			housePlateNumber: housePlateNumber || "SPlate",
			streetName: streetName.trim(),
			landmark: landmark || "Axe de quartier principal",
			coordinates: coordinates || { lat: 3.848, lng: 11.5021 },
			addressCode: calculatedAddressCode,
			photoRaw: "/assets/images/cameroon_house_address_1780109511639.png",
			photoStats: {
				compressed: "185 KB",
				ratio: "83",
			},
		};

		// Avoid duplicate addressCodes in the list
		db.addresses = db.addresses.filter(
			(a) => a.addressCode !== calculatedAddressCode,
		);
		db.addresses.unshift(newAddress);
		saveDb(db);

		return {
			success: true,
			address: newAddress,
		};
	}

	if (method === "DELETE") {
		const query = getQuery(event);
		const code = query.code as string;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: "Bad Request",
				message: "Le code d'adresse est requis pour la suppression",
			});
		}

		const initialLength = db.addresses.length;
		db.addresses = db.addresses.filter((a) => a.addressCode !== code);

		if (db.addresses.length === initialLength) {
			throw createError({
				statusCode: 444,
				statusMessage: "Not Found",
				message: "Adresse non trouvée",
			});
		}

		saveDb(db);
		return {
			success: true,
			message: `L'adresse (${code}) a été retirée définitivement.`,
		};
	}

	throw createError({
		statusCode: 405,
		statusMessage: "Method Not Allowed",
		message: "Méthode non autorisée",
	});
});
