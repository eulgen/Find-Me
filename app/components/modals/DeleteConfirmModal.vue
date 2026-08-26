<!--
  @file app/components/modals/DeleteConfirmModal.vue
  @description Boîte de dialogue de confirmation de suppression d'adresse (Glassmorphism ton uni émeraude & bleu nuit).
-->

<script setup lang="ts">
import { X, Trash2 } from 'lucide-vue-next'
import { useAddresses } from '~/composables/useAddresses'

const { showDeleteConfirm, addressToDeleteIndex, addressesList, executeDeleteAddress } = useAddresses()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="showDeleteConfirm && addressToDeleteIndex !== null"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 text-slate-900 dark:text-white"
      id="delete-confirm-overlay"
    >
      <div 
        class="bg-white dark:bg-[#0A0D1A] border border-slate-200/80 dark:border-slate-800 rounded-[32px] w-full max-w-md shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 space-y-6"
        role="dialog"
        aria-modal="true"
        aria-label="Confirmer la suppression"
        id="delete-confirm-dialog"
      >
        <button 
          @click="showDeleteConfirm = false"
          class="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Fermer le dialogue"
          id="delete-confirm-close-btn"
        >
          <X class="w-4.5 h-4.5" />
        </button>

        <div class="space-y-2">
          <span class="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-full inline-block">
            Action Irréversible
          </span>
          <h3 class="text-2xl font-black font-serif text-slate-900 dark:text-white">
            Supprimer cette adresse ?
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Êtes-vous sûr de vouloir supprimer définitivement cette plaque d'adressage de votre espace citoyen ?
          </p>
        </div>

        <!-- Détails de l'adresse concernée -->
        <div class="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-1">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
            Adresse Sélectionnée
          </span>
          <p class="font-bold text-sm text-slate-900 dark:text-white">
            {{ addressesList[addressToDeleteIndex]?.neighborhood }}, {{ addressesList[addressToDeleteIndex]?.city }}
          </p>
          <span class="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-wider block uppercase">
            {{ addressesList[addressToDeleteIndex]?.addressCode }}
          </span>
        </div>

        <!-- Boutons d'action -->
        <div class="flex items-center gap-3 pt-2">
          <button 
            @click="showDeleteConfirm = false"
            class="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-full transition-all cursor-pointer"
            id="delete-cancel-btn"
          >
            Annuler
          </button>

          <button 
            @click="executeDeleteAddress"
            class="flex-1 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            id="delete-execute-btn"
          >
            <Trash2 class="w-4 h-4 shrink-0" />
            <span>Supprimer</span>
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
