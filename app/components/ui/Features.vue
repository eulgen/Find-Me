<!--
  @file Features.vue
  @description Section Avantages — Inspirée du bloc "Featured Campaigns" de Gainlove (Image 1)
  avec cartes d'illustrations d'individus noirs (Images 2 & 3), puces d'impact et boutons d'action.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Share2, MapPin, QrCode, ShieldCheck, CheckCircle2, Truck, Activity, Mail, Users, ArrowRight } from 'lucide-vue-next';

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

const features = [
  {
    title: "Précision GPS Métrique",
    desc: "Géolocalisation au mètre près idéale pour vos urgences et livraisons.",
    icon: MapPin,
    badge: "100% GPS",
    img: "/assets/images/black_man_address.png",
    colSpan: "col-span-1",
  },
  {
    title: "Code QR & Plaque Officielle",
    desc: "Affichez votre plaque sur votre portail ou partagez-la instantanément.",
    icon: QrCode,
    badge: "Code Unique",
    img: "/assets/images/black_person_phone.png",
    colSpan: "col-span-1",
  },
  {
    title: "Homologué par la Mairie",
    desc: "Conforme au plan d'adressage municipal certifié de Douala et Yaoundé.",
    icon: ShieldCheck,
    badge: "100% Officiel",
    img: "/assets/images/black_person_dashboard.png",
    colSpan: "col-span-1",
  }
];

const impacts = [
  "Urgences médicales rapides",
  "Livraison e-commerce à domicile",
  "Courrier postal et administratif",
  "Visites simples et sans égarement"
];
</script>

<template>
  <section class="py-24 px-6 bg-white dark:bg-[#0A0D1A]" id="features-highlights">
    <div class="max-w-7xl mx-auto">
      
      <!-- En-tête de section Éditorial Gainlove -->
      <div class="text-center max-w-2xl mx-auto mb-16"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">
        <span class="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4 shadow-xs">
          Avantages & Fonctionnalités
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
          Les piliers d'un adressage <br />
          <span class="not-italic font-sans text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">moderne & fiable.</span>
        </h2>
      </div>

      <!-- Grille 3 Colonnes Style Gainlove "Featured Campaigns" -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s">
        
        <div v-for="feat in features" :key="feat.title"
          class="group relative overflow-hidden rounded-[2.5rem] bg-[#FAF8F5] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-6">
          
          <!-- Image Illustration d'Individu Noir (Images 2 & 3) dans Cadre Arrondi -->
          <div class="relative w-full h-56 rounded-3xl bg-white dark:bg-slate-800 overflow-hidden mb-6 p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
            <img :src="feat.img" :alt="feat.title" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            
            <!-- Badge métrique superposé (Gainlove style) -->
            <div class="absolute top-4 right-4 bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
              {{ feat.badge }}
            </div>
          </div>

          <div class="space-y-3 px-2 mb-4">
            <h3 class="text-xl font-black text-slate-900 dark:text-white font-serif">{{ feat.title }}</h3>
            <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">{{ feat.desc }}</p>
          </div>

          <div class="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-2">
            <NuxtLink to="/creer-mon-adresse" class="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 flex items-center gap-1.5">
              En savoir plus <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bannière Impact Citoyen -->
      <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-[#0A0F2C] text-white p-8 md:p-14 shadow-2xl"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s">
        
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="space-y-4 max-w-xl text-center lg:text-left">
            <span class="inline-block px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">Impact citoyen</span>
            <h3 class="text-2xl md:text-4xl font-black text-white tracking-tight font-serif">
              Transformez l'adressage de votre quartier dès aujourd'hui
            </h3>
            <p class="text-slate-300 text-sm md:text-base font-medium">
              Une adresse structurée permet à l'ensemble de la communauté d'être reliée aux services essentiels.
            </p>
          </div>

          <NuxtLink to="/creer-mon-adresse"
            class="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all shrink-0">
            <span>Créer mon adresse</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>
      </div>

    </div>
  </section>
</template>
