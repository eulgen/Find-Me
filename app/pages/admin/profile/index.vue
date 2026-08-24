<script setup lang="ts">
/**
 * @file /pages/admin/profile/index.vue
 * @description Page Profil de l'administrateur — réutilise le composant UserProfile
 * identique au dashboard utilisateur (GET/PUT /api/users/me, POST /api/users/me/profile-image).
 */
import UserProfile from "~/components/dashboard/UserProfile.vue";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});
</script>

<template>
	<div class="space-y-2">
		<UserProfile />
	</div>
</template>
