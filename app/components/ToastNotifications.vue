<!--
  @file ToastNotifications.vue
  @description Composant d'affichage des bulles de notifications (toasts) bilingues.
-->

<script setup lang="ts">
import { X, CheckCircle, Mail, Bell } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'
import { useToasts } from '../composables/useToasts'

const { currentLang } = useLanguage()
const { toasts } = useToasts()
</script>

<template>
  <div class="fixed bottom-6 right-6 z-55 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none px-4 sm:px-0" id="toast-notifications-container">
    <div 
      v-for="t in toasts"
      :key="t.id" 
      class="pointer-events-auto flex items-start space-x-3.5 p-4 rounded-2xl border-2 shadow-lg transition-all duration-300 animate-in slide-in-from-right-8 duration-200"
      :class="t.type === 'success' ? 'bg-emerald-50 border-[#2E7D32] text-emerald-950' : t.type === 'mail' ? 'bg-sky-50 border-[#1A237E] text-[#1A237E]' : 'bg-indigo-50 border-indigo-200 text-indigo-900'"
      :id="`toast-item-${t.id}`"
    >
      <CheckCircle v-if="t.type === 'success'" class="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
      <Mail v-else-if="t.type === 'mail'" class="w-5 h-5 text-[#1A237E] shrink-0 mt-0.5" />
      <Bell v-else class="w-5 h-5 text-[#1A237E] shrink-0 mt-0.5" />
      
      <div class="space-y-1">
        <span class="text-[9px] font-black uppercase tracking-wider opacity-70 block">
          {{ t.type === 'success' 
            ? (currentLang === 'FR' ? 'NOTIFICATION CITOYEN' : 'CITIZEN NOTIFICATION') 
            : t.type === 'mail' 
              ? (currentLang === 'FR' ? "SYSTÈME D'ENVOI MAILING" : 'OUTBOX MAILING DISPATCH') 
              : (currentLang === 'FR' ? 'INFO SYSTEME' : 'SYSTEM INFO') }}
        </span>
        <p class="text-xs font-bold leading-relaxed">{{ t.message }}</p>
      </div>
      
      <button 
        @click="toasts = toasts.filter(x => x.id !== t.id)"
        class="text-[#1A237E]/40 hover:text-[#1A237E] transition-colors self-start cursor-pointer p-0.5"
        aria-label="Fermer"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
