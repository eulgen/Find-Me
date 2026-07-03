<!--
  @file app/components/address-form/AddressStepper.vue
  @description Composant de formulaire de création d'adresse en 3 étapes (glassmorphism premium).
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MapPin, Locate, QrCode, Camera, Check, Upload, ArrowRight, ShieldCheck, HelpCircle, Image as ImageIcon, FileUp, Sparkles } from 'lucide-vue-next'
import ButtonUI from '~/components/ui/ButtonUI.vue'
import QRScanner from '~/components/ui/QRScanner.vue'
import { useToasts } from '~/composables/useToasts'
import { useRouter } from 'vue-router'
import { useHead, useNuxtApp } from '#imports'

import { useAddressFormState } from '~/composables/address/useAddressFormState'
import { useAddressMap } from '~/composables/address/useAddressMap'
import { useAddressStepperLogic } from '~/composables/address/useAddressStepperLogic'

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

const deps = {
  formState, step1State, currentStep, addToast, setMapView, initMap,
  submitForm, router, currentUser, removeDraft, showLimitModal
}

const {
  handleGeolocationYes, handleGeolocationNo, handleManualLocationDone,
  handleQRYes, handleImageUpload, handleQRNo, handleQRScanned,
  goBackToStep1, photoInput, triggerPhotoUpload, handlePhotoUpload,
  finalSubmit, cancelCreation
} = useAddressStepperLogic(deps)
</script>

<template>
  <div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 dark:border-slate-200 overflow-hidden relative group/container">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none transition-transform duration-1000" />
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[60px] pointer-events-none transition-transform duration-1000" />
    
    <!-- HEADER & STEPPER -->
    <div class="bg-white/30 dark:bg-white backdrop-blur-md p-6 md:p-8 border-b border-white/60 dark:border-slate-200 relative z-10">
      <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 mb-8 tracking-tight">Création de votre adresse</h1>
      
      <div class="flex items-center space-x-2 sm:space-x-4">
        <!-- Step 1 -->
        <div class="flex items-center space-x-2">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 z-10 relative" :class="
            currentStep >= 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30' : 'bg-white/50 dark:bg-slate-50 text-slate-400 border border-white/60 dark:border-slate-300'
          ">
            <Check v-if="currentStep > 1" class="w-5 h-5" />
            <span v-else>1</span>
          </div>
          <span :class="currentStep >= 1 ? 'font-bold text-slate-800 dark:text-[#0f172b]' : 'font-semibold text-slate-400 hidden sm:inline'">Localisation</span>
        </div>
        <div class="w-8 sm:w-16 h-1.5 rounded-full transition-colors duration-500 shadow-inner" :class="currentStep >= 2 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-200/50 dark:bg-slate-700/50'"></div>
        
        <!-- Step 2 -->
        <div class="flex items-center space-x-2">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 z-10 relative" :class="
            currentStep >= 2 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30' : 'bg-white/50 dark:bg-slate-50 text-slate-400 border border-white/60 dark:border-slate-300'
          ">
            <Check v-if="currentStep > 2" class="w-5 h-5" />
            <span v-else>2</span>
          </div>
          <span :class="currentStep >= 2 ? 'font-bold text-slate-800 dark:text-[#0f172b]' : 'font-semibold text-slate-400 hidden sm:inline'">Infos</span>
        </div>
        <div class="w-8 sm:w-16 h-1.5 rounded-full transition-colors duration-500 shadow-inner" :class="currentStep >= 3 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-200/50 dark:bg-slate-700/50'"></div>

        <!-- Step 3 -->
        <div class="flex items-center space-x-2">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 z-10 relative" :class="
            currentStep >= 3 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30' : 'bg-white/50 dark:bg-slate-50 text-slate-400 border border-white/60 dark:border-slate-300'
          ">
            3
          </div>
          <span :class="currentStep >= 3 ? 'font-bold text-slate-800 dark:text-[#0f172b]' : 'font-semibold text-slate-400 hidden sm:inline'">Photo</span>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="p-6 md:p-8 min-h-[450px] relative z-10">

      <!-- ================= STEP 1: LOCALISATION ================= -->
      <div v-if="currentStep === 1" class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        
        <!-- THE MAP -->
        <div class="relative w-full h-96 md:h-[450px] bg-slate-100 dark:bg-white rounded-[32px] overflow-hidden border border-white/60 dark:border-slate-300 shadow-lg z-0">
          <div id="leaflet-stepper-map" class="w-full h-full z-0"></div>
          
          <div v-if="step1State.geolocationStatus === 'loading'" class="absolute inset-0 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center text-white z-10">
            <Locate class="w-10 h-10 animate-spin text-emerald-400 mb-3" />
            <span class="font-black tracking-widest uppercase text-[11px] bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/30 backdrop-blur-md">Recherche GPS de haute précision...</span>
          </div>
        </div>

        <!-- Questions (Glass Container) -->
        <div class="bg-white/60 dark:bg-white backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 border border-white/40 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
          
          <template v-if="step1State.askQR">
            <div class="space-y-8 relative z-10">
              <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[20px] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
                  <MapPin class="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <h3 class="text-2xl font-black text-slate-800 dark:text-[#0f172b]">Avez-vous un voisin sur FindMe ?</h3>
                <p class="text-[15px] text-slate-500 dark:text-slate-600 mt-2 max-w-sm mx-auto font-medium">Récupérez instantanément son adresse pour créer la vôtre automatiquement.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <!-- Option 1: Scan Caméra -->
                <button @click="handleQRYes" class="group relative bg-white/50 dark:bg-slate-50 backdrop-blur-md border-2 border-white/60 dark:border-slate-300 hover:border-emerald-500 rounded-[24px] p-6 text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 ">
                  <div class="absolute top-5 right-5 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Camera class="w-5 h-5 text-white" />
                  </div>
                  <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 transition-colors shadow-inner">
                    <QrCode class="w-7 h-7 text-slate-500 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                  </div>
                  <h4 class="text-lg font-black text-slate-800 dark:text-[#0f172b] mb-2">1. Scanner le QR Code</h4>
                  <p class="text-[13px] text-slate-500 dark:text-slate-600 font-medium leading-relaxed pr-8">
                    Utilisez votre caméra pour scanner la plaque digitale de votre voisin.
                  </p>
                </button>

                <!-- Option 2: Upload Image -->
                <div class="relative">
                  <input type="file" accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <button class="w-full h-full group relative bg-white/50 dark:bg-slate-50 backdrop-blur-md border-2 border-white/60 dark:border-slate-300 hover:border-emerald-500 rounded-[24px] p-6 text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 ">
                    <div class="absolute top-5 right-5 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <ImageIcon class="w-5 h-5 text-white" />
                    </div>
                    <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 transition-colors shadow-inner">
                      <FileUp class="w-7 h-7 text-slate-500 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    </div>
                    <h4 class="text-lg font-black text-slate-800 dark:text-[#0f172b] mb-2">2. Joindre une image</h4>
                    <p class="text-[13px] text-slate-500 dark:text-slate-600 font-medium leading-relaxed pr-8">
                      Importez la photo du QR Code. Nous récupérerons également la photo du bâtiment si disponible.
                    </p>
                  </button>
                </div>
              </div>

              <!-- Action: Skip -->
              <div class="pt-6 text-center border-t border-white/40 dark:border-slate-200">
                <button @click="handleQRNo" class="text-[11px] font-black text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 uppercase tracking-widest transition-colors py-2.5 px-6 rounded-full bg-white/50 dark:bg-slate-50 border border-white/60 dark:border-slate-300 hover:shadow-md backdrop-blur-sm">
                  Non, passer cette étape
                </button>
              </div>

              <div id="hidden-qr-stepper-box" style="display: none;"></div>
            </div>
          </template>

          <template v-else-if="step1State.askGeolocation">
            <div class="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <HelpCircle class="w-10 h-10 text-white drop-shadow-md" />
              </div>
              <div class="flex-1 text-center md:text-left">
                <h3 class="text-2xl font-black text-slate-800 dark:text-[#0f172b] mb-2">Utiliser la géolocalisation ?</h3>
                <p class="text-[15px] text-slate-500 dark:text-slate-600 font-medium">Pouvez-vous utiliser votre position actuelle pour remplir automatiquement le formulaire avec une haute précision ?</p>
              </div>
              <div class="flex items-center gap-4 w-full md:w-auto mt-6 md:mt-0">
                <ButtonUI @click="handleGeolocationNo" variant="outline" class="flex-1 md:w-32 bg-white/50 dark:bg-slate-50 border-white/60 shadow-sm text-slate-600">Non</ButtonUI>
                <ButtonUI @click="handleGeolocationYes" variant="primary" class="flex-1 md:w-32 shadow-xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-teal-600 border-none text-[15px]">Oui</ButtonUI>
              </div>
            </div>
          </template>

          <template v-else-if="step1State.askManualLocation">
            <div class="flex flex-col items-center text-center relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30">
                <MapPin class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-2xl font-black text-slate-800 dark:text-[#0f172b] mb-2">Localisation Manuelle</h3>
              <p class="text-[14px] text-slate-500 dark:text-slate-600 font-medium max-w-md mx-auto mb-6">
                Cliquez sur la carte pour placer le repère, ou entrez vos coordonnées ci-dessous. Cette étape est facultative.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 w-full max-w-sm mb-6">
                <div class="flex-1 space-y-1.5 text-left">
                  <label class="text-[10px] font-black uppercase text-slate-500 pl-1">Latitude</label>
                  <input v-model="formState.lat" @input="updateMapFromInputs" type="text" class="w-full bg-slate-100/50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-emerald-500 outline-none" />
                </div>
                <div class="flex-1 space-y-1.5 text-left">
                  <label class="text-[10px] font-black uppercase text-slate-500 pl-1">Longitude</label>
                  <input v-model="formState.lng" @input="updateMapFromInputs" type="text" class="w-full bg-slate-100/50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-emerald-500 outline-none" />
                </div>
              </div>
              
              <div class="flex items-center justify-center gap-4 w-full sm:w-auto">
                <ButtonUI @click="handleManualLocationDone" variant="outline" class="flex-1 sm:w-40 bg-white/50 dark:bg-slate-50 border-white/60 shadow-sm text-slate-600">Passer</ButtonUI>
                <ButtonUI @click="handleManualLocationDone" variant="primary" class="flex-1 sm:w-48 shadow-xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-teal-600 border-none text-[14px]">Confirmer ma position</ButtonUI>
              </div>
            </div>
          </template>

          <template v-else-if="step1State.showQRScanner">
            <div class="space-y-4 relative z-10">
              <p class="text-sm font-bold text-center text-slate-500 dark:text-slate-600 flex items-center justify-center gap-2">
                <span class="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                Ouverture du scanner en cours...
              </p>
            </div>
          </template>

        </div>

        <QRScanner :isOpen="step1State.showQRScanner" @scan-success="handleQRScanned" @close="handleQRNo" />

      </div>

      <!-- ================= STEP 2: INFOS ================= -->
      <div v-if="currentStep === 2" class="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div class="p-5 bg-gradient-to-r from-orange-500/10 to-amber-500/5 border-l-4 border-orange-500 rounded-r-[24px] backdrop-blur-md shadow-sm">
          <p class="text-[15px] font-black text-slate-800 dark:text-[#0f172b] flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-orange-500" /> Formulaire pré-rempli
          </p>
          <p class="text-[13px] font-medium text-slate-600 dark:text-slate-600 mt-1">Vérifiez les données géolocalisées et complétez les champs manquants avec précision.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Pays</label>
            <input v-model="formState.country" type="text" disabled class="w-full bg-slate-100/50 dark:bg-white border border-white/40 dark:border-slate-200 text-slate-500 rounded-2xl px-5 py-3.5 font-bold shadow-inner opacity-70" />
          </div>
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Ville</label>
            <input v-model="formState.city" type="text" class="w-full bg-white/50 dark:bg-white backdrop-blur-sm border border-white/60 dark:border-slate-300 text-slate-900 dark:text-[#0f172b] rounded-2xl px-5 py-3.5 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner" />
          </div>
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Quartier <span class="text-rose-500">*</span></label>
            <input v-model="formState.neighborhood" type="text" class="w-full bg-white/50 dark:bg-white backdrop-blur-sm border border-white/60 dark:border-slate-300 text-slate-900 dark:text-[#0f172b] rounded-2xl px-5 py-3.5 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner" />
            <p v-if="formErrors.neighborhood" class="text-rose-500 text-[10px] font-bold pl-2">{{ formErrors.neighborhood }}</p>
          </div>
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Rue</label>
            <input v-model="formState.street" type="text" placeholder="Optionnel" class="w-full bg-white/50 dark:bg-white backdrop-blur-sm border border-white/60 dark:border-slate-300 text-slate-900 dark:text-[#0f172b] rounded-2xl px-5 py-3.5 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner" />
          </div>
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Numéro de domicile</label>
            <input :value="formState.houseNumber || 'Auto-généré'" type="text" disabled class="w-full bg-slate-100/50 dark:bg-white border border-white/40 dark:border-slate-200 text-emerald-600 dark:text-emerald-500 text-lg rounded-2xl px-5 py-3.5 font-black shadow-inner opacity-80" />
            <p class="text-[10px] text-slate-400 font-bold pl-2 mt-1">Généré automatiquement</p>
          </div>
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Code postal</label>
            <input v-model="formState.postalCode" type="text" placeholder="Optionnel" class="w-full bg-white/50 dark:bg-white backdrop-blur-sm border border-white/60 dark:border-slate-300 text-slate-900 dark:text-[#0f172b] rounded-2xl px-5 py-3.5 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner" />
          </div>
        </div>

        <div class="flex justify-between items-center pt-6 border-t border-white/60 dark:border-slate-200">
          <ButtonUI @click="goBackToStep1" variant="outline" class="bg-white/50 dark:bg-slate-50 shadow-sm border-white/60 dark:border-slate-300 text-slate-600">
            Précédent
          </ButtonUI>
          <ButtonUI @click="validateStep2" variant="primary" class="px-8 shadow-lg shadow-emerald-500/25 bg-gradient-to-r from-emerald-500 to-teal-600 border-none text-[15px]" :icon="ArrowRight">
            Étape Suivante
          </ButtonUI>
        </div>
      </div>

      <!-- ================= STEP 3: PHOTO ================= -->
      <div v-if="currentStep === 3" class="animate-in slide-in-from-right-4 duration-500">
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <!-- Colonne Gauche : Petit carré stylé et statuts -->
          <div class="md:col-span-2 space-y-6">
            
            <div class="bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-black dark:to-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
              <!-- Déco de fond -->
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-[40px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              
              <div class="flex items-center space-x-5 mb-8 relative z-10">
                <div class="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[20px] flex items-center justify-center border border-white/20 shadow-inner transition-transform duration-500">
                  <ImageIcon class="w-8 h-8 text-indigo-300 drop-shadow-md" />
                </div>
                <div>
                  <h3 class="font-black text-xl tracking-tight">Façade</h3>
                  <div class="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full">
                    <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                    <p class="text-[10px] text-rose-300 font-black uppercase tracking-widest">Obligatoire</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4 bg-white/5 backdrop-blur-sm p-5 rounded-[24px] border border-white/10 relative z-10">
                <div class="flex justify-between text-[13px] items-center">
                  <span class="text-slate-400 font-medium">Format accepté :</span>
                  <span class="font-black bg-white/10 px-2 py-0.5 rounded-lg text-indigo-200">JPG, PNG</span>
                </div>
                <div class="flex justify-between text-[13px] items-center">
                  <span class="text-slate-400 font-medium">Taille Max :</span>
                  <span class="font-black text-white">5 MB</span>
                </div>
                <div v-if="formState.photoStats" class="flex justify-between text-[13px] pt-4 border-t border-white/10 items-center">
                  <span class="text-emerald-400 font-bold flex items-center gap-1.5"><Check class="w-4 h-4"/> Optimisé :</span>
                  <span class="font-black text-emerald-400">{{ formState.photoStats.compressed }}</span>
                </div>
              </div>

            </div>

            <!-- Composant Conseil -->
            <div class="bg-emerald-500/5 backdrop-blur-md border border-emerald-500/20 rounded-[24px] p-6 relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 opacity-[0.03]">
                <ShieldCheck class="w-32 h-32" />
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-[16px] bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-inner">
                  <span class="text-xl">💡</span>
                </div>
                <div class="relative z-10">
                  <h4 class="text-[11px] font-black text-emerald-600 dark:text-[#0f172b] mb-1.5 uppercase tracking-widest">Pourquoi une photo ?</h4>
                  <p class="text-[13px] text-slate-600 dark:text-slate-600 leading-relaxed font-medium">
                    Une photo claire de votre portail ou bâtiment est un repère visuel indispensable pour les livreurs et services d'urgence. Elle réduit de <span class="text-emerald-600 dark:text-[#0f172b] font-bold">80%</span> le temps de recherche sur le terrain.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <!-- Colonne Droite : Upload ou Capture -->
          <div class="md:col-span-3 flex flex-col">
            
            <div 
              class="w-full flex-1 min-h-[320px] bg-white/40 dark:bg-white backdrop-blur-md border-2 border-dashed border-white/60 dark:border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 rounded-[32px] flex flex-col items-center justify-center relative transition-all duration-300 group overflow-hidden cursor-pointer shadow-sm"
              @click="triggerPhotoUpload"
            >
              <input type="file" accept="image/*" class="hidden" ref="photoInput" @change="handlePhotoUpload" />
              
              <template v-if="formState.photo">
                <img :src="formState.photo" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <ButtonUI variant="secondary" :icon="Camera" class="shadow-2xl transition-transform">Remplacer la photo</ButtonUI>
                </div>
              </template>
              
              <template v-else>
                <div class="w-20 h-20 bg-white/80 dark:bg-slate-50 backdrop-blur-md border border-white/40 shadow-xl rounded-full flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-all duration-500">
                  <Camera class="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <h3 class="text-xl font-black text-slate-800 dark:text-[#0f172b] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Prendre une photo</h3>
                <p class="text-[13px] text-slate-500 font-medium mt-2">Ou importer depuis la galerie (JPG, PNG)</p>
                <p v-if="formErrors.photo" class="text-rose-500 font-bold mt-5 px-4 py-2 bg-rose-500/10 rounded-full text-[13px]">{{ formErrors.photo }}</p>
              </template>
            </div>

            <div class="flex justify-between items-center mt-6 pt-6 border-t border-white/60 dark:border-slate-200">
              <ButtonUI @click="currentStep = 2" variant="outline" class="bg-white/50 dark:bg-slate-50 border-white/60 shadow-sm text-slate-600">
                Retour
              </ButtonUI>
              <ButtonUI @click="finalSubmit" variant="primary" :icon="Check" class="px-8 py-4 shadow-xl shadow-emerald-500/30 text-[15px] bg-gradient-to-r from-emerald-500 to-teal-600 border-none transition-transform">
                Valider l'adresse
              </ButtonUI>
            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- MODALE LIMITE ATTEINTE -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="absolute w-full transition-all duration-300 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showLimitModal" class="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <div class="bg-white/90 dark:bg-white backdrop-blur-2xl border border-white/60 dark:border-slate-200 rounded-[32px] p-8 max-w-sm w-full text-center shadow-[0_16px_64px_rgba(0,0,0,0.1)] relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-[30px]" />
          
          <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-rose-100 dark:border-rose-500/20 relative z-10">
            <Check class="w-10 h-10 text-rose-500" />
          </div>
          <h3 class="text-2xl font-black text-slate-800 dark:text-[#0f172b] mb-3 tracking-tight relative z-10">Limite atteinte</h3>
          <p class="text-[14px] font-medium text-slate-500 dark:text-slate-600 leading-relaxed mb-8 relative z-10">
            Vous avez déjà créé le nombre maximum d'adresses (4). Vous ne pouvez pas publier celle-ci.
          </p>
          <div class="flex gap-4 relative z-10">
            <ButtonUI @click="cancelCreation" variant="danger" class="flex-1 shadow-lg shadow-rose-500/20 py-3.5">Fermer et annuler</ButtonUI>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>
