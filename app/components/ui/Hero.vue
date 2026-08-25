<!--
  @file Hero.vue
  @description Section Hero — Inspirée du layout Gainlove (Image 1) avec illustrations vectorielles d'individus noirs (Images 2 & 3).
  En-tête éditorial haute conversion, silhouette de carte du Cameroun/Afrique et badges de preuve sociale.
-->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight, PlayCircle, MapPin, Users, Zap, Shield, QrCode, CheckCircle2 } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "scroll-to-step", stepId: string): void;
  (e: "create-address-click"): void;
}>();

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => { isVisible.value = true; }, 100);
});

const handleSecondaryClick = () => {
  emit("scroll-to-step", "comment-ca-marche");
};

const stats = [
  { value: "+500",    label: "Foyers inscrits", icon: Users },
  { value: "2 villes", label: "Couvertes",      icon: MapPin },
  { value: "<3 min",  label: "Génération",      icon: Zap },
];
</script>

<template>
  <section class="relative w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#0A0D1A]" id="app-hero" style="min-height: 100vh;">

    <!-- Arrière-plan Carte en Filigrane -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-[5%] right-[-5%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] opacity-10 dark:opacity-5 pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-[#FAF8F5]/90 to-[#FAF8F5] dark:from-[#0A0D1A]/90 dark:via-[#0A0D1A]/95 dark:to-[#0A0D1A]"></div>
    </div>

    <!-- Contenu Principal (Layout Gainlove Image 1) -->
    <div class="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-14" style="min-height: 100vh; padding-top: 7.5rem; padding-bottom: 4rem;">

      <!-- GAUCHE : Titre Éditorial Haute Conversion -->
      <div class="flex-1 space-y-8 text-center lg:text-left z-10"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">

        <!-- Badge haut de page -->
        <div class="inline-flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-full shadow-xs">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span class="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
            Adressage Officiel · Cameroun
          </span>
        </div>

        <!-- Titre Style Éditorial (Gainlove) -->
        <h1 class="text-[2.8rem] sm:text-[3.8rem] lg:text-[4.4rem] xl:text-[5.4rem] font-black text-slate-900 dark:text-white leading-[1.04] tracking-tight font-serif">
          Votre adresse <br />
          <span class="relative inline-block not-italic font-sans text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
            officielle & précise
          </span>
          commence ici.
        </h1>

        <!-- Sous-titre -->
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-[540px] mx-auto lg:mx-0 leading-relaxed font-medium">
          Finis les repères vagues. Générez votre code structuré, obtenez votre plaque QR Code certifiée par la mairie et facilitez toutes vos livraisons.
        </p>

        <!-- Boutons d'Action CTA -->
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
          <NuxtLink to="/creer-mon-adresse"
            class="group inline-flex items-center justify-center gap-3 bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 text-white font-black text-sm px-9 py-4.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all duration-300 w-full sm:w-auto">
            <span>Créer mon adresse</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>

          <button @click="handleSecondaryClick"
            class="group inline-flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold text-sm px-7 py-4.5 rounded-full shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto">
            <PlayCircle class="w-5 h-5 text-emerald-500 transition-transform group-hover:scale-110" />
            Voir la démo
          </button>
        </div>

        <!-- Statistiques Footer Hero -->
        <div class="flex items-center justify-center lg:justify-start gap-6 sm:gap-10 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div v-for="(stat, index) in stats" :key="stat.label" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-none">{{ stat.value }}</p>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{{ stat.label }}</p>
            </div>
            <div v-if="index < stats.length - 1" class="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block ml-4" />
          </div>
        </div>
      </div>

      <!-- DROITE : Layout Silhouette Carte Gainlove + Illustration d'individu Noir (Image 2/3) -->
      <div class="flex-1 w-full max-w-2xl lg:max-w-none flex justify-center items-center relative z-10 h-full min-h-[440px]"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.2s">

        <div class="relative w-full max-w-[580px] flex items-center justify-center">
          
          <!-- Silhouette de carte découpée (Gainlove style) -->
          <div class="relative w-full aspect-square max-w-[480px] bg-gradient-to-br from-emerald-100/70 via-teal-50/50 to-orange-50/50 dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-slate-900 p-6 rounded-[3.5rem] border-2 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
            
            <!-- Fond illustration d'individu noir -->
            <img src="/assets/images/black_man_address.png" alt="Illustration Citoyen Camerounais" class="w-full h-full object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-700" />
            
            <!-- Décorations de la silhouette -->
            <div class="absolute top-4 left-4 w-12 h-12 bg-white/90 dark:bg-slate-900/90 rounded-2xl flex items-center justify-center shadow-md">
              <QrCode class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <!-- Badge Flottant Inférieur : Code Adresse -->
          <div class="absolute bottom-2 right-[-2%] z-30 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 animate-float hidden sm:flex">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
              <Shield class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="text-left">
              <span class="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">Certifié Mairie</span>
              <p class="text-sm font-black text-slate-900 dark:text-white">FM-YDE-BAS-28B</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
