<!--
  @file ContactSupport.vue
  @description Section Support & Contact — Design conversion d'assistance directe.
  Formulaire ergonomique avec validation en direct + Canaux de communication rapide (WhatsApp, Email).
-->

<script setup lang="ts">
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-vue-next';
import { useContactSupport } from '../../composables/useContactSupport';

const {
  name,
  email,
  message,
  isSubmitting,
  submitSuccess,
  errorFeedback,
  nameTouched,
  emailTouched,
  messageTouched,
  isNameValid,
  isEmailValid,
  isMessageValid,
  submitSupportMessage
} = useContactSupport();
</script>

<template>
  <section class="py-24 px-6 bg-white dark:bg-[#0A0D1A]" id="support-section">
    <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
      
      <!-- Infos contact -->
      <div class="flex-1 space-y-8 text-center lg:text-left">
        <div>
          <span class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-4 shadow-xs">
            <MessageCircle class="w-3.5 h-3.5" />
            Support Citoyen 24/7
          </span>
          <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Une question ? <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Nous sommes là pour vous.</span>
          </h2>
          <p class="mt-4 text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-md mx-auto lg:mx-0 font-medium">
            Une hésitation sur la création de votre adresse ? Notre équipe basée au Cameroun vous répond rapidement.
          </p>
        </div>

        <div class="space-y-4 flex flex-col items-center lg:items-start">
          <a href="mailto:support@findme.cm" class="group flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F5] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors w-full max-w-md">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Mail class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider">Email Officiel</p>
              <p class="font-black text-slate-900 dark:text-white text-sm sm:text-base">support@findme.cm</p>
            </div>
          </a>
          
          <a href="#" class="group flex items-center gap-4 p-4 rounded-2xl bg-[#FAF9F5] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors w-full max-w-md">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <MessageCircle class="w-5 h-5" />
            </div>
            <div class="text-left">
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider">Assistance WhatsApp</p>
              <p class="font-black text-slate-900 dark:text-white text-sm sm:text-base">+237 600 00 00 00</p>
            </div>
          </a>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="flex-1 w-full max-w-lg">
        <div class="bg-[#FAF9F5] dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-800">
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-6">Envoyez-nous un message</h3>
          
          <form @submit.prevent="submitSupportMessage" class="space-y-4">
            <div>
              <label for="contact-name" class="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Nom complet</label>
              <input id="contact-name" v-model="name" type="text" required @blur="nameTouched = true"
                class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white font-medium text-sm"
                :class="{'border-red-500': nameTouched && !isNameValid}"
                placeholder="Takam Jules" />
            </div>
            
            <div>
              <label for="contact-email" class="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Adresse email ou Téléphone</label>
              <input id="contact-email" v-model="email" type="text" required @blur="emailTouched = true"
                class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white font-medium text-sm"
                :class="{'border-red-500': emailTouched && !isEmailValid}"
                placeholder="takam@example.com" />
            </div>
            
            <div>
              <label for="contact-message" class="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
              <textarea id="contact-message" v-model="message" rows="4" required @blur="messageTouched = true"
                class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none text-slate-900 dark:text-white font-medium text-sm"
                :class="{'border-red-500': messageTouched && !isMessageValid}"
                placeholder="Comment pouvons-nous vous aider ?" />
            </div>
            
            <p v-if="errorFeedback" class="text-xs font-bold text-red-500 flex items-center gap-1">
              <AlertCircle class="w-4 h-4" /> {{ errorFeedback }}
            </p>

            <button type="submit" :disabled="isSubmitting"
              class="w-full bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70 cursor-pointer text-sm">
              <template v-if="!isSubmitting && !submitSuccess">
                Envoyer le message <Send class="w-4 h-4" />
              </template>
              <template v-else-if="isSubmitting">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi en cours...
              </template>
              <template v-else>
                <CheckCircle2 class="w-5 h-5" /> Message envoyé
              </template>
            </button>
          </form>
        </div>
      </div>

    </div>
  </section>
</template>
