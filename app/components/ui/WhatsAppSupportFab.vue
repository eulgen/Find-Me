<!--
  @file WhatsAppSupportFab.vue
  @description Bouton flottant interactif (FAB) et widget compact d'assistance WhatsApp findMe Cameroun.
  Fidèle au design system FindMe (glassmorphism, mode sombre #0A0D1A, typography serif, pills & micro-animations).
-->

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import {
	X,
	Send,
	MessageSquare,
	User,
	ShieldCheck,
	Check,
	MapPin,
	QrCode,
	HelpCircle,
} from "lucide-vue-next";

// Runtime Config
const WHATSAPP_NUMBER = useRuntimeConfig().public.whatsappNumber || "237600000000";

const { currentUser } = useAuth();

// Dynamic State
const isOpen = ref(false);
const clientName = ref("");
const clientMessage = ref("");
const messageSentPlaceholder = ref(false);

// Touch / validation
const nameTouched = ref(false);
const messageTouched = ref(false);

// Auto-fill user name if logged in
watch(
	() => currentUser.value,
	(newVal) => {
		if (newVal && newVal.fullName) {
			clientName.value = newVal.fullName;
		}
	},
	{ immediate: true },
);

onMounted(() => {
	if (currentUser.value && currentUser.value.fullName) {
		clientName.value = currentUser.value.fullName;
	}
});

// Quick suggestion topics
const quickTopics = [
	{ label: "Créer mon adresse", icon: MapPin, text: "Bonjour, j'aimerais créer mon adresse officielle." },
	{ label: "Plaque & QR Code", icon: QrCode, text: "Bonjour, j'ai une question sur ma plaque QR Code." },
	{ label: "Assistance compte", icon: HelpCircle, text: "Bonjour, j'ai besoin d'aide avec mon compte." },
];

const selectTopic = (topicText: string) => {
	clientMessage.value = topicText;
	messageTouched.value = true;
};

// Validation Computed Checks
const isNameValid = computed(() => clientName.value.trim().length >= 2);
const isMessageValid = computed(() => clientMessage.value.trim().length >= 5);
const canSubmit = computed(() => isNameValid.value && isMessageValid.value);

// Build WhatsApp Direct Link
const whatsappUrl = computed(() => {
	const base = `https://wa.me/${WHATSAPP_NUMBER}`;
	const textIntro = `Bonjour l'équipe findMe ! 🇨🇲\n\n`;
	const textIdentity = `Nom: ${clientName.value.trim() || 'Citoyen'}\n`;
	const textBody = `Demande: ${clientMessage.value.trim()}`;

	const fullText = encodeURIComponent(
		`${textIntro}${textIdentity}${textBody}`,
	);
	return `${base}?text=${fullText}`;
});

const handleToggle = () => {
	isOpen.value = !isOpen.value;
	if (isOpen.value) {
		messageSentPlaceholder.value = false;
		if (!clientName.value && currentUser.value?.fullName) {
			clientName.value = currentUser.value.fullName;
		}
	}
};

// Handle Form Submit with standard HTML <form> behavior & window.open
const handleFormSubmit = () => {
	nameTouched.value = true;
	messageTouched.value = true;

	if (!canSubmit.value) {
		return;
	}

	if (typeof window !== "undefined") {
		window.open(whatsappUrl.value, "_blank", "noopener,noreferrer");
	}

	messageSentPlaceholder.value = true;

	setTimeout(() => {
		isOpen.value = false;
		messageSentPlaceholder.value = false;
		clientMessage.value = "";
		nameTouched.value = false;
		messageTouched.value = false;
	}, 2000);
};
</script>

<template>
	<div
		class="fixed bottom-5 right-5 z-[80] select-none font-sans"
		id="whatsapp-fab-container"
	>
		<!-- 1. BOUTON FLOTTANT FAB COMPACT -->
		<div class="relative flex items-center gap-2.5">
			
			<!-- Badge d'invitation au survol -->
			<Transition name="fade">
				<div
					v-if="!isOpen"
					@click="handleToggle"
					class="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#0A0D1A]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-lg cursor-pointer hover:scale-105 transition-all group"
					id="whatsapp-trigger-pill"
				>
					<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
					<span class="text-xs font-black text-slate-800 dark:text-white tracking-wide">
						Support <span class="text-emerald-600 dark:text-emerald-400">WhatsApp</span>
					</span>
				</div>
			</Transition>

			<!-- Bouton principal -->
			<button
				@click="handleToggle"
				class="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all duration-300 group shadow-[0_6px_25px_rgba(0,188,125,0.4)] hover:shadow-[0_10px_30px_rgba(0,188,125,0.55)] hover:scale-105 active:scale-95 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white"
				aria-label="Contacter le support client via WhatsApp"
				id="whatsapp-trigger-bubble"
			>
				<!-- Pulse ring halo -->
				<span
					v-if="!isOpen"
					class="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none"
					id="whatsapp-ripple-ring"
				/>

				<!-- Notification Dot -->
				<span
					v-if="!isOpen"
					class="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-[#0A0D1A]"
					id="whatsapp-badge"
				/>

				<!-- Icônes -->
				<Transition name="fade" mode="out-in">
					<X v-if="isOpen" class="w-5 h-5 text-white stroke-[2.5]" />
					<svg
						v-else
						class="w-6 h-6 fill-white drop-shadow-sm transform group-hover:rotate-12 transition-transform duration-300"
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>WhatsApp</title>
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
					</svg>
				</Transition>
			</button>
		</div>

		<!-- 2. PANNEAU DE CHAT COMPACT (Hauteur optimisée) -->
		<Transition name="slide-up">
			<div
				v-if="isOpen"
				class="absolute bottom-[66px] right-0 w-[320px] sm:w-[340px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-[#0A0D1A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 text-slate-900 dark:text-white"
				id="whatsapp-chat-box"
			>
				<!-- En-tête compact -->
				<div
					class="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-[#0A0D1A] text-white flex items-center justify-between border-b border-emerald-500/20 shrink-0"
					id="whatsapp-box-header"
				>
					<div class="flex items-center gap-2.5">
						<div class="relative w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
							<span class="text-lg">🇨🇲</span>
							<span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900 animate-pulse" />
						</div>
						<div>
							<h4 class="text-xs font-black tracking-tight font-sans">Support findMe</h4>
							<p class="text-[10px] text-emerald-100/90 font-medium leading-none mt-0.5">
								En ligne 24/7 • WhatsApp
							</p>
						</div>
					</div>

					<button
						type="button"
						@click="isOpen = false"
						class="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
						id="whatsapp-box-close"
					>
						<X class="w-4 h-4" />
					</button>
				</div>

				<!-- Formulaire HTML5 conforme avec @submit.prevent -->
				<form @submit.prevent="handleFormSubmit" class="p-3.5 space-y-3" id="whatsapp-form-fields-container">
					
					<!-- Sujets d'aide rapides (Chips compactes) -->
					<div class="space-y-1">
						<span class="block text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
							Sujets rapides
						</span>
						<div class="flex flex-wrap gap-1">
							<button
								v-for="(topic, idx) in quickTopics"
								:key="idx"
								type="button"
								@click="selectTopic(topic.text)"
								class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/80 dark:border-slate-800 transition-all text-left cursor-pointer"
							>
								<component :is="topic.icon" class="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
								<span>{{ topic.label }}</span>
							</button>
						</div>
					</div>

					<!-- Champ Nom -->
					<div class="space-y-1" id="wa-field-name">
						<label
							for="wa-input-name"
							class="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300"
						>
							<User class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
							<span>Votre Nom</span>
						</label>
						<input
							type="text"
							id="wa-input-name"
							v-model="clientName"
							@blur="nameTouched = true"
							placeholder="Ex: David d'Essos"
							class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/90 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-xs"
							:class="{
								'border-rose-500 focus:border-rose-500 ring-rose-500/20': nameTouched && !isNameValid
							}"
						/>
						<p v-if="nameTouched && !isNameValid" class="text-rose-500 text-[9px] font-bold">
							Nom requis (min 2 caractères).
						</p>
					</div>

					<!-- Champ Message -->
					<div class="space-y-1" id="wa-field-message">
						<div class="flex justify-between items-center">
							<label
								for="wa-input-msg"
								class="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300"
							>
								<MessageSquare class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
								<span>Message</span>
							</label>
						</div>
						<textarea
							id="wa-input-msg"
							v-model="clientMessage"
							@blur="messageTouched = true"
							rows="2"
							placeholder="Précisez votre demande..."
							class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/90 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none shadow-xs"
							:class="{
								'border-rose-500 focus:border-rose-500 ring-rose-500/20': messageTouched && !isMessageValid
							}"
						></textarea>
						<p v-if="messageTouched && !isMessageValid" class="text-rose-500 text-[9px] font-bold">
							Message requis (min 5 caractères).
						</p>
					</div>

					<!-- Bouton de soumission WhatsApp -->
					<div class="pt-1 space-y-1.5" id="whatsapp-redirect-actions">
						<button
							type="submit"
							:disabled="!canSubmit"
							class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none"
							id="whatsapp-opener-btn"
						>
							<Send class="w-3.5 h-3.5 shrink-0" />
							<span>Envoyer sur WhatsApp</span>
						</button>

						<div class="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold">
							<ShieldCheck class="w-3 h-3 text-emerald-500" />
							<span>Redirection officielle WhatsApp</span>
						</div>
					</div>

				</form>

				<!-- Feedback de redirection réussi -->
				<div
					v-if="messageSentPlaceholder"
					class="absolute inset-0 bg-white/95 dark:bg-[#0A0D1A]/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-5 space-y-3 z-30 transition-all"
					id="whatsapp-success-cover"
				>
					<div class="w-12 h-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg animate-bounce">
						<Check class="w-6 h-6 stroke-[3]" />
					</div>
					<div>
						<h5 class="text-sm font-black text-slate-900 dark:text-white font-serif">
							Redirection...
						</h5>
						<p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 max-w-[200px] mx-auto leading-tight">
							Ouverture de votre discussion WhatsApp.
						</p>
					</div>
				</div>

			</div>
		</Transition>
	</div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
	opacity: 0;
	transform: translateY(16px) scale(0.96);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
