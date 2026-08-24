<script setup lang="ts">
/**
 * @file /pages/support-agent/profile/index.vue
 * @description Page Profil de l'agent de support — réutilise le composant UserProfile
 * identique au dashboard utilisateur et administrateur.
 */
import UserProfile from "~/components/dashboard/UserProfile.vue";

definePageMeta({
	layout: "dashboard-support",
	middleware: ["support"],
});
</script>

<template>
	<div class="space-y-2">
		<UserProfile />
	</div>
</template>
