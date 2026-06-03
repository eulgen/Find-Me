/**
 * @file useAddressExporter.ts
 * @description Composable spécialisé dans l'export technique des fiches d'adresses.
 * 
 * Il propose deux méthodes d'export :
 * 1. downloadAddressFile : Génère et télécharge une plaque vectorielle SVG haute qualité.
 * 2. downloadAddressPDF : Génère et télécharge un Certificat Officiel d'Adressage en format PDF A4.
 */

import { jsPDF } from 'jspdf'
import { useToasts } from './useToasts'

export function useAddressExporter() {
  const { addToast } = useToasts()
  return {
    downloadAddressFile: (addr: any) => downloadAddressFile(addr, addToast),
    downloadAddressPDF: (addr: any) => downloadAddressPDF(addr, addToast)
  }
}

/**
 * Génère et lance le téléchargement d'un fichier SVG vectoriel de la plaque
 * @param addr {any} Les données de l'adresse utilisateur à inscrire
 * @param addToast {Function} Callback pour émettre une notification Toast en cas de succès
 */
export function downloadAddressFile(addr: any, addToast: (msg: string, type?: 'success' | 'info') => void) {
  if (!addr) return
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&amp;family=JetBrains+Mono:wght@700&amp;display=swap');
        .title { font-family: 'Space Grotesk', sans-serif; font-weight: 900; fill: #1A237E; }
        .mono { font-family: 'JetBrains Mono', monospace; font-weight: 700; fill: #1A237E; }
        .label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; fill: #1A237E; opacity: 0.6; }
        .value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; fill: #1A237E; }
        .code { font-family: 'Space Grotesk', sans-serif; font-weight: 900; fill: #FFFFFF; letter-spacing: 2px; }
      </style>
    </defs>
    <rect width="800" height="600" fill="#FAF8FD" />
    <rect x="48" y="48" width="712" height="512" rx="24" fill="#1A237E" />
    <rect x="40" y="40" width="712" height="512" rx="24" fill="#FFFFFF" stroke="#1A237E" stroke-width="8" />
    <rect x="40" y="40" width="712" height="90" rx="24" fill="#1A237E" />
    <text x="400" y="94" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" fill="#FFFFFF" font-size="20" letter-spacing="2">CERTIFICAT D'ADRESSAGE MUNICIPAL HOMOLOGUE</text>
    <rect x="620" y="160" width="100" height="35" rx="8" fill="#2E7D32" />
    <text x="670" y="182" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="900" fill="#FFFFFF" font-size="12">CAMEROUN</text>
    <text x="80" y="190" class="label" font-size="11">PROPRIÉTAIRE VALIDE :</text>
    <text x="80" y="215" class="value" font-size="18">${addr.fullName}</text>
    <text x="80" y="270" class="label" font-size="11">VILLE &amp; ARRONDISSEMENT :</text>
    <text x="80" y="295" class="value" font-size="18">${addr.city} • ${addr.arrondissement || 'Yaoundé I'}</text>
    <text x="80" y="350" class="label" font-size="11">QUARTIER &amp; REPERE VISUEL :</text>
    <text x="80" y="375" class="value" font-size="15">${addr.neighborhood} — ${addr.landmark || 'Près de l\'axe principal'}</text>
    <text x="440" y="190" class="label" font-size="11">COORDONNEES SATELLITES :</text>
    <text x="440" y="215" class="mono" font-size="14">LAT: ${addr.coordinates.lat}° N / LNG: ${addr.coordinates.lng}° E</text>
    <text x="440" y="270" class="label" font-size="11">PLAQUE D'ENTRÉE MUNICIPALE :</text>
    <text x="440" y="295" class="value" font-size="28" fill="#2E7D32">N° ${addr.housePlateNumber || '28B'}</text>
    <rect x="80" y="440" width="640" height="70" rx="16" fill="#1A237E" />
    <text x="400" y="482" text-anchor="middle" class="code" font-size="24">${addr.addressCode}</text>
  </svg>`

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Certificat_municipal_${addr.addressCode}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  addToast(`Le certificat vectoriel (SVG) pour l'adresse ${addr.addressCode} a été téléchargé.`, 'success')
}

/**
 * Génère et lance le téléchargement du Certificat Officiel d'Adressage au format PDF A4
 * @param addr {any} Les données de l'adresse à inscrire dans le document
 * @param addToast {Function} Callback pour émettre une notification Toast en cas de succès
 */
export function downloadAddressPDF(addr: any, addToast: (msg: string, type?: 'success' | 'info') => void) {
  if (!addr) return
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  doc.setFillColor(250, 248, 253)
  doc.rect(0, 0, 210, 297, 'F')
  doc.setDrawColor(26, 35, 126)
  doc.setLineWidth(1.5)
  doc.rect(8, 8, 194, 281, 'S')
  doc.setLineWidth(0.5)
  doc.rect(10, 10, 190, 277, 'S')

  doc.setFillColor(26, 35, 126)
  doc.rect(12, 12, 186, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('REPUBLIQUE DU CAMEROUN', 105, 22, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Paix - Travail - Patrie  |  Peace - Work - Fatherland', 105, 27, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(129, 230, 217)
  doc.text("PLATEFORME NATIONALE D'ADRESSAGE GEOSPATIAL NUMERIQUE", 105, 33, { align: 'center' })

  doc.setFillColor(46, 125, 50)
  doc.rect(12, 47, 186, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9.5)
  doc.text("DOCUMENT OFFICIEL D'IDENTIFICATION DU DOMICILE", 105, 53.5, { align: 'center' })

  doc.setTextColor(26, 35, 126)
  doc.setFontSize(11)
  doc.text('1. INFORMATIONS DU CITOYEN / CITIZEN INFO', 20, 72)
  doc.line(20, 74, 190, 74)

  doc.setFontSize(9)
  doc.setTextColor(100, 110, 130)
  doc.text('Nom complet:', 20, 81)
  doc.setTextColor(26, 35, 126)
  doc.setFont('helvetica', 'bold')
  doc.text(addr.fullName || '', 20, 87)

  doc.setFontSize(9)
  doc.setTextColor(100, 110, 130)
  doc.text('Téléphone lié:', 120, 81)
  doc.setTextColor(26, 35, 126)
  doc.text(addr.phone || '', 120, 87)

  doc.text("2. SPECIFICATIONS CADRASTRALES DE L'EMPLACEMENT", 20, 103)
  doc.line(20, 105, 190, 105)

  const printVal = (label: string, val: string, x: number, y: number) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 110, 130)
    doc.text(label, x, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 35, 126)
    doc.text(val || '-', x, y + 6)
  }

  printVal('Ville :', addr.city || '', 20, 113)
  printVal('Arrondissement :', addr.arrondissement || '', 105, 113)
  printVal('Quartier :', addr.neighborhood || '', 20, 127)
  printVal('Rue principale :', addr.streetName || "Non spécifiée", 105, 127)
  printVal('Point de repère :', addr.landmark || "Aucun", 20, 141)
  printVal("Numéro d'Entrée :", `Plaque N° ${addr.housePlateNumber || '28B'}`, 105, 141)

  doc.text('3. COORDONNEES GEOPHYSIQUES SATELLITAIRES (GPS)', 20, 160)
  doc.line(20, 162, 190, 162)

  printVal('Latitude d’orientation (N) :', `${addr.coordinates?.lat || '3.8480'} deg Nord`, 20, 170)
  printVal('Longitude d’orientation (E) :', `${addr.coordinates?.lng || '11.5021'} deg Est`, 105, 170)

  doc.setFillColor(242, 239, 247)
  doc.rect(20, 185, 170, 32, 'F')
  doc.setDrawColor(26, 35, 126)
  doc.rect(20, 185, 170, 32, 'S')
  doc.setTextColor(46, 125, 50)
  doc.text('STATUT : COORDONNEES CERTIFIEES PAR GEODESIE MUNICIPALE', 25, 192)

  doc.setFillColor(26, 35, 126)
  doc.rect(20, 226, 170, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('CODE DIGITAL D’ADRESSAGE UNIQUE', 105, 233, { align: 'center' })
  doc.setFontSize(16)
  doc.text(addr.addressCode || '', 105, 244, { align: 'center' })

  // Homologation Seal
  doc.setDrawColor(46, 125, 50)
  doc.circle(45, 271, 9, 'S')
  doc.setFontSize(6)
  doc.setTextColor(46, 125, 50)
  doc.text('HOMOLOGUE', 45, 270, { align: 'center' })
  doc.text('FINDME CM', 45, 273, { align: 'center' })

  doc.setTextColor(100, 110, 130)
  doc.setFontSize(8)
  doc.text('Généré de manière sécurisée le ' + new Date().toLocaleDateString('fr-FR'), 190, 275, { align: 'right' })

  doc.save(`Certificat_Adressage_${addr.addressCode}.pdf`)
  
  addToast(`Le certificat d'adressage officiel PDF pour ${addr.addressCode} a été téléchargé.`, 'success')
}
