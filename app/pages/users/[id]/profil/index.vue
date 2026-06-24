<!--
  @file app/pages/users/[id]/profil/index.vue
  @description Page de profil pour le tableau de bord citoyen.
-->
<script setup lang="ts">
import ButtonUI from "~/components/ui/ButtonUI.vue";
import UserProfile from "~/components/dashboard/UserProfile.vue";
import { useAuth } from "~/composables/useAuth";
import { CheckCircle } from "lucide-vue-next";

definePageMeta({
	middleware: "auth",
	layout: "dashboard",
});

const { currentUser } = useAuth();
</script>

<template>
	<div
		v-if="currentUser"
		class="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] relative"
	>
		<UserProfile />
	</div>

	<div
		v-else
		class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0E111F]"
	>
		<div class="text-center max-w-sm mx-auto p-8">
			<!-- Illustration d'état vide -->
			<div class="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
				<svg class="w-10 h-10 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
			</div>
			<h2 class="text-lg font-black text-gray-800 dark:text-white mb-2">
				Accès restreint
			</h2>
			<p class="text-sm text-gray-400 dark:text-slate-500 mb-6 leading-relaxed">
				Vous devez être connecté pour accéder à votre espace citoyen FindMe.
			</p>
			<ButtonUI
				@click="navigateTo('/auth/signin')"
				variant="primary"
				class="shadow-lg shadow-[#2E7D32]/30 px-8"
				:icon="CheckCircle"
			>
				Se connecter
			</ButtonUI>
		</div>
	</div>
</template>
