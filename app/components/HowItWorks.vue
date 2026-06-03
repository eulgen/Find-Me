<!--
  @file HowItWorks.vue
  @description Section de présentation bilingue interactive des 3 étapes de findMe Cameroun.
  Présente d'un côté la chronologie d'adressage et de l'autre l'illustration correspondante d'Afrique et du Cameroun.
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Check, MapPin, ClipboardList, Send, Map } from 'lucide-vue-next'
import { type AddressData } from '../types'

const props = defineProps<{
  address: AddressData
  currentLang: 'FR' | 'EN'
}>()

const emit = defineEmits<{
  (e: 'update:address', value: AddressData): void
}>()

// Étape d'illustration active
const activeStep = ref<number>(0)

const steps = [
  {
    id: 0,
    icon: ClipboardList,
    titleFr: 'Saisie de vos détails civiques',
    titleEn: 'Enter municipal credentials',
    descFr: 'Renseignez la ville, le quartier et votre numéro de plaque cadastrale. Ajoutez un repère familier (ex: "Face pharmacie de Bastos") et une photographie optionnelle de votre portail ou barrière pour faciliter le répérage.',
    descEn: 'Specify your city, neighborhood, and cadastral house plate number. Insert easy local landmarks (e.g. "Opposite Bastos pharmacy") and an optional frontage photograph to guide final meters.',
    img: '/assets/images/cameroon_house_address_1780109511639.png',
    tagFr: 'Étape 1 : Localisation du domicile',
    tagEn: 'Step 1: Household Registration',
    badgeFr: 'Formulaire',
    badgeEn: 'Registry'
  },
  {
    id: 1,
    icon: Map,
    titleFr: 'Positionnement GPS millimétrique',
    titleEn: 'Satellite coordinate validation',
    descFr: 'Ajustez de manière interactive et précise le repère géographique de votre propriété en direct sur notre cartographie satellite standardisée. findMe sécurise la capture géodésique pour un résultat conforme.',
    descEn: 'Millimetrically pinpoint your exact property gate directly on our standardized satellite imagery canvas. findMe secures your coordinate parameters with military-grade precision.',
    img: '/assets/images/hero_cameroon_address_1780108325962.png',
    tagFr: 'Étape 2 : Validation sur l\'imagerie',
    tagEn: 'Step 2: Geographic Calibration',
    badgeFr: 'Carte interactive',
    badgeEn: 'GPS Mapping'
  },
  {
    id: 2,
    icon: Send,
    titleFr: 'Votre code & plaque de partage',
    titleEn: 'Get standard code & share',
    descFr: 'Générez votre code d\'adresse structuré (ex: `FM-YDE-BAS-28B`) et téléchargez votre certificat officiel. Partagez votre itinéraire en un clic sur WhatsApp, par mail ou SMS avec vos livreurs, proches et secours.',
    descEn: 'Generate your short address identification code and download your official PDF/SVG plate. Share standard point routes on WhatsApp, mail, or SMS straight to cargo dispatchers, guests, and emergencies.',
    img: '/assets/images/cameroon_delivery_man_1780109448383.png',
    tagFr: 'Étape 3 : Code d\'adressage unique',
    tagEn: 'Step 3: Unique Citizen Code',
    badgeFr: 'Usage & Diffusion',
    badgeEn: 'Last-Mile Delivery'
  }
]

const activeStepData = computed(() => {
  return (steps[activeStep.value] || steps[0]) as typeof steps[0]
})
</script>

<template>
  <section class="py-24 px-6 bg-[#F5F2FB] dark:bg-[#11142A] border-t-4 border-b-4 border-[#1A237E] dark:border-[#2E7D32]" id="comment-ca-marche">
    <div class="max-w-7xl mx-auto" id="comment-how-grid-container">
      
      <!-- En-tête -->
      <div class="text-center max-w-2xl mx-auto mb-16" id="wizard-heading-meta">
        <span class="bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#2E7D32]/10 inline-block mb-3.5">
          {{ currentLang === 'FR' ? 'Accompagnement Citoyen' : 'Step-By-Step Standard' }}
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-[#1A237E] dark:text-white tracking-tight">
          {{ currentLang === 'FR' ? 'Créez votre adresse en 3 étapes' : 'Build your Address in 3 Easy Steps' }}
        </h2>
        <p class="mt-4 text-sm md:text-base text-[#1A237E]/75 dark:text-slate-300 max-w-lg mx-auto font-medium">
          {{ currentLang === 'FR' 
            ? 'Une procédure fluide et assistée de bout en bout pour géolocaliser votre barrière et obtenir votre certificat findMe.' 
            : 'A transparent, fully guided process to map your property gates and secure your custom civic navigation label.' }}
        </p>
      </div>

      <!-- Rubrique d'interaction double volet -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- VOLET GAUCHE / LES 3 ÉTAPES INTERACTIVES -->
        <div class="lg:col-span-6 space-y-5" id="steps-selector-side">
          <div 
            v-for="step in steps" 
            :key="step.id"
            @click="activeStep = step.id"
            class="bg-white dark:bg-[#191D3C] border-3 rounded-[24px] p-6 transition-all duration-300 cursor-pointer text-left block"
            :class="activeStep === step.id 
              ? 'border-[#2E7D32] dark:border-[#2E7D32] shadow-[6px_6px_0px_0px_#1A237E] dark:shadow-[6px_6px_0px_0px_#2E7D32] translate-x-1.5' 
              : 'border-[#1A237E]/10 dark:border-slate-800 hover:border-[#1A237E]/40 hover:-translate-y-0.5'"
            :id="`step-option-card-${step.id}`"
          >
            <div class="flex items-start space-x-4">
              <!-- Indicateur d'étape ou Icône -->
              <div 
                class="w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-colors"
                :class="activeStep === step.id 
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32]' 
                  : 'bg-[#F5F2FB] dark:bg-slate-800 text-[#1A237E] dark:text-slate-200 border-[#1A237E]/10'"
              >
                <component :is="step.icon" class="w-5.5 h-5.5" />
              </div>

              <!-- Bloc Texte -->
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="text-[9px] font-black uppercase tracking-widest text-[#2E7D32] dark:text-emerald-400">
                    {{ currentLang === 'FR' ? step.badgeFr : step.badgeEn }}
                  </span>
                  <span v-if="activeStep === step.id" class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-ping" />
                </div>
                
                <h3 class="text-base md:text-lg font-black text-[#1A237E] dark:text-white leading-tight">
                  {{ currentLang === 'FR' ? step.titleFr : step.titleEn }}
                </h3>
                
                <p class="text-xs md:text-sm text-[#1A237E]/75 dark:text-slate-300 leading-relaxed font-normal pt-1">
                  {{ currentLang === 'FR' ? step.descFr : step.descEn }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- VOLET DROIT / ILLUSTRATIONS CORRESPONDANTES DU CAMEROUN -->
        <div class="lg:col-span-6 flex flex-col justify-center relative" id="steps-illustrations-viewpanel">
          <div class="relative w-full max-w-xl mx-auto" id="how-its-illustrated-container">
            <!-- Blur Background Accent -->
            <div class="absolute -inset-4 bg-gradient-to-tr from-[#2E7D32]/15 to-[#1A237E]/15 rounded-[40px] blur-3xl opacity-60 pointer-events-none" />

            <!-- Card Wrap -->
            <div class="bg-white dark:bg-[#141732] border-4 border-[#1A237E] dark:border-[#2E7D32] rounded-[32px] overflow-hidden shadow-[10px_10px_0px_0px_#2E7D32] dark:shadow-[10px_10px_0px_0px_#1A237E] relative">
              <!-- Top Badge -->
              <div class="absolute top-0 inset-x-0 bg-[#1A237E]/90 dark:bg-[#191D3C]/95 backdrop-blur-sm text-white px-5 py-3 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between border-b-2 border-[#1A237E]/10 z-10">
                <span>{{ currentLang === 'FR' ? activeStepData.tagFr : activeStepData.tagEn }}</span>
                <span class="bg-[#2E7D32] px-2.5 py-0.5 rounded text-[8px] font-black tracking-widest text-white">LIVE PREVIEW</span>
              </div>

              <!-- Main Illustration Image with key for smooth Vue re-render animations -->
              <div class="h-[340px] md:h-[390px] w-full pt-12 overflow-hidden bg-white flex items-center justify-center relative">
                <transition name="fade" mode="out-in">
                  <img
                    :key="activeStep"
                    :src="activeStepData.img"
                    :alt="currentLang === 'FR' ? activeStepData.tagFr : activeStepData.tagEn"
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    referrerpolicy="no-referrer"
                    :id="`step-active-img-${activeStep}`"
                  />
                </transition>
              </div>
              
              <!-- Bottom interactive navigation selector directly beneath illustration -->
              <div class="bg-[#EDF2FA] dark:bg-slate-900 px-5 py-4 flex items-center justify-between border-t border-[#1A237E]/10">
                <span class="text-[10px] font-black text-[#1A237E]/70 dark:text-slate-300">
                  {{ currentLang === 'FR' ? 'Consulter d\'autres étapes :' : 'Browse other instructions :' }}
                </span>
                
                <div class="flex items-center space-x-2">
                  <button 
                    v-for="s in [0, 1, 2]" 
                    :key="s"
                    @click="activeStep = s"
                    class="w-8 h-8 rounded-full font-black text-xs border-2 transition-all cursor-pointer"
                    :class="activeStep === s 
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] scale-110 shadow-sm' 
                      : 'bg-white dark:bg-[#1E213D] text-[#1A237E] dark:text-slate-200 border-[#1A237E]/20 hover:border-[#1A237E]/60'"
                  >
                    {{ s + 1 }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
