<!--
  @file FormPhotoCapture.vue
  @description Composant du formulaire d'adressage: Prise de vue par webcam ou tÃ©lÃ©versement d'image avec raccord de compression.
-->

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Camera, Upload, CheckCircle, RefreshCw, ShieldAlert, Sparkles } from 'lucide-vue-next'
import { useCameraAndPhoto } from '../../composables/useCameraAndPhoto'

const emit = defineEmits<{
  (e: 'photo-loaded', data: { raw: string; stats: { compressed: string; ratio: string } }): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

const {
  useWebcam,
  selectedPhoto,
  photoCompressedName,
  originalSize,
  compressedSize,
  compressionRatio,
  isCompressing,
  mockCameraActive,
  startCamera,
  stopCamera,
  captureSnapshot,
  handleFileUpload
} = useCameraAndPhoto()

// Ã‰mettre le rÃ©sultat dÃ¨s qu'une photo est sÃ©lectionnÃ©e/capturÃ©e
watch(selectedPhoto, (newPhoto) => {
  if (newPhoto) {
    emit('photo-loaded', {
      raw: newPhoto,
      stats: {
        compressed: compressedSize.value || '180 KB',
        ratio: String(compressionRatio.value || '85')
      }
    })
  }
})

const onFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0 && files[0]) {
    handleFileUpload(files[0])
  }
}

const onDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (files && files.length > 0 && files[0]) {
    handleFileUpload(files[0])
  }
}
</script>

<template>
  <div class="space-y-4.5" id="address-form-visual-capture">
    <label class="block text-xs font-bold text-[#155dfc]">4. Photo de la faÃ§ade (recommandÃ© pour les livreurs) :</label>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- Zone d'import / Webcam -->
      <div 
        class="border-3 border-dashed border-[#155dfc]/20 hover:border-[#00bc7d] bg-white rounded-2xl p-6 text-center transition-all flex flex-col justify-center items-center min-h-[190px] relative"
        @dragover.prevent
        @drop.prevent="onDrop"
        id="facade-photo-import-zone"
      >
        <span class="sr-only">Zone de tÃ©lÃ©versement ou capture d'image de la faÃ§ade</span>

        <div v-if="!useWebcam && !selectedPhoto" class="space-y-4">
          <div class="flex items-center justify-center space-x-3">
            <button 
              type="button" 
              @click="startCamera(videoRef)"
              class="flex items-center space-x-1.5 bg-[#155dfc] hover:bg-[#155dfc]/90 text-white text-[11px] font-black px-4 py-2.5 rounded-xl cursor-pointer shadow-md"
            >
              <Camera class="w-4 h-4 text-emerald-400" />
              <span>Prendre Photo</span>
            </button>
            <span class="text-xs font-bold text-[#155dfc]/40">ou</span>
            <label class="flex items-center space-x-1.5 bg-white border-2 border-[#155dfc] hover:bg-[#F5F2FB] text-[#155dfc] text-[11px] font-black px-4 py-2 rounded-xl cursor-pointer">
              <Upload class="w-4 h-4" />
              <span>Importer</span>
              <input type="file" accept="image/*" class="hidden" @change="onFileSelect" />
            </label>
          </div>
          <p class="text-[10px] text-[#155dfc]/50 font-semibold">Glissez-dÃ©posez la photo de votre portail ici</p>
        </div>

        <!-- Rendu du Flux CamÃ©ra / Scanner Visuel -->
        <div v-if="useWebcam" class="w-full relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
          <video 
            ref="videoRef"
            autoplay 
            playsinline 
            muted 
            class="w-full h-full object-cover transform scale-x-[-1]"
          />
          <div v-if="mockCameraActive" class="absolute inset-0 bg-[#155dfc]/92 p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Sparkles class="w-8 h-8 text-emerald-400 animate-spin" />
            <h4 class="text-xs font-bold text-white">Scanner de FaÃ§ade Actif</h4>
          </div>
          <!-- Boutons d'action webcam -->
          <div class="absolute bottom-3 inset-x-0 flex justify-center space-x-3.5 z-10">
            <button type="button" @click="captureSnapshot(videoRef)" class="bg-[#00bc7d] hover:bg-green-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg">Capturer</button>
            <button type="button" @click="stopCamera" class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg">Annuler</button>
          </div>
        </div>

        <!-- Rendu du cadre une fois l'image capturÃ©e -->
        <div v-if="selectedPhoto && !useWebcam" class="relative max-h-[170px] rounded-xl overflow-hidden shadow-md">
          <img :src="selectedPhoto" alt="FaÃ§ade d'immeuble capturÃ©e" class="h-full w-full object-cover rounded-xl" />
          <button 
            type="button" 
            @click="selectedPhoto = null"
            class="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-2 shadow-md transition-colors"
            title="Effacer la photo"
          >
            <RefreshCw class="w-3 h-3 animate-spin duration-3000" />
          </button>
        </div>
      </div>

      <!-- MÃ©tadonnÃ©es de Compression RÃ©seau Intelligent -->
      <div class="bg-[#F5F2FB] border-2 border-[#155dfc]/10 rounded-2xl p-4.5 flex flex-col justify-between" id="photo-compression-insight shadow-inner">
        <div>
          <h4 class="text-xs font-black text-[#155dfc] flex items-center space-x-1">
            <CheckCircle class="w-4 h-4 text-[#00bc7d]" />
            <span>MOTEUR DE COMPRESSION INTELLIGENT</span>
          </h4>
          <p class="mt-2 text-[10px] text-[#155dfc]/70 font-semibold leading-relaxed">
            Pour assurer l'utilisation hors-ligne (zÃ©ro rÃ©seau) et un chargement rapide Ã  Douala et YaoundÃ©, notre moteur compresse d'office l'image avant l'envoi national.
          </p>
        </div>

        <!-- Indicateur de compression des mÃ©tadonnÃ©es -->
        <div v-if="selectedPhoto" class="bg-white border border-[#155dfc]/10 p-3 rounded-xl space-y-1.5 mt-3">
          <div class="flex justify-between text-[11px] font-bold text-[#155dfc]">
            <span>Nom du fichier :</span>
            <span class="truncate max-w-[120px]">{{ photoCompressedName }}</span>
          </div>
          <div class="flex justify-between text-[11px] font-bold text-[#155dfc]">
            <span>Taille d'origine :</span>
            <span class="text-rose-600 line-through">{{ originalSize }}</span>
          </div>
          <div class="flex justify-between text-[11px] font-bold text-[#00bc7d]">
            <span>Volume compressÃ© :</span>
            <span>{{ compressedSize }} (-{{ compressionRatio }}%)</span>
          </div>
        </div>
        <div v-else class="text-[10px] text-[#155dfc]/40 font-bold flex items-center space-x-1.5 mt-3">
          <ShieldAlert class="w-4 h-4 text-amber-500" />
          <span>Aucune photo capturÃ©e pour l'instant.</span>
        </div>
      </div>
    </div>
  </div>
</template>
