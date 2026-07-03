<!--
  @file app/layouts/default.vue
  @description Standardized global layout for all findMe pages, hosting Header, main content, and Footer.
-->

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { useTheme } from "../composables/useTheme";
	import { useToasts } from "../composables/useToasts";
	import { useAuth } from "../composables/useAuth";
	import { useAddresses } from "../composables/useAddresses";
	import { useNavigation } from "../composables/useNavigation";
	import Header from "~/components/ui/Header.vue";
	import Footer from "~/components/ui/Footer.vue";
	import CreateAddressForm from "~/components/ui/CreateAddressForm.vue";
	import QRScanner from "~/components/ui/QRScanner.vue";
	import ToastNotifications from "~/components/ui/ToastNotifications.vue";
	import PageLoader from "~/components/modals/PageLoader.vue";
	import WhatsAppSupportFab from "~/components/ui/WhatsAppSupportFab.vue";

	// Shared composable singletons
	const { isDark, toggleDarkMode, initTheme } = useTheme();
	const { addToast } = useToasts();
	const { currentUser, authModalOpen, resetAuth, handleLogout } = useAuth();

	const {
		isCreateAddressOpen,
		selectedAddressDetails,
		selectedAddressDetailsIndex,
		showDetailsModal,
		handleAddressCreated,
		downloadAddressFile,
		downloadAddressPDF,
		confirmDeleteAddress,
	} = useAddresses();

	const {
		currentView,
		initLoaderSimulation,
		scrollToSection,
		handleProfileClick,
	} = useNavigation();

	const { handleShareLink } = useShare();

	const isQRScannerOpen = ref(false);

	// Handle global Logout context
	const onLogout = () => {
		const prevName = currentUser.value?.username || "Citoyen";
		handleLogout();
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0 });
		}
		addToast(`DÃ©connexion rÃ©ussie. Ã€ bientÃ´t, ${prevName} !`, "info");
		navigateTo("/");
	};

	onMounted(() => {
		initTheme();
		initLoaderSimulation();
	});
</script>

<template>
	<div
		class="bg-white dark:bg-[#0D0F1A] min-h-screen text-black dark:text-[#E2E8F0] antialiased selection:bg-[#00bc7d]/20 select-none pb-0"
		id="global-layout-root"
	>
		<!-- 1. Global Navigation Header (QR Scanner Removed as requested) -->
		<Header
			:isDark="isDark"
			@toggle-theme="toggleDarkMode"
			@open-auth="navigateTo('/auth/signin')"
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
		<Footer @scroll-to-step="scrollToSection" id="footer-bar" />

		<!-- PERSISTENT GLOBAL PORTALS & DIALOGS -->

		<!-- Formulaire interactif de crÃ©ation d'adresses standardisÃ©es -->
		<CreateAddressForm
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

		<!-- Dialogue dÃ©taillant les aspects et certificat d'adressage d'une plaque -->
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

		<!-- Dialogue d'avertissement et confirmation irrÃ©versible de suppression -->
		<ModalsDeleteConfirmModal />

		<!-- Ã‰cran de progression et d'initialisation de dÃ©part -->
		<PageLoader />

		<!-- Dialogue interactif de scanner QR findMe -->
		<QRScanner :isOpen="isQRScannerOpen" @close="isQRScannerOpen = false" />

		<!-- Angle de notification systÃ¨me (toasts dynamiques) -->
		<ToastNotifications />

		<!-- Bouton flottant WhatsApp de support client direct -->
		<WhatsAppSupportFab />
	</div>
</template>
