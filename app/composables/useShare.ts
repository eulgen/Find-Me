/**
 * @file useShare.ts
 * @description Composable spécialisé dans le partage d'adresses municipales et génération du QR Code.
 */

import { ref } from 'vue'
import { useToasts } from './useToasts'

const selectedShareCode = ref<string | null>(null)
const selectedShareAddress = ref<any | null>(null)
const shareModalOpen = ref<boolean>(false)
const qrCodeDataUrl = ref<string>('')
const isGeneratingQr = ref<boolean>(false)

export function useShare() {
  const { addToast } = useToasts()

  const generateQrForCode = async (code: string) => {
    if (typeof window === 'undefined') return
    isGeneratingQr.value = true
    try {
      const QRCode = (await import('qrcode')).default
      const payload = JSON.stringify({
        addressCode: code,
        raw: code,
        url: `${window.location.origin}?code=${code}`
      })
      qrCodeDataUrl.value = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 1,
        color: { dark: '#0A0D1A', light: '#FFFFFF' }
      })
    } catch (e) {
      console.error('Erreur génération QR Code partage:', e)
    } finally {
      isGeneratingQr.value = false
    }
  }

  const getWhatsAppShareUrl = (addressCode: string) => {
    if (typeof window === "undefined") return "#"
    const url = window.location.origin + "?code=" + addressCode
    const text = `Voici mon code d'adresse municipale unique findMe Cameroun : ${addressCode}. Cliquez sur ce lien pour me localiser : ${url}`
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  }

  const getEmailShareUrl = (addressCode: string) => {
    if (typeof window === "undefined") return "#"
    const url = window.location.origin + "?code=" + addressCode
    const subject = "Mon Adresse Municipale Officielle findMe"
    const body = `Bonjour,\n\nVoici le code unique représentant mon adresse homologuée findMe Cameroun : ${addressCode}.\n\nPour afficher l'itinéraire ou me localiser de manière précise sur la carte, veuillez ouvrir le lien ci-dessous :\n${url}\n\nCordialement.`
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const copyAndClose = (addressCode: string) => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const routeLink = window.location.origin + "?code=" + addressCode
      navigator.clipboard.writeText(routeLink)
        .then(() => {
          addToast("📋 Lien d'itinéraire copié dans le presse-papier !", "success")
        })
        .catch(() => {
          addToast("Lien copié !", "success")
        })
    }
    shareModalOpen.value = false
  }

  const downloadQRCodeImage = () => {
    if (!qrCodeDataUrl.value) return
    const a = document.createElement('a')
    a.href = qrCodeDataUrl.value
    a.download = `QRCode_FindMe_${selectedShareCode.value || 'adresse'}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    addToast("Image du QR Code téléchargée avec succès !", "success")
  }

  const handleShareLink = async (addressData: any) => {
    const code = typeof addressData === 'string' ? addressData : addressData?.addressCode || 'CODE-ND'
    selectedShareCode.value = code
    selectedShareAddress.value = typeof addressData === 'object' ? addressData : null

    await generateQrForCode(code)
    shareModalOpen.value = true
  }

  return {
    selectedShareCode,
    selectedShareAddress,
    shareModalOpen,
    qrCodeDataUrl,
    isGeneratingQr,
    getWhatsAppShareUrl,
    getEmailShareUrl,
    copyAndClose,
    downloadQRCodeImage,
    handleShareLink
  }
}
