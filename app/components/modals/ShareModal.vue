<!--
  @file ShareModal.vue
  @description Boîte de dialogue présentant les options de partage bilingues pour une adresse municipale homologuée findMe.
-->

<script setup lang="ts">
import { X, Mail, CheckCircle } from 'lucide-vue-next'
import { useLanguage } from '../../composables/useLanguage'
import { useShare } from '../../composables/useShare'

const { currentLang } = useLanguage()
const { shareModalOpen, selectedShareCode, getWhatsAppShareUrl, getEmailShareUrl, copyAndClose } = useShare()
</script>

<template>
  <div v-if="shareModalOpen && selectedShareCode" class="fixed inset-0 z-50 bg-[#1A237E]/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto block animate-in fade-in duration-200" id="share-overlay">
    <div 
      class="bg-[#FAF8FD] dark:bg-[#141627] border-4 border-[#1A237E] dark:border-[#2E7D32] rounded-[32px] w-full max-w-md shadow-[10px_10px_0px_0px_#2E7D32] dark:shadow-[10px_10px_0px_0px_#1A237E] p-6 relative animate-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
      :aria-label="currentLang === 'FR' ? 'Options de partage d\'adresse' : 'Address Share Options'"
      id="share-modal-dialog"
    >
      <button 
        @click="shareModalOpen = false"
        class="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1A237E]/5 text-[#1A237E] dark:text-gray-200 flex items-center justify-center cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
        :aria-label="currentLang === 'FR' ? 'Fermer le dialogue' : 'Close dialogue'"
        id="share-modal-close-btn"
      >
        <X class="w-4.5 h-4.5" />
      </button>

      <div class="space-y-6">
        <div class="space-y-1">
          <span class="bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20 font-black uppercase text-[9px] tracking-wider px-2.5 py-0.5 rounded-full inline-block">
            {{ currentLang === 'FR' ? 'Options de Partage' : 'Sharing Channels' }}
          </span>
          <h3 class="text-xl font-black text-[#1A237E] dark:text-white">
            {{ currentLang === 'FR' ? 'Partager votre Adresse' : 'Share your Address' }}
          </h3>
          <p class="text-xs text-[#1A237E]/75 dark:text-gray-300 font-semibold leading-relaxed">
            {{ currentLang === 'FR' ? 'Envoyez votre adresse findMe directement via vos canaux favoris.' : 'Send your findMe address directly through preferred channels.' }}
          </p>
        </div>

        <!-- Highlight of the address code -->
        <div class="bg-[#F5F2FB] dark:bg-[#1E213D] border-2 border-dashed border-[#1A237E]/20 dark:border-[#2E7D32]/30 p-4 rounded-2xl text-center space-y-1">
          <span class="text-[8.5px] font-black text-[#1A237E]/50 dark:text-gray-400 uppercase tracking-widest block font-bold leading-none mb-1">CODE UNIQUE D'ADRESSE</span>
          <span class="font-mono text-xl font-black text-[#2E7D32] dark:text-white tracking-widest block uppercase">
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
            class="flex items-center space-x-3 w-full p-4 bg-emerald-55 dark:bg-emerald-950/25 hover:bg-emerald-100/80 border-2 border-emerald-500 rounded-2xl transition-all cursor-pointer font-extrabold text-[#1A237E] dark:text-white active:scale-98"
            :aria-label="currentLang === 'FR' ? 'Partager via WhatsApp' : 'Share via WhatsApp'"
            id="share-whatsapp-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-black shrink-0">
              W
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-black text-emerald-900 dark:text-emerald-300 leading-none">WhatsApp</p>
              <p class="text-[10px] text-emerald-800/80 dark:text-emerald-400 font-normal mt-1">
                {{ currentLang === 'FR' ? 'Envoyer directement à un contact ou groupe' : 'Send to contacts or groups directly' }}
              </p>
            </div>
          </a>

          <!-- 2. Email Button -->
          <a 
            :href="getEmailShareUrl(selectedShareCode)"
            @click="shareModalOpen = false"
            class="flex items-center space-x-3 w-full p-4 bg-blue-50 dark:bg-blue-950/25 hover:bg-blue-100/80 border-2 border-blue-500 rounded-2xl transition-all cursor-pointer font-extrabold text-[#1A237E] dark:text-white active:scale-98"
            :aria-label="currentLang === 'FR' ? 'Partager par Email' : 'Share via Email'"
            id="share-email-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Mail class="w-5 h-5 flex items-center justify-center" />
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-black text-blue-900 dark:text-blue-300 leading-none">Email</p>
              <p class="text-[10px] text-blue-800/80 dark:text-blue-400 font-normal mt-1">
                {{ currentLang === 'FR' ? 'Envoyer les coordonnées par courriel' : 'Send location details via email' }}
              </p>
            </div>
          </a>

          <!-- 3. Copy Link directly -->
          <button 
            @click="copyAndClose(selectedShareCode)"
            class="flex items-center space-x-3 w-full p-4 bg-[#F5F2FB] dark:bg-[#1E213D] hover:bg-[#EDF2FA] dark:hover:bg-[#1E213D]/80 border-2 border-[#1A237E]/20 hover:border-[#1A237E]/60 dark:border-transparent dark:hover:border-white rounded-2xl transition-all cursor-pointer font-extrabold text-[#1A237E] dark:text-white active:scale-98 text-left"
            :aria-label="currentLang === 'FR' ? 'Copier le lien d’adresse' : 'Copy address link'"
            id="share-copy-btn"
          >
            <div class="w-10 h-10 rounded-xl bg-[#1A237E] text-white flex items-center justify-center shrink-0">
              <CheckCircle class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-black text-[#1A237E] dark:text-sky-300 leading-none">
                {{ currentLang === 'FR' ? 'Copier le Lien' : 'Copy Link' }}
              </p>
              <p class="text-[10px] text-[#1A237E]/70 dark:text-sky-400 font-normal mt-1">
                {{ currentLang === 'FR' ? 'Copier dans votre presse-papiers' : 'Save route link to clipboard' }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
