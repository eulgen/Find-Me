<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSignUp = computed(() => route.path.includes('/signup'))

const illustrationSrc = computed(() => {
	if (isSignUp.value) return '/assets/images/auth_signup_v2.png'
	return '/assets/images/auth_signin_v2.png'
})

const illustrationAlt = computed(() => {
	if (isSignUp.value) return 'Création de compte findMe'
	return 'Connexion findMe'
})
</script>

<template>
	<div
		class="relative w-full min-h-screen flex bg-slate-50 dark:bg-[#0A0D1A] overflow-hidden"
		id="auth-layout-root"
	>
		<!-- ── Décoration fond animée ── -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
			<div class="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-900/20 blur-[120px] animate-pulse-slow" />
			<div class="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 dark:bg-teal-900/20 blur-[100px] animate-pulse-slow" style="animation-delay: 2s;" />
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-indigo-500/5 dark:bg-indigo-900/10 blur-[150px]" />
		</div>

		<!-- ── Grille subtile ── -->
		<div
			class="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05]"
			style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 40px 40px; color: #10B981"
			aria-hidden="true"
		/>

		<!-- ══════════════ PANNEAU FORMULAIRE ══════════════ -->
		<div
			class="relative z-10 w-full lg:w-[540px] xl:w-[600px] flex flex-col px-6 sm:px-12 py-4 sm:py-6 justify-center bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-3xl border-r border-white/20 dark:border-slate-800/50 shadow-2xl h-[100vh] overflow-y-auto"
			id="auth-form-side"
		>
            <slot />
        </div>

		<!-- ══════════════ PANNEAU ILLUSTRATION ══════════════ -->
		<div class="hidden lg:block relative flex-1 bg-[#0A0D1A] overflow-hidden">
			<!-- Image d'illustration avec effet Ken Burns infini -->
			<div class="absolute inset-0">
				<NuxtImg
					:src="illustrationSrc"
					:alt="illustrationAlt"
					class="w-full h-full object-cover opacity-60 animate-ken-burns"
				/>
			</div>
			
			<!-- Overlays de protection et gradients -->
			<div class="absolute inset-0 bg-gradient-to-tr from-[#0A0D1A] via-[#0A0D1A]/60 to-transparent z-10" />
			<div class="absolute inset-0 bg-emerald-900/30 mix-blend-overlay z-10" />
			
			<!-- ── Éléments Animés "Vivants" ── -->
			<div class="absolute inset-0 z-10 pointer-events-none overflow-hidden">
				<!-- Orbes luminescents flottants -->
				<div class="absolute top-[10%] left-[20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] animate-float-slow"></div>
				<div class="absolute bottom-[20%] right-[10%] w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] animate-float-medium"></div>
				<div class="absolute top-[40%] right-[30%] w-72 h-72 bg-indigo-500/20 rounded-full blur-[90px] animate-float-fast"></div>

				<!-- Radar / Pings géolocalisation -->
				<div class="absolute top-[35%] left-[45%] w-32 h-32 border border-emerald-400/30 rounded-full animate-ping-slow"></div>
				<div class="absolute top-[35%] left-[45%] w-32 h-32 border border-teal-400/20 rounded-full animate-ping-slower" style="animation-delay: 1.5s"></div>
				<div class="absolute bottom-[35%] right-[25%] w-48 h-48 border border-emerald-500/20 rounded-full animate-ping-slow" style="animation-delay: 0.5s"></div>

				<!-- Réseau neuronal / géolocalisation SVG animé -->
				<svg class="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
					<g class="animate-float-slow">
						<path d="M 100 300 C 300 200, 500 500, 700 300 S 900 600, 1100 400" fill="none" stroke="rgba(16,185,129,0.5)" stroke-width="2" class="animate-dash" stroke-dasharray="8 8" />
						<circle cx="100" cy="300" r="4" fill="#10b981" class="animate-glow" />
						<circle cx="480" cy="400" r="5" fill="#14b8a6" class="animate-glow" style="animation-delay: 1s;" />
						<circle cx="700" cy="300" r="4" fill="#10b981" class="animate-glow" style="animation-delay: 2s;" />
					</g>
					<g class="animate-float-medium" style="animation-delay: 0.5s;">
						<path d="M -100 600 C 200 700, 400 400, 600 600 S 800 300, 1100 500" fill="none" stroke="rgba(20,184,166,0.4)" stroke-width="2" class="animate-dash-reverse" stroke-dasharray="12 12" />
						<circle cx="200" cy="650" r="4" fill="#14b8a6" class="animate-glow" style="animation-delay: 0.5s;" />
						<circle cx="600" cy="600" r="5" fill="#10b981" class="animate-glow" style="animation-delay: 1.5s;" />
						<circle cx="900" cy="400" r="4" fill="#14b8a6" class="animate-glow" style="animation-delay: 2.5s;" />
					</g>
					<g class="animate-float-fast" style="animation-delay: 1s;">
						<path d="M 200 1100 C 400 800, 600 1000, 800 700" fill="none" stroke="rgba(16,185,129,0.3)" stroke-width="2" class="animate-dash" stroke-dasharray="6 6" />
						<circle cx="200" cy="1100" r="3" fill="#10b981" class="animate-glow" style="animation-delay: 1.2s;" />
						<circle cx="800" cy="700" r="3" fill="#14b8a6" class="animate-glow" style="animation-delay: 2.2s;" />
					</g>
				</svg>
			</div>
			
			<!-- Contenu informatif -->
			<div class="absolute bottom-0 left-0 right-0 p-12 lg:p-16 z-20">
				<div class="max-w-xl">
					<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-6">
						<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
						Sécurité & Fiabilité
					</div>
					<h2 class="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
						Votre adresse numérique, <br>
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">certifiée & universelle.</span>
					</h2>
					<p class="text-lg text-slate-300 font-medium leading-relaxed max-w-lg drop-shadow">
						Rejoignez le réseau findMe et facilitez vos livraisons, démarches administratives et partages de localisation avec une adresse unique et vérifiée.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.animate-pulse-slow {
	animation: pulseBg 8s ease-in-out infinite;
}
@keyframes pulseBg {
	0%, 100% { opacity: 0.5; }
	50% { opacity: 0.8; }
}

/* ── ANIMATIONS VIVANTES ── */
@keyframes kenBurns {
	0% { transform: scale(1) translate(0, 0); }
	50% { transform: scale(1.15) translate(-2%, -2%); }
	100% { transform: scale(1) translate(0, 0); }
}
.animate-ken-burns { animation: kenBurns 30s ease-in-out infinite; }

@keyframes floatSlow {
	0%, 100% { transform: translateY(0) translateX(0); }
	50% { transform: translateY(-20px) translateX(10px); }
}
.animate-float-slow { animation: floatSlow 10s ease-in-out infinite; }

@keyframes floatMedium {
	0%, 100% { transform: translateY(0) translateX(0); }
	50% { transform: translateY(-30px) translateX(-15px); }
}
.animate-float-medium { animation: floatMedium 8s ease-in-out infinite; }

@keyframes floatFast {
	0%, 100% { transform: translateY(0) translateX(0); }
	50% { transform: translateY(-15px) translateX(20px); }
}
.animate-float-fast { animation: floatFast 6s ease-in-out infinite; }

@keyframes dash {
	to { stroke-dashoffset: -100; }
}
.animate-dash { animation: dash 6s linear infinite; }
.animate-dash-reverse { animation: dash 6s linear infinite reverse; }

@keyframes glow {
	0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 2px rgba(16,185,129,0.5)); transform: scale(1); }
	50% { opacity: 1; filter: drop-shadow(0 0 10px rgba(16,185,129,1)); transform: scale(1.5); }
}
.animate-glow { animation: glow 3s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }

@keyframes pingSlow {
	0% { transform: scale(0.8); opacity: 0.8; }
	100% { transform: scale(2.5); opacity: 0; }
}
.animate-ping-slow { animation: pingSlow 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
.animate-ping-slower { animation: pingSlow 6s cubic-bezier(0, 0, 0.2, 1) infinite; }

/* S'assurer que la scrollbar est cachée ou jolie pour le formulaire */
#auth-form-side::-webkit-scrollbar {
    width: 6px;
}
#auth-form-side::-webkit-scrollbar-track {
    background: transparent;
}
#auth-form-side::-webkit-scrollbar-thumb {
    background-color: rgba(16, 185, 129, 0.2);
    border-radius: 10px;
}
</style>
