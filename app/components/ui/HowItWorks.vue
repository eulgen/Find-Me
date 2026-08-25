<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlayCircle, ArrowRight } from 'lucide-vue-next';

const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  const el = document.getElementById('how-it-works-module');
  if (el) observer.observe(el);
});
</script>

<template>
  <section class="py-24 px-6 bg-white dark:bg-[#0A0D1A] overflow-hidden relative" id="how-it-works-module">
    <!-- Points décoratifs -->
    <div class="absolute top-20 right-[15%] w-3 h-3 bg-orange-400 rounded-full opacity-70"></div>
    <div class="absolute bottom-[30%] left-[5%] w-2 h-2 bg-blue-500 rounded-full opacity-60"></div>

    <div class="max-w-7xl mx-auto">
      
      <!-- Layout "Changing Lives with Knowledge" (Image à gauche, Texte à droite) -->
      <div class="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
        
        <!-- GAUCHE : Collage Circulaire Organique -->
        <div class="w-full lg:w-1/2 flex items-center justify-center relative"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
          style="transition: all 1s cubic-bezier(0.22,1,0.36,1)">
          
          <div class="relative w-full max-w-[500px] aspect-square">
            <!-- Cercle Principal (Background pointillé / abstrait en CSS pour l'effet) -->
            <div class="absolute top-0 left-0 w-3/4 h-3/4 bg-[radial-gradient(#94a3b8_2px,transparent_2px)] [background-size:16px_16px] opacity-20 dark:opacity-10 rounded-full mix-blend-multiply"></div>
            
            <!-- Cercle Image 1 (Gros) -->
            <div class="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-[45%] w-[75%] h-[75%] rounded-full overflow-hidden shadow-2xl border-8 border-white dark:border-[#0A0D1A] z-10">
              <img src="/assets/images/impact_community_address.png" alt="Commerçant avec son QR Code d'adresse" class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
            </div>

            <!-- Cercle Image 2 (Petit) -->
            <div class="absolute top-[10%] right-[5%] w-[35%] h-[35%] rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-[#0A0D1A] z-20">
              <img src="/assets/images/service_delivery_happy.png" alt="Service rendu rapidement à domicile" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>

            <!-- Cercle Image 3 (Très petit) -->
            <div class="absolute bottom-[10%] left-[10%] w-[25%] h-[25%] rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-[#0A0D1A] z-20">
              <img src="/assets/images/community_address_happy.png" alt="Partage d'adresse entre amis" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            
            <!-- Petit point décoratif -->
            <div class="absolute bottom-[25%] right-[0%] w-4 h-4 bg-amber-500 rounded-full z-30 shadow-md"></div>
          </div>
        </div>

        <!-- DROITE : Texte Éditorial "Changing Lives with Knowledge" -->
        <div class="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'"
          style="transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.2s">
          
          <div class="inline-flex items-center justify-center lg:justify-start">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
              L'impact citoyen
            </span>
          </div>

          <h2 class="text-4xl md:text-5xl lg:text-[3.2rem] font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight font-serif">
            Améliorer nos vies <br class="hidden lg:block"> par la localisation
          </h2>

          <p class="text-slate-800 dark:text-slate-200 text-sm md:text-base font-bold leading-relaxed max-w-lg mx-auto lg:mx-0">
            Notre promesse est que votre adresse officielle simplifie vos démarches quotidiennes.
          </p>

          <p class="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
            Aujourd'hui, nous œuvrons pour délivrer une localisation fiable à des millions de personnes au Cameroun. Demain, grâce à votre engagement, nous accompagnerons l'évolution des quartiers vers des villes intelligentes et connectées.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <NuxtLink to="/creer-mon-adresse"
              class="group inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transition-all">
              En savoir plus
            </NuxtLink>
            
            <button class="group inline-flex items-center justify-center gap-2.5 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-full transition-all hover:text-emerald-600 dark:hover:text-emerald-400">
              <PlayCircle class="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
              Voir la vidéo
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
