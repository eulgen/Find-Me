<!--
  @file app/pages/auth/verify-account/index.vue
  @description Page de vérification OTP de compte findMe — Design premium, glassmorphism.
-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-vue-next";
import { useAuth } from "~/composables/useAuth";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";

definePageMeta({
	layout: "auth",
});

const route = useRoute();
const { handleVerifyAccount, handleResendOtp, isAuthSubmitLoading, authEmail } = useAuth();

const email = ref<string>("");
const otpCode = ref<string>("");
const isSuccess = ref<boolean>(false);
const resendTimer = ref<number>(0);
let timerInterval: any = null;

onMounted(() => {
	// Récupération de l'email depuis query param ou useAuth
	if (route.query.email) {
		email.value = String(route.query.email);
	} else if (authEmail.value) {
		email.value = authEmail.value;
	}
	startResendTimer();
});

onUnmounted(() => {
	if (timerInterval) clearInterval(timerInterval);
});

const startResendTimer = () => {
	resendTimer.value = 60;
	if (timerInterval) clearInterval(timerInterval);
	timerInterval = setInterval(() => {
		if (resendTimer.value > 0) {
			resendTimer.value--;
		} else {
			clearInterval(timerInterval);
		}
	}, 1000);
};

const onSubmitVerify = async () => {
	if (!email.value || otpCode.value.length < 6) return;
	const success = await handleVerifyAccount(email.value, otpCode.value);
	if (success) {
		isSuccess.value = true;
		setTimeout(() => {
			navigateTo("/auth/signin");
		}, 2000);
	}
};

const onResend = async () => {
	if (resendTimer.value > 0 || !email.value) return;
	const ok = await handleResendOtp(email.value);
	if (ok) {
		startResendTimer();
	}
};
</script>

<template>
	<div class="flex flex-col justify-center w-full max-w-[400px] mx-auto h-full min-h-0 py-4">
		<!-- Logo -->
		<div class="flex items-center justify-center mb-6">
			<FindMeLogo size="140" class="cursor-pointer transition-all" @click="navigateTo('/')" />
		</div>

		<div class="w-full relative">
			<transition name="slide-fade" mode="out-in">
				<!-- ── ÉCRAN DE VÉRIFICATION OTP ── -->
				<div v-if="!isSuccess" key="verify-form" class="space-y-6">
					<!-- En-tête -->
					<div class="text-center space-y-2">
						<div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-3 shadow-inner">
							<ShieldCheck class="w-7 h-7" />
						</div>
						<h1 class="text-2xl font-black text-slate-900 dark:text-[#0f172b] tracking-tight leading-tight">
							Vérification du compte
						</h1>
						<p class="text-xs text-slate-500 dark:text-slate-600 leading-relaxed font-medium">
							Saisissez le code OTP à 6 chiffres envoyé à <br />
							<span class="font-bold text-slate-800 dark:text-[#0f172b]">{{ email || "votre adresse email" }}</span>
						</p>
					</div>

					<!-- Formulaire -->
					<form @submit.prevent="onSubmitVerify" class="space-y-4">
						<!-- Champ Email si non renseigné -->
						<div v-if="!route.query.email && !authEmail" class="space-y-1.5 group">
							<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700">
								Adresse email
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
									<Mail class="w-4 h-4" />
								</span>
								<input
									type="email"
									required
									v-model="email"
									placeholder="exemple@email.com"
									class="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/60 dark:bg-white text-slate-900 dark:text-[#0f172b] text-sm font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm"
								/>
							</div>
						</div>

						<!-- Champ Code OTP -->
						<div class="space-y-2 text-center">
							<label class="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-700">
								Code de confirmation (OTP)
							</label>
							<input
								type="text"
								required
								maxlength="6"
								v-model="otpCode"
								placeholder="123456"
								class="w-full text-center tracking-[0.4em] text-2xl font-black px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-300 bg-white/80 dark:bg-white text-slate-900 dark:text-[#0f172b] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm"
							/>
						</div>

						<!-- Bouton Valider -->
						<button
							type="submit"
							:disabled="isAuthSubmitLoading || otpCode.length < 6"
							class="group relative w-full h-12 mt-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white overflow-hidden transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-500 cursor-pointer active:scale-[0.98]"
						>
							<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-2">
								<CheckCircle class="w-5 h-5" />
								Activer mon compte
							</span>
							<span v-else class="relative z-10 flex items-center justify-center gap-2">
								<span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Vérification...
							</span>
						</button>
					</form>

					<!-- Renvoi OTP & Navigation -->
					<div class="pt-2 flex flex-col items-center space-y-3 text-xs">
						<button
							type="button"
							@click="onResend"
							:disabled="resendTimer > 0"
							class="inline-flex items-center space-x-2 font-bold text-slate-600 dark:text-slate-700 hover:text-emerald-600 disabled:opacity-50 transition-colors cursor-pointer"
						>
							<RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': resendTimer > 0 }" />
							<span v-if="resendTimer > 0">Renvoyer le code dans {{ resendTimer }}s</span>
							<span v-else>Renvoyer un nouveau code OTP</span>
						</button>

						<NuxtLink
							to="/auth/signin"
							class="inline-flex items-center space-x-1.5 font-bold text-slate-500 hover:text-emerald-600 transition-colors mt-2"
						>
							<ArrowLeft class="w-3.5 h-3.5" />
							<span>Retour à la connexion</span>
						</NuxtLink>
					</div>
				</div>

				<!-- ── SUCCÈS VÉRIFICATION ── -->
				<div v-else key="verify-success" class="text-center space-y-6 py-6">
					<div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
						<CheckCircle class="w-10 h-10 text-white" />
					</div>
					<div class="space-y-2">
						<h2 class="text-2xl font-black text-slate-900 dark:text-[#0f172b]">Compte vérifié !</h2>
						<p class="text-xs text-slate-500 dark:text-slate-600 font-medium">
							Votre adresse email a été validée avec succès. Redirection vers la page de connexion...
						</p>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
	opacity: 0;
	transform: translateX(20px);
}
.slide-fade-leave-to {
	opacity: 0;
	transform: translateX(-20px);
}
</style>
