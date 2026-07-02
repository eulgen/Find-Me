<!--
  @file ContactSupport.vue
  @description Section Support & Contact — Light Mode Premium
-->

<script setup lang="ts">
import { ref } from 'vue';
import { Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-vue-next';
import { useToasts } from '../../composables/useToasts';

const { addToast } = useToasts();
const isSubmitting = ref(false);
const isSuccess = ref(false);

const form = ref({ name: '', email: '', message: '' });

const handleSubmit = async () => {
  isSubmitting.value = true;
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false;
    isSuccess.value = true;
    addToast("Message envoyé avec succès ! Nous vous répondrons bientôt.", "success");
    form.value = { name: '', email: '', message: '' };
    
    setTimeout(() => { isSuccess.value = false; }, 3000);
  }, 1000);
};
</script>

<template>
  <section class="py-24 px-6 bg-[#F8FAFC] dark:bg-[#0A0D1A]" id="support-section">
    <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
      
      <!-- Infos contact -->
      <div class="flex-1 space-y-8">
        <div>
          <span class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <MessageCircle class="w-3.5 h-3.5" />
            Support 24/7
          </span>
          <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Nous sommes là<br />pour vous aider.
          </h2>
          <p class="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-md">
            Une question sur la création de votre adresse ? Un problème technique ? Notre équipe basée à Douala vous répond.
          </p>
        </div>

        <div class="space-y-4">
          <a href="mailto:support@findme.cm" class="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors w-max">
            <div class="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-transform">
              <Mail class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase">Email</p>
              <p class="font-bold text-slate-900 dark:text-white">support@findme.cm</p>
            </div>
          </a>
          
          <a href="#" class="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors w-max">
            <div class="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-transform">
              <MessageCircle class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase">WhatsApp</p>
              <p class="font-bold text-slate-900 dark:text-white">+237 600 00 00 00</p>
            </div>
          </a>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="flex-1 w-full max-w-lg">
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Envoyez-nous un message</h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom complet</label>
              <input v-model="form.name" type="text" required
                class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                placeholder="Jean Dupont" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse email ou Téléphone</label>
              <input v-model="form.email" type="text" required
                class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                placeholder="jean@example.com" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea v-model="form.message" rows="4" required
                class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none text-slate-900 dark:text-white"
                placeholder="Comment pouvons-nous vous aider ?" />
            </div>
            
            <button type="submit" :disabled="isSubmitting"
              class="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70">
              <template v-if="!isSubmitting && !isSuccess">
                Envoyer le message <Send class="w-4 h-4" />
              </template>
              <template v-else-if="isSubmitting">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi...
              </template>
              <template v-else>
                <CheckCircle2 class="w-5 h-5" /> Envoyé
              </template>
            </button>
          </form>
        </div>
      </div>

    </div>
  </section>
</template>
