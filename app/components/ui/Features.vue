<!--
  @file Features.vue
  @description Grille d'avantages Bento — Light Mode Premium
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Share2, MapPin, QrCode, Home, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-vue-next';

const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  const el = document.getElementById('features-highlights');
  if (el) observer.observe(el);
});

// Avantages pour la grille bento
const features = [
  {
    title: "Précision GPS",
    desc: "Coordonnées exactes au mètre près, idéales pour les livraisons et urgences.",
    icon: MapPin,
    colSpan: "col-span-1 md:col-span-2",
    bgColor: "bg-emerald-50/50",
    iconColor: "text-emerald-500",
    iconBg: "bg-white",
  },
  {
    title: "Code QR Unique",
    desc: "Affichez-le sur votre porte ou partagez-le en un clic.",
    icon: QrCode,
    colSpan: "col-span-1 md:col-span-1",
    bgColor: "bg-indigo-50/50",
    iconColor: "text-indigo-500",
    iconBg: "bg-white",
  },
  {
    title: "100% Officiel",
    desc: "Certifié par les mairies locales (Douala, Yaoundé).",
    icon: ShieldCheck,
    colSpan: "col-span-1 md:col-span-1",
    bgColor: "bg-amber-50/50",
    iconColor: "text-amber-500",
    iconBg: "bg-white",
  },
  {
    title: "Partage Facile",
    desc: "Envoyez votre adresse sur WhatsApp, SMS ou réseaux sociaux instantanément.",
    icon: Share2,
    colSpan: "col-span-1 md:col-span-2",
    bgColor: "bg-blue-50/50",
    iconColor: "text-blue-500",
    iconBg: "bg-white",
  }
];

const impacts = [
  "Urgences médicales rapides",
  "Livraison e-commerce à domicile",
  "Courrier postal facilité",
  "Visites simplifiées"
];
</script>

<template>
  <section class="py-24 px-6 bg-white dark:bg-[#0A0D1A]" id="features-highlights">
    <div class="max-w-7xl mx-auto">
      
      <!-- En-tête de section -->
      <div class="text-center max-w-2xl mx-auto mb-16"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">
        <span class="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 shadow-sm">
          Avantages findMe
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Pourquoi utiliser<br/>une adresse <span class="text-emerald-500">structurée ?</span>
        </h2>
      </div>

      <!-- Grille Bento -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s">
        
        <div v-for="(feat, i) in features" :key="feat.title"
          class="group relative overflow-hidden rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white dark:bg-slate-900"
          :class="[feat.colSpan]">
          
          <!-- Bg Gradient On Hover -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" :class="feat.bgColor" />
          
          <div class="relative z-10 flex flex-col h-full">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100" :class="[feat.iconBg, feat.iconColor]">
              <component :is="feat.icon" class="w-6 h-6" />
            </div>
            
            <div class="mt-auto">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">{{ feat.title }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bannière Impact Citoyen (Version Light/Colorée) -->
      <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-500 to-teal-400 p-1 md:p-2"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s">
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden h-full">
          
          <!-- Motif de fond -->
          <div class="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

          <div class="flex-1 z-10 text-center md:text-left">
            <h3 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
              L'impact citoyen avant tout
            </h3>
            <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto md:mx-0">
              Une adresse claire permet de structurer les villes camerounaises et d'apporter des services essentiels directement chez vous.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="imp in impacts" :key="imp" class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ imp }}</span>
              </div>
            </div>
          </div>

          <!-- Illustration / Badge -->
          <div class="shrink-0 relative z-10 w-full md:w-auto flex justify-center">
            <div class="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center relative shadow-inner border-4 border-white dark:border-slate-800">
              <Home class="w-20 h-20 sm:w-24 sm:h-24 text-emerald-500/80" />
              <!-- Badge animé -->
              <div class="absolute -bottom-4 right-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce">
                <span class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500" />
                  Impact
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
