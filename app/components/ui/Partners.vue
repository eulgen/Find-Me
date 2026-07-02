<!--
  @file app/components/ui/Partners.vue
  @description Section chiffres-clés + partenaires — Light Mode Premium
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Users, MapPin, Clock, Award } from 'lucide-vue-next';

const keyStats = [
  { value: "500+",    label: "Foyers enregistrés",      icon: Users,   color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "2",       label: "Villes pilotes",           icon: MapPin,  color: "text-orange-500",  bg: "bg-orange-50" },
  { value: "<3 min",  label: "Pour créer une adresse",  icon: Clock,   color: "text-indigo-600",  bg: "bg-indigo-50" },
  { value: "100%",    label: "Gratuit pour les citoyens", icon: Award,   color: "text-emerald-600", bg: "bg-emerald-50" },
];

const partners = ref([
  { name: "Google",         logo: "/assets/images/google.svg",       category: "Cartographie",     accent: "#4285F4" },
  { name: "Orange Cameroun", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg", category: "Télécom", accent: "#FF7900" },
  { name: "MTN Cameroun",   logo: null, initials: "MTN",              category: "Mobile",           accent: "#FFCC00", textColor: "#1A1A1A" },
  { name: "DHL",            logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg",     category: "Livraison", accent: "#D40511" },
  { name: "Jumia",          logo: null, initials: "JUM",              category: "E-commerce",       accent: "#F68B1E", textColor: "#fff" },
  { name: "CAMPOST",        logo: null, initials: "POST",             category: "Poste Nationale",  accent: "#2E7D32", textColor: "#fff" },
]);

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

    <!-- ── Stats Band (Light & Clean) ── -->
    <div class="relative py-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0D1A] z-10"
      style="box-shadow: 0 20px 40px -20px rgba(0,0,0,0.03)">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <div v-for="(stat, i) in keyStats" :key="i"
            class="flex flex-col items-center text-center group"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="`transition: all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`">

            <!-- Icône -->
            <div class="w-14 h-14 rounded-[1.25rem] mb-4 flex items-center justify-center transition-transform "
              :class="stat.bg">
              <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
            </div>

            <!-- Valeur -->
            <p class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-2">
              {{ stat.value }}
            </p>

            <!-- Label -->
            <p class="text-xs md:text-sm text-slate-500 font-medium leading-snug max-w-[120px]">
              {{ stat.label }}
            </p>

            <!-- Séparateur vertical -->
            <div v-if="i < keyStats.length - 1" class="hidden md:block absolute right-0 top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Partenaires ── -->
    <div class="py-20 px-6 relative overflow-hidden">
      <!-- Background subtle elements -->
      <div class="absolute inset-0 pointer-events-none">
        <svg class="absolute inset-0 w-full h-full opacity-[0.02]">
          <defs>
            <pattern id="partners-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748B" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#partners-grid)" />
        </svg>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">

        <!-- Header -->
        <div class="text-center mb-12">
          <p class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-3">
            Écosystème de confiance
          </p>
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Partenaires & intégrations
          </h2>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 lg:gap-6"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s">

          <div v-for="(p, i) in partners" :key="i"
            class="group flex flex-col items-center justify-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">

            <div class="h-12 flex items-center justify-center">
              <img v-if="p.logo" :src="p.logo" :alt="p.name"
                class="h-8 max-w-[90px] object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                referrerpolicy="no-referrer" loading="lazy" />
              <div v-else
                class="w-14 h-10 rounded-xl flex items-center justify-center font-black text-sm tracking-widest transition-all duration-300 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 "
                :style="{ background: p.accent, color: p.textColor || '#fff' }">
                {{ p.initials }}
              </div>
            </div>

            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {{ p.category }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
