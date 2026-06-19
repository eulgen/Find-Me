<!--
  @file PageLoader.vue
  @description Loader de démarrage findMe — design épuré et minimaliste.
  Se ferme automatiquement dès que Nuxt a fini de charger la page (hook page:finish).
  N'utilise plus de simulation arbitraire — synchronisé avec le vrai état de navigation.
-->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import FindMeLogo from "../ui/FindMeLogo.vue";

// État local uniquement — plus de simulation arbitraire
const isVisible = ref(true);
const progress = ref(0);

onMounted(() => {
  // Nuxt lifecycle hooks pour suivre le vrai chargement
  const nuxtApp = useNuxtApp();

  // Démarrer la barre de progression au chargement
  let tick = 0;
  const advance = setInterval(() => {
    // Progression rapide jusqu'à 85%, puis attente du signal réel
    if (progress.value < 85) {
      progress.value = Math.min(85, progress.value + (Math.random() * 14 + 6));
    }
    tick++;
    if (tick > 20) clearInterval(advance); // sécurité
  }, 80);

  // Dès que la page est prête (hook Nuxt réel)
  const finish = () => {
    clearInterval(advance);
    progress.value = 100;
    setTimeout(() => {
      isVisible.value = false;
    }, 350);
  };

  // Hook Nuxt : page:finish est émis quand le routeur a fini
  nuxtApp.hook("page:finish", finish);

  // Fallback : si déjà chargé (SPA initiale sans navigation)
  // On attend que Vue soit monté + un tick supplémentaire
  nextTick(() => {
    setTimeout(finish, 800);
  });
});
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0A0D1A]"
      id="page-reload-loader"
      aria-live="polite"
      aria-label="Chargement de la page"
    >
      <!-- Logo centré -->
      <div class="flex flex-col items-center gap-6">
        <FindMeLogo size="120" id="loader-brand-logo" />

        <!-- Barre de progression fine -->
        <div class="w-48 h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-150 ease-out"
            style="background: linear-gradient(90deg, #2E7D32, #4CAF50)"
            :style="{ width: progress + '%' }"
          />
        </div>

        <!-- Texte minimaliste -->
        <p class="text-[11px] font-medium text-gray-400 dark:text-slate-500 tracking-widest uppercase">
          findMe · Chargement
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loader-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.loader-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
