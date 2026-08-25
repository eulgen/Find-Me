<!--
  @file Testimonials.vue
  @description Témoignages citoyens findMe — Design conversion d'élite inspiré d'Image 1.
  Cartes d'avis blanches avec coins arrondis 3XL, badge certifié et note globale.
-->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Star, CheckCircle2, Quote } from 'lucide-vue-next';
import testimonials from '~/data/reviews.json';

const reviews = computed(() => testimonials);

const photoPairs = [
  { src: '/assets/images/amadou.jpg',  initials: 'AM', color: '#10B981' },
  { src: '/assets/images/florence.jpg', initials: 'FL', color: '#6366F1' },
  { src: '/assets/images/mathieu.jpg', initials: 'MT', color: '#F59E0B' },
] as Array<{ src: string, initials: string, color: string }>;

const isVisible = ref(false);
const sectionRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  
  if (sectionRef.value) observer.observe(sectionRef.value);
});
</script>

<template>
  <section ref="sectionRef" class="py-24 px-6 relative bg-white dark:bg-[#0A0D1A]" id="testimonials-block">
    <div class="max-w-7xl mx-auto relative z-10">

      <!-- En-tête -->
      <div class="text-center max-w-2xl mx-auto mb-16"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">
        <span class="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200/60 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4 shadow-xs">
          Avis & Témoignages
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Ce que les citoyens <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">en disent au quotidien</span>
        </h2>
        
        <!-- Note globale -->
        <div class="mt-6 inline-flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-6 py-2.5 rounded-full shadow-xs">
          <div class="flex items-center gap-1">
            <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span class="font-black text-slate-900 dark:text-white text-sm">4.9 / 5</span>
          <span class="text-slate-400 text-xs font-bold">sur +500 avis certifiés</span>
        </div>
      </div>

      <!-- Grille de témoignages -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(review, index) in reviews.slice(0,3)" :key="index"
          class="relative bg-[#FAF9F5] dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
          :style="`transition: all 0.6s cubic-bezier(0.22,1,0.36,1) ${(index * 0.15) + 0.2}s`">
          
          <!-- Icône Quote -->
          <div class="absolute top-6 right-6 text-slate-200 dark:text-slate-800">
            <Quote class="w-10 h-10 fill-current" />
          </div>

          <div>
            <!-- Étoiles -->
            <div class="flex items-center gap-1 mb-5">
              <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            
            <!-- Citation -->
            <p class="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed mb-8 relative z-10 text-sm md:text-base">
              "{{ review.quote }}"
            </p>
          </div>

          <!-- Auteur -->
          <div class="flex items-center gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-slate-100 flex items-center justify-center font-bold text-white relative">
              <NuxtImg v-if="photoPairs[index]?.src" :src="photoPairs[index]?.src" :alt="review.name" width="48" height="48" loading="lazy" format="webp" class="w-full h-full object-cover" />
              <span v-else :style="{ color: photoPairs[index]?.color }">{{ photoPairs[index]?.initials }}</span>
            </div>
            
            <div>
              <p class="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                {{ review.name }}
                <CheckCircle2 class="w-4 h-4 text-emerald-500 fill-emerald-50" />
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ review.role }}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
