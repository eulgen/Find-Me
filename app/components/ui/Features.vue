<!--
  @file Features.vue
  @description Section avantages findMe — redesign premium avec grille de cartes
  à effet hover glassmorphism et bannière de confiance. Logique conservée.
-->

<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck, MapPin, Printer, Smartphone, Map, Sparkles } from 'lucide-vue-next'
import features from '~/data/features.json'
import type { LucideIcon } from 'lucide-vue-next'

const featuresIcons = [ShieldCheck, MapPin, Printer, Smartphone, Map, Sparkles] as LucideIcon[]
const benefits = computed(() => features)

const avatarPersons = computed(() => [
  { name: 'Amadou',  src: '/assets/images/amadou.jpg' },
  { name: 'Florence', src: '/assets/images/florence.jpg' },
  { name: 'Mathieu', src: '/assets/images/mathieu.jpg' },
  { name: 'Grace',   src: '/assets/images/grace.jpg' },
])

const bannerHouseImage = '/assets/images/bastos_yaounde.jpg'

const accentColors = [
  'text-blue-600', 'text-[#2E7D32]', 'text-purple-500',
  'text-orange-500', 'text-teal-500', 'text-pink-500',
]
</script>

<template>
  <section class="py-24 px-6 bg-white dark:bg-[#0A0D1A]" id="benefices">

    <!-- En-tête -->
    <div class="text-center max-w-2xl mx-auto mb-16" id="features-heading-area">
      <span class="inline-block bg-[#FF6D00]/10 text-[#FF6D00] text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#FF6D00]/20 mb-4">
        Avantages findMe
      </span>
      <h2 class="text-3xl md:text-5xl font-black tracking-tight text-[#1A237E] dark:text-white leading-tight" id="features-main-title">
        Une adresse claire<br />change tout dans la vie.
      </h2>
      <p class="mt-4 text-base text-[#1A237E]/65 dark:text-slate-400 font-normal leading-relaxed">
        Notre plateforme fusionne la rigueur cartographique moderne avec la convivialité des repères locaux camerounais.
      </p>
    </div>

    <!-- Grille des atouts -->
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="benefits-grid">
        <div
          v-for="(benefit, i) in benefits"
          :key="i"
          class="group relative bg-gray-50 dark:bg-slate-900/60 rounded-2xl p-7 border border-gray-100 dark:border-slate-800 hover:border-[#2E7D32]/35 hover:shadow-xl hover:shadow-[#1A237E]/6 hover:-translate-y-1.5 transition-all duration-300"
          :id="`benefit-card-${i}`"
        >
          <!-- Badge -->
          <div class="absolute top-5 right-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-2.5 py-0.5 rounded-full group-hover:border-[#2E7D32]/30 group-hover:text-[#2E7D32] transition-colors">
            {{ benefit.badge }}
          </div>

          <!-- Icône -->
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
            :class="`bg-gray-100 dark:bg-slate-800`"
          >
            <component :is="featuresIcons[i]" :class="['w-6 h-6', accentColors[i]]" />
          </div>

          <!-- Contenu -->
          <h3 class="text-base font-extrabold text-[#1A237E] dark:text-white group-hover:text-[#2E7D32] transition-colors mb-2 leading-snug">
            {{ benefit.title }}
          </h3>
          <p class="text-sm text-[#1A237E]/65 dark:text-slate-400 leading-relaxed font-normal">
            {{ benefit.description }}
          </p>

          <!-- Ligne de séparation décorative -->
          <div class="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#2E7D32]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      <!-- Bannière de confiance -->
      <div
        class="mt-12 rounded-3xl overflow-hidden relative flex flex-col lg:flex-row items-stretch bg-[#1A237E] dark:bg-[#10164A]"
        id="features-trust-banner"
      >
        <!-- Décor interne -->
        <div class="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
          <svg class="w-full h-full"><defs><pattern id="feat-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#feat-grid)"/></svg>
        </div>

        <!-- Texte gauche -->
        <div class="relative flex-1 p-8 md:p-12 flex flex-col justify-between gap-8" id="trust-banner-text-side">
          <div class="space-y-4">
            <span class="inline-block bg-white/10 border border-white/15 text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full">
              Impact Citoyen
            </span>
            <h3 class="text-2xl md:text-3xl font-black text-white leading-tight">
              Déjà adopté à Douala<br />et Yaoundé&nbsp;!
            </h3>
            <p class="text-sm text-white/70 font-normal leading-relaxed max-w-sm">
              Des centaines de foyers utilisent findMe comme adresse officielle pour recevoir du courrier, faire livrer des marchandises et guider les secours.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-white/10" id="trust-banner-footer">
            <div class="flex -space-x-3 items-center" id="trusted-people-avatars">
              <NuxtImg
                v-for="(person, idx) in avatarPersons"
                :key="idx"
                :src="person.src"
                :alt="person.name"
                class="w-9 h-9 rounded-full border-2 border-[#1A237E] bg-white object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div class="text-sm font-extrabold text-white/80">
              +500 foyers inscrits
              <span class="block text-xs font-normal text-white/45 mt-0.5">et ça grandit chaque jour</span>
            </div>
          </div>
        </div>

        <!-- Image droite -->
        <div class="relative w-full lg:w-[400px] min-h-[260px] overflow-hidden shrink-0" id="trust-banner-image-side">
          <NuxtImg
            :src="bannerHouseImage"
            alt="Foyer Camerounais — Bastos Yaoundé"
            class="w-full h-full object-cover opacity-75 hover:opacity-90 transition-opacity duration-500"
            referrerPolicy="no-referrer"
            id="cameroon-registered-house-img"
          />
          <div class="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1A237E] to-transparent hidden lg:block" />
          <!-- Tag -->
          <div class="absolute bottom-4 left-4 right-4 bg-[#1A237E]/80 backdrop-blur-sm border border-white/10 px-3.5 py-2.5 rounded-xl flex items-center justify-between" id="house-overlay-tag">
            <div>
              <span class="text-[9px] text-white/50 font-black uppercase tracking-wider block">Foyer Enregistré</span>
              <span class="text-xs font-bold text-white">Famille Florence, Bastos, Yaoundé</span>
            </div>
            <div class="bg-[#2E7D32] text-white text-[9px] font-black px-2.5 py-1 rounded-lg shrink-0 ml-2">
              FM-YDE-BAS-28B
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
