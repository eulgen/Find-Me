<!--
  @file app/components/ui/Partners.vue
  @description Section partenaires findMe — logos fiables avec fallback initiales stylées.
  MTN et Jumia utilisent des initiales premium (logos Wikipedia instables).
-->

<script setup lang="ts">
const partners = [
  {
    name: "Google",
    logo: "/assets/images/google.svg",
    category: "Cartographie & Cloud",
    accent: "#4285F4",
  },
  {
    name: "Orange Cameroun",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg",
    category: "Opérateur Télécom",
    accent: "#FF7900",
  },
  {
    name: "MTN Cameroun",
    logo: null,
    initials: "MTN",
    category: "Opérateur Mobile",
    accent: "#FFCC00",
    textColor: "#1A1A1A",
  },
  {
    name: "DHL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg",
    category: "Logistique & Livraison",
    accent: "#D40511",
  },
  {
    name: "Jumia",
    logo: null,
    initials: "JUM",
    category: "E-commerce",
    accent: "#F68B1E",
    textColor: "#ffffff",
  },
  {
    name: "Afriland First Bank",
    logo: null,
    initials: "AFB",
    category: "Banque & Finance",
    accent: "#1A237E",
    textColor: "#ffffff",
  },
  {
    name: "CAMPOST",
    logo: null,
    initials: "CAM",
    category: "Poste Nationale",
    accent: "#2E7D32",
    textColor: "#ffffff",
  },
  {
    name: "Nexttel",
    logo: null,
    initials: "NXT",
    category: "Opérateur Mobile",
    accent: "#6A1B9A",
    textColor: "#ffffff",
  },
];
</script>

<template>
  <section
    class="py-16 px-6 overflow-hidden bg-gray-50 dark:bg-[#0C0F1C] border-t border-gray-100 dark:border-slate-800/60"
    id="partners-section"
  >
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-10" id="partners-heading">
        <p class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1A237E]/45 dark:text-slate-500 mb-3">
          Écosystème de confiance
        </p>
        <h2 class="text-2xl md:text-3xl font-black text-[#1A237E] dark:text-white tracking-tight">
          Nos partenaires &amp; intégrations
        </h2>
        <p class="mt-2 text-sm text-[#1A237E]/60 dark:text-slate-400 max-w-lg mx-auto font-normal">
          findMe s'intègre avec les acteurs qui font le quotidien digital du Cameroun.
        </p>
      </div>

      <!-- Grid partenaires -->
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"
        id="partners-grid"
      >
        <div
          v-for="(p, i) in partners"
          :key="i"
          :id="`partner-card-${i}`"
          class="group relative flex flex-col items-center justify-center gap-3 p-5 bg-white dark:bg-slate-900/70 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-[#2E7D32]/40 hover:shadow-lg hover:shadow-[#2E7D32]/6 hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Category tooltip -->
          <span
            class="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider text-gray-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-right leading-tight max-w-[80px]"
          >{{ p.category }}</span>

          <!-- Logo SVG ou Initiales -->
          <div class="h-12 flex items-center justify-center">
            <img
              v-if="p.logo"
              :src="p.logo"
              :alt="p.name"
              class="h-7 max-w-[110px] object-contain grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              referrerpolicy="no-referrer"
              loading="lazy"
            />
            <div
              v-else
              class="w-14 h-10 rounded-xl flex items-center justify-center font-black text-[13px] tracking-widest transition-all duration-300 group-hover:scale-105"
              :style="{ background: p.accent, color: p.textColor || '#fff' }"
            >
              {{ p.initials }}
            </div>
          </div>

          <!-- Nom -->
          <span
            class="text-[11px] font-semibold text-gray-400 dark:text-slate-500 group-hover:text-[#1A237E] dark:group-hover:text-white transition-colors duration-200 text-center leading-snug"
          >{{ p.name }}</span>
        </div>
      </div>

      <!-- CTA bas -->
      <div class="mt-10 text-center">
        <p class="text-xs text-gray-400 dark:text-slate-500">
          Vous souhaitez devenir partenaire findMe ?
          <a
            href="#contact-support-section"
            class="text-[#2E7D32] font-bold hover:underline underline-offset-2 ml-1"
          >Contactez-nous →</a>
        </p>
      </div>
    </div>
  </section>
</template>
