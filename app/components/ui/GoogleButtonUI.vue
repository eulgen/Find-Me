<!--
  @file GoogleButtonUI.vue
  @description Bouton "Se connecter avec Google" — approche directe et fiable.

  Flux :
  1. onMounted → google.accounts.id.initialize() enregistre le callback idToken
  2. Clic utilisateur → handleGoogleClick() → google.accounts.id.prompt()
     → ouvre le sélecteur de compte Google (popup classique, sans FedCM)
  3. Callback reçoit response.credential (idToken) → handleGoogleAuth()
     → POST /api/auth/google { idToken }
-->

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

const {
  handleGoogleAuth,
  isGoogleLoading,
  isIcloudLoading,
  isAuthSubmitLoading,
} = useAuth();
const { addToast } = useToasts();
const config = useRuntimeConfig();

/** GIS est-il initialisé et prêt ? */
const isGisReady = ref(false);

/** Chargement intermédiaire : popup ouverte, en attente du choix utilisateur */
const isWaitingForPopup = ref(false);

const isDisabled = computed(
  () =>
    isGoogleLoading.value ||
    isIcloudLoading.value ||
    isAuthSubmitLoading.value,
);

/** Montre le spinner si la popup Google est ouverte OU si handleGoogleAuth est en cours */
const showSpinner = computed(
  () => isWaitingForPopup.value || isGoogleLoading.value,
);

onMounted(() => {
  if (typeof window === "undefined") return;

  const clientId = config.public.googleClientId as string;
  if (!clientId) {
    console.warn("[GoogleButtonUI] NUXT_PUBLIC_GOOGLE_CLIENT_ID non configuré.");
    return;
  }
});

/**
 * Déclenché au clic sur notre bouton.
 * Affiche immédiatement le spinner puis redirige vers le backend pour le flux OAuth2.
 */
const handleGoogleClick = () => {
  if (isDisabled.value) return;

  isWaitingForPopup.value = true;
  
  // Redirection vers l'endpoint Spring Boot qui va initier le flux Google OAuth2
  window.location.href = "http://localhost:8080/api/auth/google/login";
};
</script>

<template>
  <div class="w-full">
    <button
      type="button"
      :disabled="isDisabled"
      @click="handleGoogleClick"
      class="relative w-full h-14 flex items-center justify-center bg-white dark:bg-white border border-slate-200 dark:border-slate-200 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 rounded-2xl group overflow-hidden cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      id="google-signin-btn"
    >
      <!-- Dégradé hover -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      <span
        class="relative z-10 flex items-center space-x-3 font-bold text-slate-700 dark:text-[#0f172b] transition-colors pointer-events-none"
      >
        <!-- Icône / Spinner -->
        <div
          class="bg-white rounded-full shadow-sm p-1 group-hover:rotate-3 transition-transform duration-300"
        >
          <!-- Spinner chargement -->
          <svg
            v-if="showSpinner"
            class="w-5 h-5 animate-spin text-[#4285F4]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>

          <!-- Logo Google -->
          <svg
            v-else
            class="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        </div>

        <!-- Label -->
        <span>
          {{
            isGoogleLoading
              ? "Connexion en cours..."
              : isWaitingForPopup
                ? "En attente..."
                : "Se connecter avec Google"
          }}
        </span>
      </span>
    </button>
  </div>
</template>
