<!--
  @file app/components/address-form/AddressStepper.vue
  @description Composant de formulaire de création d'adresse en 3 étapes.
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MapPin, Locate, QrCode, Camera, Check, Upload, ArrowRight, ShieldCheck, HelpCircle, Image as ImageIcon } from 'lucide-vue-next'
import ButtonUI from '~/components/ui/ButtonUI.vue'
import QRScanner from '~/components/ui/QRScanner.vue'
import { useToasts } from '~/composables/useToasts'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useAddresses } from '~/composables/useAddresses'
import { useHead } from '#imports'

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' }
  ]
})

const { addToast } = useToasts()
const router = useRouter()
const { currentUser } = useAuth()
const { handleAddressCreated } = useAddresses()

const currentStep = ref(1)

let L: any = null
let mapInstance: any = null
let markerInstance: any = null

const initMap = async () => {
  if (typeof window !== 'undefined') {
    if (!L) L = (await import('leaflet')).default
    
    const mapEl = document.getElementById('leaflet-stepper-map')
    if (!mapEl) return

    // Clean up old instance if exists
    if (mapInstance) {
      mapInstance.remove()
      mapInstance = null
    }

    const lat = parseFloat(formState.value.lat) || 3.8480
    const lng = parseFloat(formState.value.lng) || 11.5021

    mapInstance = L.map('leaflet-stepper-map').setView([lat, lng], 13)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance)
    
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    })
    
    markerInstance = L.marker([lat, lng], { icon }).addTo(mapInstance)
  }
}

onMounted(() => {
  setTimeout(() => {
    initMap()
  }, 300)
})

// --- STATE ---
const formState = ref({
  country: 'Cameroun',
  city: 'Yaoundé',
  neighborhood: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  lat: '3.8480',
  lng: '11.5021',
  photo: '',
  photoStats: null as any
})

// --- STEP 1 LOGIC ---
const step1State = ref({
  askGeolocation: true,
  geolocationStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  askQR: false,
  showQRScanner: false
})

const mapMarkerPos = computed(() => {
  const latVal = parseFloat(formState.value.lat) || 3.8480;
  const lngVal = parseFloat(formState.value.lng) || 11.5021;
  const latDiff = latVal - 3.8480;
  const lngDiff = lngVal - 11.5021;
  const x = Math.max(5, Math.min(95, (lngDiff / 0.03 + 0.5) * 100));
  const y = Math.max(5, Math.min(95, (0.5 - latDiff / 0.03) * 100));
  return { x, y };
});

const handleGeolocationYes = () => {
  step1State.value.geolocationStatus = 'loading'
  addToast("Recherche de votre position...", "info")
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        formState.value.lat = pos.coords.latitude.toFixed(6)
        formState.value.lng = pos.coords.longitude.toFixed(6)
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=fr`)
          const data = await res.json()
          if (data && data.address) {
            if (data.address.country) formState.value.country = data.address.country;
            const city = data.address.city || data.address.town || data.address.village;
            if (city) formState.value.city = city;
            const neighborhood = data.address.suburb || data.address.neighbourhood;
            if (neighborhood) formState.value.neighborhood = neighborhood;
            if (data.address.road) formState.value.street = data.address.road;
          }
        } catch (e) {}

        step1State.value.geolocationStatus = 'success'
        addToast("Position trouvée !", "success")

        if (mapInstance && markerInstance) {
          mapInstance.setView([pos.coords.latitude, pos.coords.longitude], 18)
          markerInstance.setLatLng([pos.coords.latitude, pos.coords.longitude])
        }
        
        // Show next question
        step1State.value.askGeolocation = false
        step1State.value.askQR = true
      },
      () => {
        step1State.value.geolocationStatus = 'error'
        addToast("Impossible de récupérer la position.", "error")
        currentStep.value = 2 // Move to manual
      },
      { enableHighAccuracy: true }
    )
  } else {
    currentStep.value = 2
  }
}

const handleGeolocationNo = () => {
  currentStep.value = 2
}

const handleQRYes = () => {
  step1State.value.showQRScanner = true
}

const handleQRNo = () => {
  currentStep.value = 2
}

const handleQRScanned = (data: any) => {
  if (data) {
    step1State.value.showQRScanner = false
    // Fill form from scanned data
    formState.value.city = data.city || "Yaoundé"
    formState.value.neighborhood = data.neighborhood || "Bastos"
    formState.value.street = data.streetName || "Rue 1"
    formState.value.houseNumber = data.housePlateNumber || "12A"
    addToast("Adresse récupérée via QR Code !", "success")
    currentStep.value = 2
  }
}

// --- STEP 2 LOGIC ---
const formErrors = ref({ neighborhood: '', street: '', houseNumber: '', photo: '' })
const validateStep2 = () => {
  let valid = true
  if (!formState.value.neighborhood.trim()) { formErrors.value.neighborhood = "Requis"; valid = false }
  else formErrors.value.neighborhood = ""
  
  if (!formState.value.street.trim()) { formErrors.value.street = "Requis"; valid = false }
  else formErrors.value.street = ""
  
  if (!formState.value.houseNumber.trim()) { formErrors.value.houseNumber = "Requis"; valid = false }
  else formErrors.value.houseNumber = ""
  
  if (valid) currentStep.value = 3
}

// --- STEP 3 LOGIC ---
const photoInput = ref<HTMLInputElement | null>(null)

const triggerPhotoUpload = () => {
  if (photoInput.value) photoInput.value.click()
}

const handlePhotoUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const maxDim = 720;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.72);
      const origSizeKB = Math.round(file.size / 1024);
      const compSizeKB = Math.round((compressedBase64.length * 3) / 4 / 1024);
      const ratio = Math.round(((origSizeKB - compSizeKB) / origSizeKB) * 100);

      formState.value.photo = compressedBase64;
      formState.value.photoStats = {
        compressed: `${compSizeKB} KB`,
        ratio: ratio > 0 ? ratio.toString() : "0",
        format: (file.type.split('/')[1] || 'JPEG').toUpperCase()
      };
    };
    img.src = event.target?.result as string;
  };
  reader.readAsDataURL(file);
}

const submitForm = () => {
  if (!formState.value.photo) {
    formErrors.value.photo = "Photo requise"
    return
  }

  const cityAbbr = formState.value.city.substring(0, 3).toUpperCase();
  const qAbbr = formState.value.neighborhood.substring(0, 3).toUpperCase().replace(/\s/g, "");
  const addrCode = `FM-${cityAbbr}-${qAbbr}-${formState.value.houseNumber}`;

  const addressPayload = {
    fullName: currentUser.value?.username || "Citoyen",
    phone: currentUser.value?.phoneNumber || "+237 600 00 00 00",
    country: formState.value.country,
    city: formState.value.city,
    neighborhood: formState.value.neighborhood,
    streetName: formState.value.street,
    housePlateNumber: formState.value.houseNumber,
    postalCode: formState.value.postalCode,
    coordinates: {
      lat: parseFloat(formState.value.lat),
      lng: parseFloat(formState.value.lng),
    },
    addressCode: addrCode,
    photoRaw: formState.value.photo,
    photoStats: formState.value.photoStats,
  };

  handleAddressCreated(addressPayload);
  addToast("Adresse créée avec succès !", "success")
  router.push(`/users/${currentUser.value?.username || 'me'}?section=addresses`)
}
</script>

<template>
  <div class="bg-white dark:bg-[#151923] rounded-3xl shadow-xl shadow-[#1A237E]/5 border border-gray-100 dark:border-slate-800 overflow-hidden">
    
    <!-- HEADER & STEPPER -->
    <div class="bg-gradient-to-r from-[#1A237E]/5 to-transparent p-6 md:p-8 border-b border-gray-100 dark:border-slate-800">
      <h1 class="text-2xl font-black text-[#1A237E] dark:text-white mb-6">Création de votre adresse</h1>
      
      <div class="flex items-center space-x-4">
        <!-- Step 1 -->
        <div class="flex items-center space-x-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors',
            currentStep >= 1 ? 'bg-[#1A237E] text-white' : 'bg-gray-100 text-gray-400'
          ]">
            <Check v-if="currentStep > 1" class="w-4 h-4" />
            <span v-else>1</span>
          </div>
          <span :class="currentStep >= 1 ? 'font-bold text-[#1A237E] dark:text-white' : 'font-semibold text-gray-400'">Localisation</span>
        </div>
        <div class="w-12 h-1 rounded-full" :class="currentStep >= 2 ? 'bg-[#1A237E]' : 'bg-gray-100'"></div>
        
        <!-- Step 2 -->
        <div class="flex items-center space-x-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors',
            currentStep >= 2 ? 'bg-[#1A237E] text-white' : 'bg-gray-100 text-gray-400'
          ]">
            <Check v-if="currentStep > 2" class="w-4 h-4" />
            <span v-else>2</span>
          </div>
          <span :class="currentStep >= 2 ? 'font-bold text-[#1A237E] dark:text-white' : 'font-semibold text-gray-400'">Infos</span>
        </div>
        <div class="w-12 h-1 rounded-full" :class="currentStep >= 3 ? 'bg-[#1A237E]' : 'bg-gray-100'"></div>

        <!-- Step 3 -->
        <div class="flex items-center space-x-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors',
            currentStep >= 3 ? 'bg-[#1A237E] text-white' : 'bg-gray-100 text-gray-400'
          ]">
            3
          </div>
          <span :class="currentStep >= 3 ? 'font-bold text-[#1A237E] dark:text-white' : 'font-semibold text-gray-400'">Photo</span>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="p-6 md:p-8 min-h-[400px]">

      <!-- ================= STEP 1: LOCALISATION ================= -->
      <div v-if="currentStep === 1" class="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        <!-- THE MAP -->
        <div class="relative w-full h-64 bg-sky-50 dark:bg-slate-800 rounded-2xl overflow-hidden border-4 border-white shadow-lg z-0">
          <div id="leaflet-stepper-map" class="w-full h-full z-0"></div>
          
          <div v-if="step1State.geolocationStatus === 'loading'" class="absolute inset-0 bg-[#1A237E]/40 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
            <Locate class="w-8 h-8 animate-spin mb-2" />
            <span class="font-bold">Recherche GPS de haute précision...</span>
          </div>
        </div>

        <!-- Questions -->
        <div class="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
          
          <template v-if="step1State.askGeolocation">
            <div class="flex flex-col md:flex-row items-center gap-6">
              <div class="w-12 h-12 bg-[#1A237E]/10 rounded-full flex items-center justify-center shrink-0">
                <HelpCircle class="w-6 h-6 text-[#1A237E]" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-black text-[#1A237E] dark:text-white mb-2">Utiliser la géolocalisation ?</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pouvez-vous utiliser votre position actuelle pour remplir automatiquement le formulaire avec une haute précision ?</p>
              </div>
              <div class="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                <ButtonUI @click="handleGeolocationNo" variant="outline" class="flex-1 md:w-24">Non</ButtonUI>
                <ButtonUI @click="handleGeolocationYes" variant="primary" class="flex-1 md:w-24 shadow-lg shadow-[#2E7D32]/20">Oui</ButtonUI>
              </div>
            </div>
          </template>

          <template v-else-if="step1State.askQR">
            <div class="flex flex-col md:flex-row items-center gap-6">
              <div class="w-12 h-12 bg-[#2E7D32]/10 rounded-full flex items-center justify-center shrink-0">
                <HelpCircle class="w-6 h-6 text-[#2E7D32]" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-black text-[#1A237E] dark:text-white mb-2">Voisinage</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Y a-t-il un utilisateur de l'application dans le même bâtiment que vous ? (Vous pourrez scanner son QR Code).</p>
              </div>
              <div class="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                <ButtonUI @click="handleQRNo" variant="outline" class="flex-1 md:w-24">Non</ButtonUI>
                <ButtonUI @click="handleQRYes" variant="primary" class="flex-1 md:w-24 shadow-lg shadow-[#2E7D32]/20">Oui</ButtonUI>
              </div>
            </div>
          </template>

          <template v-if="step1State.showQRScanner">
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
              <h3 class="text-base font-black text-[#1A237E] dark:text-white mb-4 text-center">Scannez le QR Code de votre voisin</h3>
              <QRScanner :isOpen="step1State.showQRScanner" @scan-success="handleQRScanned" @close="step1State.showQRScanner = false" />
              <div class="text-center mt-4">
                <ButtonUI @click="handleQRNo" variant="outline" size="sm">Passer cette étape</ButtonUI>
              </div>
            </div>
          </template>

        </div>
      </div>

      <!-- ================= STEP 2: INFOS ================= -->
      <div v-if="currentStep === 2" class="space-y-6 animate-in slide-in-from-right duration-300">
        <div class="p-4 bg-gradient-to-r from-[#FF6D00]/10 to-transparent border-l-4 border-[#FF6D00] rounded-r-xl">
          <p class="text-sm font-bold text-gray-800 dark:text-white">Formulaire pré-rempli</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Vérifiez les données et complétez les champs manquants.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Pays</label>
            <input v-model="formState.country" type="text" disabled class="w-full bg-gray-100 dark:bg-slate-800 border-none text-gray-500 rounded-xl px-4 py-3 font-semibold" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Ville</label>
            <input v-model="formState.city" type="text" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-[#1A237E] dark:text-white rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[#2E7D32]/20 outline-none" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Quartier <span class="text-rose-500">*</span></label>
            <input v-model="formState.neighborhood" type="text" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-[#1A237E] dark:text-white rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[#2E7D32]/20 outline-none" />
            <p v-if="formErrors.neighborhood" class="text-rose-500 text-[10px] font-bold">{{ formErrors.neighborhood }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Rue <span class="text-rose-500">*</span></label>
            <input v-model="formState.street" type="text" placeholder="Ex: Rue de la Joie" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-[#1A237E] dark:text-white rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[#2E7D32]/20 outline-none" />
            <p v-if="formErrors.street" class="text-rose-500 text-[10px] font-bold">{{ formErrors.street }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Numéro de domicile <span class="text-rose-500">*</span></label>
            <input v-model="formState.houseNumber" type="text" placeholder="Ex: 28B" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-[#1A237E] dark:text-white text-lg rounded-xl px-4 py-3 font-black focus:ring-2 focus:ring-[#2E7D32]/20 outline-none" />
            <p v-if="formErrors.houseNumber" class="text-rose-500 text-[10px] font-bold">{{ formErrors.houseNumber }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Code postal</label>
            <input v-model="formState.postalCode" type="text" placeholder="Optionnel" class="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-[#1A237E] dark:text-white rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-[#2E7D32]/20 outline-none" />
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <ButtonUI @click="validateStep2" variant="primary" class="px-8 shadow-lg shadow-[#2E7D32]/30">
            Suivant <ArrowRight class="w-4 h-4 ml-2" />
          </ButtonUI>
        </div>
      </div>

      <!-- ================= STEP 3: PHOTO ================= -->
      <div v-if="currentStep === 3" class="animate-in slide-in-from-right duration-300">
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <!-- Colonne Gauche : Petit carré stylé et statuts -->
          <div class="md:col-span-2 space-y-6">
            
            <div class="bg-gradient-to-br from-[#1A237E] to-[#0A124A] rounded-3xl p-6 text-white shadow-xl shadow-[#1A237E]/20 relative overflow-hidden">
              <!-- Déco de fond -->
              <div class="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              
              <div class="flex items-center space-x-4 mb-6">
                <div class="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <ImageIcon class="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 class="font-black text-lg">Façade</h3>
                  <p class="text-[10px] text-white/60 font-bold uppercase tracking-wider">Obligatoire</p>
                </div>
              </div>

              <div class="space-y-3 mb-6 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div class="flex justify-between text-xs">
                  <span class="text-white/60 font-semibold">Format accepté :</span>
                  <span class="font-black">JPG, PNG</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-white/60 font-semibold">Taille Max :</span>
                  <span class="font-black">5 MB</span>
                </div>
                <div v-if="formState.photoStats" class="flex justify-between text-xs pt-3 border-t border-white/10">
                  <span class="text-emerald-400 font-bold">Optimisé à :</span>
                  <span class="font-black text-emerald-400">{{ formState.photoStats.compressed }}</span>
                </div>
              </div>

            </div>

            <!-- Composant Conseil -->
            <div class="bg-[#2E7D32]/5 border border-[#2E7D32]/20 rounded-2xl p-5 relative overflow-hidden">
              <div class="absolute -right-4 -bottom-4 opacity-5">
                <ShieldCheck class="w-24 h-24" />
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-[#2E7D32]/10 flex items-center justify-center shrink-0">
                  <span class="text-lg">💡</span>
                </div>
                <div>
                  <h4 class="text-xs font-black text-[#2E7D32] mb-1 uppercase tracking-wider">Pourquoi une photo ?</h4>
                  <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    Une photo claire de votre portail ou bâtiment est un repère visuel indispensable pour les livreurs et services d'urgence. Elle réduit de 80% le temps de recherche sur le terrain.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <!-- Colonne Droite : Upload ou Capture -->
          <div class="md:col-span-3">
            
            <div 
              class="w-full h-[320px] bg-gray-50 dark:bg-slate-900 border-3 border-dashed border-gray-200 dark:border-slate-800 hover:border-[#2E7D32] rounded-[32px] flex flex-col items-center justify-center relative transition-all group overflow-hidden cursor-pointer"
              @click="triggerPhotoUpload"
            >
              <input type="file" accept="image/*" class="hidden" ref="photoInput" @change="handlePhotoUpload" />
              
              <template v-if="formState.photo">
                <img :src="formState.photo" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <ButtonUI variant="secondary" :icon="Camera">Changer la photo</ButtonUI>
                </div>
              </template>
              
              <template v-else>
                <div class="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera class="w-8 h-8 text-[#1A237E]" />
                </div>
                <h3 class="text-lg font-black text-[#1A237E] dark:text-white">Prendre une photo</h3>
                <p class="text-sm text-gray-500 mt-2">Ou importer depuis la galerie</p>
                <p v-if="formErrors.photo" class="text-rose-500 font-bold mt-4">{{ formErrors.photo }}</p>
              </template>
            </div>

            <div class="flex justify-between items-center mt-8">
              <ButtonUI @click="currentStep = 2" variant="outline" class="text-gray-500">
                Retour
              </ButtonUI>
              <ButtonUI @click="submitForm" variant="primary" :icon="Check" class="px-8 py-3 shadow-xl shadow-[#2E7D32]/30 text-lg">
                Valider l'adresse
              </ButtonUI>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>
