<!--
  @file Footer.vue
  @description Pied de page de l'application findMe Cameroun — Light Mode Premium
-->

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Search
} from "lucide-vue-next";
import FindMeLogo from "./FindMeLogo.vue";

const emit = defineEmits<{ (e: "scroll-to-step", stepId: string): void; }>();
const currentYear = computed(() => new Date().getFullYear());
const searchQuery = ref("");
</script>

<template>
  <footer class="bg-white dark:bg-[#0A0D1A] border-t border-slate-200 dark:border-slate-200" id="app-footer">
    <!-- Main footer grid -->
    <div class="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
      
      <!-- Col 1: Identifiant de marque -->
      <div class="space-y-6 sm:col-span-2 lg:col-span-1">
        <div class="cursor-pointer inline-block hover:opacity-80 transition-opacity duration-200">
          <FindMeLogo size="150" id="footer-logo" @click="navigateTo('/')" />
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-600 leading-relaxed font-medium max-w-[260px]">
          findMe est l'infrastructure civique d'adressage du Cameroun, alliant rigueur technique et convivialité pour que chaque foyer soit visible.
        </p>

        <!-- Réseaux sociaux -->
        <div class="flex items-center gap-3">
          <a href="#" aria-label="Facebook" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-all duration-300">
            <Facebook class="w-4 h-4" />
          </a>
          <a href="#" aria-label="Twitter" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-all duration-300">
            <Twitter class="w-4 h-4" />
          </a>
          <a href="#" aria-label="LinkedIn" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-all duration-300">
            <Linkedin class="w-4 h-4" />
          </a>
          <a href="#" aria-label="Instagram" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-all duration-300">
            <Instagram class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Col 2: Navigation Produit -->
      <div class="space-y-6">
        <h4 class="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-[#0f172b]">Produit</h4>
        <ul class="space-y-4">
          <li>
            <button @click="emit('scroll-to-step', 'comment-ca-marche')" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              Comment ça fonctionne
            </button>
          </li>
          <li>
            <button @click="emit('scroll-to-step', 'features-highlights')" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              Tarification
            </button>
          </li>
          <li>
            <button @click="emit('scroll-to-step', 'testimonials-section')" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              Témoignages
            </button>
          </li>
          <li>
            <button @click="emit('scroll-to-step', 'faq-section')" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              FAQ
            </button>
          </li>
          <li>
            <button @click="navigateTo('/creer-mon-adresse')" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              Créer mon adresse
            </button>
          </li>
        </ul>
      </div>

      <!-- Col 3: Entreprise -->
      <div class="space-y-6">
        <h4 class="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-[#0f172b]">Entreprise</h4>
        <ul class="space-y-4">
          <li>
            <button @click="emit('scroll-to-step', 'support-section')" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              À propos
            </button>
          </li>
          <li>
            <a href="#careers" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              Carrières
            </a>
          </li>
          <li>
            <a href="#blog" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              Blog & Actualités
            </a>
          </li>
          <li>
            <a href="#cgu" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              CGU & Confidentialité
            </a>
          </li>
          <li>
            <button @click="emit('scroll-to-step', 'support-section')" class="text-sm font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-600 dark:hover:text-emerald-400 hover:translate-x-1 transition-all duration-300">
              Contact
            </button>
          </li>
        </ul>
      </div>

      <!-- Col 4: Notre adresse + Recherche -->
      <div class="space-y-6">
        <h4 class="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-[#0f172b]">Notre Adresse</h4>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <MapPin class="w-4 h-4 text-emerald-600" />
            </div>
            <span class="text-sm text-slate-500 dark:text-slate-600 leading-relaxed font-medium mt-1">
              Immeuble findMe, Avenue Charles de Gaulle, Akwa, Douala
            </span>
          </li>
          <li class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Phone class="w-4 h-4 text-emerald-600" />
            </div>
            <span class="text-sm text-slate-500 dark:text-slate-600 font-medium">+237 677 88 99 00</span>
          </li>
          <li class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Mail class="w-4 h-4 text-emerald-600" />
            </div>
            <span class="text-sm text-slate-500 dark:text-slate-600 font-medium">contact@findme.cm</span>
          </li>
        </ul>

        <!-- Barre de recherche -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-200">
          <div class="relative flex items-center">
            <input v-model="searchQuery" type="text" placeholder="Rechercher une adresse..."
              class="w-full bg-slate-50 dark:bg-white border border-slate-200 dark:border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-900 dark:text-[#0f172b] placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            <button class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors">
              <Search class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Séparateur -->
    <div class="max-w-7xl mx-auto px-6 md:px-8">
      <div class="h-px bg-slate-100 dark:bg-slate-50" />
    </div>

    <!-- Copyright bar -->
    <div class="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500 dark:text-slate-600">
      <span>© {{ currentYear }} findMe CM. Tous droits réservés.</span>
      <div class="flex items-center gap-6">
        <a href="#cgu" class="hover:text-emerald-600 transition-colors">CGU</a>
        <a href="#support" class="hover:text-emerald-600 transition-colors">Support</a>
        <a href="#contact" class="hover:text-emerald-600 transition-colors">Confidentialité</a>
      </div>
    </div>
  </footer>
</template>
