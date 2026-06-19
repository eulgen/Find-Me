<!--
  @file Testimonials.vue
  @description Témoignages citoyens findMe — redesign premium avec cartes glassmorphism,
  étoiles animées et avatar en relief. Logique conservée.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { Quote, Star, MapPin } from 'lucide-vue-next'
import testimonials from '~/data/reviews.json'

const reviews = computed(() => testimonials)
</script>

<template>
  <section class="py-24 px-6 bg-[#F7F6FF] dark:bg-[#0C0F1C] relative overflow-hidden" id="temoignages">

    <!-- Décor fond -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style="background: radial-gradient(circle, #2E7D32, transparent 70%)"
      />
      <div
        class="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.04]"
        style="background: radial-gradient(circle, #1A237E, transparent 70%)"
      />
    </div>

    <div class="relative max-w-7xl mx-auto" id="testimonials-main-inner">

      <!-- En-tête -->
      <div class="text-center max-w-2xl mx-auto mb-16" id="testimonials-headings">
        <span class="inline-flex items-center gap-2 bg-[#FF6D00]/10 border border-[#FF6D00]/20 text-[#FF6D00] text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-[#FF6D00] animate-pulse" />
          Avis Citoyens
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-[#1A237E] dark:text-white tracking-tight leading-tight">
          Ce que les Camerounais<br />en disent
        </h2>
        <p class="mt-4 text-sm md:text-base text-[#1A237E]/65 dark:text-slate-400 font-normal leading-relaxed">
          Du professionnel de la logistique à la mère de famille, la révolution de l'adressage simplifie la vie quotidienne de tous.
        </p>
      </div>

      <!-- Grille d'avis -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="testimonials-grid-block">
        <div
          v-for="(rev, i) in reviews"
          :key="i"
          class="group relative bg-white dark:bg-slate-900/70 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 hover:border-[#2E7D32]/30 hover:shadow-xl hover:shadow-[#1A237E]/6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          :id="`rev-box-${i}`"
        >
          <!-- Guillemet décoratif -->
          <div class="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#2E7D32]/8 flex items-center justify-center">
            <Quote class="w-4 h-4 text-[#2E7D32] opacity-50" />
          </div>

          <div class="space-y-4">
            <!-- Étoiles -->
            <div class="flex space-x-0.5" id="ranking-stars">
              <Star
                v-for="stIdx in 5"
                :key="stIdx"
                class="w-4 h-4 fill-[#FF6D00] text-[#FF6D00]"
              />
            </div>

            <!-- Citation -->
            <p class="text-sm text-[#1A237E]/80 dark:text-slate-300 leading-relaxed font-normal italic">
              "{{ rev.quote }}"
            </p>
          </div>

          <!-- Footer auteur -->
          <div
            class="flex items-center gap-3.5 mt-6 pt-5 border-t border-gray-100 dark:border-slate-800"
            id="reviewer-meta-footer"
          >
            <div class="relative shrink-0">
              <NuxtImg
                :src="rev.avatar"
                :alt="rev.name"
                class="w-11 h-11 rounded-full object-cover ring-2 ring-[#2E7D32]/20 ring-offset-2 dark:ring-offset-slate-900"
                referrerPolicy="no-referrer"
              />
              <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2E7D32] border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-extrabold text-sm text-[#1A237E] dark:text-white leading-none mb-1">{{ rev.name }}</h4>
              <span class="text-[10px] text-[#2E7D32] font-bold uppercase tracking-wider block mb-1">{{ rev.role }}</span>
              <div class="flex items-center gap-1 text-[10px] text-[#1A237E]/45 dark:text-slate-500">
                <MapPin class="w-3 h-3 shrink-0" />
                <span>{{ rev.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Score global -->
      <div class="mt-10 flex items-center justify-center gap-3">
        <div class="flex">
          <Star v-for="i in 5" :key="i" class="w-5 h-5 fill-[#FF6D00] text-[#FF6D00]" />
        </div>
        <span class="text-sm font-bold text-[#1A237E] dark:text-white">4.9 / 5</span>
        <span class="text-sm text-[#1A237E]/45 dark:text-slate-500 font-normal">sur 200+ retours citoyens</span>
      </div>
    </div>
  </section>
</template>
