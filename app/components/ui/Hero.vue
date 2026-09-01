<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight, PlayCircle } from "lucide-vue-next";

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
</script>

<template>
  <section class="relative w-full bg-[#FAF8F5] dark:bg-[#0A0D1A] overflow-hidden font-sans" id="app-hero" style="min-height: 100vh; padding-top: 5rem; padding-bottom: 4rem;">
    
    <!-- Abstract Floating Dots (Gainlove style) -->
    <div class="absolute top-[25%] left-[8%] w-4 h-4 bg-blue-500 rounded-full opacity-60"></div>
    <div class="absolute top-[12%] left-[48%] w-3 h-3 bg-amber-500 rounded-full opacity-70"></div>
    <div class="absolute bottom-[20%] left-[50%] w-2 h-2 bg-emerald-500 rounded-full opacity-80"></div>
    <div class="absolute top-[45%] right-[8%] w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
    <div class="absolute bottom-[35%] right-[32%] w-4 h-4 bg-amber-400 rounded-full opacity-70"></div>
    <div class="absolute bottom-[10%] left-[15%] w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>

    <div class="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row items-center gap-12 h-full min-h-[calc(100vh-9rem)]">
      
      <!-- LEFT: Big Serif Text (Justice begins where inequality ends style) -->
      <div class="flex-1 space-y-7 z-10 text-center lg:text-left mt-12 lg:mt-0"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">
        
        <h1 class="text-[3.4rem] md:text-[4.5rem] lg:text-[5.5rem] font-serif text-slate-900 dark:text-white leading-[1.02] tracking-tight">
          L'adressage <br>
          de qualité <br>
          commence <span class="relative inline-block">
            ici<span class="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 bg-emerald-500 rounded-full"></span>
          </span>
        </h1>
        
        <p class="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
          Nous construisons un environnement où chaque citoyen dispose d'une identité géographique précise, donnant le pouvoir de façonner librement son quotidien au Cameroun.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
          <NuxtLink to="/creer-mon-adresse"
            class="group inline-flex items-center justify-center gap-3 bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 text-white font-black text-[11px] md:text-xs uppercase tracking-[0.15em] px-9 py-4.5 rounded-full shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all">
            <span class="w-1.5 h-1.5 bg-emerald-400 dark:bg-slate-900 rounded-full animate-pulse"></span>
            Créer mon adresse
          </NuxtLink>
        </div>
      </div>

      <!-- RIGHT: Masked Image (Africa shape) -->
      <div class="flex-1 w-full flex justify-center items-center relative z-10"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 1s cubic-bezier(0.22,1,0.36,1) 0.2s">
        
        <div class="relative w-full max-w-[650px] aspect-[4/5] flex justify-center items-center">
          <!-- Carte d'Afrique/Silhouette Blob (Remplaçant l'image d'illustration carrée) -->
          <div class="w-full h-full bg-slate-200 dark:bg-slate-800 mask-organic overflow-hidden shadow-2xl relative">
            <img src="/assets/images/hero_address_happy.webp" alt="Famille camerounaise fière de son adresse" class="w-full h-full object-cover object-center scale-110 hover:scale-100 transition-transform duration-[2s]" />
            <div class="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 to-transparent mix-blend-overlay"></div>
          </div>
          
          <!-- Background silhouette / shadow map for depth -->
          <div class="absolute inset-0 mask-organic bg-[#F3F0EA] dark:bg-slate-800 opacity-60 transform scale-[1.03] -z-10 translate-x-4 translate-y-6"></div>
          
          <!-- Subtle dot accent on map edge -->
          <div class="absolute bottom-[20%] right-[-5%] w-3 h-3 bg-red-500 rounded-full z-20"></div>
          <div class="absolute top-[25%] left-[-2%] w-4 h-4 bg-orange-400 rounded-full z-20"></div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Responsive organic blob simulating a geographical map mask */
.mask-organic {
  /* Utilizing mask-image for fully responsive clipping */
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M45.7,-76.3C58.9,-69.3,69.2,-55.4,78.2,-41.1C87.2,-26.8,94.9,-12.1,93.4,1.8C91.9,15.7,81.2,28.8,71.1,41C61,53.2,51.5,64.5,39.4,71.8C27.3,79.1,12.6,82.4,-1.8,85.3C-16.2,88.2,-30.4,90.7,-42.9,84.9C-55.4,79.1,-66.2,65,-74.6,50.3C-83,35.6,-89,20.3,-88.9,5.2C-88.8,-9.9,-82.6,-24.8,-74.2,-38.3C-65.8,-51.8,-55.2,-63.9,-42,-70.8C-28.8,-77.7,-13.1,-79.4,1.8,-82C16.7,-84.6,32.5,-83.3,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" /></svg>');
  mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M45.7,-76.3C58.9,-69.3,69.2,-55.4,78.2,-41.1C87.2,-26.8,94.9,-12.1,93.4,1.8C91.9,15.7,81.2,28.8,71.1,41C61,53.2,51.5,64.5,39.4,71.8C27.3,79.1,12.6,82.4,-1.8,85.3C-16.2,88.2,-30.4,90.7,-42.9,84.9C-55.4,79.1,-66.2,65,-74.6,50.3C-83,35.6,-89,20.3,-88.9,5.2C-88.8,-9.9,-82.6,-24.8,-74.2,-38.3C-65.8,-51.8,-55.2,-63.9,-42,-70.8C-28.8,-77.7,-13.1,-79.4,1.8,-82C16.7,-84.6,32.5,-83.3,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" /></svg>');
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
</style>
