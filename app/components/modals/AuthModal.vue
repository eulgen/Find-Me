<!--
  @file AuthModal.vue
  @description Composant d'authentification et d'inscription citoyenne findMe Cameroun bilingue.
-->

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, ShieldCheck, CheckCircle, Check, Sparkles } from 'lucide-vue-next'
import { useAuth } from '../../composables/useAuth'
import { useLanguage } from '../../composables/useLanguage'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', user: { email: string; username: string }): void
}>()

const { currentLang } = useLanguage()
const {
  authStep,
  authMode,
  authEmail,
  authUsername,
  authPassword,
  isGoogleLoading,
  googleUser,
  isAuthSubmitLoading,
  isAuthDoneLoading,
  handleSimulatedClaim,
  handleGoogleAuth,
  currentUser,
  resetAuth
} = useAuth()

watch(currentUser, (newUser) => {
  if (newUser && authStep.value === 'success') {
    emit('success', newUser)
  }
})

const handleDone = () => {
  isAuthDoneLoading.value = true
  setTimeout(() => {
    isAuthDoneLoading.value = false
    if (currentUser.value) {
      emit('success', currentUser.value)
    }
    resetAuth()
    emit('close')
  }, 900)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-[#1A237E]/45 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl" id="auth-modal-overlay">
    <div 
      class="bg-[#F9F7FC] border-4 border-[#1A237E] rounded-[32px] w-full max-w-md p-6 relative shadow-[12px_12px_0px_0px_#FFD5D0]" 
      id="auth-modal-dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="currentLang === 'FR' ? 'Portail de Connexion Citoyenne' : 'Citizen Login Portal'"
    >
      <!-- Fermeture -->
      <button @click="emit('close')" class="absolute top-4 right-4 text-[#1A237E] hover:text-[#2E7D32] p-1.5 hover:bg-[#F5F2FB] rounded-full cursor-pointer z-10 focus:outline-none" aria-label="Fermer le dialogue" id="auth-close-btn">
        <X class="w-5 h-5" />
      </button>

      <div v-if="authStep === 'login'" class="space-y-4" id="auth-form-wrapper">
        <div class="space-y-1 mt-2" id="auth-header-texts">
          <div class="w-11 h-11 rounded-2xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 flex items-center justify-center mb-4"><ShieldCheck class="w-6 h-6 text-[#2E7D32]" /></div>
          <h3 class="text-xl font-extrabold text-[#1A237E]">
            {{ currentLang === 'FR' ? "Espace Citoyen " : "Citizen Access Portal" }}
          </h3>
          <p class="text-xs text-[#1A237E]/70 leading-relaxed font-normal">
            {{ currentLang === 'FR'
              ? "Gérez, partagez ou réclamez votre plaque municipale findMe."
              : "Manage, share, or register your official findMe municipal coordinate plaque." }}
          </p>
        </div>

        <!-- Basculeur Connexion / Compte -->
        <div class="flex border-b border-[#1A237E]/10" id="auth-tabbar" role="tablist" :aria-label="currentLang === 'FR' ? 'Type de connexion' : 'Authentication type'">
          <button @click="authMode = 'signin'" role="tab" :aria-selected="authMode === 'signin'" class="flex-1 pb-3 text-sm font-black transition-all border-b-3 focus:outline-none" :class="authMode === 'signin' ? 'border-[#1A237E] text-[#1A237E]' : 'border-transparent text-[#1A237E]/55 hover:text-[#1A237E]'" id="tab-signin-toggle">
            {{ currentLang === 'FR' ? 'Se connecter' : 'Sign In' }}
          </button>
          <button @click="authMode = 'signup'" role="tab" :aria-selected="authMode === 'signup'" class="flex-1 pb-3 text-sm font-black transition-all border-b-3 focus:outline-none" :class="authMode === 'signup' ? 'border-[#1A237E] text-[#1A237E]' : 'border-transparent text-[#1A237E]/55 hover:text-[#1A237E]'" id="tab-signup-toggle">
            {{ currentLang === 'FR' ? 'Créer un compte' : 'Sign Up' }}
          </button>
        </div>

        <!-- Google Auth -->
        <div id="google-auth-wrapper">
          <ButtonUI 
            variant="outline" 
            :loading="isGoogleLoading" 
            :disabled="isGoogleLoading || isAuthSubmitLoading" 
            @click="handleGoogleAuth" 
            class="w-full flex items-center justify-center" 
            id="google-signin-btn"
          >
            <span>
              {{ isGoogleLoading
                ? (currentLang === 'FR' ? 'Accès Google...' : 'Google Connecting...')
                : authMode === 'signin'
                  ? (currentLang === 'FR' ? 'Se connecter avec Google' : 'Sign in with Google')
                  : (currentLang === 'FR' ? 'S\'inscrire avec Google' : 'Register with Google') }}
            </span>
          </ButtonUI>

          <div class="flex items-center my-4" id="auth-divider-row">
            <div class="flex-1 h-0.5 bg-[#1A237E]/10" />
            <span class="px-3.5 text-[10px] text-[#1A237E]/50 font-black uppercase tracking-wider">
              {{ currentLang === 'FR' ? 'Ou par mot de passe' : 'Or via password' }}
            </span>
            <div class="flex-1 h-0.5 bg-[#1A237E]/10" />
          </div>
        </div>

        <form @submit="handleSimulatedClaim" class="space-y-4" id="auth-form-body">
          <div v-if="authMode === 'signup'" class="space-y-1.5" id="auth-input-username-group">
            <label class="text-[10px] font-black uppercase text-[#1A237E]/80 tracking-wider">
              {{ currentLang === 'FR' ? "Nom d'utilisateur" : 'Username' }}
            </label>
            <input type="text" required class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white text-[#1A237E] font-bold focus:border-[#2E7D32] focus:outline-none" placeholder="Brice Ndeng" v-model="authUsername" />
          </div>

          <div class="space-y-1.5" id="auth-input-email-group">
            <label class="text-[10px] font-black uppercase text-[#1A237E]/80 tracking-wider">
              {{ currentLang === 'FR' ? 'Adresse email' : 'Email Address' }}
            </label>
            <input type="email" required class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white text-[#1A237E] font-bold focus:border-[#2E7D32] focus:outline-none" placeholder="ndengbrice@gmail.com" v-model="authEmail" />
          </div>

          <div class="space-y-1.5" id="auth-input-password-group">
            <label class="text-[10px] font-black uppercase text-[#1A237E]/80 tracking-wider flex justify-between">
              <span>{{ currentLang === 'FR' ? 'Mot de passe' : 'Password' }}</span>
              <span class="text-[9px] text-[#2E7D32] cursor-pointer hover:underline font-bold">
                {{ currentLang === 'FR' ? 'oublié ?' : 'forgot?' }}
              </span>
            </label>
            <input type="password" required class="w-full text-xs px-3.5 py-3 rounded-xl border-2 border-[#1A237E]/20 bg-white text-[#1A237E] font-bold focus:border-[#2E7D32] focus:outline-none" placeholder="••••••••" v-model="authPassword" />
          </div>

          <ButtonUI 
            type="submit" 
            variant="primary" 
            :loading="isAuthSubmitLoading" 
            :disabled="isAuthSubmitLoading" 
            :icon="CheckCircle" 
            class="w-full h-11" 
            id="auth-submit-btn"
          >
            <span>
              {{ authMode === 'signin'
                ? (currentLang === 'FR' ? "Se connecter" : "Sign In")
                : (currentLang === 'FR' ? "Créer mon compte citoyen" : "Create Citizen Account") }}
            </span>
          </ButtonUI>
        </form>

        <p class="text-[10px] text-[#1A237E]/50 text-center leading-relaxed">
          {{ currentLang === 'FR'
            ? "En vous connectant ou vous inscrivant, vous acceptez les conditions de findMe Cameroun et la protection des données civiques."
            : "By entering or registering, you standardly agree to findMe Cameroon safety covenants and local citizen data acts." }}
        </p>
      </div>

      <!-- Écran Réussite -->
      <div v-else class="text-center py-6 space-y-6" id="auth-success-screen">
        <div class="mx-auto w-16 h-16 rounded-full bg-[#2E7D32]/10 flex items-center justify-center border-2 border-[#2E7D32]/30"><Check class="w-8 h-8 text-[#2E7D32] stroke-[3]" /></div>
        
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-[#1A237E]">
            {{ currentLang === 'FR' 
              ? (authMode === 'signin' ? "Réseau Connecté !" : "Compte créé !") 
              : (authMode === 'signin' ? "Successfully Connected!" : "Account Registered!") }}
          </h3>
          <p class="text-xs text-[#1A237E]/85 leading-relaxed font-normal">
            {{ currentLang === 'FR' 
              ? `Bienvenue à ${authUsername || authEmail || 'Citoyen findMe'}. Vos adresses pour la parcelle de Bastos (Yaoundé) sont maintenant chargées avec succès.`
              : `Access fully unlocked for ${authUsername || authEmail || 'findMe Citizen'}. Loaded Yaounde Bastos coordinates successfully.` }}
          </p>
          <div v-if="googleUser" class="inline-flex items-center space-x-1.5 bg-[#4285F4]/10 text-[#4285F4] text-[10px] font-bold px-3 py-1 rounded-full border border-[#4285F4]/20">
            <span class="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
            <span>{{ currentLang === 'FR' ? 'Espace Authentifié avec Google' : 'Authenticated via Google Secure Auth' }}</span>
          </div>
        </div>

        <ButtonUI 
          variant="primary" 
          :loading="isAuthDoneLoading" 
          :disabled="isAuthDoneLoading" 
          :icon="Sparkles" 
          @click="handleDone" 
          class="w-full" 
          id="auth-done-btn"
        >
          <span>{{ currentLang === 'FR' ? "Continuer vers ma Console" : "Proceed to Dashboard" }}</span>
        </ButtonUI>
      </div>

    </div>
  </div>
</template>
