<!--
  @file ShareModal.vue
  @description Boîte de dialogue présentant les options de partage pour une adresse municipale homologuée findMe.
-->

<script setup lang="ts">
import { X, Mail, CheckCircle } from 'lucide-vue-next'
import { useShare } from '../../composables/useShare'

const { shareModalOpen, selectedShareCode, getWhatsAppShareUrl, getEmailShareUrl, copyAndClose } = useShare()
</script>

<template>
  <div v-if="shareModalOpen && selectedShareCode" class="fixed inset-0 z-50 bg-[#155dfc]/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto block animate-in fade-in duration-200" id="share-overlay">
    <div 
      class="bg-[#FAF8FD] dark:bg-[#141627] border-4 border-[#155dfc] dark:border-[#00bc7d] rounded-[32px] w-full max-w-md shadow-[10px_10px_0px_0px_#00bc7d] dark:shadow-[10px_10px_0px_0px_#155dfc] p-6 relative animate-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Options de partage d'adresse"
      id="share-modal-dialog"
    >
      <button 
        @click="shareModalOpen = false"
        class="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#155dfc]/5 text-[#155dfc] dark:text-gray-200 flex items-center justify-center cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
        aria-label="Fermer le dialogue"
        id="share-modal-close-btn"
      >
        <X class="w-4.5 h-4.5" />
      </button>

      <div class="space-y-6">
        <div class="space-y-1">
          <span class="bg-[#00bc7d]/10 text-[#00bc7d] border border-[#00bc7d]/20 font-black uppercase text-[9px] tracking-wider px-2.5 py-0.5 rounded-full inline-block">
            Options de Partage
          </span>
          <h3 class="text-xl font-black text-[#155dfc] dark:text-[#0f172b]">
            Partager votre Adresse
          </h3>
          <p class="text-xs text-[#155dfc]/75 dark:text-gray-300 font-semibold leading-relaxed">
            Envoyez votre adresse findMe directement via vos canaux favoris.
          </p>
        </div>

        <!-- Highlight of the address code -->
        <div class="bg-[#F5F2FB] dark:bg-[#1E213D] border-2 border-dashed border-[#155dfc]/20 dark:border-[#00bc7d]/30 p-4 rounded-2xl text-center space-y-1">
          <span class="text-[8.5px] font-black text-[#155dfc]/50 dark:text-gray-400 uppercase tracking-widest block font-bold leading-none mb-1">CODE UNIQUE D'ADRESSE</span>
          <span class="font-mono text-xl font-black text-[#00bc7d] dark:text-[#0f172b] tracking-widest block uppercase">
            {{ selectedShareCode }}
          </span>
        </div>

        <!-- Channel List buttons -->
        <div class="space-y-3">
          <!-- 1. WhatsApp Button -->
          <a 
            :href="getWhatsAppShareUrl(selectedShareCode)" 
            target="_blank" 
            rel="noopener"
            @click="shareModalOpen = false"
            class="flex items-center space-x-3 w-full p-4 bg-emerald-55 dark:bg-emerald-950/25 hover:bg-emerald-100/80 border-2 border-emerald-500 rounded-2xl transition-all cursor-pointer font-extrabold text-[#155dfc] dark:text-[#0f172b] text-left"
            aria-label="Partager via WhatsApp"
            id="share-whatsapp-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-black shrink-0">
              W
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-black text-emerald-900 dark:text-slate-700 leading-none">WhatsApp</p>
              <p class="text-[10px] text-emerald-800/80 dark:text-[#0f172b] font-normal mt-1">
                Envoyer directement à un contact ou groupe
              </p>
            </div>
          </a>

          <!-- 2. Email Button -->
          <a 
            :href="getEmailShareUrl(selectedShareCode)"
            @click="shareModalOpen = false"
            class="flex items-center space-x-3 w-full p-4 bg-blue-50 dark:bg-blue-950/25 hover:bg-blue-100/80 border-2 border-blue-500 rounded-2xl transition-all cursor-pointer font-extrabold text-[#155dfc] dark:text-[#0f172b] text-left"
            aria-label="Partager par Email"
            id="share-email-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Mail class="w-5 h-5 flex items-center justify-center" />
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-black text-blue-900 dark:text-blue-300 leading-none">Email</p>
              <p class="text-[10px] text-blue-800/80 dark:text-blue-400 font-normal mt-1">
                Envoyer les coordonnées par courriel
              </p>
            </div>
          </a>

          <!-- 3. Copy Link directly -->
          <button 
            @click="copyAndClose(selectedShareCode)"
            class="flex items-center space-x-3 w-full p-4 bg-[#F5F2FB] dark:bg-[#1E213D] hover:bg-[#EDF2FA] dark:hover:bg-[#1E213D]/80 border-2 border-[#155dfc]/20 hover:border-[#155dfc]/60 dark:border-transparent dark:hover:border-white rounded-2xl transition-all cursor-pointer font-extrabold text-[#155dfc] dark:text-[#0f172b] text-left"
            aria-label="Copier le lien d’adresse"
            id="share-copy-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-[#155dfc] text-white flex items-center justify-center shrink-0">
              <CheckCircle class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-black text-[#155dfc] dark:text-sky-300 leading-none">
                Copier le Lien
              </p>
              <p class="text-[10px] text-[#155dfc]/70 dark:text-sky-400 font-normal mt-1">
                Copier dans votre presse-papiers
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
