<!--
  @file AddressDetailsModal.vue
  @description Boîte de dialogue présentant les spécifications géodésiques d'un certificat d'adressage homologuétique.
-->

<script setup lang="ts">
import { X, Share2, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  addr: any
  index: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'download', addr: any): void
  (e: 'pdf', addr: any): void
  (e: 'share', code: string): void
  (e: 'delete', index: number): void
}>()
</script>

<template>
  <div v-if="isOpen && addr" class="fixed inset-0 z-50 bg-[#155dfc]/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto block animate-in fade-in duration-200" id="address-details-overlay">
    <div 
      class="bg-[#FAF8FD] dark:bg-[#141627] border-4 border-[#155dfc] rounded-[32px] w-full max-w-2xl shadow-[10px_10px_0px_0px_#155dfc] p-6 relative animate-in zoom-in-95 duration-200 space-y-6"
      role="dialog"
      aria-modal="true"
      aria-label="Détails de la plaque d'adressage"
    >
      <!-- Fermeture -->
      <button 
        @click="emit('close')" 
        class="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#155dfc]/5 text-[#155dfc] dark:text-gray-200 flex items-center justify-center cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
        aria-label="Fermer les détails"
      >
        <X class="w-4.5 h-4.5" />
      </button>

      <!-- En-tête -->
      <div class="space-y-1">
        <span class="bg-[#00bc7d]/10 text-[#00bc7d] border border-[#00bc7d]/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-full inline-block">
          PLAQUE D'ADRESSAGE DÉTAILLÉE
        </span>
        <h3 class="text-2xl font-black text-[#155dfc] dark:text-[#0f172b] leading-tight">
          {{ addr.fullName }}
        </h3>
        <p class="text-xs font-bold text-[#155dfc]/65 dark:text-gray-400">
          Visualisation certifiée conforme aux normes cadastrales de la République du Cameroun.
        </p>
      </div>

      <!-- Meta Grid layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Column A: Plate and Code Info -->
        <div class="space-y-4">
          <!-- Plate Replica Visual -->
          <div class="bg-[#155dfc] text-white p-5 rounded-2xl border-4 border-[#00bc7d] shadow-md relative text-center space-y-3 overflow-hidden">
            <div class="absolute top-0 right-0 bg-[#00bc7d] text-white font-mono text-[8px] px-3 py-1 rounded-bl-xl font-bold uppercase tracking-widest leading-none">
              CAMEROUN
            </div>
            <div class="text-[9px] uppercase font-black text-emerald-300 tracking-widest leading-none">
              PLAQUE OFFICIELLE
            </div>
            
            <div class="space-y-1 my-3">
              <span class="text-2xl font-black block tracking-tight leading-none text-white">N° {{ addr.housePlateNumber || '28B' }}</span>
              <span class="text-[10px] font-bold text-white/85 block leading-tight">{{ addr.streetName || 'Rue de l\'Espace' }}</span>
              <span class="text-[10px] font-bold text-white/70 block leading-tight">{{ addr.neighborhood }}, {{ addr.arrondissement || 'Yaoundé I' }}</span>
            </div>

            <!-- Big Code Box inside the Plate -->
            <div class="bg-white/10 border border-white/20 px-3 py-2.5 rounded-xl">
              <span class="text-[8px] text-emerald-300 font-extrabold uppercase tracking-widest block mb-0.5">CODE DE LIGNE RECTILIGNE</span>
              <span class="font-mono text-lg font-black text-white block tracking-widest uppercase">
                {{ addr.addressCode }}
              </span>
            </div>
          </div>

          <!-- Satellite Parameters -->
          <div class="bg-white dark:bg-white border-2 border-[#155dfc]/10 p-4 rounded-2xl space-y-2">
            <span class="text-[9px] font-black uppercase text-[#155dfc]/60 dark:text-gray-400 block tracking-widest">COORDONNÉES PAR SECONDE SATELLITE</span>
            <div class="grid grid-cols-2 gap-2 text-center flex-wrap">
              <div class="bg-[#155dfc]/5 dark:bg-slate-50 p-2 rounded-xl">
                <span class="text-[7.5px] uppercase font-bold text-[#155dfc]/50 dark:text-gray-400 block">Latitude</span>
                <span class="text-xs font-mono font-black text-[#155dfc] dark:text-[#0f172b]">{{ addr.coordinates?.lat }}° N</span>
              </div>
              <div class="bg-[#155dfc]/5 dark:bg-slate-50 p-2 rounded-xl">
                <span class="text-[7.5px] uppercase font-bold text-[#155dfc]/50 dark:text-gray-400 block">Longitude</span>
                <span class="text-xs font-mono font-black text-[#155dfc] dark:text-[#0f172b]">{{ addr.coordinates?.lng }}° E</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Column B: Full Address Data and Photo -->
        <div class="space-y-4">
          <!-- Full details sheet -->
          <div class="bg-white dark:bg-white border-2 border-[#155dfc]/15 p-4.5 rounded-2xl space-y-3.5 text-xs font-semibold text-[#155dfc] dark:text-gray-300">
            <div class="grid grid-cols-3 border-b border-gray-100 dark:border-slate-200 pb-2">
              <span class="text-gray-400 uppercase text-[9px] font-black col-span-1">Ville</span>
              <span class="col-span-2 font-black text-[#155dfc] dark:text-[#0f172b]">{{ addr.city }}</span>
            </div>
            <div class="grid grid-cols-3 border-b border-gray-100 dark:border-slate-200 pb-2">
              <span class="text-gray-400 uppercase text-[9px] font-black col-span-1">Arrondissement</span>
              <span class="col-span-2 font-black text-[#155dfc] dark:text-[#0f172b]">{{ addr.arrondissement || 'Yaoundé II' }}</span>
            </div>
            <div class="grid grid-cols-3 border-b border-gray-100 dark:border-slate-200 pb-2">
              <span class="text-gray-400 uppercase text-[9px] font-black col-span-1">Quartier</span>
              <span class="col-span-2 font-black text-[#155dfc] dark:text-[#0f172b]">{{ addr.neighborhood }}</span>
            </div>
            <div v-if="addr.streetName" class="grid grid-cols-3 border-b border-gray-100 dark:border-slate-200 pb-2">
              <span class="text-gray-400 uppercase text-[9px] font-black col-span-1">Rue</span>
              <span class="col-span-2 font-black text-[#155dfc] dark:text-[#0f172b]">{{ addr.streetName }}</span>
            </div>
            <div v-if="addr.landmark" class="grid grid-cols-3 border-b border-gray-100 dark:border-slate-200 pb-2">
              <span class="text-gray-400 uppercase text-[9px] font-black col-span-1">Repère Visuel</span>
              <span class="col-span-2 font-black text-[#155dfc] dark:text-[#0f172b]">{{ addr.landmark }}</span>
            </div>
            <div class="grid grid-cols-3">
              <span class="text-gray-400 uppercase text-[9px] font-black col-span-1">Téléphone</span>
              <span class="col-span-2 font-mono font-bold text-[#155dfc] dark:text-[#0f172b]">{{ addr.phone }}</span>
            </div>
          </div>

          <!-- Micro preview image -->
          <div class="border-2 border-[#155dfc]/10 rounded-2xl overflow-hidden h-28 bg-[#F5F2FB] relative">
            <img 
              v-if="addr.photoRaw" 
              :src="addr.photoRaw" 
              alt="Frontage preview"
              class="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-center text-[#155dfc]/40" id="det-no-photo">
              <span class="text-[9px] uppercase font-black tracking-widest text-[#155dfc]/65">Pas d'image personnalisée</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer Control Row -->
      <div class="border-t-2 border-[#155dfc]/10 pt-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div class="flex items-center gap-2 flex-wrap">
          <!-- PDF Export Button -->
          <button 
            @click="emit('pdf', addr)"
            class="px-5 py-3 bg-[#E0E2FD] hover:bg-[#C5CAE9] text-[#155dfc] font-black text-xs rounded-xl border-2 border-[#155dfc] shadow-[3px_3px_0px_0px_#155dfc] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all flex items-center space-x-1.5"
            aria-label="Exporter le certificat d'adressage au format PDF"
          >
            <span>📄</span>
            <span>Exporter en PDF</span>
          </button>

          <!-- Download Button -->
          <button 
            @click="emit('download', addr)"
            class="px-5 py-3 bg-[#00bc7d] hover:bg-[#00bc7d]/95 text-white font-extrabold text-xs rounded-xl shadow-[3px_3px_0px_0px_#155dfc] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all flex items-center space-x-1.5"
          >
            <span>💾</span>
            <span>Télécharger la Plaque (SVG)</span>
          </button>

          <!-- Share Button -->
          <button 
            @click="emit('share', addr.addressCode)"
            class="px-4 py-3 bg-[#155dfc] hover:bg-[#155dfc]/95 text-white font-extrabold text-xs rounded-xl shadow-[3px_3px_0px_0px_#00bc7d] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all flex items-center space-x-1.5"
          >
            <Share2 class="w-4 h-4 text-white" />
            <span>Partager</span>
          </button>
        </div>

        <!-- Delete direct button -->
        <button 
          v-if="index !== null"
          @click="emit('delete', index)"
          class="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-[#D32F2F] border-2 border-[#D32F2F] font-extrabold text-xs rounded-xl shadow-[3px_3px_0px_0px_#D32F2F] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all flex items-center space-x-1.5"
        >
          <Trash2 class="w-4 h-4 text-[#D32F2F]" />
          <span>Supprimer l'Adresse</span>
        </button>
      </div>

    </div>
  </div>
</template>
