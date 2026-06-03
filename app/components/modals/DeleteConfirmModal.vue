<!--
  @file DeleteConfirmModal.vue
  @description Boîte de dialogue présentant la confirmation bilingue d'une suppression d'adresse homologuée findMe.
-->

<script setup lang="ts">
import { X, Trash2 } from 'lucide-vue-next'
import { useLanguage } from '../../composables/useLanguage'
import { useAddresses } from '../../composables/useAddresses'

const { currentLang } = useLanguage()
const { showDeleteConfirm, addressToDeleteIndex, addressesList, executeDeleteAddress } = useAddresses()
</script>

<template>
  <div v-if="showDeleteConfirm && addressToDeleteIndex !== null" class="fixed inset-0 z-50 bg-[#1A237E]/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto block animate-in fade-in duration-200" id="delete-confirm-overlay">
    <div 
      class="bg-[#FAF8FD] dark:bg-[#141627] border-4 border-[#D32F2F] rounded-[32px] w-full max-w-md shadow-[10px_10px_0px_0px_#D32F2F] p-6 relative animate-in zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
      :aria-label="currentLang === 'FR' ? 'Confirmer la suppression' : 'Confirm Deletion'"
      id="delete-confirm-dialog"
    >
      <button 
        @click="showDeleteConfirm = false"
        class="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1A237E]/5 text-[#1A237E] dark:text-gray-200 flex items-center justify-center cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
        :aria-label="currentLang === 'FR' ? 'Fermer le dialogue' : 'Close dialogue'"
        id="delete-confirm-close-btn"
      >
        <X class="w-4.5 h-4.5" />
      </button>

      <div class="space-y-6">
        <div class="space-y-1">
          <span class="bg-rose-100/60 dark:bg-rose-950/35 text-[#D32F2F] border border-rose-200 font-black uppercase text-[9px] tracking-wider px-2.5 py-0.5 rounded-full inline-block">
            {{ currentLang === 'FR' ? 'Action Irréversible' : 'Irreversible Action' }}
          </span>
          <h3 class="text-xl font-black text-[#1A237E] dark:text-white">
            {{ currentLang === 'FR' ? 'Supprimer l\'Adresse ?' : 'Delete Address?' }}
          </h3>
          <p class="text-sm text-[#1A237E]/75 dark:text-gray-300 font-semibold leading-relaxed">
            {{ currentLang === 'FR' ? 'Êtes-vous sûr de vouloir supprimer définitivement cette plaque d\'adressage de votre espace citoyen ?' : 'Are you sure you want to permanently delete this address plate from your citizen space?' }}
          </p>
        </div>

        <!-- Address details card inside confirmation dialog -->
        <div class="bg-rose-50/50 dark:bg-rose-950/20 border-2 border-[#D32F2F]/20 p-4 rounded-2xl space-y-1">
          <span class="text-[8.5px] font-black text-[#D32F2F]/70 uppercase tracking-widest block font-bold leading-none mb-1">
            {{ currentLang === 'FR' ? 'ADRESSE CONCERNÉE' : 'TARGET ADDRESS' }}
          </span>
          <span class="font-mono text-xs font-black text-[#1A237E] dark:text-white block tracking-wide uppercase">
            {{ addressesList[addressToDeleteIndex]?.fullName }}
          </span>
          <span class="font-mono text-sm font-black text-[#D32F2F] tracking-widest block uppercase mt-1">
            {{ addressesList[addressToDeleteIndex]?.addressCode }}
          </span>
        </div>

        <!-- Buttons layout -->
        <div class="flex items-center gap-3">
          <button 
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-[#1A237E] border-2 border-[#1A237E] font-black text-xs rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1A237E] active:translate-y-0.5 active:shadow-none"
            id="delete-cancel-btn"
          >
            {{ currentLang === 'FR' ? 'Annuler' : 'Cancel' }}
          </button>

          <button 
            @click="executeDeleteAddress"
            class="flex-1 px-4 py-3 bg-[#D32F2F] hover:bg-[#D32F2F]/95 text-white font-extrabold text-xs rounded-xl shadow-[2px_2px_0px_0px_#1A237E] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all flex items-center justify-center space-x-1.5"
            id="delete-execute-btn"
          >
            <Trash2 class="w-4 h-4 shrink-0 text-white" />
            <span>{{ currentLang === 'FR' ? 'Supprimer' : 'Delete Now' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
