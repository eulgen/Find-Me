<!--
  @file app/components/modals/ShareModal.vue
  @description Boîte de dialogue présentant les options de partage et l'affichage/téléchargement du QR Code officiel.
-->

<script setup lang="ts">
import { X, Mail, CheckCircle, Download, QrCode, Share2, Copy } from 'lucide-vue-next'
import SkeletonUI from '~/components/ui/SkeletonUI.vue'
import { useShare } from '~/composables/useShare'

const {
  shareModalOpen, selectedShareCode, qrCodeDataUrl, isGeneratingQr,
  getWhatsAppShareUrl, getEmailShareUrl, copyAndClose, downloadQRCodeImage
} = useShare()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="shareModalOpen && selectedShareCode"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 text-slate-900 dark:text-white"
      id="share-overlay"
    >
      <div 
        class="bg-white dark:bg-[#0A0D1A] border border-slate-200/80 dark:border-slate-800 rounded-[32px] w-full max-w-md shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 space-y-6"
        role="dialog"
        aria-modal="true"
        aria-label="Options de partage d'adresse et QR Code"
        id="share-modal-dialog"
      >
        <!-- Bouton Fermer -->
        <button 
          @click="shareModalOpen = false"
          class="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Fermer le dialogue"
          id="share-modal-close-btn"
        >
          <X class="w-4.5 h-4.5" />
        </button>

        <!-- En-tête -->
        <div class="space-y-1">
          <span class="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-full inline-block">
            Partage Certifié
          </span>
          <h3 class="text-2xl font-black font-serif text-slate-900 dark:text-white">
            Partager votre Adresse
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Partagez votre QR Code officiel ou transmettez votre itinéraire.
          </p>
        </div>

        <!-- AFFICHAGE DU QR CODE EN DIRECT -->
        <div class="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-inner">
          <div class="relative w-44 h-44 mx-auto bg-white p-3 rounded-2xl shadow-md flex items-center justify-center">
            <img
              v-if="qrCodeDataUrl"
              :src="qrCodeDataUrl"
              alt="QR Code d'adresse"
              class="w-full h-full object-contain"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <QrCode class="w-12 h-12 animate-pulse text-emerald-600" />
              <span class="text-[10px] font-bold mt-2">Génération...</span>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Code Digital Officiel</span>
            <span class="font-mono text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-widest block uppercase">
              {{ selectedShareCode }}
            </span>
          </div>

          <!-- Bouton Télécharger l'image QR Code -->
          <button
            @click="downloadQRCodeImage"
            :disabled="!qrCodeDataUrl || isGeneratingQr"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Download class="w-4 h-4" />
            Télécharger l'image du QR Code
          </button>
        </div>

        <!-- Canaux de Partage Direct -->
        <div class="space-y-2.5">
          <!-- 1. WhatsApp Button -->
          <a 
            :href="getWhatsAppShareUrl(selectedShareCode)" 
            target="_blank" 
            rel="noopener"
            @click="shareModalOpen = false"
            class="flex items-center space-x-3.5 w-full p-3.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 rounded-2xl transition-all cursor-pointer text-left group"
            aria-label="Partager via WhatsApp"
            id="share-whatsapp-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              W
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">WhatsApp</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Envoyer le lien directement par message</p>
            </div>
          </a>

          <!-- 2. Email Button -->
          <a 
            :href="getEmailShareUrl(selectedShareCode)"
            @click="shareModalOpen = false"
            class="flex items-center space-x-3.5 w-full p-3.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 rounded-2xl transition-all cursor-pointer text-left group"
            aria-label="Partager par Email"
            id="share-email-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Email</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Envoyer les coordonnées par courriel</p>
            </div>
          </a>

          <!-- 3. Copier le Lien -->
          <button 
            @click="copyAndClose(selectedShareCode)"
            class="flex items-center space-x-3.5 w-full p-3.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 rounded-2xl transition-all cursor-pointer text-left group"
            aria-label="Copier le lien d’adresse"
            id="share-copy-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Copy class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Copier le Lien</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Copier l'URL dans le presse-papier</p>
            </div>
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
