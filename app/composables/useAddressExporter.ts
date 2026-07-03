/**
 * @file useAddressExporter.ts
 * @description Composable spÃ©cialisÃ© dans l'export technique des fiches d'adresses.
 *
 * Il propose deux mÃ©thodes d'export :
 * 1. downloadAddressFile : GÃ©nÃ¨re et tÃ©lÃ©charge une plaque vectorielle SVG haute qualitÃ©.
 * 2. downloadAddressPDF  : GÃ©nÃ¨re et tÃ©lÃ©charge un Certificat Officiel d'Adressage en format PDF A4,
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
 * GÃ©nÃ¨re un QR Code en base64 via canvas (client-side uniquement).
 * @param text Le texte Ã  encoder dans le QR code
 * @returns Data URL PNG ou null si l'environnement ne le supporte pas
 */
async function generateQRCodeDataUrl(text: string): Promise<string | null> {
	if (typeof window === "undefined") return null;
	try {
		const QRCode = await import("qrcode");
		return await QRCode.toDataURL(text, {
			width: 120,
			margin: 1,
			color: { dark: "#0f172b", light: "#FFFFFF" },
		});
	} catch {
		return null;
	}
}

/**
 * RÃ©cupÃ¨re dynamiquement la tuile OpenStreetMap correspondante aux coordonnÃ©es
 * @param lat Latitude
 * @param lng Longitude
 * @param zoom Niveau de zoom (16 recommandÃ© pour quartier)
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
 * GÃ©nÃ¨re et lance le tÃ©lÃ©chargement d'un fichier SVG vectoriel de la plaque.
 * @param addr      Les donnÃ©es de l'adresse utilisateur Ã  inscrire
 * @param addToast  Callback pour Ã©mettre une notification Toast en cas de succÃ¨s
 */
export function downloadAddressFile(
	addr: any,
	addToast: (msg: string, type?: "success" | "info") => void,
) {
	if (!addr) return;

		const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&amp;family=JetBrains+Mono:wght@700&amp;display=swap');
        .title { font-family: 'Space Grotesk', sans-serif; font-weight: 900; fill: #0f172b; }
        .mono  { font-family: 'JetBrains Mono', monospace; font-weight: 700; fill: #0f172b; }
        .label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; fill: #000000; opacity: 0.6; }
        .value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; fill: #000000; }
        .code  { font-family: 'Space Grotesk', sans-serif; font-weight: 900; fill: #FFFFFF; letter-spacing: 2px; }
      </style>
    </defs>
    <rect width="800" height="600" fill="#FAF8FD" />
    <rect x="48" y="48" width="712" height="512" rx="24" fill="#0f172b" />
    <rect x="40" y="40" width="712" height="512" rx="24" fill="#FFFFFF" stroke="#0f172b" stroke-width="8" />
    <rect x="40" y="40" width="712" height="90" rx="24" fill="#0f172b" />
    <text x="400" y="94" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" fill="#FFFFFF" font-size="20" letter-spacing="2">CERTIFICAT D'ADRESSAGE MUNICIPAL HOMOLOGUÉ</text>
    <rect x="620" y="160" width="100" height="35" rx="8" fill="#10b981" />
    <text x="670" y="182" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" fill="#FFFFFF" font-size="12">CAMEROUN</text>
    <text x="80" y="190" class="label" font-size="11">PROPRIÉTAIRE VALIDE :</text>
    <text x="80" y="215" class="value" font-size="18">${addr.fullName}</text>
    <text x="80" y="270" class="label" font-size="11">VILLE &amp; ARRONDISSEMENT :</text>
    <text x="80" y="295" class="value" font-size="18">${addr.city} • ${addr.arrondissement || "Yaoundé I"}</text>
    <text x="80" y="350" class="label" font-size="11">QUARTIER &amp; REPERE VISUEL :</text>
    <text x="80" y="375" class="value" font-size="15">${addr.neighborhood} — ${addr.landmark || "Près de l'axe principal"}</text>
    <text x="440" y="190" class="label" font-size="11">COORDONNEES SATELLITES :</text>
    <text x="440" y="215" class="mono" font-size="14">LAT: ${addr.coordinates.lat}° N / LNG: ${addr.coordinates.lng}° E</text>
    <text x="440" y="270" class="label" font-size="11">PLAQUE D'ENTRÉE MUNICIPALE :</text>
    <text x="440" y="295" class="value" font-size="28" fill="#10b981">N° ${addr.housePlateNumber || "28B"}</text>
    <rect x="80" y="440" width="640" height="70" rx="16" fill="#0f172b" />
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
		`Le certificat vectoriel (SVG) pour l'adresse ${addr.addressCode} a été téléchargé.`,
		"success",
	);
}

/**
 * GÃ©nÃ¨re le Logo SVG en Base64 pour le PDF
 */
async function getLogoBase64(): Promise<string> {
	if (typeof window === "undefined") return "";
	const svgString = `<svg width="160" height="50" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="#0f172b" stroke-width="2.5" stroke-linejoin="round"><path d="M5 12 L18 6 L31 12 M5 42 L18 36 L31 42"/><path d="M5 12 V42 L18 36 V6 L31 12 V42"/><path d="M18 6 L31 12 L44 6 V36 L31 42 L18 36" fill="#F0EDF6" fill-opacity="0.4"/><path d="M31 12 L44 6 M31 42 L44 36 M44 6 V36"/></g><circle cx="28" cy="24" r="11" fill="#10b981" stroke="#0f172b" stroke-width="2"/><path d="M24 24.5 L27 27.5 L32 20.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="56" y="28" fill="#10b981" font-size="23" font-weight="800" font-family="sans-serif">find<tspan fill="#0f172b" font-weight="900">Me</tspan></text><text x="56" y="42" fill="#0f172b" font-size="6.5" letter-spacing="1.8" font-weight="600" font-family="sans-serif">ADRESSAGE URBAIN</text></svg>`;

	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = 160 * 4;
			canvas.height = 50 * 4;
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
 * GÃ©nÃ¨re et lance le tÃ©lÃ©chargement du Certificat Officiel d'Adressage au format PDF A4,
 * incluant un QR Code encodant le code unique de l'adresse et le nouveau design Premium.
 * @param addr      Les donnÃ©es de l'adresse Ã  inscrire dans le document
 * @param addToast  Callback pour Ã©mettre une notification Toast en cas de succÃ¨s
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

	// Generate Logo (async)
	const logoDataUrl = await getLogoBase64();

	const { jsPDF } = await import("jspdf");
	const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

	// Couleurs
	const COLOR_DARK = [15, 23, 43] as [number, number, number];
	const COLOR_GREEN = [16, 185, 129] as [number, number, number];
	const COLOR_TEXT = [0, 0, 0] as [number, number, number];
	const COLOR_LIGHT = [245, 246, 250] as [number, number, number];

	// Fond principal
	doc.setFillColor(252, 252, 253);
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
	doc.roundedRect(20, 42, 170, 30, 4, 4, "FD"); // Y=42, H=30

	// Filigrane abstrait
	doc.setFillColor(248, 248, 250);
	doc.rect(160, 44, 10, 10, "F");
	doc.rect(172, 56, 12, 12, "F");
	doc.rect(150, 58, 15, 10, "F");

	doc.setFontSize(8);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text("CODE NUMÉRIQUE UNIQUE (ID)", 28, 51);

	// Gros Code
	doc.setFontSize(22);
	doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
	doc.text(addr.addressCode || "CODE-ND", 28, 62);

	// Icône check verte
	const checkX = doc.getTextWidth(addr.addressCode || "CODE-ND") + 35;
	doc.setFillColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	doc.circle(checkX, 59, 4.5, "F");
	doc.setDrawColor(255, 255, 255);
	doc.setLineWidth(0.8);
	doc.line(checkX - 1.5, 59, checkX - 0.5, 60.5); // Check mark
	doc.line(checkX - 0.5, 60.5, checkX + 2, 57.5);

	// Pill vérifié
	doc.setFillColor(232, 245, 233); // Light green
	doc.roundedRect(28, 65, 85, 5, 2.5, 2.5, "F");
	doc.setFontSize(6.5);
	doc.setTextColor(COLOR_GREEN[0], COLOR_GREEN[1], COLOR_GREEN[2]);
	doc.text("VÉRIFIÉ ET ENREGISTRÉ AU CADASTRE NUMÉRIQUE", 70.5, 68.5, { align: "center" });

	// --- BOÎTE 2 : INFO ADRESSAGE (GAUCHE) ---
	doc.setDrawColor(220, 220, 225);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(20, 76, 105, 88, 4, 4, "FD"); // Y=76, W=105, H=88

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
		doc.setFillColor(240, 242, 250); // Light blue
		doc.circle(32, startY + 2, 4.5, "F");
		doc.setFontSize(6);
		doc.setTextColor(COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
		doc.text(iconTxt, 32, startY + 3.5, { align: "center" });

		doc.setFontSize(7);
		doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
		doc.text(label, 42, startY);
		
		doc.setFontSize(8.5);
		doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]); // Text is now completely black
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
	doc.roundedRect(132, 76, 58, 88, 4, 4, "FD"); // Y=76, X=132, W=58, H=88

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
	doc.roundedRect(20, 169, 170, 54, 4, 4, "FD"); // Y=169, W=170, H=54

	// Séparateur vertical
	doc.setDrawColor(240, 240, 245);
	doc.line(105, 173, 105, 219); // Milieu (X=105)

	// Photo Bâtiment (Gauche)
	doc.setFontSize(7);
	doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
	doc.text("PHOTOGRAPHIE DU BÂTIMENT", 62.5, 177, { align: "center" });

	if (addr.photoRaw) {
		try {
			doc.addImage(addr.photoRaw, "JPEG", 28, 180, 69, 39); // X=28, W=69, H=39
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
	doc.rect(126.5, 180, 42, 42, "F"); // Fond map X=126.5, W=42, H=42
	
	if (mapTile) {
		// Tracer la carte réelle OSM
		doc.addImage(mapTile.base64, "PNG", 126.5, 180, 42, 42);
		
		const markerX = 126.5 + mapTile.pixelX * 42;
		const markerY = 180 + mapTile.pixelY * 42;
		
		doc.setFillColor(211, 47, 47);
		doc.setDrawColor(255, 255, 255);
		doc.setLineWidth(0.3);
		doc.circle(markerX, markerY - 2, 2.5, "FD"); 
		doc.triangle(markerX - 2.2, markerY - 2, markerX + 2.2, markerY - 2, markerX, markerY + 1.5, "F"); 
		
		doc.setFillColor(255, 255, 255);
		doc.rect(126.5, 210, 42, 5, "F"); // fond blanc
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
	doc.roundedRect(20, 228, 170, 36, 6, 6, "FD"); // Y=228, H=36

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
	
	doc.setLineDashPattern([], 0); // reset
	doc.setFontSize(6);
	doc.setTextColor(180, 180, 185);
	doc.text("DOCUMENT GÉNÉRÉ DE MANIÈRE SÉCURISÉE PAR FINDME CM", 105, 277, { align: "center" });


	doc.save(`Certificat_Adressage_${addr.addressCode}.pdf`);
	addToast(
		`Le certificat d'adressage officiel PDF pour ${addr.addressCode} a été téléchargé avec le nouveau design Premium.`,
		"success",
	);
}
