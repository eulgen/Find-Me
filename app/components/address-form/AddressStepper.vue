<!--
  @file app/components/address-form/AddressStepper.vue
  @description Composant de formulaire de création d'adresse en 3 étapes.
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MapPin, Locate, QrCode, Camera, Check, Upload, ArrowRight, ShieldCheck, HelpCircle, Image as ImageIcon, FileUp } from 'lucide-vue-next'
import { Html5Qrcode } from "html5-qrcode"
import ButtonUI from '~/components/ui/ButtonUI.vue'
import QRScanner from '~/components/ui/QRScanner.vue'
import { useToasts } from '~/composables/useToasts'
import { useRouter } from 'vue-router'
import { useHead } from '#imports'

import { useAddressFormState } from '~/composables/address/useAddressFormState'
import { useAddressMap } from '~/composables/address/useAddressMap'

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' }
  ]
})

const { addToast } = useToasts()
const router = useRouter()

// -- Composables --
const { 
  formState, step1State, currentStep, showLimitModal, formErrors, draftId,
  initDraft, removeDraft, submitForm, validateStep2, addressesList, currentUser
} = useAddressFormState()

const { initMap, updateMapFromInputs, setMapView } = useAddressMap(formState)

onMounted(() => {
  initDraft()
  setTimeout(() => {
    initMap('leaflet-stepper-map')
  }, 300)
})

// -- Geolocation & Steps UI Logic --

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

        setMapView(pos.coords.latitude, pos.coords.longitude, 18)
        
        // Show next question
        step1State.value.askGeolocation = false
        setTimeout(() => {
          currentStep.value = 2
        }, 1200)
      },
      () => {
        step1State.value.geolocationStatus = 'error'
        addToast("Impossible de récupérer la position.", "error")
        step1State.value.askGeolocation = false
        currentStep.value = 2
      },
      { enableHighAccuracy: true }
    )
  } else {
    step1State.value.askGeolocation = false
    currentStep.value = 2
  }
}

const handleGeolocationNo = () => {
  step1State.value.askGeolocation = false
  currentStep.value = 2
}

// -- QR Logic --
const handleQRYes = () => {
  step1State.value.askQR = false
  step1State.value.showQRScanner = true
}

const handleImageUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  
  addToast("Analyse de l'image en cours...", "info");
  try {
    const html5QrCode = new Html5Qrcode("hidden-qr-stepper-box");
    const decodedText = await html5QrCode.scanFile(file, true);
    
    // Parse decoded text
    let resultData = null;
    try {
        resultData = JSON.parse(decodedText);
    } catch(e) {
        resultData = { addressCode: decodedText.trim() };
    }
    
    if (resultData) {
        handleQRScanned(resultData);
    } else {
        addToast("Aucune donnée d'adresse trouvée dans ce QR Code.", "error");
    }
  } catch (err) {
    addToast("Impossible de lire un QR Code valide sur cette image.", "error");
  }
}

const handleQRNo = () => {
  step1State.value.askQR = false
  step1State.value.showQRScanner = false
  step1State.value.askGeolocation = true
}

const handleQRScanned = async (data: any) => {
  if (data) {
    step1State.value.showQRScanner = false
    
    let fullData = data;
    // Si on a un code mais pas le reste, on interroge l'API
    if ((data.addressCode && !data.city) || data.raw) {
      try {
        addToast("Récupération de l'adresse depuis le serveur...", "info");
        const { $api } = useNuxtApp();
        const codeToFetch = data.addressCode || data.raw;
        // On utilise l'ID de l'utilisateur ou user_12345 par défaut
        const userId = currentUser.value?.id || 'user_12345';
        const fetched = await $api(`/api/users/user/${userId}/addresses/${codeToFetch}`);
        if (fetched) {
          fullData = fetched;
        }
      } catch(err) {
        addToast("Impossible de récupérer les détails de l'adresse distante.", "error");
      }
    }

    // Fill form from scanned data
    if (fullData.country) formState.value.country = fullData.country;
    if (fullData.city) formState.value.city = fullData.city;
    if (fullData.neighborhood) formState.value.neighborhood = fullData.neighborhood;
    if (fullData.streetName || fullData.street) formState.value.street = fullData.streetName || fullData.street;
    if (fullData.housePlateNumber || fullData.houseNumber) formState.value.houseNumber = fullData.housePlateNumber || fullData.houseNumber;
    if (fullData.photoRaw || fullData.photo) formState.value.photo = fullData.photoRaw || fullData.photo;
    if (fullData.coordinates) {
      formState.value.lat = fullData.coordinates.lat;
      formState.value.lng = fullData.coordinates.lng;
    }
    addToast("Données du QR Code récupérées. Veuillez vérifier les informations.", "success");
    currentStep.value = 2;
  }
}

const goBackToStep1 = () => {
  currentStep.value = 1
  step1State.value.askGeolocation = true
  step1State.value.geolocationStatus = 'idle'
  step1State.value.askManualLocation = false
  step1State.value.askQR = false
  step1State.value.showQRScanner = false
  setTimeout(() => {
    initMap('leaflet-stepper-map')
  }, 300)
}

// --- PHOTO UPLOAD LOGIC ---
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

const finalSubmit = () => {
  if (submitForm()) {
    addToast("Adresse créée avec succès !", "success")
    router.push(`/users/${currentUser.value?.username || 'me'}?section=addresses`)
  }
}

const cancelCreation = () => {
  showLimitModal.value = false;
  removeDraft();
  router.push(`/users/${currentUser.value?.username || 'me'}?section=addresses`);
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
        <div class="relative w-full h-96 md:h-[450px] bg-sky-50 dark:bg-slate-800 rounded-2xl overflow-hidden border-4 border-white shadow-lg z-0">
          <div id="leaflet-stepper-map" class="w-full h-full z-0"></div>
          
          <div v-if="step1State.geolocationStatus === 'loading'" class="absolute inset-0 bg-[#1A237E]/40 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
            <Locate class="w-8 h-8 animate-spin mb-2" />
            <span class="font-bold">Recherche GPS de haute précision...</span>
          </div>
        </div>

        <!-- Questions -->
        <div class="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
          
          <template v-if="step1State.askQR">
            <div class="space-y-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-[#1A237E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin class="w-6 h-6 text-[#1A237E]" />
                </div>
                <h3 class="text-xl font-black text-[#1A237E] dark:text-white">Avez-vous un voisin sur FindMe ?</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">Récupérez instantanément son adresse pour créer la vôtre automatiquement.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Option 1: Scan Caméra -->
                <button @click="handleQRYes" class="group relative bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 hover:border-[#2E7D32] rounded-2xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2E7D32]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera class="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div class="w-12 h-12 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center mb-4">
                    <QrCode class="w-6 h-6 text-[#2E7D32]" />
                  </div>
                  <h4 class="text-base font-black text-[#1A237E] dark:text-white mb-2">1. Scanner le QR Code</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Utilisez votre caméra pour scanner la plaque de votre voisin.
                  </p>
                </button>

                <!-- Option 2: Upload Image -->
                <div class="relative">
                  <input type="file" accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <button class="w-full h-full group relative bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 hover:border-[#1A237E] rounded-2xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                    <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1A237E]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon class="w-4 h-4 text-[#1A237E]" />
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-[#1A237E]/10 flex items-center justify-center mb-4">
                      <FileUp class="w-6 h-6 text-[#1A237E]" />
                    </div>
                    <h4 class="text-base font-black text-[#1A237E] dark:text-white mb-2">2. Joindre une image</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                      Importez la photo du QR Code. Nous récupérerons également la photo du bâtiment.
                    </p>
                  </button>
                </div>
              </div>

              <!-- Action: Skip -->
              <div class="pt-4 text-center border-t border-gray-100 dark:border-slate-800">
                <button @click="handleQRNo" class="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 uppercase tracking-widest transition-colors py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                  Non, passer cette étape
                </button>
              </div>

              <!-- Hidden html5-qrcode container for file processing -->
              <div id="hidden-qr-stepper-box" style="display: none;"></div>
            </div>
          </template>

          <template v-else-if="step1State.askGeolocation">
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

          <template v-else-if="step1State.showQRScanner">
            <div class="space-y-4">
              <p class="text-sm text-center text-gray-500 dark:text-gray-400">Ouverture du scanner...</p>
            </div>
          </template>

        </div>

        <!-- QRScanner always mounted so its watch(isOpen) fires on transition false→true -->
        <!-- On close without scan: treat as "skip QR" and continue normal flow -->
        <QRScanner :isOpen="step1State.showQRScanner" @scan-success="handleQRScanned" @close="handleQRNo" />

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

        <div class="flex justify-between pt-4">
          <ButtonUI @click="goBackToStep1" variant="outline" class="text-gray-500">
            Précédent
          </ButtonUI>
          <ButtonUI @click="validateStep2" variant="primary" class="px-8 shadow-lg shadow-[#2E7D32]/30" :icon="ArrowRight">
            Suivant
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
              <ButtonUI @click="finalSubmit" variant="primary" :icon="Check" class="px-8 py-3 shadow-xl shadow-[#2E7D32]/30 text-lg">
                Valider l'adresse
              </ButtonUI>
            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- MODALE LIMITE ATTEINTE -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div v-if="showLimitModal" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div class="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-5">
            <Check class="w-8 h-8 text-rose-500" />
          </div>
          <h3 class="text-lg font-black text-gray-800 dark:text-white mb-2">Limite atteinte</h3>
          <p class="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
            Vous avez déjà créé le nombre maximum d'adresses (4). Vous ne pouvez pas publier celle-ci.
          </p>
          <div class="flex gap-3">
            <ButtonUI @click="cancelCreation" variant="danger" class="flex-1 text-sm px-2">Fermer et annuler</ButtonUI>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>
