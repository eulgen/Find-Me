<!--
  @file app/pages/auth/verify-account/index.vue
  @description Page de vérification OTP de compte findMe — Design éditorial Gainlove, ultra-compact (100vh).
-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, CheckCircle, Lock } from "lucide-vue-next";
import { useAuth } from "~/composables/useAuth";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";
import ThemeToggle from "~/components/ui/ThemeToggle.vue";

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
	if (route.query.email) {
		email.value = String(route.query.email);
	} else if (authEmail.value) {
		email.value = authEmail.value;
	}

	if (route.query.code) {
		otpCode.value = String(route.query.code);
	} else if (route.query.otp) {
		otpCode.value = String(route.query.otp);
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
	<div class="flex flex-col justify-between w-full max-w-[390px] mx-auto h-full max-h-screen py-2 font-sans overflow-hidden">
		
		<!-- Logo -->
		<div class="flex-shrink-0 flex items-center justify-between w-full px-2">
			<div class="w-10"></div>
			<FindMeLogo size="130" class="mx-auto cursor-pointer transition-all hover:scale-105" @click="navigateTo('/')" />
			<ThemeToggle />
		</div>

		<div class="w-full relative flex-1 flex flex-col justify-center my-auto">
			<transition name="slide-fade" mode="out-in">
				<!-- ── ÉCRAN DE VÉRIFICATION OTP ── -->
				<div v-if="!isSuccess" key="verify-form" class="space-y-3 w-full">
					
					<!-- En-tête Éditorial -->
					<div class="text-center space-y-1">
						<div class="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
							<ShieldCheck class="w-6 h-6" />
						</div>
						<h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-tight">
							Vérification du compte
						</h1>
						<p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight max-w-xs mx-auto">
							Saisissez le code OTP envoyé à <br />
							<span class="font-bold text-slate-900 dark:text-white">{{ email || "votre email" }}</span>
						</p>
					</div>

					<!-- Formulaire -->
					<form @submit.prevent="onSubmitVerify" class="space-y-2.5">
						<!-- Champ Email si non renseigné -->
						<div v-if="!route.query.email && !authEmail" class="space-y-0.5 group">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Adresse email
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<Mail class="w-3.5 h-3.5" />
								</span>
								<input
									type="email"
									required
									v-model="email"
									placeholder="exemple@email.com"
									class="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
								/>
							</div>
						</div>

						<!-- Champ Code OTP -->
						<div class="space-y-1 text-center">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Code de confirmation (OTP)
							</label>
							<input
								type="text"
								required
								maxlength="6"
								v-model="otpCode"
								placeholder="123456"
								class="w-full text-center tracking-[0.3em] text-xl font-black px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
							/>
						</div>

						<!-- Bouton Valider -->
						<button
							type="submit"
							:disabled="isAuthSubmitLoading || otpCode.length < 6"
							class="group relative w-full h-11 mt-1 rounded-full font-black text-xs uppercase tracking-[0.12em] text-white overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800"
						>
							<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-1.5">
								<CheckCircle class="w-4 h-4 text-emerald-400 dark:text-slate-950" />
								Activer mon compte
							</span>
							<span v-else class="relative z-10 flex items-center justify-center gap-2">
								<span class="w-3.5 h-3.5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
								Vérification...
							</span>
						</button>
					</form>

					<!-- Renvoi OTP & Navigation -->
					<div class="pt-1 flex flex-col items-center space-y-2 text-[11px]">
						<button
							type="button"
							@click="onResend"
							:disabled="resendTimer > 0"
							class="inline-flex items-center space-x-1.5 font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 disabled:opacity-50 transition-colors cursor-pointer"
						>
							<RefreshCw class="w-3 h-3" :class="{ 'animate-spin': resendTimer > 0 }" />
							<span v-if="resendTimer > 0">Renvoyer le code dans {{ resendTimer }}s</span>
							<span v-else>Renvoyer un nouveau code OTP</span>
						</button>

						<NuxtLink
							to="/auth/signin"
							class="inline-flex items-center space-x-1 font-bold text-slate-500 hover:text-emerald-600 transition-colors"
						>
							<ArrowLeft class="w-3 h-3" />
							<span>Retour à la connexion</span>
						</NuxtLink>
					</div>
				</div>

				<!-- ── SUCCÈS VÉRIFICATION ── -->
				<div v-else key="verify-success" class="text-center space-y-4 py-4 my-auto">
					<div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
						<CheckCircle class="w-8 h-8 text-white" />
					</div>
					<div class="space-y-1">
						<h2 class="text-2xl font-black text-slate-900 dark:text-white font-serif">Compte vérifié !</h2>
						<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
							Votre adresse email a été validée. Redirection...
						</p>
					</div>
				</div>
			</transition>
		</div>

		<div class="flex-shrink-0"></div>
	</div>
</template>

<style scoped>
.slide-fade-enter-active {
	transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-leave-active {
	transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-enter-from {
	opacity: 0;
	transform: translateX(10px);
}
.slide-fade-leave-to {
	opacity: 0;
	transform: translateX(-10px);
}
</style>
