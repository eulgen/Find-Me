<!--
  @file Faq.vue
  @description Section FAQ — Light Mode Premium (Accordéons clairs)
-->

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Minus, HelpCircle } from 'lucide-vue-next';
import faqs from '~/data/faq.json';

const activeItem = ref<number | null>(0); // First item open by default

const toggle = (id: number) => {
  activeItem.value = activeItem.value === id ? null : id;
};
</script>

<template>
  <section class="py-24 px-6 bg-white dark:bg-[#0A0D1A]" id="faq-section">
    <div class="max-w-4xl mx-auto">
      
      <!-- En-tête -->
      <div class="text-center mb-16">
        <span class="inline-flex items-center gap-2 bg-slate-50 dark:bg-white border border-slate-200 dark:border-slate-200 text-slate-600 dark:text-slate-600 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          <HelpCircle class="w-3.5 h-3.5" />
          Des questions ?
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight">
          Foire aux <span class="text-emerald-500">questions</span>
        </h2>
      </div>

      <!-- Liste d'accordéons -->
      <div class="space-y-4">
        <div v-for="item in faqs" :key="item.id" 
          class="border border-slate-200 dark:border-slate-200 rounded-[1.5rem] bg-white dark:bg-white overflow-hidden transition-all duration-300"
          :class="{ 'shadow-md border-emerald-200 dark:border-emerald-800/50': activeItem === item.id }">
          
          <button @click="toggle(item.id)" 
            class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group">
            <span class="font-bold text-lg transition-colors" 
              :class="activeItem === item.id ? 'text-emerald-600 dark:text-[#0f172b]' : 'text-slate-800 dark:text-[#0f172b] group-hover:text-emerald-500'">
              {{ item.q }}
            </span>
            <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              :class="activeItem === item.id ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-[#0f172b]' : 'bg-slate-50 text-slate-400 dark:bg-slate-50'">
              <Minus v-if="activeItem === item.id" class="w-4 h-4" />
              <Plus v-else class="w-4 h-4" />
            </div>
          </button>
          
          <div class="grid transition-all duration-300 ease-in-out"
            :class="activeItem === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
            <div class="overflow-hidden">
              <p class="px-6 pb-6 pt-0 text-slate-500 dark:text-slate-600 leading-relaxed">
                {{ item.a }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </section>
</template>
