<!--
  @file app/layouts/default.vue
  @description Standardized global layout for all findMe pages, hosting Header, main content, and Footer.
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { useTheme } from '../composables/useTheme'
import { useToasts } from '../composables/useToasts'
import { useAuth } from '../composables/useAuth'
import { useAddresses } from '../composables/useAddresses'
import { useNavigation } from '../composables/useNavigation'

// Shared composable singletons
const { currentLang, toggleLanguage } = useLanguage()
const { isDark, toggleDarkMode, initTheme } = useTheme()
const { addToast } = useToasts()
const {
  currentUser,
  authModalOpen,
  resetAuth
} = useAuth()

const {
  address,
  isCreateAddressOpen,
  selectedAddressDetails,
  selectedAddressDetailsIndex,
  showDetailsModal,
  handleAddressCreated,
  downloadAddressFile,
  downloadAddressPDF,
  confirmDeleteAddress
} = useAddresses()

const {
  currentView,
  initLoaderSimulation,
  scrollToSection,
  handleProfileClick
} = useNavigation()

const { handleShareLink } = useShare()

const isQRScannerOpen = ref(false)

// Handle global Logout context
const onLogout = () => {
  const prevName = currentUser.value?.username || 'Citoyen'
  currentUser.value = null
  currentView.value = 'home'
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 })
  }
  resetAuth()
  addToast(
    currentLang.value === 'FR' 
      ? `Déconnexion réussie. À bientôt, ${prevName} !` 
      : `Logged out successfully. See you soon, ${prevName}!`, 
    'info'
  )
}

onMounted(() => {
  initTheme()
  initLoaderSimulation()
})
</script>

<template>
  <div class="bg-white dark:bg-[#0D0F1A] min-h-screen text-black dark:text-[#E2E8F0] antialiased selection:bg-[#2E7D32]/20 select-none pb-0" id="global-layout-root">
    
    <!-- 1. Global Navigation Header (QR Scanner Removed as requested) -->
    <Header 
      :currentLang="currentLang" 
      :isDark="isDark"
      @toggle-language="toggleLanguage" 
      @toggle-theme="toggleDarkMode"
      @open-auth="authModalOpen = true"
      @scroll-to-step="scrollToSection"
      :currentUser="currentUser"
      @logout="onLogout"
      @profile-click="handleProfileClick"
      @open-qr="isQRScannerOpen = true"
      id="header-bar"
    />

    <!-- Main slot content (all active pages) -->
    <main id="main-content-flow" class="relative">
      <slot />
    </main>

    <!-- 3. Global Footer -->
    <Footer 
      :currentLang="currentLang" 
      @scroll-to-step="scrollToSection" 
      id="footer-bar"
    />

    <!-- PERSISTENT GLOBAL PORTALS & DIALOGS -->
    
    <!-- Formulaire interactif de création d'adresses standardisées -->
    <CreateAddressForm 
      :currentLang="currentLang"
      :isOpen="isCreateAddressOpen"
      @close="isCreateAddressOpen = false"
      :currentUser="currentUser"
      @success="handleAddressCreated"
      @add-toast="addToast"
    />

    <!-- Dialogue d'authentification ou connexion citoyenne -->
    <ModalsAuthModal 
      :isOpen="authModalOpen"
      @close="resetAuth"
      @success="currentView = 'citizen-space'"
    />

    <!-- Dialogue détaillant les aspects et certificat d'adressage d'une plaque -->
    <ModalsAddressDetailsModal 
      :isOpen="showDetailsModal"
      :addr="selectedAddressDetails"
      :index="selectedAddressDetailsIndex"
      @close="showDetailsModal = false"
      @download="downloadAddressFile"
      @pdf="downloadAddressPDF"
      @share="handleShareLink"
      @delete="confirmDeleteAddress"
    />

    <!-- Dialogue bilingue d'exposition sociale d'adresse (WhatsApp, Email) -->
    <ModalsShareModal />

    <!-- Dialogue d'avertissement et confirmation irréversible de suppression -->
    <ModalsDeleteConfirmModal />

    <!-- Écran de progression et d'initialisation de départ -->
    <ModalsPageLoader />

    <!-- Dialogue interactif de scanner QR findMe -->
    <QRScanner 
      :isOpen="isQRScannerOpen"
      @close="isQRScannerOpen = false"
    />

    <!-- Angle de notification système (toasts dynamiques) -->
    <ToastNotifications />

  </div>
</template>
