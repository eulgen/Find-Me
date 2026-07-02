<!--
  @file Testimonials.vue
  @description Témoignages citoyens findMe — Light Mode Premium (Cartes blanches, clean, shadow douce)
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
  <section ref="sectionRef" class="py-24 px-6 relative bg-[#F8FAFC] dark:bg-[#0A0D1A]">

    <!-- Motif de fond discret -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;" />

    <div class="max-w-7xl mx-auto relative z-10">

      <!-- En-tête -->
      <div class="text-center max-w-2xl mx-auto mb-20"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        style="transition: all 0.8s cubic-bezier(0.22,1,0.36,1)">
        <span class="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-600 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm">
          Avis Citoyens
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Ce que les Camerounais<br />en disent
        </h2>
        
        <!-- Note globale -->
        <div class="mt-8 inline-flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-3 rounded-full shadow-sm">
          <div class="flex items-center gap-1">
            <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span class="font-bold text-slate-900 dark:text-white">4.9/5</span>
          <span class="text-slate-400 text-sm">sur plus de 500 avis</span>
        </div>
      </div>

      <!-- Grille de témoignages -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(review, index) in reviews.slice(0,3)" :key="index"
          class="relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
          :style="`transition: all 0.6s cubic-bezier(0.22,1,0.36,1) ${(index * 0.15) + 0.2}s`">
          
          <!-- Icône Quote -->
          <div class="absolute top-8 right-8 text-slate-100 dark:text-slate-800">
            <Quote class="w-12 h-12 fill-current" />
          </div>

          <!-- Contenu de l'avis -->
          <div class="flex items-center gap-1 mb-6">
            <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <p class="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8 relative z-10 text-base">
            "{{ review.quote }}"
          </p>

          <!-- Auteur -->
          <div class="flex items-center gap-4 mt-auto">
            <!-- Avatar -->
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-100 flex items-center justify-center font-bold text-white relative">
              <img v-if="photoPairs[index]?.src" :src="photoPairs[index]?.src" :alt="review.name" class="w-full h-full object-cover" />
              <span v-else :style="{ color: photoPairs[index]?.color }">{{ photoPairs[index]?.initials }}</span>
            </div>
            
            <div>
              <p class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                {{ review.name }}
                <CheckCircle2 class="w-4 h-4 text-emerald-500 fill-emerald-50" />
              </p>
              <p class="text-xs text-slate-500 font-medium">{{ review.role }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
