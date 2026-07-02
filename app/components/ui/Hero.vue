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
  <section class="relative w-full overflow-hidden bg-white" id="app-hero" style="min-height: 100vh;">

    <!-- ── Fond Image + Dégradé ── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Background image générée -->
      <NuxtImg 
        src="/assets/images/hero_bg_light.png" 
        alt="Background abstrait" 
        class="w-full h-full object-cover opacity-60"
        loading="eager"
      />
      <!-- Gradient principal très doux pour assurer la lisibilité -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white" />
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

      <!-- DROITE : Visual Hero (Nouvelle Illustration) -->
      <div class="flex-1 w-full max-w-2xl lg:max-w-none flex justify-center items-center relative z-10"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.2s">

        <div class="relative w-full max-w-[640px]">
          <!-- Cercle décoratif derrière l'image -->
          <div class="absolute inset-0 bg-emerald-50/80 rounded-full blur-3xl scale-90" />

          <!-- Illustration principale -->
          <div class="relative z-10">
            <NuxtImg
              src="/assets/images/hero_illustration_v2.png"
              alt="findMe Cameroun — Application d'adressage premium"
              class="w-full h-auto object-contain animate-float"
              id="hero-illustration"
            />
          </div>

          <!-- Badge flottant : QR Code -->
          <div class="absolute -top-4 -right-2 z-30 bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white animate-float-slow hidden md:block">
            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-2">
              <QrCode class="w-6 h-6 text-emerald-500" />
            </div>
            <p class="text-[10px] font-black uppercase text-slate-900 tracking-widest text-center">Scanner</p>
          </div>

          <!-- Badge flottant : Code adresse -->
          <div class="absolute -bottom-6 -left-4 z-30 bg-white/90 backdrop-blur-md px-5 py-4 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white flex items-center gap-4 animate-float hidden md:flex" style="animation-delay: -3s">
            <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <Shield class="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Code Officiel</p>
              <p class="text-sm font-black text-slate-900 mt-0.5">FM-YDE-BAS-28B</p>
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
