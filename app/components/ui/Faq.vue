<!--
  @file Faq.vue
  @description Composant de Foire Aux Questions (FAQ) pour findMe Cameroun.
  Présente les questions d'intérêt civil sous forme de panneaux accordéons interactifs.
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-vue-next'

const openIndex = ref<number | null>(0)

const questions = computed(() => [
  {
    q: "Est-ce que le service findMe est gratuit ?",
    a: "Oui, l'attribution et l'édition de votre adresse civique findMe sont entièrement gratuites pour tous les citoyens. L'objectif est de garantir l'accès universel à un adressage de qualité."
  },
  {
    q: "Comment puis-je partager mon adresse avec des livreurs ?",
    a: "Une fois générée, vous pouvez partager votre fiche PDF d'adresse par WhatsApp, e-mail ou SMS. Les livreurs n'auront qu'à flasher la fiche (ou cliquer sur le lien court) pour ouvrir le GPS directement sur notre carte d'orientation et repérer votre portail."
  },
  {
    q: "Et si le GPS de mon smartphone n'est pas fiable ?",
    a: "Pas de souci ! Notre module combine localisation satellite et ajustement pictural manuel. Si votre GPS donne une position imprécise, déplacez simplement et précisément le repère sur notre carte en glissant le doigt vers votre portail réel."
  },
  {
    q: "Peut-on utiliser findMe sans connexion internet active ?",
    a: "Absolument. findMe est conçu 'contexte-offline' : vous formulez votre adresse en local et enregistrez votre géolocalisation. Vos coordonnées sont mémorisées sagement en cache et se transmettent en ligne dès que vous captez du réseau !"
  }
])

const toggleIndex = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx
}
</script>

<template>
  <section class="py-24 px-6 bg-[#F5F2FB] border-t-3 border-b-3 border-[#1A237E]" id="faq">
    <div class="max-w-4xl mx-auto" id="faq-inner-box">
      <!-- Titre et sous-texte -->
      <div class="text-center mb-16" id="faq-meta-block">
        <span class="bg-[#4CAF50]/15 text-[#2E7D32] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full border border-[#2E7D32]/10 inline-block mb-3">
          FAQ • SUPPORT
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-[#1A237E] tracking-tight">
          Une réponse à vos questions
        </h2>
        <p class="mt-4 text-xs md:text-sm text-[#1A237E]/70 max-w-md mx-auto font-normal">
          Tout que vous devez savoir pour entamer votre immatriculation d'adressage sans aucune hésitation.
        </p>
      </div>

      <!-- Bloc Accordéons -->
      <div class="space-y-4" id="faq-accordions-container">
        <div 
          v-for="(item, idx) in questions"
          :key="idx"
          class="bg-white border-3 border-[#1A237E] rounded-2xl overflow-hidden transition-all duration-200"
          :id="`faq-panel-${idx}`"
        >
          <button
            type="button"
            @click="toggleIndex(idx)"
            class="w-full text-left px-6 py-5 flex items-center justify-between font-extrabold text-[#1A237E] hover:text-[#2E7D32] text-sm md:text-base cursor-pointer focus:outline-none"
            :id="`faq-header-btn-${idx}`"
            :aria-expanded="openIndex === idx"
            :aria-controls="`faq-body-content-${idx}`"
          >
            <div class="flex items-center space-x-3.5 pr-4">
              <HelpCircle class="w-5 h-5 text-[#2E7D32] shrink-0" />
              <span>{{ item.q }}</span>
            </div>
            <ChevronUp v-if="openIndex === idx" class="w-5 h-5 text-[#1A237E] shrink-0" />
            <ChevronDown v-else class="w-5 h-5 text-[#1A237E] shrink-0" />
          </button>

          <!-- Zone déployable de réponse -->
          <div 
            v-if="openIndex === idx"
            class="px-6 pb-6 pt-1 text-xs md:text-sm text-[#1A237E]/80 border-t-2 border-[#1A237E]/5 leading-relaxed font-normal" 
            role="region"
            :aria-labelledby="`faq-header-btn-${idx}`"
            :id="`faq-body-content-${idx}`"
          >
            {{ item.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
