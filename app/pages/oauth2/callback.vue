<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useToasts } from '~/composables/useToasts';

const route = useRoute();
const { saveTokens, initSession, currentUser } = useAuth();
const { addToast } = useToasts();

onMounted(async () => {
    // 1. Récupérer les tokens de l'URL renvoyée par Spring Boot
    const accessToken = route.query.access_token as string;
    const refreshToken = route.query.refresh_token as string;
    
    if (accessToken && refreshToken) {
        // 2. Sauvegarder dans le localStorage
        saveTokens(accessToken, refreshToken);
        
        // 3. Charger le profil utilisateur en passant le token explicitement
        await initSession(accessToken);
        
        // 4. Redirection selon le rôle
        const user = currentUser.value;
        if (user) {
            addToast(`Bienvenue, ${user.fullName || 'Citoyen'} ! (Google)`, 'success');
            if (user.role === 'ADMIN') {
                navigateTo('/admin');
            } else {
                navigateTo(`/users/${user.id}`);
            }
        } else {
            addToast('Erreur lors de la récupération du profil.', 'error');
            navigateTo('/auth/signin');
        }
    } else {
        const error = route.query.error;
        if (error) {
            addToast(`Échec de connexion Google: ${error}`, 'error');
        } else {
            addToast('Aucun jeton reçu de Google.', 'error');
        }
        navigateTo('/auth/signin');
    }
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0A0D1A]">
        <div class="flex flex-col items-center gap-4">
            <!-- Spinner -->
            <svg class="w-10 h-10 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p class="text-sm font-bold text-slate-600 dark:text-slate-300">
                Finalisation de votre connexion Google...
            </p>
        </div>
    </div>
</template>
