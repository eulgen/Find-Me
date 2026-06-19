<!--
  @file Faq.vue
  @description FAQ findMe — redesign premium avec accordéons flottants et transitions douces.
  Logique métier (toggleIndex, openIndex) conservée à l'identique.
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Minus, MessageCircleQuestion } from 'lucide-vue-next'

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
    a: "Absolument. findMe est conçu 'contexte-offline' : vous formulez votre adresse en local et enregistrez votre géolocalisation. Vos coordonnées sont mémorisées en cache et se transmettent en ligne dès que vous captez du réseau !"
  }
])

const toggleIndex = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx
}
</script>

<template>
  <section
    class="py-24 px-6 bg-white dark:bg-[#0A0D1A] relative overflow-hidden"
    id="faq"
  >
    <!-- Décor -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-0 left-0 right-0 h-px"
        style="background: linear-gradient(90deg, transparent, #F7F6FF 50%, transparent)"
      />
      <div
        class="absolute -right-24 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-[0.035]"
        style="background: radial-gradient(circle, #2E7D32, transparent 70%)"
      />
    </div>

    <div class="relative max-w-4xl mx-auto" id="faq-inner-box">

      <!-- En-tête -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14" id="faq-meta-block">
        <div>
          <span class="inline-flex items-center gap-2 bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
            FAQ · Support
          </span>
          <h2 class="text-3xl md:text-4xl font-black text-[#1A237E] dark:text-white tracking-tight leading-tight">
            Une réponse à<br />vos questions
          </h2>
        </div>
        <p class="text-sm text-[#1A237E]/60 dark:text-slate-400 max-w-xs font-normal leading-relaxed md:text-right">
          Tout ce que vous devez savoir pour démarrer votre immatriculation sans hésitation.
        </p>
      </div>

      <!-- Accordéons -->
      <div class="space-y-3" id="faq-accordions-container">
        <div
          v-for="(item, idx) in questions"
          :key="idx"
          class="rounded-2xl border transition-all duration-300 overflow-hidden"
          :class="
            openIndex === idx
              ? 'bg-[#F7F6FF] dark:bg-slate-900/80 border-[#2E7D32]/30 shadow-md shadow-[#2E7D32]/5'
              : 'bg-gray-50 dark:bg-slate-900/40 border-gray-100 dark:border-slate-800 hover:border-[#1A237E]/20'
          "
          :id="`faq-panel-${idx}`"
        >
          <!-- Trigger -->
          <button
            type="button"
            @click="toggleIndex(idx)"
            class="w-full text-left px-6 py-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-inset"
            :id="`faq-header-btn-${idx}`"
            :aria-expanded="openIndex === idx"
            :aria-controls="`faq-body-content-${idx}`"
          >
            <div class="flex items-start gap-3.5 flex-1">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                :class="openIndex === idx ? 'bg-[#2E7D32] text-white' : 'bg-white dark:bg-slate-800 text-[#1A237E]/50'"
              >
                <MessageCircleQuestion class="w-3.5 h-3.5" />
              </div>
              <span
                class="font-bold text-sm md:text-[15px] leading-snug transition-colors"
                :class="openIndex === idx ? 'text-[#1A237E] dark:text-white' : 'text-[#1A237E]/80 dark:text-slate-300'"
              >
                {{ item.q }}
              </span>
            </div>
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all"
              :class="openIndex === idx ? 'bg-[#2E7D32] rotate-0' : 'bg-gray-200 dark:bg-slate-700 rotate-0'"
            >
              <component
                :is="openIndex === idx ? Minus : Plus"
                class="w-3.5 h-3.5 transition-transform"
                :class="openIndex === idx ? 'text-white' : 'text-gray-500 dark:text-slate-400'"
              />
            </div>
          </button>

          <!-- Réponse -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="openIndex === idx"
              class="px-6 pb-6 pl-[3.75rem] text-sm text-[#1A237E]/70 dark:text-slate-400 leading-relaxed font-normal"
              role="region"
              :aria-labelledby="`faq-header-btn-${idx}`"
              :id="`faq-body-content-${idx}`"
            >
              {{ item.a }}
            </div>
          </transition>
        </div>
      </div>

      <!-- CTA contact -->
      <div class="mt-10 text-center">
        <p class="text-sm text-[#1A237E]/50 dark:text-slate-500">
          Vous n'avez pas trouvé votre réponse ?
          <a href="#contact-support-section" class="text-[#2E7D32] font-bold hover:underline underline-offset-2 ml-1">
            Contactez notre support →
          </a>
        </p>
      </div>
    </div>
  </section>
</template>
