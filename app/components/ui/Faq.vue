<!--
  @file Faq.vue
  @description Section FAQ — Design d'accordéon ultra-clean inspiré de la section FAQ d'Image 2.
  Interactions fluides, typographie soignée et bordures épurées.
-->

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Minus, HelpCircle } from 'lucide-vue-next';
import faqs from '~/data/faq.json';

const activeItem = ref<number | null>(0);

const toggle = (id: number) => {
  activeItem.value = activeItem.value === id ? null : id;
};
</script>

<template>
  <section class="py-20 md:py-28 px-6 bg-[#FAF9F5] dark:bg-[#0A0D1A]" id="accordion-faq">
    <div class="max-w-4xl mx-auto">
      
      <!-- En-tête -->
      <div class="text-center mb-16">
        <span class="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4 shadow-xs">
          <HelpCircle class="w-3.5 h-3.5 text-emerald-500" />
          Questions Fréquentes
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Foire aux <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">questions</span>
        </h2>
      </div>

      <!-- Liste d'accordéons (Design Épuré Inspiré d'Image 2) -->
      <div class="space-y-4">
        <div v-for="item in faqs" :key="item.id" 
          class="border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700"
          :class="{ 'shadow-md border-emerald-500/80 dark:border-emerald-500/80': activeItem === item.id }">
          
          <button @click="toggle(item.id)" 
            class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group cursor-pointer">
            <span class="font-bold text-base md:text-lg transition-colors" 
              :class="activeItem === item.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white group-hover:text-emerald-600'">
              {{ item.q }}
            </span>
            <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ml-4"
              :class="activeItem === item.id ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'">
              <Minus v-if="activeItem === item.id" class="w-4 h-4" />
              <Plus v-else class="w-4 h-4" />
            </div>
          </button>
          
          <div class="grid transition-all duration-300 ease-in-out"
            :class="activeItem === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
            <div class="overflow-hidden">
              <p class="px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base font-medium border-t border-slate-100 dark:border-slate-800/60 mt-1">
                {{ item.a }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </section>
</template>
