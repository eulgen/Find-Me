/**
 * @file useAddressExporter.ts
 * @description Composable spécialisé dans l'export technique des fiches d'adresses.
 *
 * Il propose deux méthodes d'export :
 * 1. downloadAddressFile : Génère et télécharge une plaque vectorielle SVG haute qualité.
 * 2. downloadAddressPDF  : Génère et télécharge un Certificat Officiel d'Adressage en format PDF A4,
 *    incluant un QR Code pointant vers le code unique de l'adresse.
 */

// jsPDF imported dynamically
import { useToasts } from "./useToasts";

export function useAddressExporter() {
	const { addToast } = useToasts();
	return {
		downloadAddressFile: (addr: any) => downloadAddressFile(addr, addToast),
		downloadAddressPDF: (addr: any) => downloadAddressPDF(addr, addToast),
	};
}

/**
 * Convertit une URL d'image (HTTP/HTTPS ou DataURL) en DataURL base64 pour jsPDF.
 */
async function urlToDataUrl(url: string): Promise<string | null> {
	if (!url || typeof window === "undefined") return null;
	if (url.startsWith("data:")) return url;
	try {
		return new Promise((resolve) => {
			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth || img.width || 400;
				canvas.height = img.naturalHeight || img.height || 300;
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.drawImage(img, 0, 0);
					resolve(canvas.toDataURL("image/jpeg", 0.85));
				} else {
					resolve(null);
				}
			};
			img.onerror = () => resolve(null);
			img.src = url;
		});
	} catch {
		return null;
	}
}

/**
 * Génère un QR Code en base64 via canvas (client-side uniquement).
 * @param text Le texte à encoder dans le QR code
 * @returns Data URL PNG ou null si l'environnement ne le supporte pas
 */
async function generateQRCodeDataUrl(text: string): Promise<string | null> {
	if (typeof window === "undefined") return null;
	try {
		const QRCode = await import("qrcode");
		return await QRCode.toDataURL(text, {
			width: 120,
			margin: 1,
			color: { dark: "#0A0D1A", light: "#FFFFFF" },
		});
	} catch {
		return null;
	}
}

/**
 * Récupère dynamiquement la tuile OpenStreetMap correspondante aux coordonnées
 * @param lat Latitude
 * @param lng Longitude
 * @param zoom Niveau de zoom (16 recommandé pour quartier)
 */
async function getMapTileDataUrl(lat: number, lng: number, zoom = 16): Promise<{ base64: string, pixelX: number, pixelY: number } | null> {
	if (typeof window === "undefined" || isNaN(lat) || isNaN(lng)) return null;
	try {
		const n = Math.pow(2, zoom);
		const x = ((lng + 180) / 360) * n;
		const latRad = (lat * Math.PI) / 180;
		const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;
		
		const tileX = Math.floor(x);
		const tileY = Math.floor(y);
		const pixelX = x - tileX;
		const pixelY = y - tileY;

		const tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
		
		const res = await fetch(tileUrl);
		const blob = await res.blob();
		const base64 = await new Promise<string>((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.readAsDataURL(blob);
		});
		return { base64, pixelX, pixelY };
	} catch (err) {
		console.error("Failed to fetch OSM tile for PDF", err);
		return null;
	}
}

/**
 * Génère et lance le téléchargement d'un fichier SVG vectoriel de la plaque.
 * @param addr      Les données de l'adresse utilisateur à inscrire
 * @param addToast  Callback pour émettre une notification Toast en cas de succès
 */
export async function downloadAddressFile(
	addr: any,
	addToast: (msg: string, type?: "success" | "info") => void,
) {
	if (!addr) return;

	const qrCodeText = addr.addressCode || "CODE-ND";
	const qrDataUrl = await generateQRCodeDataUrl(qrCodeText);

	const qrElement = qrDataUrl
		? `<g transform="translate(560, 260)">
         <rect width="130" height="130" rx="16" fill="#FFFFFF" stroke="#00bc7d" stroke-width="3"/>
         <image href="${qrDataUrl}" x="10" y="10" width="110" height="110"/>
       </g>`
		: "";

	const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&amp;family=JetBrains+Mono:wght@700&amp;display=swap');
        .title { font-family: 'Space Grotesk', sans-serif; font-weight: 900; fill: #0A0D1A; }
        .mono  { font-family: 'JetBrains Mono', monospace; font-weight: 700; fill: #0A0D1A; }
        .label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; fill: #64748b; }
        .value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; fill: #0A0D1A; }
        .code  { font-family: 'Space Grotesk', sans-serif; font-weight: 900; fill: #FFFFFF; letter-spacing: 2px; }
      </style>
    </defs>
    <rect width="800" height="600" fill="#FAF8F5" />
    <rect x="48" y="48" width="712" height="512" rx="24" fill="#0A0D1A" />
    <rect x="40" y="40" width="712" height="512" rx="24" fill="#FFFFFF" stroke="#0A0D1A" stroke-width="8" />
    <rect x="40" y="40" width="712" height="90" rx="24" fill="#0A0D1A" />
    <text x="400" y="94" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" fill="#FFFFFF" font-size="20" letter-spacing="2">CERTIFICAT D'ADRESSAGE NUMÉRIQUE</text>
    <rect x="620" y="160" width="100" height="35" rx="8" fill="#00bc7d" />
    <text x="670" y="182" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" fill="#FFFFFF" font-size="12">CAMEROUN</text>
    <text x="80" y="190" class="label" font-size="11">PROPRIÉTAIRE VALIDE :</text>
    <text x="80" y="215" class="value" font-size="18">${addr.fullName || "Utilisateur FindMe"}</text>
    <text x="80" y="270" class="label" font-size="11">VILLE &amp; ARRONDISSEMENT :</text>
    <text x="80" y="295" class="value" font-size="18">${addr.city || "Yaoundé"} • ${addr.arrondissement || addr.district || "Yaoundé I"}</text>
    <text x="80" y="350" class="label" font-size="11">QUARTIER &amp; REPÈRE VISUEL :</text>
    <text x="80" y="375" class="value" font-size="15">${addr.neighborhood || addr.district || "Quartier"} — ${addr.streetName || addr.street || "Voie enregistrée"}</text>
    <text x="440" y="190" class="label" font-size="11">COORDONNÉES SATELLITES :</text>
    <text x="440" y="215" class="mono" font-size="14">LAT: ${addr.coordinates?.lat || "3.8480"}° N / LNG: ${addr.coordinates?.lng || "11.5021"}° E</text>
    <text x="440" y="270" class="label" font-size="11">PLAQUE D'ENTRÉE MUNICIPALE :</text>
    <text x="440" y="295" class="value" font-size="28" fill="#00bc7d">N° ${addr.housePlateNumber || addr.houseNumber || "28B"}</text>
    ${qrElement}
    <rect x="80" y="440" width="640" height="70" rx="16" fill="#00bc7d" />
    <text x="400" y="482" text-anchor="middle" class="code" font-size="24">${addr.addressCode}</text>
  </svg>`;

	const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `Certificat_municipal_${addr.addressCode}.svg`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);

	addToast(
		`Le certificat vectoriel (SVG) avec QR Code pour l'adresse ${addr.addressCode} a été téléchargé.`,
		"success",
	);
}

/**
 * Génère le Logo SVG en Base64 pour le PDF
 */
async function getLogoBase64(): Promise<string> {
	if (typeof window === "undefined") return "";
	const svgString = `<svg width="190" height="52" viewBox="0 0 190 52" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M22 6 C12.059 6 4 14.059 4 24 C4 35.5 22 47 22 47 C22 47 40 35.5 40 24 C40 14.059 31.941 6 22 6 Z" fill="#00bc7d" /><circle cx="22" cy="22" r="10" fill="#FFFFFF" /><path d="M16 22 L20 26 L28 17" stroke="#00bc7d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /><circle cx="36" cy="10" r="4.5" fill="#00bc7d" stroke="#FFFFFF" stroke-width="1.5" /></g><text x="48" y="31" fill="#0A0D1A" font-size="25" font-weight="900" font-family="'Playfair Display', Georgia, serif" letter-spacing="-0.5">find</text><text x="96" y="31" fill="#00bc7d" font-size="27" font-weight="900" font-family="sans-serif" letter-spacing="-0.5">Me</text><text x="49" y="44" fill="#64748B" font-size="7" font-weight="800" font-family="sans-serif" letter-spacing="2.2">ADRESSAGE CERTIFIÉ</text></svg>`;

	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = 190 * 4;
			canvas.height = 52 * 4;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.scale(4, 4);
				ctx.drawImage(img, 0, 0);
				resolve(canvas.toDataURL("image/png"));
			} else {
				resolve("");
			}
		};
		img.onerror = () => resolve("");
		img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
	});
}

/**
 * Génère et lance le téléchargement du Certificat Officiel d'Adressage au format PDF A4,
 * incluant un QR Code encodant le code unique de l'adresse et le design Émeraude Uni.
 * @param addr      Les données de l'adresse à inscrire dans le document
 * @param addToast  Callback pour émettre une notification Toast en cas de succès
 */
/**
 * Redimensionne et découpe proprement une image DataURL au format cover (aspect-ratio préservé)
 */
async function fitImageCoverDataUrl(
	dataUrl: string,
	targetW = 600,
	targetH = 304,
): Promise<string | null> {
	if (!dataUrl || typeof window === "undefined") return null;
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = targetW;
			canvas.height = targetH;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve(null);
				return;
			}
			const srcW = img.naturalWidth || img.width || 1;
			const srcH = img.naturalHeight || img.height || 1;

			const scale = Math.max(targetW / srcW, targetH / srcH);
			const drawW = srcW * scale;
			const drawH = srcH * scale;
			const offsetX = (targetW - drawW) / 2;
			const offsetY = (targetH - drawH) / 2;

			ctx.fillStyle = "#F1F5F9";
			ctx.fillRect(0, 0, targetW, targetH);
			ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
			resolve(canvas.toDataURL("image/jpeg", 0.92));
		};
		img.onerror = () => resolve(null);
		img.src = dataUrl;
	});
}

/**
 * Génère et lance le téléchargement du Certificat Officiel d'Adressage au format PDF A4,
 * incluant un QR Code encodant le code unique de l'adresse et le design Émeraude Uni.
 * @param addr      Les données de l'adresse à inscrire dans le document
 * @param addToast  Callback pour émettre une notification Toast en cas de succès
 */
export async function downloadAddressPDF(
	addr: any,
	addToast: (msg: string, type?: "success" | "info") => void,
) {
	if (!addr) return;

	// Generate QR Code (async, client-side)
	const qrText = addr.addressCode || "CODE-ND";
	const qrDataUrl = await generateQRCodeDataUrl(qrText);

	// Fetch Real Map Tile
	const mapLat = parseFloat(addr.coordinates?.lat ?? addr.gps?.latitude ?? "3.8480");
	const mapLng = parseFloat(addr.coordinates?.lng ?? addr.gps?.longitude ?? "11.5021");
	const mapTile = await getMapTileDataUrl(mapLat, mapLng, 17);

	// Convert photo URL or photoRaw to DataURL for PDF embedding
	const photoSource = (addr.photoRaw && (addr.photoRaw.startsWith("data:") || addr.photoRaw.startsWith("blob:")))
		? addr.photoRaw
		: (addr.photo && (addr.photo.startsWith("data:") || addr.photo.startsWith("blob:")))
			? addr.photo
			: addr.photoRaw || addr.photoUrl || addr.photo;
	const rawPhotoDataUrl = photoSource ? await urlToDataUrl(photoSource) : null;
	const photoCoverUrl = rawPhotoDataUrl ? await fitImageCoverDataUrl(rawPhotoDataUrl, 600, 304) : null;
	const mapCoverUrl = mapTile?.base64 ? await fitImageCoverDataUrl(mapTile.base64, 600, 304) : null;

	// Generate Logo (async)
	const logoDataUrl = await getLogoBase64();

	const { jsPDF } = await import("jspdf");
	const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

	// Couleurs (Ton Émeraude Uni #00bc7d & Sombre #0A0D1A)
	const COLOR_DARK = [10, 13, 26] as [number, number, number];
	const COLOR_GREEN = [0, 188, 125] as [number, number, number];
	const COLOR_TEXT = [15, 23, 42] as [number, number, number];

	// Fond principal A4
	doc.setFillColor(250, 248, 245);
	doc.rect(0, 0, 210, 297, "F");

	// --- EN-TÊTE ---
	if (logoDataUrl) {
		doc.addImage(logoDataUrl, "PNG", 15, 14, 48, 14);
	} else {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(14);
		doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
		doc.text("Find", 30, 24);
		doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
		doc.text("Me", 41, 24);
	}
	
	// Titres Droit
	doc.setFont("helvetica", "bold");
	doc.setFontSize(15);
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("CERTIFICAT OFFICIEL", 190, 20, { align: "right" });
	doc.text("D'ADRESSAGE NUMÉRIQUE", 190, 26, { align: "right" });

	// Sous-titre Ministère
	doc.setFont("helvetica", "bold");
	doc.setFontSize(7);
	doc.setTextColor(100, 116, 139);
	doc.text("RÉPUBLIQUE DU CAMEROUN • PAIX-TRAVAIL-PATRIE", 190, 32, { align: "right" });

	// --- BOÎTE 1 : CODE UNIQUE (Y=36 à Y=66) ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.setLineWidth(0.4);
	doc.roundedRect(15, 36, 180, 28, 4, 4, "FD");

	doc.setFontSize(8);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(100, 116, 139);
	doc.text("CODE DIGITAL CERTIFIÉ (ID UNIQUE)", 22, 44);

	// Gros Code
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	const displayCode = addr.addressCode || "CODE-ND";
	doc.text(displayCode, 22, 54);

	// Icône check verte
	const checkX = 22 + doc.getTextWidth(displayCode) + 6;
	doc.setFillColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	doc.circle(checkX, 52, 4, "F");
	doc.setDrawColor(255, 255, 255);
	doc.setLineWidth(0.7);
	doc.line(checkX - 1.5, 52, checkX - 0.5, 53.5);
	doc.line(checkX - 0.5, 53.5, checkX + 2, 50.5);

	// Badge vérifié
	doc.setFillColor(230, 248, 240);
	doc.roundedRect(22, 57, 95, 4.5, 2, 2, "F");
	doc.setFontSize(6);
	doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	doc.text("HOMOLOGUÉ ET ENREGISTRÉ AU CADASTRE NUMÉRIQUE", 69.5, 60.2, { align: "center" });

	// --- BOÎTE 2 : INFO ADRESSAGE (GAUCHE, Y=68 à Y=154) ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(15, 68, 120, 86, 4, 4, "FD");

	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("Informations d'Adressage", 22, 78);
	doc.setDrawColor(230, 230, 235);
	doc.setLineWidth(0.4);
	doc.line(22, 82, 128, 82);

	// Lignes d'info
	let startY = 88;
	const lineH = 11.5;

	const drawInfoLine = (iconTxt: string, label: string, val1: string, val2: string = "") => {
		doc.setFillColor(230, 248, 240);
		doc.circle(26, startY + 1.5, 3.8, "F");
		doc.setFontSize(5.5);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
		doc.text(iconTxt, 26, startY + 3, { align: "center" });

		doc.setFontSize(6.5);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(100, 116, 139);
		doc.text(label, 34, startY);

		doc.setFontSize(8.5);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
		doc.text(val1, 34, startY + 4.2);

		if (val2) {
			doc.setFontSize(8.5); // Uniform 8.5pt font size
			doc.setFont("helvetica", "bold");
			doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
			doc.text(val2, 34, startY + 8.5);
		}
		startY += lineH + (val2 ? 4.5 : 0);
	};

	drawInfoLine("PV", "Pays / Ville", `${addr.country || 'Cameroun'}, ${addr.city || 'Yaoundé'}`);
	drawInfoLine("AQ", "Quartier / District", addr.neighborhood || addr.district || "Non spécifié");
	drawInfoLine("RV", "Rue / Voie", addr.streetName || addr.street || "Non spécifié");
	drawInfoLine("NP", "N° de Domicile / Code Postal", `${addr.housePlateNumber || addr.houseNumber || 'Non spécifié'}  •  Code Postal: ${addr.postalCode || 'Non spécifié'}`);
	drawInfoLine("GPS", "Coordonnées GPS Satellites", `Lat: ${mapLat.toFixed(6)}° N`, `Lng: ${mapLng.toFixed(6)}° E`);

	// --- BOÎTE 3 : QR CODE (DROITE, Y=68 à Y=154) ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(139, 68, 56, 86, 4, 4, "FD");

	if (qrDataUrl) {
		doc.setDrawColor(0, 188, 125);
		doc.setLineWidth(0.6);
		doc.roundedRect(144, 82, 46, 46, 3, 3, "S");
		doc.addImage(qrDataUrl, "PNG", 145.5, 83.5, 43, 43);
	}
	doc.setFontSize(7);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("QR CODE CERTIFIÉ", 167, 76, { align: "center" });

	doc.setFontSize(6.5);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(100, 116, 139);
	doc.text("Scannez pour localiser ou", 167, 135, { align: "center" });
	doc.text("partager cette adresse", 167, 139, { align: "center" });

	// --- BOÎTE 4 : ILLUSTRATIONS (SIDE-BY-SIDE, Y=158 à Y=222) ---
	// Carte Façade Bâtiment (Gauche)
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(15, 158, 88, 64, 4, 4, "FD");

	doc.setFontSize(7);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("PHOTOGRAPHIE DE LA FAÇADE", 59, 165, { align: "center" });

	if (photoCoverUrl) {
		try {
			doc.addImage(photoCoverUrl, "JPEG", 19, 168, 80, 48);
		} catch (e) {
			doc.setFillColor(240, 243, 246);
			doc.rect(19, 168, 80, 48, "F");
		}
	} else {
		doc.setFillColor(240, 243, 246);
		doc.rect(19, 168, 80, 48, "F");
		doc.setFontSize(8);
		doc.setTextColor(150, 160, 175);
		doc.text("Aucune photo téléversée", 59, 194, { align: "center" });
	}

	// Carte Vue Satellite (Droite)
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(107, 158, 88, 64, 4, 4, "FD");

	doc.setFontSize(7);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("POSITIONNEMENT SUR CARTE", 151, 165, { align: "center" });

	if (mapCoverUrl) {
		doc.addImage(mapCoverUrl, "JPEG", 111, 168, 80, 48);
		
		// Marqueur au centre exact
		const markerX = 111 + 40;
		const markerY = 168 + 24;
		
		doc.setFillColor(0, 188, 125);
		doc.setDrawColor(255, 255, 255);
		doc.setLineWidth(0.4);
		doc.circle(markerX, markerY - 2, 2.8, "FD"); 
		doc.triangle(markerX - 2.5, markerY - 2, markerX + 2.5, markerY - 2, markerX, markerY + 2, "F"); 
		
		// Badge coordonnées bas de carte
		doc.setFillColor(255, 255, 255);
		doc.roundedRect(121, 210, 60, 5, 2, 2, "F");
		doc.setFontSize(6.5);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
		doc.text(`${mapLat.toFixed(5)}° N, ${mapLng.toFixed(5)}° E`, 151, 213.5, { align: "center" });
	} else {
		doc.setFillColor(240, 243, 246);
		doc.rect(111, 168, 80, 48, "F");
		doc.setFontSize(8);
		doc.setTextColor(150, 160, 175);
		doc.text("Coordonnées: " + mapLat.toFixed(4) + ", " + mapLng.toFixed(4), 151, 194, { align: "center" });
	}

	// --- BOÎTE 5 : FOOTER PREUVE OFFICIELLE (Y=226 à Y=262) ---
	doc.setFillColor(246, 245, 252); 
	doc.setDrawColor(230, 230, 240);
	doc.setLineWidth(0.4);
	doc.roundedRect(15, 226, 180, 34, 4, 4, "FD");

	// Icône Shield
	doc.setDrawColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.setLineWidth(0.5);
	doc.line(23, 234, 27, 232); 
	doc.line(27, 232, 31, 234); 
	doc.line(31, 234, 31, 238); 
	doc.line(23, 234, 23, 238); 
	doc.line(23, 238, 27, 242); 
	doc.line(31, 238, 27, 242); 
	doc.setFillColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.circle(27, 237, 0.9, "F"); 	
	
	// Titre preuve
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9.5);
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("Ce certificat constitue une preuve officielle d'adressage numérique.", 35, 236);

	// Texte info citoyen
	doc.setFontSize(7.5);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(100, 116, 139);
	doc.text("Il atteste de la conformité des données certifiées et enregistrées pour le citoyen :", 35, 242);
	
	doc.setFontSize(8);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text(`Nom : ${addr.fullName || 'Citoyen FindMe'}   •   Email : ${addr.email || 'Vérifié'}   •   Tél : ${addr.phone || addr.phoneNumber || 'Vérifié'}`, 35, 249);

	// Date d'émission (badge)
	const today = new Date().toLocaleDateString("fr-FR");
	doc.setFillColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.roundedRect(136, 248, 52, 7, 3.5, 3.5, "F");
	doc.setFontSize(6.5);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(255, 255, 255);
	doc.text(`Émis le : ${today}`, 162, 252.8, { align: "center" });
	
	// --- CACHET DE FIN DE PAGE ---
	doc.setDrawColor(210, 210, 215);
	doc.setLineWidth(0.3);
	doc.setLineDashPattern([2, 2], 0);
	doc.line(15, 266, 195, 266);
	
	doc.setLineDashPattern([], 0);
	doc.setFontSize(6);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(180, 180, 185);
	doc.text("DOCUMENT OFFICIEL GÉNÉRÉ DE MANIÈRE SÉCURISÉE PAR FINDME CM • 1 PAGE", 105, 271, { align: "center" });

	doc.save(`Certificat_Adressage_${displayCode}.pdf`);
	addToast(
		`Le certificat d'adressage officiel PDF pour ${displayCode} a été téléchargé avec succès (1 page A4).`,
		"success",
	);
}
