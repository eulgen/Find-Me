<!--
  @file Testimonials.vue
  @description Section affichant les retours et témoignages de citoyens camerounais (livreurs, urgentistes, commerçants).
-->

<script setup lang="ts">
import { computed } from 'vue'
import { Quote, Star, MapPin } from 'lucide-vue-next'
import testimonials from '~/data/reviews.json'

const reviews = computed(() => testimonials)
</script>

<template>
  <section class="py-20 bg-white" id="temoignages bg-white">
    <div class="max-w-7xl mx-auto px-6" id="testimonials-main-inner">
      <!-- En-tête -->
      <div class="text-center max-w-2xl mx-auto mb-16" id="testimonials-headings">
        <span class="bg-[#FFD5D0] text-[#1A237E] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full border border-[#1A237E]/25 inline-block mb-3.5">
          Avis Citoyens
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-[#1A237E] tracking-tight">
          Ce que les Camerounais en disent
        </h2>
        <p class="mt-4 text-sm md:text-base text-[#1A237E]/80 font-normal">
          Du professionnel de la logistique à la mère de famille, la révolution de l'adressage simplifie la vie quotidienne de tous.
        </p>
      </div>

      <!-- Grille d'avis -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8" id="testimonials-grid-block">
        <div 
          v-for="(rev, i) in reviews"
          :key="i"
          class="bg-[#FBF8FF] rounded-3xl p-8 border-3 border-[#1A237E] shadow-[5px_5px_0px_0px_#1A237E] flex flex-col justify-between relative hover:translate-y-[-4px] transition-transform duration-200"
          :id="`rev-box-${i}`"
        >
          <Quote class="absolute top-6 right-6 w-10 h-10 text-[#FFD5D0] opacity-40 stroke-2" />
          
          <div>
            <div class="flex space-x-1 mb-4" id="ranking-stars">
              <Star v-for="stIdx in 5" :key="stIdx" class="w-4 h-4 fill-[#2E7D32] text-[#2E7D32]" />
            </div>

            <p class="text-xs md:text-sm text-[#1A237E] leading-relaxed italic font-medium mb-6">
              {{ rev.quote }}
            </p>
          </div>

          <!-- Métadonnées de l'auteur répertorié -->
          <div class="flex items-center space-x-3.5 border-t-2 border-[#1A237E]/10 pt-4" id="reviewer-meta-footer">
            <NuxtImg 
              :src="rev.avatar"
              :alt="rev.name"
              class="w-12 h-12 rounded-full border-2 border-[#1A237E] bg-white object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 class="font-extrabold text-sm text-[#1A237E]">{{ rev.name }}</h4>
              <span class="text-[10px] text-[#2E7D32] font-semibold block uppercase tracking-wider">{{ rev.role }}</span>
              <div class="flex items-center space-x-1 text-[9px] text-[#1A237E]/65 mt-0.5">
                <MapPin class="w-3 h-3 text-[#1A237E]" />
                <span>{{ rev.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
