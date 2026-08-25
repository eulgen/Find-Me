<!--
  @file app/components/ui/Partners.vue
  @description Section 4 Avantages Clés ("Make a Difference" Gainlove Image 1) & Partenaires de confiance.
  Cartes blanches aux coins arrondis 3XL avec icônes dorées/émeraude et carrousel infini.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Users, MapPin, Clock, Award, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-vue-next';

const keyStats = [
  { value: "500+",    label: "Foyers enregistrés",      icon: Users,   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  { value: "2",       label: "Villes pilotes",           icon: MapPin,  color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-900/30" },
  { value: "<3 min",  label: "Pour créer une adresse",  icon: Clock,   color: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-50 dark:bg-indigo-900/30" },
  { value: "100%",    label: "Gratuit pour les citoyens", icon: Award,   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
];

const partnerLogos = [
  { name: "Google",    text: "Google" },
  { name: "Microsoft", text: "Microsoft" },
  { name: "Stripe",    text: "stripe" },
  { name: "Meta",      text: "Meta" },
  { name: "Orange",    text: "orange" },
  { name: "AWS",       text: "aws" },
];

const carouselLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  const el = document.getElementById('partners-section');
  if (el) observer.observe(el);
});
</script>

<template>
  <section class="relative bg-[#FAF8F5] dark:bg-[#0A0D1A] overflow-hidden py-16" id="partners-section">

    <!-- ── 4 Cartes d'Engagement Style Gainlove ("Make a Difference") ── -->
    <div class="relative max-w-7xl mx-auto px-6 z-10 mb-14">
      <div class="text-center max-w-xl mx-auto mb-10">
        <p class="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 mb-1">
          Engagements findMe
        </p>
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif">
          Une plateforme au service des citoyens
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(stat, i) in keyStats" :key="i"
          class="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          :style="`transition: all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`">

          <!-- Icône encadrée -->
          <div class="w-16 h-16 rounded-full mb-5 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs border border-slate-100 dark:border-slate-800"
            :class="stat.bg">
            <component :is="stat.icon" class="w-7 h-7" :class="stat.color" />
          </div>

          <p class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-none">
            {{ stat.value }}
          </p>

          <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold leading-snug">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Partenaires (Carrousel Infini) ── -->
    <div class="py-10 relative overflow-hidden bg-white dark:bg-[#0A0D1A] border-y border-slate-200/60 dark:border-slate-800">
      <div class="max-w-7xl mx-auto relative z-10 text-center mb-6 px-6">
        <p class="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Écosystème & Partenaires de Confiance
        </p>
      </div>

      <!-- Marquee -->
      <div class="relative w-full overflow-hidden flex items-center">
        <div class="absolute left-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-r from-white dark:from-[#0A0D1A] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-l from-white dark:from-[#0A0D1A] to-transparent z-10 pointer-events-none"></div>
        
        <div class="flex animate-marquee items-center gap-16 md:gap-24 w-max hover:play-state-paused">
          <div v-for="(logo, index) in carouselLogos" :key="index" 
               class="flex items-center justify-center shrink-0 group px-4 py-2 cursor-pointer">
            <div class="h-8 md:h-10 flex items-center justify-center font-black text-2xl md:text-3xl text-slate-400 dark:text-slate-600 tracking-tighter opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {{ logo.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-33.333333%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}

.hover\:play-state-paused:hover {
  animation-play-state: paused;
}
</style>
