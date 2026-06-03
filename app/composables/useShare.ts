/**
 * @file useShare.ts
 * @description Composable spécialisé dans le partage d'adresses municipales.
 * 
 * Il génère des liens de partage optimisés (WhatsApp, email direct)
 * et utilise l'API de partage native des smartphones (Navigator.share)
 * avec fallback sur une boîte modale dédiée.
 */

import { ref } from 'vue'
import { useToasts } from './useToasts'

const selectedShareCode = ref<string | null>(null)
const shareModalOpen = ref<boolean>(false)

export function useShare() {
  const { addToast } = useToasts()

  const getWhatsAppShareUrl = (addressCode: string) => {
    if (typeof window === "undefined") return "#"
    const url = window.location.origin + "?code=" + addressCode
    const text = `Voici mon code d'adresse municipale unique findMe Cameroun : ${addressCode}. Cliquez sur ce lien pour tracer l'itinéraire précis et me localiser : ${url}`
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

  const handleShareLink = async (addressCode: string) => {
    selectedShareCode.value = addressCode
    
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && navigator.share) {
      const routeLink = window.location.origin + "?code=" + addressCode
      try {
        await navigator.share({
          title: "Mon adresse findMe",
          text: `Voici mon code d'adresse unique findMe Cameroun : ${addressCode}. Utilisez-le pour me localiser !`,
          url: routeLink
        })
        addToast("Partagé avec succès !", "success")
      } catch (err: any) {
        if (err.name === "AbortError") {
          return
        }
        shareModalOpen.value = true
      }
    } else {
      shareModalOpen.value = true
    }
  }

  return {
    selectedShareCode,
    shareModalOpen,
    getWhatsAppShareUrl,
    getEmailShareUrl,
    copyAndClose,
    handleShareLink
  }
}
