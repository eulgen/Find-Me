<!--
  @file CtaBold.vue
  @description CTA Bold section — Light Mode Premium (Colorful, Energetic, Bright)
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sparkles, ArrowRight, MousePointerClick } from 'lucide-vue-next';
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
  <section class="py-24 px-6 relative bg-white dark:bg-[#0A0D1A]" id="cta-bold-conversion">
    <div class="max-w-6xl mx-auto relative">
      
      <!-- Arrière-plan animé avec dégradés doux pastel -->
      <div class="absolute inset-0 bg-gradient-to-tr from-emerald-100 via-indigo-50 to-orange-50 dark:from-emerald-900/40 dark:via-indigo-900/20 dark:to-orange-900/20 rounded-[3rem] opacity-70 blur-xl" />

      <!-- Carte Principale -->
      <div class="relative bg-white/80 dark:bg-white backdrop-blur-2xl rounded-[3rem] border border-white dark:border-slate-200 shadow-2xl p-8 md:p-16 lg:p-20 overflow-hidden"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 1s cubic-bezier(0.22,1,0.36,1)">
        
        <!-- Motifs décoratifs SVG bg -->
        <svg class="absolute right-0 top-0 text-emerald-50 dark:text-emerald-900/20 w-1/2 h-full object-cover opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="80" cy="20" r="40" fill="currentColor" />
          <circle cx="90" cy="80" r="30" fill="currentColor" />
        </svg>

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          <!-- Contenu Textuel -->
          <div class="flex-1 text-center md:text-left space-y-8">
            <div class="inline-flex items-center gap-2 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-[#0f172b] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-emerald-200/50 dark:border-emerald-800/50">
              <Sparkles class="w-4 h-4" />
              <span>Passez à l'action</span>
            </div>

            <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-[#0f172b] leading-[1.1] tracking-tight">
              Prêt à obtenir <br/>votre code ?
            </h2>

            <p class="text-lg text-slate-600 dark:text-slate-600 max-w-md mx-auto md:mx-0">
              Rejoignez des milliers de Camerounais qui facilitent déjà la livraison de leurs colis et la venue de leurs proches grâce à <span class="font-bold text-slate-900 dark:text-[#0f172b]">findMe</span>.
            </p>

            <div class="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
              <NuxtLink to="/creer-mon-adresse"
                class="group flex items-center justify-center gap-3 bg-slate-900 dark:bg-[#0f172b] text-white font-bold px-8 py-5 rounded-2xl w-full sm:w-auto hover:bg-slate-800 dark:hover:bg-slate-800 transition-all hover:shadow-xl ">
                <span>Générer mon adresse</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              <div class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-600">
                <MousePointerClick class="w-4 h-4" />
                Totalement gratuit
              </div>
            </div>
          </div>

          <!-- Illustration visuelle (composant SVG interactif) -->
          <div class="hidden md:flex flex-1 justify-center relative">
            <div class="relative w-full max-w-sm rounded-3xl overflow-hidden border-4 border-white shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
               <CtaIllustration class="w-full h-auto object-cover" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </section>
</template>
