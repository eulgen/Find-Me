<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToastNotifications from '~/components/ui/ToastNotifications.vue'
import { ShieldCheck, Users } from 'lucide-vue-next'

const route = useRoute()
const isSignUp = computed(() => route.path.includes('/signup'))

const illustrationSrc = computed(() => {
	if (isSignUp.value) return '/assets/images/auth_signup_bg.png'
	return '/assets/images/auth_signin_bg.png'
})

const badgeText = computed(() => {
	if (isSignUp.value) return 'Inauguration & Attribution Officielle'
	return 'Espace Citoyen Accrédité'
})

const titleText = computed(() => {
	if (isSignUp.value) return 'Votre chez-vous a désormais un nom, un code et une place sur la carte.'
	return 'Gérez et partagez vos adresses en toute sécurité.'
})

const descriptionText = computed(() => {
	if (isSignUp.value) return 'Créez votre compte gratuitement pour attribuer un identifiant certifié et une plaque municipale officielle à votre domicile.'
	return 'Accédez instantanément à votre tableau de bord d\'adressage numérique, vos codes QR et vos données certifiées.'
})
</script>

<template>
	<div
		class="relative w-full h-screen flex bg-[#FAF8F5] dark:bg-[#0A0D1A] overflow-hidden font-sans"
		id="auth-layout-root"
	>
		<!-- ── Toast Notifications ── -->
		<ToastNotifications />

		<!-- ══════════════ FORM PANEL (LEFT) ══════════════ -->
		<div
			class="relative z-10 w-full lg:w-[500px] xl:w-[540px] flex flex-col px-6 sm:px-10 py-4 justify-center bg-white/90 dark:bg-[#0A0D1A]/90 backdrop-blur-2xl border-r border-slate-200/60 dark:border-slate-800 shadow-2xl h-screen overflow-hidden"
			id="auth-form-side"
		>
			<slot />
		</div>

		<!-- ══════════════ FULL BLEED VISUAL PANEL (RIGHT) ══════════════ -->
		<div class="hidden lg:block relative flex-1 h-screen overflow-hidden bg-slate-950">
			
			<!-- Full-Bleed Cover Background Image -->
			<img
				:src="illustrationSrc"
				:alt="isSignUp ? 'Inscription findMe' : 'Connexion findMe'"
				class="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 transform scale-100 hover:scale-105"
			/>

			<!-- Solid Overlays for Readability -->
			<div class="absolute inset-0 bg-slate-950/70 z-10"></div>

			<!-- Floating Top Badge -->
			<div class="absolute top-8 left-8 z-20 inline-flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-4.5 py-2 rounded-full border border-white/20 shadow-xl">
				<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
				<span class="text-xs font-black uppercase tracking-wider text-white">
					{{ badgeText }}
				</span>
			</div>

			<!-- Floating Proof Badges -->
			<div class="absolute top-8 right-8 z-20 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-3 animate-float hidden xl:flex">
				<div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
					<ShieldCheck class="w-5 h-5" />
				</div>
				<div class="text-left">
					<span class="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">Conforme Mairie</span>
					<p class="text-xs font-black text-white">Douala & Yaoundé</p>
				</div>
			</div>

			<!-- Editorial Content Overlay at Bottom -->
			<div class="absolute bottom-0 left-0 right-0 p-10 xl:p-14 z-20 space-y-3 max-w-2xl">
				<div class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
					findMe Cameroun
				</div>
				<h2 class="text-3xl xl:text-4xl font-black text-white font-serif leading-tight">
					{{ titleText }}
				</h2>
				<p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
					{{ descriptionText }}
				</p>
			</div>

		</div>
	</div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
