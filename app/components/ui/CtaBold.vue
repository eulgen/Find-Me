<!--
  @file CtaBold.vue
  @description Section Bottom Stats & Map (Inspirée du bloc "Volunteer Positions Available" / Stats Gainlove Image 1).
  Chiffres impactants à gauche, silhouette de carte vectorielle du Cameroun/Afrique à droite avec illustration d'individu noir.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sparkles, ArrowRight, MousePointerClick, CheckCircle } from 'lucide-vue-next';
import CtaIllustration from '~/components/illustrations/CtaIllustration.vue';

const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  const el = document.getElementById('cta-bold-conversion');
  if (el) observer.observe(el);
});
</script>

<template>
  <section class="py-20 px-6 relative bg-[#FAF8F5] dark:bg-[#0A0D1A]" id="cta-bold-conversion">
    <div class="max-w-7xl mx-auto relative">
      
      <!-- Carte Gainlove avec Carte Vectorielle & Statistiques -->
      <div class="relative bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 md:p-14 lg:p-16 overflow-hidden"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 0.9s cubic-bezier(0.22,1,0.36,1)">
        
        <div class="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <!-- GAUCHE : Texte & Chiffres Clés -->
          <div class="flex-1 text-center lg:text-left space-y-6">
            <div class="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-emerald-200/60 dark:border-emerald-800">
              <Sparkles class="w-4 h-4 text-emerald-500" />
              <span>Couverture Nationale</span>
            </div>

            <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight font-serif">
              Rejoignez l'adressage <br />
              <span class="not-italic font-sans text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">certifié au Cameroun</span>
            </h2>

            <p class="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-lg mx-auto lg:mx-0 font-medium">
              Obtenez votre adresse en moins de 3 minutes et recevez votre plaque officielle QR Code.
            </p>

            <div class="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
              <NuxtLink to="/creer-mon-adresse"
                class="group flex items-center justify-center gap-3 bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 text-white font-black text-sm px-9 py-4.5 rounded-full shadow-xl hover:scale-[1.02] transition-all w-full sm:w-auto">
                <span>Générer mon adresse</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>

              <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <CheckCircle class="w-4 h-4 text-emerald-500" />
                <span>100% Gratuit pour tous</span>
              </div>
            </div>
          </div>

          <!-- DROITE : Carte d'Afrique/Cameroun en filigrane avec Illustration d'Individu Noir (Image 2/3) -->
          <div class="flex-1 w-full flex justify-center relative">
            <div class="relative w-full max-w-md aspect-square rounded-3xl bg-[#FAF8F5] dark:bg-slate-800/60 p-6 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center overflow-hidden">
              <img src="/assets/images/black_person_phone.png" alt="Illustration Citoyenne Camerounaise" class="w-full h-full object-contain drop-shadow-lg" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </section>
</template>
