<!--
  @file AddressDetailsModal.vue
  @description Boîte de dialogue présentant les spécifications géodésiques d'un certificat d'adressage — design ton émeraude uni.
-->

<script setup lang="ts">
import { X, Share2, Trash2, Download, FileText } from 'lucide-vue-next'

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
  <div v-if="isOpen && addr" class="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto block animate-in fade-in duration-200" id="address-details-overlay">
    <div 
      class="bg-white dark:bg-[#0A0D1A] border border-slate-200/80 dark:border-slate-800 rounded-[32px] w-full max-w-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 space-y-6 text-slate-900 dark:text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Détails de la plaque d'adressage"
    >
      <!-- Fermeture -->
      <button 
        @click="emit('close')" 
        class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        aria-label="Fermer les détails"
      >
        <X class="w-4.5 h-4.5" />
      </button>

      <!-- En-tête -->
      <div class="space-y-1">
        <span class="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-full inline-block">
          PLAQUE D'ADRESSAGE DÉTAILLÉE
        </span>
        <h3 class="text-2xl font-black font-serif text-slate-900 dark:text-white leading-tight">
          {{ addr.fullName }}
        </h3>
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          Visualisation certifiée conforme aux normes cadastrales de la République du Cameroun.
        </p>
      </div>

      <!-- Meta Grid layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Column A: Plate and Code Info -->
        <div class="space-y-4">
          <!-- Plate Replica Visual -->
          <div class="bg-emerald-600 text-white p-5 rounded-2xl border-2 border-emerald-400 shadow-md relative text-center space-y-3 overflow-hidden">
            <div class="absolute top-0 right-0 bg-emerald-700 text-white font-mono text-[8px] px-3 py-1 rounded-bl-xl font-bold uppercase tracking-widest leading-none">
              CAMEROUN
            </div>
            <div class="text-[9px] uppercase font-black text-emerald-100 tracking-widest leading-none">
              PLAQUE OFFICIELLE
            </div>
            
            <div class="space-y-1 my-3">
              <span class="text-2xl font-black block tracking-tight leading-none text-white">N° {{ addr.housePlateNumber || '28B' }}</span>
              <span class="text-[10px] font-bold text-white/90 block leading-tight">{{ addr.streetName || 'Rue de l\'Espace' }}</span>
              <span class="text-[10px] font-bold text-white/80 block leading-tight">{{ addr.neighborhood }}, {{ addr.arrondissement || 'Yaoundé I' }}</span>
            </div>

            <!-- Big Code Box inside the Plate -->
            <div class="bg-white/10 border border-white/20 px-3 py-2.5 rounded-xl">
              <span class="text-[8px] text-emerald-200 font-extrabold uppercase tracking-widest block mb-0.5">CODE DIGITAL CERTIFIÉ</span>
              <span class="font-mono text-lg font-black text-white block tracking-widest uppercase">
                {{ addr.addressCode }}
              </span>
            </div>
          </div>

          <!-- Satellite Parameters -->
          <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-2">
            <span class="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 block tracking-widest">COORDONNÉES GPS SATELLITE</span>
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700">
                <span class="text-[8px] uppercase font-bold text-slate-400 block">Latitude</span>
                <span class="text-xs font-mono font-black text-slate-900 dark:text-white">{{ addr.coordinates?.lat }}° N</span>
              </div>
              <div class="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700">
                <span class="text-[8px] uppercase font-bold text-slate-400 block">Longitude</span>
                <span class="text-xs font-mono font-black text-slate-900 dark:text-white">{{ addr.coordinates?.lng }}° E</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Column B: Full Address Data and Photo -->
        <div class="space-y-4">
          <!-- Full details sheet -->
          <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4.5 rounded-2xl space-y-3 text-xs font-semibold text-slate-900 dark:text-white">
            <div class="grid grid-cols-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span class="text-slate-500 dark:text-slate-400 uppercase text-[9px] font-black col-span-1">Ville</span>
              <span class="col-span-2 font-black text-slate-900 dark:text-white">{{ addr.city }}</span>
            </div>
            <div class="grid grid-cols-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span class="text-slate-500 dark:text-slate-400 uppercase text-[9px] font-black col-span-1">Arrondissement</span>
              <span class="col-span-2 font-black text-slate-900 dark:text-white">{{ addr.arrondissement || 'Yaoundé II' }}</span>
            </div>
            <div class="grid grid-cols-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span class="text-slate-500 dark:text-slate-400 uppercase text-[9px] font-black col-span-1">Quartier</span>
              <span class="col-span-2 font-black text-slate-900 dark:text-white">{{ addr.neighborhood }}</span>
            </div>
            <div v-if="addr.streetName" class="grid grid-cols-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span class="text-slate-500 dark:text-slate-400 uppercase text-[9px] font-black col-span-1">Rue</span>
              <span class="col-span-2 font-black text-slate-900 dark:text-white">{{ addr.streetName }}</span>
            </div>
            <div v-if="addr.landmark" class="grid grid-cols-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span class="text-slate-500 dark:text-slate-400 uppercase text-[9px] font-black col-span-1">Repère Visuel</span>
              <span class="col-span-2 font-black text-slate-900 dark:text-white">{{ addr.landmark }}</span>
            </div>
            <div class="grid grid-cols-3">
              <span class="text-slate-500 dark:text-slate-400 uppercase text-[9px] font-black col-span-1">Téléphone</span>
              <span class="col-span-2 font-mono font-bold text-slate-900 dark:text-white">{{ addr.phone }}</span>
            </div>
          </div>

          <!-- Micro preview image -->
          <div class="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden h-28 bg-slate-100 dark:bg-slate-900 relative">
            <img 
              v-if="addr.photoRaw" 
              :src="addr.photoRaw" 
              alt="Frontage preview"
              class="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-center text-slate-400">
              <span class="text-[9px] uppercase font-black tracking-widest">Pas d'image personnalisée</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer Control Row -->
      <div class="border-t border-slate-200/60 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div class="flex items-center gap-2 flex-wrap">
          <!-- PDF Export Button -->
          <button 
            @click="emit('pdf', addr)"
            class="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 cursor-pointer transition-all flex items-center gap-1.5"
            aria-label="Exporter le certificat d'adressage au format PDF"
          >
            <FileText class="w-4 h-4 text-emerald-400" />
            <span>Exporter en PDF</span>
          </button>

          <!-- Share Button -->
          <button 
            @click="emit('share', addr.addressCode)"
            class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Share2 class="w-4 h-4 text-white" />
            <span>Partager</span>
          </button>
        </div>

        <!-- Delete direct button -->
        <button 
          v-if="index !== null"
          @click="emit('delete', index)"
          class="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
        >
          <Trash2 class="w-4 h-4" />
          <span>Supprimer</span>
        </button>
      </div>

    </div>
  </div>
</template>
