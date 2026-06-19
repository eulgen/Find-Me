<!--
  @file Hero.vue
  @description Section d'accueil principale findMe — philosophie "trouver son chemin".
  L'image droite est une photo aérienne réelle de Bastos (Yaoundé) avec overlay GPS.
-->

<script setup lang="ts">
import { ref } from "vue";
import { ArrowRight, PlayCircle, CheckCircle2, MapPin, Users, Zap } from "lucide-vue-next";
import ButtonUI from "./ButtonUI.vue";

const emit = defineEmits<{
  (e: "scroll-to-step", stepId: string): void;
  (e: "create-address-click"): void;
}>();

const isPrimaryLoading = ref(false);
const isSecondaryLoading = ref(false);

const handlePrimaryClick = () => {
  isPrimaryLoading.value = true;
  setTimeout(() => {
    isPrimaryLoading.value = false;
    navigateTo("/creer-mon-adresse");
  }, 700);
};

const handleSecondaryClick = () => {
  isSecondaryLoading.value = true;
  setTimeout(() => {
    isSecondaryLoading.value = false;
    emit("scroll-to-step", "comment-ca-marche");
  }, 1000);
};

const stats = [
  { icon: Users,  value: "+500",   label: "foyers enregistrés" },
  { icon: MapPin, value: "2 villes", label: "Douala & Yaoundé" },
  { icon: Zap,    value: "< 3 min", label: "pour créer une adresse" },
];
</script>

<template>
  <section
    class="relative w-full overflow-hidden bg-white dark:bg-[#0A0D1A]"
    id="app-hero"
  >
    <!-- ── Décor fond ───────────────────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style="background: radial-gradient(circle, #2E7D32 0%, #1A237E 55%, transparent 100%)"
      />
      <svg class="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.035]">
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A237E" stroke-width="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      <div
        class="absolute bottom-0 left-0 right-0 h-px"
        style="background: linear-gradient(90deg, transparent, #2E7D32 30%, #1A237E 70%, transparent)"
      />
    </div>

    <div
      class="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-14 lg:gap-20"
      id="hero-inner"
    >

      <!-- ═══════════════════════════════════════════════════════
           COLONNE GAUCHE — texte + CTA
      ════════════════════════════════════════════════════════ -->
      <div class="flex-1 space-y-8 text-center lg:text-left" id="hero-left-contents">

        <!-- Badge mission -->
        <div
          class="inline-flex items-center gap-2.5 bg-[#2E7D32]/10 border border-[#2E7D32]/25 px-4 py-2 rounded-full"
          id="hero-mission-badge"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
          <span class="text-[11px] md:text-xs font-extrabold uppercase tracking-widest text-[#2E7D32]">
            L'initiative civique d'adressage camerounais
          </span>
        </div>

        <!-- Titre H1 -->
        <h1
          class="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-black text-[#1A237E] dark:text-white leading-[1.08] tracking-tight"
          id="hero-display-title"
        >
          Chaque foyer mérite<br />une
          <span class="relative inline-block">
            <span class="relative z-10 text-[#2E7D32]">adresse précise</span>
            <svg
              class="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 220 8"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 6 Q55 2 110 5 Q165 8 218 3"
                stroke="#2E7D32"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            </svg>
          </span>
          &amp;&nbsp;officielle.
        </h1>

        <!-- Sous-titre -->
        <p
          class="text-base md:text-lg text-[#1A237E]/70 dark:text-slate-300 max-w-[520px] mx-auto lg:mx-0 font-normal leading-relaxed"
          id="hero-subtitle"
        >
          Fini le flou des
          <em class="not-italic font-semibold text-[#1A237E] dark:text-white">«&nbsp;à côté de la boutique jaune&nbsp;»</em>.
          Générez un code structuré, un QR code et recevez livreurs et secours
          à Douala, Yaoundé et dans tout le Cameroun.
        </p>

        <!-- Puces d'atouts -->
        <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2.5" id="hero-value-markers">
          <div
            v-for="item in ['Norme Municipale', 'GPS Satellite', 'QR Code Standard']"
            :key="item"
            class="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-[#1A237E]/10 dark:border-slate-700 shadow-sm text-xs text-[#1A237E] dark:text-slate-300 font-semibold"
          >
            <CheckCircle2 class="w-4 h-4 text-[#2E7D32] shrink-0" />
            {{ item }}
          </div>
        </div>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1"
          id="hero-cta-buttons"
        >
          <ButtonUI
            variant="primary"
            :loading="isPrimaryLoading"
            :disabled="isPrimaryLoading || isSecondaryLoading"
            :icon="ArrowRight"
            iconPosition="right"
            @click="handlePrimaryClick"
            class="w-full sm:w-auto"
            id="hero-primary-cta"
          >
            Créer mon adresse
          </ButtonUI>
          <ButtonUI
            variant="outline"
            :loading="isSecondaryLoading"
            :disabled="isSecondaryLoading || isPrimaryLoading"
            :icon="PlayCircle"
            @click="handleSecondaryClick"
            class="w-full sm:w-auto"
            id="hero-secondary-cta"
          >
            Voir comment ça marche
          </ButtonUI>
        </div>

        <!-- Stats rapides -->
        <div
          class="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 border-t border-[#1A237E]/8 dark:border-slate-800"
          id="hero-quick-stats"
        >
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex items-center gap-2.5"
          >
            <div class="w-8 h-8 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center shrink-0">
              <component :is="stat.icon" class="w-4 h-4 text-[#2E7D32]" />
            </div>
            <div class="text-left">
              <p class="text-sm font-extrabold leading-none text-[#1A237E] dark:text-white">{{ stat.value }}</p>
              <p class="text-[11px] text-[#1A237E]/55 dark:text-slate-500 font-medium mt-0.5">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════
           COLONNE DROITE — photo aérienne + overlay GPS
           Philosophie : "trouver son chemin"
      ════════════════════════════════════════════════════════ -->
      <div
        class="flex-1 w-full max-w-xl lg:max-w-none flex justify-center items-center"
        id="hero-right-contents"
      >
        <div class="relative w-full max-w-[540px]" id="hero-map-card">

          <!-- Halo ambiant -->
          <div
            class="absolute -inset-8 rounded-[56px] blur-3xl opacity-30 pointer-events-none"
            style="background: radial-gradient(ellipse, #2E7D32 0%, #1A237E 50%, transparent 75%)"
            aria-hidden="true"
          />

          <!-- Carte principale : immeuble sur carte satellitaire -->
          <div class="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10" id="hero-map-photo-frame">
            <NuxtImg
              src="/assets/images/hero_building_map.png"
              alt="Immeuble géolocalisé sur carte satellitaire – findMe Cameroun"
              class="w-full h-[400px] md:h-[480px] object-cover"
              referrerpolicy="no-referrer"
              id="hero-building-map-photo"
            />

            <!-- Overlay dégradé pour lisibilité des badges -->
            <div
              class="absolute inset-0 pointer-events-none"
              style="background: linear-gradient(160deg, rgba(26,35,126,0.45) 0%, transparent 45%, rgba(10,10,30,0.55) 100%)"
              aria-hidden="true"
            />

            <!-- ── PIN GPS animé centré ─────────────────────── -->
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center"
              id="hero-gps-pin"
              aria-hidden="true"
            >
              <!-- Cercle de signal pulsant -->
              <div class="relative">
                <div class="absolute -inset-3 rounded-full bg-[#2E7D32]/30 animate-ping" />
                <div class="absolute -inset-5 rounded-full bg-[#2E7D32]/15 animate-pulse" />
                <div class="w-12 h-12 rounded-full bg-[#2E7D32] border-4 border-white shadow-xl flex items-center justify-center">
                  <MapPin class="w-5 h-5 text-white stroke-[2.5]" />
                </div>
              </div>
              <!-- Tige du pin -->
              <div class="w-0.5 h-4 bg-[#2E7D32] opacity-70" />
              <div class="w-2 h-2 rounded-full bg-[#2E7D32] opacity-50" />
            </div>

            <!-- ── Badge ADRESSE en haut à gauche ─────────── -->
            <div
              class="absolute top-4 left-4 z-30 backdrop-blur-md bg-white/90 dark:bg-[#0a0d1a]/85 border border-white/60 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 -rotate-1"
              id="hero-badge-address"
            >
              <div class="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse shrink-0" />
              <div>
                <p class="font-mono text-[9px] font-bold text-[#2E7D32] uppercase tracking-widest leading-none">Code d'adresse</p>
                <p class="font-mono text-[12px] font-black text-[#1A237E] dark:text-white tracking-wider mt-0.5">FM-YDE-BAS-28B</p>
              </div>
            </div>

            <!-- ── Badge LOCALISÉ en bas à droite ─────────── -->
            <div
              class="absolute bottom-4 right-4 z-30 backdrop-blur-md bg-[#1A237E]/90 border border-white/15 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 rotate-1"
              id="hero-badge-localized"
            >
              <div class="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse shrink-0" />
              <div>
                <p class="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none">Localisé</p>
                <p class="text-[11px] font-extrabold text-white mt-0.5">Bastos, Yaoundé</p>
              </div>
            </div>

            <!-- ── Ligne de scan (effet radar) ────────────── -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
              <div class="scan-line" />
            </div>

            <!-- ── Watermark findMe ─────────────────────── -->
            <div
              class="absolute bottom-4 left-4 z-30 text-[9px] font-black text-white/40 uppercase tracking-widest font-mono"
            >
              findMe · Carte Officielle
            </div>
          </div>

          <!-- ── Badge flottant DOUALA hors carte ─────────── -->
          <div
            class="absolute -top-4 -right-4 z-40 bg-white dark:bg-slate-900 border border-[#1A237E]/12 dark:border-slate-700 px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 rotate-2 hidden md:flex"
            id="hero-badge-douala"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span class="font-mono text-[10px] font-black text-[#1A237E] dark:text-white tracking-wider">
              DOUALA · DEIDO 4A
            </span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ligne de scan radar */
.scan-line {
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(46,125,50,0.6), transparent);
  animation: scan 3s ease-in-out infinite;
}

@keyframes scan {
  0%   { top: -4px; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
</style>
