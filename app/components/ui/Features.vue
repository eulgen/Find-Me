<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Share2, MapPin, QrCode, ShieldCheck, Heart } from 'lucide-vue-next';

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
    title: "Précision GPS",
    desc: "Géolocalisation au mètre près idéale pour vos urgences et livraisons partout.",
    icon: MapPin,
  },
  {
    title: "Plaque Officielle",
    desc: "Affichez votre plaque sur votre portail ou partagez-la instantanément en ligne.",
    icon: QrCode,
  },
  {
    title: "Homologué Mairie",
    desc: "Conforme au plan d'adressage municipal certifié de Douala et Yaoundé.",
    icon: ShieldCheck,
  },
  {
    title: "Gratuit & Universel",
    desc: "Un service communautaire entièrement gratuit accessible à tous les foyers.",
    icon: Heart,
  }
];
</script>

<template>
  <section class="py-24 px-6 bg-[#FAF8F5] dark:bg-[#0A0D1A] relative" id="features-highlights">
    
    <!-- Organic dots floating -->
    <div class="absolute top-10 left-[15%] w-2 h-2 bg-amber-400 rounded-full opacity-80"></div>
    <div class="absolute bottom-20 right-[20%] w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
    <div class="absolute top-[40%] left-[5%] w-4 h-4 bg-emerald-300 rounded-full opacity-40"></div>
    
    <div class="max-w-7xl mx-auto">
      
      <!-- En-tête de section Éditorial Gainlove (Make a Difference style) -->
      <div class="text-center max-w-2xl mx-auto mb-16"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">
        
        <div class="inline-flex items-center justify-center mb-4">
          <span class="text-xs font-black uppercase tracking-[0.2em] text-amber-500">
            Ce que nous offrons
          </span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-serif mb-6">
          Changez votre quotidien
        </h2>
        
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Grâce à une adresse structurée, fini les indications floues. Vous aidez votre quartier à se moderniser et bénéficiez de services rapides.
        </p>
      </div>

      <!-- Grille 4 Colonnes Style Gainlove "Make a Difference" -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s">
        
        <div v-for="feat in features" :key="feat.title"
          class="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 text-center shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
          
          <div class="relative mb-8">
            <!-- Icon Background Dot -->
            <div class="absolute -top-1 -right-2 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-full transition-transform group-hover:scale-125"></div>
            <!-- Icon -->
            <component :is="feat.icon" class="w-10 h-10 text-slate-800 dark:text-emerald-400 relative z-10 stroke-[1.5]" />
          </div>

          <h3 class="text-lg md:text-xl font-black text-slate-900 dark:text-white font-serif mb-4">{{ feat.title }}</h3>
          <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>

    </div>
  </section>
</template>
