<!--
  @file Hero.vue
  @description Section hero findMe Cameroun — Light Mode Premium (Glassmorphism, Clean)
  Inspiré des meilleures landing pages SaaS: animations fluides, image de fond claire.
-->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight, PlayCircle, MapPin, Users, Zap, Shield, QrCode } from "lucide-vue-next";

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
  <section class="relative w-full overflow-hidden bg-white dark:bg-[#0A0D1A]" id="app-hero" style="min-height: 100vh;">

    <!-- ── Image de Fond Cinématique (Générée) ── -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <NuxtImg src="/assets/images/hero_bg_premium.png" alt="Map Background" class="w-full h-full object-cover opacity-60 dark:opacity-40" />
      
      <!-- Overlay Gradients pour une lisibilité parfaite (Apple-like) -->
      <!-- Fade depuis la gauche pour le texte -->
      <div class="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0A0D1A] dark:via-[#0A0D1A]/80 dark:to-transparent"></div>
      <!-- Fade depuis le bas pour la transition avec la section suivante -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#0A0D1A]"></div>
      
      <!-- Glows de marque -->
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow"></div>
      <div class="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 blur-[140px] animate-pulse-slow" style="animation-delay: 2s;"></div>
    </div>

    <!-- ── Contenu Principal ── -->
    <div class="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-8" style="min-height: 100vh; padding-top: 8rem; padding-bottom: 4rem;">

      <!-- GAUCHE : Texte + CTA -->
      <div class="flex-1 space-y-8 text-center lg:text-left z-10"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">

        <!-- Badge -->
        <div class="inline-flex items-center gap-2.5 bg-white/80 border border-emerald-100 px-4 py-2 rounded-full shadow-sm backdrop-blur-md">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span class="text-[11px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
            Initiative d'adressage · Cameroun
          </span>
        </div>

        <!-- H1 -->
        <h1 class="text-[3rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5.5rem] font-black text-slate-900 leading-[1.05] tracking-tight">
          Votre adresse<br />
          <span class="relative inline-block">
            <span class="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">officielle</span>
            <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 7 Q50 3 100 6 Q150 9 198 4" stroke="#10B981" stroke-width="3" stroke-linecap="round" opacity="0.3" />
            </svg>
          </span>
          & précise.
        </h1>

        <!-- Sous-titre -->
        <p class="text-base md:text-lg text-slate-600 max-w-[540px] mx-auto lg:mx-0 leading-relaxed font-medium">
          Fini le flou des <em class="not-italic font-bold text-slate-800">« à côté de la boutique jaune »</em>.
          Obtenez un code structuré, un QR Code unique et soyez retrouvé facilement partout au Cameroun.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
          <NuxtLink to="/creer-mon-adresse"
            class="group inline-flex items-center gap-2.5 bg-slate-900 text-white font-bold text-sm px-8 py-4 rounded-[20px] shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:bg-slate-800 transition-all duration-300">
            Créer mon adresse
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
          <button @click="handleSecondaryClick"
            class="group inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm px-6 py-4 rounded-[20px] shadow-sm transition-all duration-300 ">
            <PlayCircle class="w-4 h-4 text-emerald-500 transition-colors" />
            Voir la démo
          </button>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-center lg:justify-start gap-6 pt-6">
          <div v-for="(stat, index) in stats" :key="stat.label" class="flex items-center gap-3">
            <div class="text-left">
              <p class="text-lg md:text-xl font-black text-slate-900 leading-none">{{ stat.value }}</p>
              <p class="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{{ stat.label }}</p>
            </div>
            <!-- Diviseur -->
            <div v-if="index < stats.length - 1" class="w-px h-8 bg-slate-200 hidden sm:block mx-2" />
          </div>
        </div>
      </div>

      <!-- DROITE : Flottants sur le Background avec l'Illustration Centrale -->
      <div class="flex-1 w-full max-w-2xl lg:max-w-none flex justify-center items-center relative z-10 h-full min-h-[400px]"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.2s">

        <div class="relative w-full max-w-[640px] flex items-center justify-center">
          
          <!-- Lueur concentrée pour mettre en valeur l'illustration et les badges -->
          <div class="absolute bg-emerald-500/10 dark:bg-emerald-900/20 w-80 h-80 rounded-full blur-3xl"></div>

          <!-- Illustration principale sans AUCUN fond blanc, redimensionnée et ombrée -->
          <div class="relative z-10 flex justify-center">
            <NuxtImg src="/assets/images/hero_illustration_v2-Photoroom.png" alt="Illustration findMe Cameroun" class="w-full max-w-[550px] lg:max-w-[700px] h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.35)] animate-float-slow" />
          </div>

          <!-- Badge flottant : QR Code -->
          <div class="absolute top-[5%] right-[5%] z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 dark:border-slate-700/50 animate-float-slow hidden md:block" style="animation-delay: -2s">
            <div class="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-3 border border-emerald-100 dark:border-emerald-800/50 shadow-inner">
              <QrCode class="w-7 h-7 text-emerald-500" />
            </div>
            <p class="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-widest text-center">Scanner</p>
          </div>

          <!-- Badge flottant : Code adresse -->
          <div class="absolute bottom-[10%] left-[0%] z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl px-6 py-5 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 dark:border-slate-700/50 flex items-center gap-5 animate-float hidden md:flex" style="animation-delay: -4s">
            <div class="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
              <Shield class="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Code Officiel</p>
              <p class="text-base font-black text-slate-900 dark:text-white mt-0.5">FM-YDE-BAS-28B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-16px) rotate(1deg); }
}
@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-10px) rotate(-1deg); }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}
.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}
</style>
