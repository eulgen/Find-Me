<!--
  @file PageLoader.vue
  @description Composant d'attente bilingue affichant la progression de la synchronisation de départ.
-->

<script setup lang="ts">
import { useLanguage } from '../../composables/useLanguage'
import { useNavigation } from '../../composables/useNavigation'

const { currentLang } = useLanguage()
const { isPageLoading, pageLoadingProgress } = useNavigation()
</script>

<template>
  <div v-if="isPageLoading" class="fixed inset-0 z-50 bg-[#FBF9FE] dark:bg-[#0D0F1A] flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-300" id="page-reload-loader">
    <div class="relative flex flex-col items-center animate-bounce duration-1000">
      <!-- The brand logo -->
      <FindMeLogo size="200" id="loader-brand-logo" />
      
      <!-- Pulsing circular badge -->
      <div class="absolute top-2 left-10 w-4 h-4 bg-[#2E7D32] rounded-full animate-ping" />
    </div>

    <div class="text-center space-y-3 w-full max-w-xs">
      <span class="font-mono text-sm tracking-widest font-black text-[#1A237E]/70 dark:text-sky-300 block mt-2">
        {{ pageLoadingProgress }}%
      </span>

      <!-- Progress loading bar -->
      <div class="w-full h-2 bg-[#1A237E]/10 dark:bg-slate-800 rounded-full overflow-hidden border border-[#1A237E]/5">
        <div 
          class="h-full bg-gradient-to-r from-[#2E7D32] via-[#4CAF50] to-[#1A237E] rounded-full transition-all duration-150 ease-out"
          :style="{ width: pageLoadingProgress + '%' }"
        />
      </div>
      
      <p class="text-[10px] uppercase font-black tracking-widest text-[#1A237E]/50 dark:text-slate-400 animate-pulse">
        {{ currentLang === 'FR' 
          ? "Chargement des plaques d'adressage..." 
          : "Loading municipal geolocation plaques..." }}
      </p>
    </div>
  </div>
</template>
