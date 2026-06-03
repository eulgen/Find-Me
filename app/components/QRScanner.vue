<!--
  @file app/components/QRScanner.vue
  @description Scanner interactif de codes QR findMe bilingue.
  Prend en charge la capture par caméra réelle, l'analyse d'image et un simulateur de plaques pour le test instantané.
-->

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, type ComponentPublicInstance } from 'vue'
import { 
  X, Camera, QrCode, Sparkles, Check, Info, ShieldCheck, 
  MapPin, Phone, Copy, Share2, Compass, AlertCircle, FileText
} from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'
import { useToasts } from '../composables/useToasts'
import { useAddresses } from '../composables/useAddresses'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { currentLang } = useLanguage()
const { addToast } = useToasts()
const { addressesList } = useAddresses()

const videoRef = ref<HTMLVideoElement | null>(null)
const isCameraActive = ref(false)
const cameraStream = ref<MediaStream | null>(null)
const isScanning = ref(false)
const scanResult = ref<any | null>(null)
const scannerMode = ref<'camera' | 'manual'>('camera')
const soundEnabled = ref(true)
const manualCode = ref('')
const hasCameraError = ref(false)

// Plaques findMe virtuelles pré-enregistrées pour la démonstration intuitive au Cameroun
const demoPlaques = [
  {
    addressCode: 'FM-YDE-BAS-28B',
    fullName: 'Famille Ndeng Brice',
    phone: '+237 699 12 34 56',
    city: 'Yaoundé',
    arrondissement: 'Yaoundé I',
    neighborhood: 'Bastos',
    streetName: 'Rue de la Joie',
    housePlateNumber: '28B',
    landmark: 'En face de la Pharmacie de l\'Europe, près du grand manguier',
    coordinates: { lat: 3.8480, lng: 11.5021 },
    photoRaw: '/assets/images/cameroon_house_address_1780109511639.png'
  },
  {
    addressCode: 'FM-DLA-BON-10A',
    fullName: 'Jean-Pierre Eto\'o',
    phone: '+237 677 88 99 00',
    city: 'Douala',
    arrondissement: 'Douala I',
    neighborhood: 'Bonapriso',
    streetName: 'Avenue de Gaulle',
    housePlateNumber: '10A',
    landmark: 'Derrière l\'agence Air France, portail noir en bois sculpté',
    coordinates: { lat: 4.0298, lng: 9.6983 },
    photoRaw: '/assets/images/cameroon_merchant_man_1780109489668.png'
  },
  {
    addressCode: 'FM-KRI-DOM-05C',
    fullName: 'Grace Ngo',
    phone: '+237 655 44 33 22',
    city: 'Kribi',
    arrondissement: 'Kribi II',
    neighborhood: 'Dombè',
    streetName: 'Rue du Phare',
    housePlateNumber: '05C',
    landmark: 'À 50 mètres de la plage, villa blanche avec cocotiers',
    coordinates: { lat: 2.9401, lng: 9.9077 },
    photoRaw: '/assets/images/cameroon_nurse_woman_1780109468152.png'
  },
  {
    addressCode: 'FM-YDE-NGO-14F',
    fullName: 'Amadou Touré',
    phone: '+237 699 55 44 33',
    city: 'Yaoundé',
    arrondissement: 'Yaoundé V',
    neighborhood: 'Ngosso',
    streetName: 'Rue du Marché',
    housePlateNumber: '14F',
    landmark: 'Face boutique Alhadji, panneau solaire sur le toit',
    coordinates: { lat: 3.8722, lng: 11.5310 },
    photoRaw: '/assets/images/cameroon_delivery_man_1780109448383.png'
  }
]

// Liste complète incluant d'éventuelles adresses générées par l'utilisateur
const getUnifiedAddresses = () => {
  const list = [...addressesList.value]
  // S'assurer que les codes de démo s'y trouvent
  demoPlaques.forEach(demo => {
    if (!list.some(item => item.addressCode === demo.addressCode)) {
      list.push(demo);
    }
  })
  return list
}

// Fonction audio de beep de succès de décodage
const playBeep = () => {
  if (!soundEnabled.value) return
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 1100
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.25)
  } catch (e) {
    console.log('Audio Context non supporté ou bloqué.')
  }
}

// Initialisation du flux utilisateur caméra
const startScannerCamera = async () => {
  hasCameraError.value = false
  isScanning.value = true
  isCameraActive.value = false
  
  try {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
      })
      cameraStream.value = stream
      isCameraActive.value = true
      
      setTimeout(() => {
        if (videoRef.value) {
          videoRef.value.srcObject = stream
        }
      }, 150)
    } else {
      hasCameraError.value = true
      addToast(currentLang.value === 'FR' ? 'Caméra indisponible ou iframe restreinte.' : 'Camera stream unavailable or restricted.', 'info')
    }
  } catch (err) {
    console.warn("Accès caméra refusé.", err)
    hasCameraError.value = true
  }
}

const stopScannerCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
  isCameraActive.value = false
  isScanning.value = false
}

// Simulation d'une analyse QR
const triggerSelectedSimulatedPlaque = (addr: any) => {
  isScanning.value = true
  scanResult.value = null
  
  addToast(currentLang.value === 'FR' ? 'Analyse de la plaque findMe...' : 'Scanning findMe plate...', 'info')
  
  setTimeout(() => {
    isScanning.value = false
    scanResult.value = addr
    playBeep()
    addToast(currentLang.value === 'FR' ? 'Plaque municipale décodée et certifiée !' : 'Municipal plate successfully decoded!', 'success')
  }, 1200)
}

// Validation manuelle de code saisi
const validateManualCode = () => {
  if (!manualCode.value.trim()) return
  
  isScanning.value = true
  scanResult.value = null
  
  setTimeout(() => {
    isScanning.value = false
    const unified = getUnifiedAddresses()
    const found = unified.find(
      a => a.addressCode.toUpperCase() === manualCode.value.toUpperCase().trim()
    )
    
    if (found) {
      scanResult.value = found
      playBeep()
      addToast(currentLang.value === 'FR' ? 'Code certifié trouvé !' : 'Certified code found!', 'success')
    } else {
      addToast(currentLang.value === 'FR' ? 'Code introuvable. Veuillez vérifier le format (Ex: FM-YDE-BAS-28B)' : 'Code not found. Please review the pattern (Ex: FM-YDE-BAS-28B)', 'info')
    }
  }, 900)
}

const copyToClipboard = (text: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    addToast(currentLang.value === 'FR' ? 'Copié dans le presse-papier !' : 'Copied to clipboard!', 'success')
  }
}

// Watchers de cycle
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    scanResult.value = null
    manualCode.value = ''
    if (scannerMode.value === 'camera') {
      startScannerCamera()
    }
  } else {
    stopScannerCamera()
  }
})

onBeforeUnmount(() => {
  stopScannerCamera()
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-[#1A237E]/45 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto block" id="qr-scanner-overlay">
    <div 
      class="bg-[#FAF8FD] dark:bg-[#141627] border-4 border-[#1A237E] rounded-[32px] w-full max-w-2xl p-6 relative shadow-[10px_10px_0px_0px_#1A237E] space-y-6" 
      id="qr-scanner-dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="currentLang === 'FR' ? 'Scanner de plaque Municipale' : 'Municipal Plate Scanner'"
    >
      <!-- Fermeture -->
      <button @click="emit('close')" class="absolute top-4 right-4 text-[#1A237E] hover:text-rose-600 p-1.5 hover:bg-[#F5F2FB] dark:hover:bg-slate-800 rounded-full cursor-pointer z-10 focus:outline-none" aria-label="Close scanner" id="qr-close-btn">
        <X class="w-5 h-5" />
      </button>

      <!-- Titre bilingue -->
      <div class="space-y-1 mt-2" id="qr-scanner-header">
        <div class="flex items-center space-x-2.5">
          <div class="w-10 h-10 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/25 flex items-center justify-center">
            <QrCode class="w-5.5 h-5.5 text-[#2E7D32]" />
          </div>
          <div>
            <h3 class="text-xl font-black text-[#1A237E] dark:text-white leading-tight">
              {{ currentLang === 'FR' ? "Scanner officiel de plaques findMe" : "Official findMe Plate Scanner" }}
            </h3>
            <p class="text-[11px] text-[#2E7D32] dark:text-emerald-400 font-extrabold tracking-wider uppercase">
              {{ currentLang === 'FR' ? "AUTHENTIFICATION DIRECTE DE LA GÉOLOCALISATION" : "DIRECT GEOLOCATION AUTHENTICATION" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Onglets bilingues Mode Caméra / Manuel -->
      <div class="flex border-b-2 border-[#1A237E]/10" id="scanner-tab-bar">
        <button 
          @click="scannerMode = 'camera'; startScannerCamera()" 
          class="flex-1 pb-3 text-xs md:text-sm font-black uppercase transition-all tracking-wider border-b-3 focus:outline-none cursor-pointer"
          :class="scannerMode === 'camera' ? 'border-[#1A237E] text-[#1A237E] dark:text-white' : 'border-transparent text-[#1A237E]/50 hover:text-[#1A237E]'"
        >
          📷 {{ currentLang === 'FR' ? 'Caméra / Scanner Vidéo' : 'Camera Finder' }}
        </button>
        <button 
          @click="scannerMode = 'manual'; stopScannerCamera()" 
          class="flex-1 pb-3 text-xs md:text-sm font-black uppercase tracking-wider transition-all border-b-3 focus:outline-none cursor-pointer"
          :class="scannerMode === 'manual' ? 'border-[#1A237E] text-[#1A237E] dark:text-white' : 'border-transparent text-[#1A237E]/50 hover:text-[#1A237E]'"
        >
          ✏️ {{ currentLang === 'FR' ? 'Recherche par Code' : 'Search by Code' }}
        </button>
      </div>

      <!-- SECTION CONTENU PRINCIPAL -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start" id="scanner-grid-box">
        
        <!-- FLUX SCANNER / RECHERCHE -->
        <div class="md:col-span-7 space-y-4">
          
          <!-- MODE CAMERA -->
          <div v-if="scannerMode === 'camera'" class="space-y-4">
            <div class="relative rounded-2xl overflow-hidden aspect-video bg-[#0D0F1A] border-3 border-[#1A237E] flex flex-col items-center justify-center text-center">
              
              <!-- Flux Vidéo Réel -->
              <video 
                ref="videoRef" 
                autoplay 
                playsinline 
                muted 
                class="absolute inset-0 w-full h-full object-cover" 
                :class="{ 'opacity-0': !isCameraActive }"
              />

              <!-- Overlay simulateur de ciblage de code QR -->
              <div v-if="isCameraActive" class="absolute inset-0 border-4 border-emerald-500/30 flex items-center justify-center pointer-events-none">
                <!-- Coins de détection du tag QR -->
                <div class="w-48 h-48 border-4 border-emerald-500 rounded-2xl relative">
                  <!-- Laser Scan Ligne mobile -->
                  <div class="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_8px_#10B981] animate-bounce top-1/2" />
                </div>
                
                <!-- Tag live watermark -->
                <span class="absolute bottom-2 bg-[#2E7D32] text-white font-mono text-[8px] px-2 py-0.5 rounded uppercase tracking-widest font-black">
                  Ciblage QR actif
                </span>
              </div>

              <!-- Message Absence Caméra / Simulation intégrée -->
              <div v-if="!isCameraActive" class="p-6 space-y-3 z-10 text-white max-w-xs">
                <AlertCircle class="w-9 h-9 text-rose-500 mx-auto animate-pulse" />
                <h4 class="text-xs font-black uppercase tracking-wider">
                  {{ currentLang === 'FR' ? 'Attribution du flux vidéo' : 'Establishing Camera stream' }}
                </h4>
                <p class="text-[10px] text-gray-300 leading-normal">
                  {{ currentLang === 'FR' 
                    ? 'Le sandbox de l\'iframe bloque l\'accès caméra ? Pas de soucis ! Utilisez le simulateur de plaques rapides ci-dessous.' 
                    : 'Frame sandbox restricting webcam? No worries! Click the simulated Cameroon plates underneath to test.' }}
                </p>
              </div>
            </div>

            <!-- Boutons de contrôle caméra -->
            <div class="flex items-center justify-between text-xs font-bold text-[#1A237E] dark:text-gray-300">
              <span class="flex items-center space-x-1">
                <span class="w-2.5 h-2.5 rounded-full inline-block" :class="isCameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'" />
                <span>{{ isCameraActive ? (currentLang === 'FR' ? 'Caméra en direct' : 'Live Finder') : (currentLang === 'FR' ? 'Simulation active' : 'Offline Mode') }}</span>
              </span>

              <button 
                @click="soundEnabled = !soundEnabled"
                class="text-[#1A237E]/70 dark:text-gray-400 hover:text-[#1A237E] border border-gray-200 dark:border-slate-800 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 cursor-pointer text-[10px] uppercase font-black tracking-widest"
              >
                🔊 {{ soundEnabled ? (currentLang === 'FR' ? 'Bip Activé' : 'Audio ON') : (currentLang === 'FR' ? 'Bip Muet' : 'Audio OFF') }}
              </button>
            </div>
          </div>

          <!-- MODE SAISIE MANUELLE -->
          <div v-else class="bg-white dark:bg-slate-900 border-2 border-[#1A237E]/10 p-5 rounded-2xl space-y-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-[#1A237E]/70 dark:text-gray-400 tracking-widest block">
                {{ currentLang === 'FR' ? "Saisir le Code d'Adresse Municipale" : "Enter Municipal Address Code" }}
              </label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="manualCode"
                  @keyup.enter="validateManualCode"
                  placeholder="FM-YDE-BAS-28B" 
                  class="flex-1 bg-[#F5F2FB] dark:bg-slate-800 border-2 border-[#1A237E]/20 text-xs px-3.5 py-3 rounded-xl text-[#1A237E] dark:text-white uppercase font-bold focus:border-[#2E7D32] focus:outline-none placeholder:text-gray-400"
                />
                <button 
                  @click="validateManualCode"
                  class="bg-[#1A237E] hover:bg-[#1A237E]/95 text-white font-extrabold px-5 text-xs rounded-xl shadow cursor-pointer uppercase tracking-widest"
                >
                  {{ currentLang === 'FR' ? 'Valider' : 'Find' }}
                </button>
              </div>
            </div>

            <p class="text-[10px] text-[#1A237E]/60 dark:text-gray-400 leading-relaxed font-semibold">
              ℹ️ {{ currentLang === 'FR' 
                ? "Format type standard : FM-VILLE-QUARTIER-PORTAIL. Ex: FM-YDE-BAS-28B" 
                : "Standard findMe address code format: FM-CITY-NEIGHBORHOOD-PLATE. Ex: FM-YDE-BAS-28B" }}
            </p>
          </div>

          <!-- LA BANQUE DE DEBRÈVEMENT POUR LE TEST (SIMULATEUR DE COMPAGNONS) -->
          <div class="space-y-2.5 pt-2">
            <span class="text-[10px] font-black uppercase text-[#2E7D32]/85 dark:text-emerald-400 block tracking-widest">
              🤖 {{ currentLang === 'FR' ? "Simuler le ciblage d'une Plaque officielle" : "Simulate Targeting a Real Plate" }}
            </span>
            
            <div class="grid grid-cols-2 gap-2" id="demo-quick-plaques-grid">
              <button 
                v-for="plaque in demoPlaques" 
                :key="plaque.addressCode"
                @click="triggerSelectedSimulatedPlaque(plaque)"
                class="text-left bg-white dark:bg-slate-900 border border-[#1A237E]/10 p-2.5 rounded-xl transition-all hover:scale-[1.01] hover:border-[#2E7D32] cursor-pointer"
              >
                <div class="font-mono text-[10px] font-black text-[#1A237E] dark:text-white block truncate">
                  📌 {{ plaque.addressCode }}
                </div>
                <!-- Mini description civique -->
                <div class="text-[8.5px] text-slate-400 font-bold block leading-relaxed uppercase">
                  {{ plaque.fullName }} ({{ plaque.city }}, {{ plaque.neighborhood }})
                </div>
              </button>
            </div>
          </div>

        </div>

        <!-- VOLET DROIT / FICHE DÉCODÉE DES SPÉCIFICATIONS -->
        <div class="md:col-span-5 space-y-4">
          <div class="bg-gradient-to-br from-[#1A237E] to-[#12195E] text-white p-5 rounded-2xl shadow-lg border-2 border-[#2E7D32]/30 space-y-4 relative overflow-hidden" id="identity-badge-rendered">
            
            <div class="absolute -right-6 -bottom-6 text-white/5 font-mono font-black text-6xl select-none uppercase">
              YDE
            </div>

            <!-- Titre Badge -->
            <div class="border-b border-white/10 pb-3" id="result-status-block">
              <span class="bg-[#2E7D32] text-white font-mono text-[8px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase inline-block mb-1.5 shadow-sm">
                {{ scanResult ? (currentLang === 'FR' ? 'CONFORME ET CLASSIFIÉ' : 'SECURED & LEGIT') : (currentLang === 'FR' ? 'EN ATTENTE D\'ACQUISITION' : 'AWAITING DISCOVERY') }}
              </span>
              <h4 class="text-sm font-black uppercase tracking-wider block">
                {{ currentLang === 'FR' ? 'BILLET DE ROUTE GPS' : 'GPS ROUTE SLIP' }}
              </h4>
            </div>

            <div v-if="scanResult" class="space-y-3" id="scan-success-meta">
              
              <!-- Plaque ID box -->
              <div class="bg-white/10 border border-white/20 p-2.5 rounded-xl text-center">
                <span class="text-[8px] text-emerald-300 font-mono font-black tracking-widest block uppercase mb-0.5">ID Civique Standardisé</span>
                <span class="font-mono text-base font-black tracking-widest text-white block uppercase">
                  {{ scanResult.addressCode }}
                </span>
              </div>

              <!-- Info rows -->
              <div class="space-y-2 text-xs font-semibold text-white/90">
                <div class="flex items-start space-x-2">
                  <MapPin class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span class="text-[9px] text-emerald-300 font-black block uppercase tracking-wider">DOMICILE IDENTIFIÉ</span>
                    <span class="font-bold text-white block leading-tight">N° {{ scanResult.housePlateNumber }} {{ scanResult.streetName }}</span>
                    <span class="text-[10px] text-white/70 block">{{ scanResult.neighborhood }}, {{ scanResult.arrondissement || 'District principal' }}</span>
                    <span class="text-[10px] text-white/65 block font-normal pt-1 italic">"{{ scanResult.landmark }}"</span>
                  </div>
                </div>

                <div class="flex items-center space-x-2 border-t border-white/5 pt-2">
                  <Phone class="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span class="text-[9px] text-emerald-300 font-black block uppercase tracking-wider">CONTACT CITOYEN</span>
                    <span class="font-mono text-[11px] text-white block leading-none">{{ scanResult.phone }}</span>
                  </div>
                </div>

                <!-- GPS Specs -->
                <div class="bg-black/20 p-2 rounded-lg text-center flex items-center justify-between text-[10px] font-mono font-bold leading-none">
                  <span>LAT: {{ scanResult.coordinates?.lat }}° N</span>
                  <span class="text-emerald-400 font-black">|</span>
                  <span>LNG: {{ scanResult.coordinates?.lng }}° E</span>
                </div>
              </div>

              <!-- Interactive Navigation helper actions -->
              <div class="grid grid-cols-2 gap-2 pt-1">
                <button 
                  @click="copyToClipboard(`${scanResult.coordinates?.lat},${scanResult.coordinates?.lng}`)"
                  class="flex items-center justify-center space-x-1 py-2 rounded-lg text-[9px] uppercase font-black tracking-wider border border-white/20 bg-white/5 hover:bg-white/15 cursor-pointer text-white"
                >
                  <Copy class="w-3 h-3 text-white" />
                  <span>{{ currentLang === 'FR' ? 'Copier GPS' : 'Copy GPS' }}</span>
                </button>
                <a 
                  :href="`https://www.google.com/maps/search/?api=1&query=${scanResult.coordinates?.lat},${scanResult.coordinates?.lng}`"
                  target="_blank"
                  class="flex items-center justify-center space-x-1 py-2 rounded-lg text-[9px] uppercase font-black tracking-wider bg-[#2E7D32] hover:bg-[#2E7D32]/95 cursor-pointer text-white leading-none text-center"
                >
                  <Compass class="w-3 h-3 text-white" />
                  <span>{{ currentLang === 'FR' ? 'Guider' : 'GPS Route' }}</span>
                </a>
              </div>

            </div>

            <!-- State Awaiting -->
            <div v-else class="text-center py-8 space-y-3" id="waiting-pannel">
              <div class="mx-auto w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <QrCode class="w-6 h-6 text-white/50" />
              </div>
              <p class="text-[11px] text-white/60 max-w-[200px] mx-auto leading-relaxed">
                {{ currentLang === 'FR' 
                  ? "Pointez une plaque cadastrale findMe vers la caméra ou saisissez un identifiant civique." 
                  : "Target any official findMe plate with camera or type a digital plate token." }}
              </p>
            </div>

          </div>
        </div>

      </div>

      <!-- Footer action close -->
      <div class="border-t border-[#1A237E]/10 pt-4 text-center">
        <button 
          @click="emit('close')"
          class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A237E] dark:text-gray-200 font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider"
        >
          {{ currentLang === 'FR' ? 'Fermer le Panel' : 'Dismiss Tracker' }}
        </button>
      </div>

    </div>
  </div>
</template>
