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
export async function downloadAddressPDF(
	addr: any,
	addToast: (msg: string, type?: "success" | "info") => void,
) {
	if (!addr) return;

	// Generate QR Code (async, client-side)
	const qrText = addr.addressCode || "CODE-ND";
	const qrDataUrl = await generateQRCodeDataUrl(qrText);

	// Fetch Real Map Tile
	const mapLat = parseFloat(addr.coordinates?.lat || "3.8480");
	const mapLng = parseFloat(addr.coordinates?.lng || "11.5021");
	const mapTile = await getMapTileDataUrl(mapLat, mapLng, 17);

	// Convert photo URL or photoRaw to DataURL for PDF embedding
	const photoSource = addr.photoUrl || addr.photoRaw || addr.photo;
	const photoDataUrl = photoSource ? await urlToDataUrl(photoSource) : null;

	// Generate Logo (async)
	const logoDataUrl = await getLogoBase64();

	const { jsPDF } = await import("jspdf");
	const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

	// Couleurs (Ton Émeraude Uni #00bc7d & Sombre #0A0D1A)
	const COLOR_DARK = [10, 13, 26] as [number, number, number];
	const COLOR_GREEN = [0, 188, 125] as [number, number, number];
	const COLOR_TEXT = [15, 23, 42] as [number, number, number];

	// Fond principal
	doc.setFillColor(250, 248, 245);
	doc.rect(0, 0, 210, 297, "F");

	// --- EN-TÊTE ---
	if (logoDataUrl) {
		doc.addImage(logoDataUrl, "PNG", 15, 15, 48, 15);
	} else {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(14);
		doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
		doc.text("Find", 30, 25);
		doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
		doc.text("Me", 41, 25);
	}
	
	// Titres Droit
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("CERTIFICAT OFFICIEL", 185, 22, { align: "right" });
	doc.text("D'ADRESSAGE", 185, 29, { align: "right" });

	// Sous-titre Ministère
	doc.setFont("helvetica", "normal");
	doc.setFontSize(7);
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text("MINISTÈRE DU DÉVELOPPEMENT URBAIN", 20, 36);
	doc.text("RÉPUBLIQUE DU CAMEROUN • PAIX-TRAVAIL-PATRIE", 185, 36, { align: "right" });

	// --- BOÎTE 1 : CODE UNIQUE ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.setLineWidth(0.5);
	doc.roundedRect(20, 42, 170, 30, 4, 4, "FD");

	doc.setFontSize(8);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text("CODE NUMÉRIQUE UNIQUE (ID)", 28, 51);

	// Gros Code
	doc.setFontSize(22);
	doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	doc.text(addr.addressCode || "CODE-ND", 28, 62);

	// Icône check verte
	const checkX = doc.getTextWidth(addr.addressCode || "CODE-ND") + 35;
	doc.setFillColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	doc.circle(checkX, 59, 4.5, "F");
	doc.setDrawColor(255, 255, 255);
	doc.setLineWidth(0.8);
	doc.line(checkX - 1.5, 59, checkX - 0.5, 60.5);
	doc.line(checkX - 0.5, 60.5, checkX + 2, 57.5);

	// Pill vérifié
	doc.setFillColor(230, 248, 240);
	doc.roundedRect(28, 65, 85, 5, 2.5, 2.5, "F");
	doc.setFontSize(6.5);
	doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	doc.text("VÉRIFIÉ ET ENREGISTRÉ AU CADASTRE NUMÉRIQUE", 70.5, 68.5, { align: "center" });

	// --- BOÎTE 2 : INFO ADRESSAGE (GAUCHE) ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(20, 76, 105, 88, 4, 4, "FD");

	doc.setFontSize(14);
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("Informations", 28, 86);
	doc.text("d'Adressage", 28, 92);
	doc.setDrawColor(230, 230, 235);
	doc.setLineWidth(0.5);
	doc.line(28, 96, 117, 96);

	// Lignes d'info
	let startY = 104;
	const lineH = 11;

	const drawInfoLine = (iconTxt: string, label: string, val1: string, val2: string = "") => {
		doc.setFillColor(230, 248, 240);
		doc.circle(32, startY + 2, 4.5, "F");
		doc.setFontSize(6);
		doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
		doc.text(iconTxt, 32, startY + 3.5, { align: "center" });

		doc.setFontSize(7);
		doc.setTextColor(100, 116, 139);
		doc.text(label, 42, startY);
		
		doc.setFontSize(8.5);
		doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
		doc.text(val1, 42, startY + 4.5);
		if (val2) {
			doc.setFontSize(11);
			doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
			doc.text(val2, 42, startY + 9.5);
		}
		startY += lineH + (val2 ? 5 : 0);
	};

	drawInfoLine("PV", "Pays / Ville", `Cameroun, ${addr.city || 'Yaoundé'}`);
	drawInfoLine("AQ", "Arrondissement / Quartier", `${addr.arrondissement || 'Yaoundé'}, ${addr.neighborhood || 'Bastos'}`);
	drawInfoLine("RV", "Rue / Voie", addr.streetName || "Rue Principale");
	drawInfoLine("NP", "Numéro de Porte", "", addr.housePlateNumber || "33A");
	drawInfoLine("GPS", "Coordonnées GPS", `Lat: ${mapLat.toFixed(6)}`, `Lng: ${mapLng.toFixed(6)}`);

	// --- BOÎTE 3 : QR CODE (DROITE HAUT) ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(132, 76, 58, 88, 4, 4, "FD");

	if (qrDataUrl) {
		doc.setDrawColor(230, 230, 235);
		doc.roundedRect(141, 95, 40, 40, 2, 2, "S");
		doc.addImage(qrDataUrl, "PNG", 143.5, 97.5, 35, 35);
	}
	doc.setFontSize(7);
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text("Scannez pour localiser ou partager son adresse", 161, 143, { align: "center" });
    
    // --- BOÎTE 4 : ILLUSTRATIONS (PLEINE LARGEUR) ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(20, 169, 170, 54, 4, 4, "FD");

	// Séparateur vertical
	doc.setDrawColor(240, 240, 245);
	doc.line(105, 173, 105, 219);

	// Photo Bâtiment (Gauche)
	doc.setFontSize(7);
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text("PHOTOGRAPHIE DU BÂTIMENT", 62.5, 177, { align: "center" });

	if (photoDataUrl) {
		try {
			doc.addImage(photoDataUrl, "JPEG", 28, 180, 69, 39);
		} catch (e) {
			doc.setFillColor(240, 240, 245);
			doc.rect(28, 180, 69, 39, "F");
		}
	} else {
		doc.setFillColor(240, 240, 245);
		doc.rect(28, 180, 69, 39, "F");
	}

	// Vue Localisation (Droite)
	doc.text("VUE DE LOCALISATION SUR CARTE", 147.5, 177, { align: "center" });
	doc.setFillColor(235, 240, 255);
	doc.rect(126.5, 180, 42, 42, "F");
	
	if (mapTile) {
		doc.addImage(mapTile.base64, "PNG", 126.5, 180, 42, 42);
		
		const markerX = 126.5 + mapTile.pixelX * 42;
		const markerY = 180 + mapTile.pixelY * 42;
		
		doc.setFillColor(0, 188, 125);
		doc.setDrawColor(255, 255, 255);
		doc.setLineWidth(0.3);
		doc.circle(markerX, markerY - 2, 2.5, "FD"); 
		doc.triangle(markerX - 2.2, markerY - 2, markerX + 2.2, markerY - 2, markerX, markerY + 1.5, "F"); 
		
		doc.setFillColor(255, 255, 255);
		doc.rect(126.5, 210, 42, 5, "F");
		doc.setFontSize(4.5);
		doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
		doc.text(`${mapLat.toFixed(4)}, ${mapLng.toFixed(4)}`, 147.5, 213.5, { align: "center" });
	} else {
		doc.setDrawColor(255, 255, 255);
		doc.setLineWidth(1.5);
		doc.line(126.5, 201, 168.5, 201);
		doc.line(147.5, 180, 147.5, 222);
		doc.setFillColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
		doc.circle(147.5, 201, 2, "F"); 
	}

	// --- BOÎTE 5 : FOOTER PREUVE OFFICIELLE ---
	doc.setFillColor(246, 245, 252); 
	doc.setDrawColor(255, 255, 255);
	doc.roundedRect(20, 228, 170, 36, 6, 6, "FD");

	// Icône Shield
	doc.setDrawColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.setLineWidth(0.4);
	doc.line(28, 235, 32, 233); 
	doc.line(32, 233, 36, 235); 
	doc.line(36, 235, 36, 239); 
	doc.line(28, 235, 28, 239); 
	doc.line(28, 239, 32, 243); 
	doc.line(36, 239, 32, 243); 
	doc.setFillColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.circle(32, 238, 0.8, "F"); 	
	
	// Titre preuve
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text("Ce certificat constitue une preuve officielle d'adressage.", 40, 238);

	// Texte info citoyen
	doc.setFontSize(7.5);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text(`Il atteste de la conformité des données déclarées par :`, 40, 244);
	
	doc.setFontSize(8.5);
	doc.setFont("helvetica", "bold");
	doc.text(`Email : ${addr.email || 'Non renseigné'}`, 40, 250);
	doc.text(`Téléphone : ${addr.phoneNumber || 'Non renseigné'}`, 40, 255);

	// Date d'émission (badge)
	const today = new Date().toLocaleDateString("fr-FR");
	doc.setFillColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.roundedRect(135, 248, 45, 8, 4, 4, "F");
	doc.setFontSize(7);
	doc.setTextColor(255, 255, 255);
	doc.text(`Date d'émission: ${today}`, 157.5, 253.5, { align: "center" });
	
	// --- CACHET DE FIN ---
	doc.setDrawColor(200, 200, 205);
	doc.setLineWidth(0.3);
	doc.setLineDashPattern([2, 2], 0);
	doc.line(20, 272, 190, 272);
	
	doc.setLineDashPattern([], 0);
	doc.setFontSize(6);
	doc.setTextColor(180, 180, 185);
	doc.text("DOCUMENT GÉNÉRÉ DE MANIÈRE SÉCURISÉE PAR FINDME CM", 105, 277, { align: "center" });

	doc.save(`Certificat_Adressage_${addr.addressCode}.pdf`);
	addToast(
		`Le certificat d'adressage officiel PDF pour ${addr.addressCode} a été téléchargé avec le nouveau design Émeraude.`,
		"success",
	);
}
