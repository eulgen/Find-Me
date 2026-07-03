<!--
  @file app/components/ui/Partners.vue
  @description Section chiffres-clés + partenaires — Infinite Carousel & Vrais Logos
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Users, MapPin, Clock, Award } from 'lucide-vue-next';

const keyStats = [
  { value: "500+",    label: "Foyers enregistrés",      icon: Users,   color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  { value: "2",       label: "Villes pilotes",           icon: MapPin,  color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-900/30" },
  { value: "<3 min",  label: "Pour créer une adresse",  icon: Clock,   color: "text-indigo-600",  bg: "bg-indigo-50 dark:bg-indigo-900/30" },
  { value: "100%",    label: "Gratuit pour les citoyens", icon: Award,   color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
];

const partnerLogos = [
  { name: "Google",    text: "Google" },
  { name: "Microsoft", text: "Microsoft" },
  { name: "Stripe",    text: "stripe" },
  { name: "Meta",      text: "Meta" },
  { name: "Orange",    text: "orange" },
  { name: "AWS",       text: "aws" },
];

// On duplique la liste deux fois pour s'assurer que le carrousel boucle parfaitement à l'infini
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
  <section class="relative bg-[#F8FAFC] dark:bg-[#0A0D1A]" id="partners-section">

    <!-- ── Stats Band ── -->
    <div class="relative py-16 px-6 border-b border-slate-200 dark:border-slate-200 bg-white dark:bg-[#0A0D1A] z-10"
      style="box-shadow: 0 20px 40px -20px rgba(0,0,0,0.03)">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <div v-for="(stat, i) in keyStats" :key="i"
            class="flex flex-col items-center text-center group"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="`transition: all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`">

            <!-- Icône -->
            <div class="w-14 h-14 rounded-[1.25rem] mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
              :class="stat.bg">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
            </div>

            <!-- Valeur -->
            <p class="text-3xl md:text-4xl font-black text-slate-900 dark:text-[#0f172b] leading-none mb-2">
              {{ stat.value }}
            </p>

            <!-- Label -->
            <p class="text-xs md:text-sm text-slate-500 dark:text-slate-600 font-medium leading-snug max-w-[120px]">
              {{ stat.label }}
            </p>

            <!-- Séparateur vertical -->
            <div v-if="i < keyStats.length - 1" class="hidden md:block absolute right-0 top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-50" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Partenaires (Carousel Infini) ── -->
    <div class="py-16 relative overflow-hidden bg-white dark:bg-[#0A0D1A]">
      <!-- Background subtle glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 dark:from-slate-800/20 via-transparent to-transparent pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10 text-center mb-10 px-6">
        <p class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
          Écosystème de confiance
        </p>
      </div>

      <!-- Marquee Container -->
      <div class="relative w-full overflow-hidden flex items-center">
        <!-- Fades sur les bords pour un effet "infini" -->
        <div class="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-[#0A0D1A] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-[#0A0D1A] to-transparent z-10 pointer-events-none"></div>
        
        <!-- Piste du Carrousel -->
        <div class="flex animate-marquee items-center gap-16 md:gap-24 w-max hover:play-state-paused">
          <div v-for="(logo, index) in carouselLogos" :key="index" 
               class="flex items-center justify-center shrink-0 group px-4 py-2 cursor-pointer">
            <div class="h-8 md:h-10 flex items-center justify-center font-black text-2xl md:text-3xl text-slate-300 dark:text-slate-700 tracking-tighter opacity-50 transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:text-slate-400 dark:group-hover:text-slate-500">
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
  /* La durée contrôle la vitesse du défilement */
  animation: marquee 25s linear infinite;
}

.hover\:play-state-paused:hover {
  animation-play-state: paused;
}
</style>
