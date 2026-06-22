<script setup lang="ts">
import type { NuxtError } from '#app';
import { Home, ArrowLeft } from 'lucide-vue-next';
import ButtonUI from '~/components/ui/ButtonUI.vue';
import FindMeLogo from '~/components/ui/FindMeLogo.vue';

const props = defineProps<{
  error: NuxtError
}>();

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="h-[100dvh] w-full bg-[#F8FAFC] dark:bg-[#0E111F] flex flex-col justify-between overflow-hidden relative font-sans transition-colors duration-300">
    <!-- Backdrops and Glows -->
    <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#2E7D32]/5 dark:bg-[#2E7D32]/10 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1A237E]/5 dark:bg-[#1A237E]/10 rounded-full blur-[140px] pointer-events-none"></div>

    <header class="w-full p-4 sm:p-6 flex items-center justify-between z-10 shrink-0">
      <FindMeLogo size="100" @click="handleError" class="cursor-pointer hover:opacity-80 transition-opacity" />
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-4 py-2 text-center z-10 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto min-h-0">
      
      <!-- Illustration SVG premium interactive (taille réduite pour éviter les dépassements) -->
      <div class="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[400px] aspect-[16/10] mb-4 sm:mb-6 relative flex items-center justify-center shrink-0">
        <svg viewBox="0 0 600 380" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-lg">
          <!-- Ombre portée générale au sol -->
          <ellipse cx="300" cy="340" rx="220" ry="12" fill="rgba(26, 35, 126, 0.04)" class="dark:hidden" />
          <ellipse cx="300" cy="340" rx="220" ry="12" fill="rgba(0, 0, 0, 0.2)" class="hidden dark:block" />

          <!-- PLANTE EN POT (Gauche) -->
          <g class="swaying-plant">
            <!-- Le Pot -->
            <path d="M 105 340 L 135 340 L 140 310 L 100 310 Z" fill="#1A237E" class="dark:fill-[#2E7D32]" />
            <rect x="96" y="305" width="48" height="6" rx="3" fill="#2E7D32" class="dark:fill-[#1A237E]" />
            
            <!-- Tige -->
            <path d="M 120 305 Q 115 240 120 180" stroke="#2E7D32" stroke-width="4" stroke-linecap="round" fill="none" />
            
            <!-- Feuilles -->
            <path d="M 118 290 Q 90 280 100 260 Q 116 275 118 290" fill="#2E7D32" class="opacity-90" />
            <path d="M 119 270 Q 145 260 135 240 Q 121 255 119 270" fill="#4CAF50" />
            <path d="M 118 240 Q 88 230 102 210 Q 116 225 118 240" fill="#2E7D32" class="opacity-95" />
            <path d="M 119 220 Q 148 210 138 190 Q 122 205 119 220" fill="#4CAF50" />
            <path d="M 120 180 Q 110 155 120 145 Q 130 155 120 180" fill="#2E7D32" />
          </g>

          <!-- LE TROU DANS LE SOL (Milieu Gauche) -->
          <ellipse cx="240" cy="335" rx="70" ry="16" fill="#0F172A" />
          <ellipse cx="240" cy="335" rx="66" ry="13" fill="#1E293B" />

          <!-- PERSONNAGE DANS LE TROU -->
          <g class="bobbing-character">
            <!-- Torse -->
            <path d="M 215 335 C 215 310 265 310 265 335 Z" fill="#2E7D32" />
            <!-- Col -->
            <path d="M 232 315 L 240 322 L 248 315 Z" fill="#FFFFFF" />
            <!-- Tête -->
            <circle cx="240" cy="298" r="18" fill="#FDBA74" />
            <!-- Cheveux et barbe -->
            <path d="M 222 296 C 222 280 258 280 258 296 C 258 290 222 290 222 296" fill="#1E293B" />
            <path d="M 225 298 Q 240 274 255 298 C 257 305 223 305 225 298 Z" fill="#1E293B" />
            <path d="M 228 305 Q 240 320 252 305 C 248 314 232 314 228 305 Z" fill="#1E293B" />
            <!-- Yeux -->
            <circle cx="234" cy="296" r="2.5" fill="#1E293B" />
            <circle cx="246" cy="296" r="2.5" fill="#1E293B" />
            <path d="M 231 291 Q 234 290 237 291" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <path d="M 243 291 Q 246 290 249 291" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
          </g>

          <!-- BULLE DE DIALOGUE (Oups !) -->
          <g class="pop-bubble">
            <path d="M 245 225 C 245 210 285 210 285 225 C 285 235 270 240 262 240 L 255 248 L 257 240 C 245 240 245 235 245 225 Z" fill="#E8EAF6" stroke="#1A237E" stroke-width="2" />
            <text x="265" y="229" fill="#1A237E" font-size="10" font-weight="900" font-family="sans-serif" text-anchor="middle">Oups !</text>
          </g>

          <!-- PANNEAU SUSPENDU (ERROR 404) -->
          <g class="swinging-sign">
            <line x1="330" y1="30" x2="330" y2="90" stroke="#1A237E" stroke-width="3" stroke-linecap="round" />
            <line x1="430" y1="30" x2="430" y2="90" stroke="#1A237E" stroke-width="3" stroke-linecap="round" />
            <rect x="290" y="80" width="180" height="120" rx="16" fill="#FFFFFF" stroke="#1A237E" stroke-width="6" class="dark:fill-slate-900" />
            <text x="380" y="118" fill="#1A237E" font-size="20" font-weight="900" font-family="sans-serif" text-anchor="middle" letter-spacing="3" class="dark:fill-[#4fc3f7]">ERREUR</text>
            <text x="380" y="176" fill="#2E7D32" font-size="52" font-weight="950" font-family="sans-serif" text-anchor="middle" class="dark:fill-[#81C784]">404</text>
          </g>

          <!-- L'ÉCHELLE (Droite) -->
          <g>
            <line x1="475" y1="90" x2="505" y2="340" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" class="dark:stroke-slate-700" />
            <line x1="515" y1="90" x2="545" y2="340" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" class="dark:stroke-slate-700" />
            <line x1="481" y1="130" x2="521" y2="130" stroke="#94A3B8" stroke-width="4.5" class="dark:stroke-slate-700" />
            <line x1="485" y1="170" x2="525" y2="170" stroke="#94A3B8" stroke-width="4.5" class="dark:stroke-slate-700" />
            <line x1="490" y1="210" x2="530" y2="210" stroke="#94A3B8" stroke-width="4.5" class="dark:stroke-slate-700" />
            <line x1="495" y1="250" x2="535" y2="250" stroke="#94A3B8" stroke-width="4.5" class="dark:stroke-slate-700" />
            <line x1="500" y1="290" x2="540" y2="290" stroke="#94A3B8" stroke-width="4.5" class="dark:stroke-slate-700" />
          </g>

          <!-- PERSONNAGE SUR L'ÉCHELLE -->
          <g class="worker-character">
            <path d="M 488 230 L 494 185 L 504 185 L 498 230 Z" fill="#1A237E" />
            <path d="M 504 210 L 509 175 L 519 175 L 514 210 Z" fill="#1A237E" />
            <path d="M 490 185 C 490 145 525 145 525 185 Z" fill="#E2E8F0" class="dark:fill-slate-800" fill-opacity="0.9" />
            <path d="M 490 185 C 490 145 525 145 525 185 Z" fill="#1A237E" stroke="#1A237E" stroke-width="1.5" />
            <rect x="492" y="180" width="31" height="6" fill="#1E293B" />
            <path d="M 492 160 Q 470 140 455 145" stroke="#1A237E" stroke-width="7" stroke-linecap="round" fill="none" />
            <path d="M 522 160 Q 532 145 510 135" stroke="#1A237E" stroke-width="7" stroke-linecap="round" fill="none" />
            <circle cx="508" cy="138" r="11" fill="#FDBA74" />
            <path d="M 498 136 C 498 126 518 126 518 136 Z" fill="#1E293B" />
          </g>
        </svg>

        <!-- Nuages -->
        <div class="absolute top-2 left-[15%] w-12 h-5 bg-white/70 dark:bg-slate-800/50 rounded-full blur-[1px] cloud-slow pointer-events-none"></div>
        <div class="absolute top-8 right-[10%] w-14 h-6 bg-white/70 dark:bg-slate-800/50 rounded-full blur-[1px] cloud-fast pointer-events-none"></div>
      </div>

      <!-- Textes en français -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A237E] dark:text-white tracking-tight mb-2 shrink-0">
        Oups ! Page introuvable
      </h1>
      
      <p class="text-xs sm:text-sm md:text-base text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed font-medium shrink-0">
        Désolé, nous ne parvenons pas à trouver la page que vous recherchez. 
        Nous vous suggérons de retourner à l'accueil ou de revenir en arrière.
      </p>

      <!-- Deux boutons d'action conformes à la charte -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto shrink-0 pb-2">
        <ButtonUI 
          variant="primary" 
          size="md" 
          class="w-full sm:w-auto shadow-md shadow-[#1A237E]/10 bg-[#1A237E] hover:bg-[#2E7D32] text-white py-2.5 px-6 font-bold transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
          :icon="Home"
          @click="handleError"
        >
          Retourner à l'accueil
        </ButtonUI>
        
        <ButtonUI 
          variant="outline" 
          size="md" 
          class="w-full sm:w-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 py-2.5 px-6 font-bold transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
          :icon="ArrowLeft"
          @click="() => $router.back()"
        >
          Page précédente
        </ButtonUI>
      </div>

    </main>

    <footer class="w-full p-4 text-center text-xs font-semibold text-gray-400 dark:text-slate-500 z-10 shrink-0">
      &copy; {{ new Date().getFullYear() }} FindMe. Tous droits réservés.
    </footer>
  </div>
</template>

<style scoped>
/* Balancement du panneau suspendu */
@keyframes swing {
  0%, 100% { 
    transform: rotate(-1.5deg); 
  }
  50% { 
    transform: rotate(1.5deg); 
  }
}
.swinging-sign {
  animation: swing 5s ease-in-out infinite;
  transform-origin: 380px 30px;
}

/* Personnage qui monte/descend légèrement dans le trou */
@keyframes bobbing {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(6px); 
  }
}
.bobbing-character {
  animation: bobbing 4s ease-in-out infinite;
}

/* Bulle de parole qui pulse doucement */
@keyframes pop {
  0%, 100% { 
    transform: scale(1) translate(0, 0); 
  }
  50% { 
    transform: scale(1.05) translate(-2px, -3px); 
  }
}
.pop-bubble {
  animation: pop 4s ease-in-out infinite;
  transform-origin: 240px 248px;
}

/* Ouvrier qui bouge légèrement les bras */
@keyframes work {
  0%, 100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-2px) rotate(0.5deg);
  }
}
.worker-character {
  animation: work 3.5s ease-in-out infinite;
  transform-origin: 510px 230px;
}

/* Plante qui ondule doucement au vent */
@keyframes sway {
  0%, 100% { 
    transform: skewX(-1deg); 
  }
  50% { 
    transform: skewX(1deg); 
  }
}
.swaying-plant {
  animation: sway 6s ease-in-out infinite;
  transform-origin: 120px 340px;
}

/* Mouvement des nuages */
@keyframes cloudFloat {
  0% { transform: translateX(0); }
  50% { transform: translateX(15px); }
  100% { transform: translateX(0); }
}
.cloud-slow {
  animation: cloudFloat 12s ease-in-out infinite;
}
.cloud-fast {
  animation: cloudFloat 8s ease-in-out infinite;
}
</style>
