<!--
  @file Features.vue
  @description Section présentant les avantages et bénéfices d'utiliser l'infrastructure findMe.
  Met en avant les statistiques d'utilisation locales à Douala et Yaoundé.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck, MapPin, Printer, Smartphone, Map, Sparkles } from 'lucide-vue-next'
import features from '~/data/features.json'
import type { LucideIcon } from 'lucide-vue-next'

const featuresIcons = [ShieldCheck,MapPin,Printer,Smartphone,Map,Sparkles] as LucideIcon[]

const benefits = computed(() => features)

const avatarPersons = computed(() => [
  { name: 'Amadou', src: '/assets/images/amadou.jpg' },
  { name: 'Florence', src: '/assets/images/florence.jpg' },
  { name: 'Mathieu', src: '/assets/images/mathieu.jpg' },
  { name: 'Grace', src: '/assets/images/grace.jpg' }
])

const bannerHouseImage = '/assets/images/bastos_yaounde.jpg'
</script>

<template>
  <section class="py-20 px-6 max-w-7xl mx-auto" id="benefices">
    <!-- En-tête -->
    <div class="text-center max-w-2xl mx-auto mb-16" id="features-heading-area">
      <span class="bg-[#FFD5D0] text-[#1A237E] text-xs font-black uppercase tracking-widest px-4.5 py-1.5 rounded-full border border-[#1A237E]/20 inline-block mb-3.5 shadow-sm">
        Avantages findMe
      </span>
      <h2 class="text-3xl md:text-5xl font-black tracking-tight text-[#1A237E] leading-tight" id="features-main-title">
        Une adresse claire change tout dans la vie.
      </h2>
      <p class="mt-4 text-base md:text-lg text-[#1A237E]/80 font-normal">
        Notre plateforme fusionne la rigueur cartographique moderne avec la convivialité des repères locaux camerounais.
      </p>
    </div>

    <!-- Grille des atouts -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="benefits-grid">
      <div 
        v-for="(benefit, i) in benefits"
        :key="i"
        class="group relative bg-[#FDFCF2] rounded-3xl p-8 border-3 border-[#1A237E] hover:-translate-y-1.5 transition-all duration-300 shadow-[6px_6px_0px_0px_#1A237E] hover:shadow-[10px_10px_0px_0px_#2E7D32]"
        :id="`benefit-card-${i}`"
      >
        <div class="absolute top-4 right-4 bg-[#FFD5D0] group-hover:bg-[#2E7D32] group-hover:text-white border-2 border-[#1A237E] rounded-full px-3.5 py-0.5 text-[9px] font-extrabold text-[#1A237E] uppercase tracking-wider transition-colors">
          {{ benefit.badge }}
        </div>

        <div class="w-14 h-14 bg-white border-2 border-[#1A237E] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#FFD5D0] group-hover:shadow-[4px_4px_0px_0px_#4CAF50] transition-all mb-6">
          <component :is="featuresIcons[i]" :class="['w-8 h-8', benefit.colorClass]" />
        </div>

        <h3 class="text-xl font-extrabold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors mb-2.5">
          {{ benefit.title }}
        </h3>
        <p class="text-sm text-[#1A237E]/80 leading-relaxed font-normal">
          {{ benefit.description }}
        </p>
      </div>
    </div>

    <!-- Bannière de confiance à Yaoundé / Douala -->
    <div class="mt-16 bg-[#1A237E] text-white rounded-[32px] border-3 border-[#1A237E] shadow-[8px_8px_0px_0px_#2E7D32] overflow-hidden flex flex-col lg:flex-row items-stretch" id="features-trust-banner">
      <div class="flex-1 p-8 md:p-12 space-y-8 flex flex-col justify-between" id="trust-banner-text-side">
        <div class="space-y-3">
          <span class="bg-[#FFD5D0] text-[#1A237E] text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full border border-[#1A237E]/25 inline-block">
            Impact Citoyen
          </span>
          <h3 class="text-2xl md:text-3.5xl font-black text-white leading-tight">
            Déjà adopté à Douala et Yaoundé !
          </h3>
          <p class="text-sm text-[#FBF8FF]/85 font-normal leading-relaxed">
            Des centaines de foyers utilisent findMe en tant qu'adresse officielle pour recevoir du courrier de l'étranger, faire livrer des marchandises ou guider les secours médicaux à coup sûr.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10" id="trust-banner-footer">
          <div class="flex -space-x-3 items-center" id="trusted-people-avatars">
            <NuxtImg 
              v-for="(person, idx) in avatarPersons"
              :key="idx"
              :src="person.src"
              :alt="person.name"
              class="w-10 h-10 rounded-full border-2 border-[#1A237E] bg-white object-cover"
              referrerPolicy="no-referrer"
            />
            <div class="pl-5 text-xs text-[#FFD5D0] font-black uppercase tracking-wider">
              +500 foyers inscrits
            </div>
          </div>
        </div>
      </div>

      <!-- Illustration de pavillon camerounais -->
      <div class="w-full lg:w-[420px] relative bg-[#1A237E] min-h-[300px] lg:min-h-auto overflow-hidden shrink-0" id="trust-banner-image-side">
        <NuxtImg 
          :src="bannerHouseImage"
          alt="Foyer Camerounais Enregistré - Bastos Yaoundé"
          class="w-full h-full object-cover opacity-90 lg:opacity-85 hover:opacity-100 transition-opacity duration-300"
          referrerPolicy="no-referrer"
          id="cameroon-registered-house-img"
        />
        <!-- <div class="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#1A237E] to-transparent pointer-events-none dark:from-[#2E7D32] dark:to-transparent" />
        <div class="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#1A237E] to-transparent pointer-events-none hidden lg:block dark:from-[#2E7D32] dark:to-transparent" />
        <div class="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#1A237E] to-transparent pointer-events-none hidden lg:block dark:from-[#1A237E] dark:to-transparent" />
        <div class="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#1A237E] via-[#1A237E]/40 to-transparent pointer-events-none dark:from-[#1A237E] dark:to-transparent" /> -->
        
        <div class="absolute bottom-4 left-4 right-4 bg-[#1A237E]/90 backdrop-blur-md border border-white/15 p-3 rounded-2xl flex items-center justify-between" id="house-overlay-tag">
          <div>
            <span class="text-[9px] text-[#FFD5D0] font-black uppercase tracking-wider block">Foyer Enregistré</span>
            <span class="text-xs font-bold text-white block">Famille Florence, Bastos, Yaoundé</span>
          </div>
          <div class="bg-[#2E7D32] text-white text-[9px] font-black px-2.5 py-1 rounded-lg shrink-0">
            FM-YDE-BAS-28B
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
