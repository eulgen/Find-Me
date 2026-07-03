<!--
  @file Features.vue
  @description Grille d'avantages Bento — Light Mode Premium
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Share2, MapPin, QrCode, ShieldCheck, CheckCircle2, Truck, Activity, Mail, Users } from 'lucide-vue-next';

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
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight">
          Pourquoi utiliser<br/>une adresse <span class="text-emerald-500">structurée ?</span>
        </h2>
      </div>

      <!-- Grille Bento -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s">
        
        <div v-for="(feat, i) in features" :key="feat.title"
          class="group relative overflow-hidden rounded-[2rem] p-8 border border-slate-200 dark:border-slate-200 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] bg-white dark:bg-white"
          :class="[feat.colSpan]">
          
          <!-- Bg Gradient On Hover -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" :class="feat.bgColor" />
          
          <div class="relative z-10 flex flex-col h-full">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100" :class="[feat.iconBg, feat.iconColor]">
              <component :is="feat.icon" class="w-6 h-6" />
            </div>
            
            <div class="mt-auto">
              <h3 class="text-xl font-bold text-slate-900 dark:text-[#0f172b] mb-2">{{ feat.title }}</h3>
              <p class="text-slate-500 dark:text-slate-600 text-sm leading-relaxed">{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bannière Impact Citoyen (Ultra Premium Glassmorphism) -->
      <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#00bc7d] via-teal-400 to-[#155dfc] p-[3px] shadow-[0_20px_60px_-15px_rgba(0,188,125,0.3)] dark:shadow-none"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s">
        
        <div class="bg-white/95 dark:bg-white backdrop-blur-2xl rounded-[2.35rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative overflow-hidden h-full">
          
          <!-- Motif de fond (Mesh/Grid) -->
          <div class="absolute right-0 top-0 bottom-0 w-2/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
          
          <!-- Lueur interne -->
          <div class="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 dark:bg-[#0f172b]/10 blur-3xl rounded-full pointer-events-none"></div>
          <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#155dfc]/10 dark:bg-[#155dfc]/10 blur-3xl rounded-full pointer-events-none"></div>

          <!-- Texte et Liste d'Impact -->
          <div class="flex-1 z-10 text-center lg:text-left">
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-[#0f172b] mb-5 tracking-tight">
              L'impact citoyen <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00bc7d] to-teal-400">avant tout</span>
            </h3>
            <p class="text-slate-600 dark:text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 text-base md:text-lg leading-relaxed font-medium">
              Une adresse claire permet de structurer les villes camerounaises et d'apporter des services essentiels directement à votre porte, sans friction.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div v-for="imp in impacts" :key="imp" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 shadow-inner">
                  <CheckCircle2 class="w-4 h-4 text-[#00bc7d]" />
                </div>
                <span class="text-sm md:text-base font-bold text-slate-700 dark:text-slate-700">{{ imp }}</span>
              </div>
            </div>
          </div>

          <!-- Composition Flottante Premium (Widget UI) -->
          <div class="shrink-0 relative z-10 w-full lg:w-[380px] h-[320px] flex items-center justify-center mt-8 lg:mt-0">
            
            <!-- Carte Centrale (Visites/Maison) -->
            <div class="absolute z-20 animate-float bg-white/80 dark:bg-slate-50 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/60 dark:border-slate-300 w-56 text-center flex flex-col items-center">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-white/50 dark:border-indigo-700/30">
                <Users class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p class="font-black text-slate-900 dark:text-[#0f172b] text-base">Visites simplifiées</p>
              <p class="text-xs text-slate-500 dark:text-slate-600 mt-1 font-medium">Vos proches vous trouvent</p>
              <div class="mt-4 w-24 h-1.5 bg-indigo-100 dark:bg-slate-700 rounded-full overflow-hidden">
                 <div class="w-full h-full bg-indigo-500 rounded-full animate-progress-bar"></div>
              </div>
            </div>

            <!-- Flottant Haut Gauche (Urgences) -->
            <div class="absolute left-0 top-6 z-10 animate-float-delay bg-white/90 dark:bg-slate-50 backdrop-blur-lg p-3.5 rounded-2xl shadow-xl border border-white/60 dark:border-slate-300 flex items-center gap-3">
              <div class="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-xl flex items-center justify-center shadow-inner">
                <Activity class="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div class="pr-2 text-left">
                <p class="font-black text-slate-900 dark:text-[#0f172b] text-sm">Urgences</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secours Rapides</p>
              </div>
            </div>

            <!-- Flottant Bas Droite (Livraisons) -->
            <div class="absolute -right-4 bottom-10 z-30 animate-float-fast bg-white/90 dark:bg-slate-50 backdrop-blur-lg p-3.5 rounded-2xl shadow-xl border border-white/60 dark:border-slate-300 flex items-center gap-3">
              <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center shadow-inner">
                <Truck class="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div class="pr-2 text-left">
                <p class="font-black text-slate-900 dark:text-[#0f172b] text-sm">Livraisons</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">À domicile</p>
              </div>
            </div>

            <!-- Flottant Haut Droite (Courrier) -->
            <div class="absolute right-4 -top-2 z-0 animate-bounce-slow bg-white/90 dark:bg-slate-50 backdrop-blur-lg p-3 rounded-2xl shadow-lg border border-white/60 dark:border-slate-300">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center shadow-inner">
                <Mail class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes floatDelay {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes floatFast {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes progressBar {
  0% { width: 0%; opacity: 0.5; }
  50% { width: 100%; opacity: 1; }
  100% { width: 0%; opacity: 0.5; }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-delay { animation: floatDelay 5s ease-in-out infinite alternate; }
.animate-float-fast { animation: floatFast 4s ease-in-out infinite; }
.animate-bounce-slow { animation: bounceSlow 3s ease-in-out infinite alternate; }
.animate-progress-bar { animation: progressBar 4s ease-in-out infinite; }
</style>
