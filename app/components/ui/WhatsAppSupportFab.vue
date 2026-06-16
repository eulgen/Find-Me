<!--
  @file WhatsAppSupportFab.vue
  @description Bouton flottant interactif (FAB) et widget de clavardage d'assistance WhatsApp pour FindMe Cameroun.
  Permet aux citoyens d'envoyer rapidement un message structuré au numéro whatsapp défini
-->

<script setup lang="ts">
	import { ref, computed, watch, onMounted } from "vue";
	import { useAuth } from "~/composables/useAuth";
	import { X, Send, MessageCircle, HelpCircle, Check } from "lucide-vue-next";

	// Client Support WhatsApp Target
	const WHATSAPP_NUMBER = useRuntimeConfig().public.whatsappNumber;

	const { currentUser } = useAuth();

	// Dynamic State
	const isOpen = ref(false);
	const clientName = ref("");
	const clientMessage = ref("");
	const messageSentPlaceholder = ref(false);

	// Touch / validation
	const nameTouched = ref(false);
	const messageTouched = ref(false);

	// Handle automatic name pre-filling when user session is hydrated
	watch(
		() => currentUser.value,
		(newVal) => {
			if (newVal && newVal.username) {
				clientName.value = newVal.username;
			}
		},
		{ immediate: true },
	);

	onMounted(() => {
		if (currentUser.value && currentUser.value.username) {
			clientName.value = currentUser.value.username;
		}
	});

	// Validation Computed Checks
	const isNameValid = computed(() => clientName.value.trim().length >= 2);
	const isMessageValid = computed(() => clientMessage.value.trim().length >= 5);
	const canSubmit = computed(() => isNameValid.value && isMessageValid.value);

	// Build WhatsApp Direct Link
	const whatsappUrl = computed(() => {
		const base = `https://wa.me/${WHATSAPP_NUMBER}`;
		const textIntro = `Bonjour l'équipe FindMe ! 🇨🇲\n\n`;
		const textIdentity = `Nom: ${clientName.value.trim()}\n`;
		const textBody = `Message: ${clientMessage.value.trim()}`;

		const fullText = encodeURIComponent(
			`${textIntro}${textIdentity}${textBody}`,
		);
		return `${base}?text=${fullText}`;
	});

	const handleToggle = () => {
		isOpen.value = !isOpen.value;
		if (isOpen.value) {
			messageSentPlaceholder.value = false;
			// Auto populate if still empty and we have session username
			if (!clientName.value && currentUser.value?.username) {
				clientName.value = currentUser.value.username;
			}
		}
	};

	// Track submit simulation in UI to provide interactive visual confirmation before redirection
	const handleSubmitClick = (e: Event) => {
		nameTouched.value = true;
		messageTouched.value = true;

		if (!canSubmit.value) {
			e.preventDefault();
			return;
		}

		messageSentPlaceholder.value = true;

		// Close the popup slightly after redirection click
		setTimeout(() => {
			isOpen.value = false;
			messageSentPlaceholder.value = false;
			clientMessage.value = "";
			nameTouched.value = false;
			messageTouched.value = false;
		}, 3000);
	};
</script>

<template>
	<div
		class="fixed bottom-6 right-6 z-50 select-none font-sans"
		id="whatsapp-fab-container"
	>
		<!-- 1. Sleek Floating Assistant Bubble -->
		<button
			@click="handleToggle"
			class="w-14 h-14 bg-[#2E7D32] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_8px_35px_rgb(37,211,102,0.6)] cursor-pointer focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 group relative border-2 border-white/20"
			aria-label="Contacter le support client de FindMe via WhatsApp"
			id="whatsapp-trigger-bubble"
		>
			<div
				class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce duration-1000"
				id="whatsapp-badge"
			>
				<span class="w-1.5 h-1.5 bg-white rounded-full"></span>
			</div>

			<!-- Pulse ripple concentric ring effect -->
			<span
				class="absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-30 animate-ping pointer-events-none"
				id="whatsapp-ripple-ring"
				v-if="!isOpen"
			></span>

			<!-- Close icon if open, WhatsApp brand logo if closed -->
			<Transition name="fade" mode="out-in">
				<X v-if="isOpen" class="w-6 h-6 stroke-[3]" />

				<!-- <svg
					v-else
					viewBox="0 0 24 24"
					class="w-8 h-8 fill-white transition-all transform group-hover:rotate-12 duration-200"
				>
					<path
						d="M12.003 21c-1.603 0-3.17-.418-4.547-1.213L3 21l1.248-4.386C3.414 15.21 2.97 13.626 2.97 12c0-4.962 4.041-9 9.003-9 4.963 0 9.002 4.038 9.002 9s-4.04 9-9.002 9l.03-.003zm0-16.199c-3.968 0-7.199 3.23-7.199 7.2 0 1.632.551 3.16 1.554 4.385l-.761 2.673 2.748-.72c1.2.793 2.601 1.213 4.053 1.213C15.968 19.552 19.2 16.321 19.2 12.35c0-3.968-3.23-7.198-7.197-7.198zm3.834 10.155c-.211-.106-1.25-.618-1.444-.687-.193-.07-.334-.105-.475.105-.14.21-.546.688-.67 1.83-.122.142-.245.158-.456.053-.211-.106-.889-.328-1.693-1.045-.626-.56-1.049-1.25-1.171-1.462-.123-.212-.013-.326.092-.431.096-.095.211-.247.317-.37.106-.124.141-.212.212-.353.07-.14.035-.264-.018-.37-.052-.105-.474-1.144-.652-1.567-.171-.416-.347-.353-.475-.36-.123-.007-.264-.007-.405-.007-.14 0-.37.053-.563.264-.193.21-.738.72-.738 1.76s.756 2.04 1.139 2.507c.316.386 2.457 3.753 5.952 5.263.832.36 1.48.574 1.985.734.836.266 1.597.228 2.2.138.67-.1 1.385-.565 1.579-1.11.194-.546.194-1.02.137-1.123-.056-.1-.21-.17-.422-.275z"
					/>
				</svg> -->
				<svg
					v-else
					class="w-8 h-8 fill-white transition-all transform group-hover:rotate-12 duration-200"
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>WhatsApp</title>
					<path
						d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
					/>
				</svg>
			</Transition>
		</button>

		<!-- 2. Interactive Guided WhatsApp Live Support Assistant Card -->
		<Transition name="slide-up">
			<div
				v-if="isOpen"
				class="absolute bottom-20 right-0 w-[340px] bg-white dark:bg-slate-900 border-4 border-[#2E7D32] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
				id="whatsapp-chat-box"
			>
				<!-- Header -->
				<div
					class="bg-[#128C7E] text-white p-4 flex items-center justify-between"
					id="whatsapp-box-header"
				>
					<div class="flex items-center space-x-3">
						<!-- Animated Green Dot Pulse Avatar -->
						<div
							class="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10 shrink-0"
						>
							<span class="text-xl">🇨🇲</span>
							<span
								class="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#128C7E] shadow-sm animate-pulse"
							></span>
						</div>
						<div>
							<h4
								class="text-xs font-black tracking-wide flex items-center gap-1.5"
							>
								Support FindMe
								<span
									class="text-[9px] bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.5 rounded font-black uppercase"
									>Direct</span
								>
							</h4>
							<p class="text-[10px] text-emerald-100 font-bold">
								En ligne • Répond en 5 min
							</p>
						</div>
					</div>
					<button
						@click="isOpen = false"
						class="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg cursor-pointer"
						id="whatsapp-box-close"
					>
						<X class="w-4.5 h-4.5" />
					</button>
				</div>

				<!-- Assistant Welcome Dialogue Bubble -->
				<div
					class="bg-emerald-50/50 dark:bg-slate-950/40 p-4 border-b border-[#25D366]/10 text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-300"
					id="whatsapp-agent-bubble"
				>
					👋
					<strong class="text-slate-800 dark:text-slate-100 font-black"
						>Bonjour !</strong
					>
					Précisez votre nom et votre besoin. Nous allons créer un lien sécurisé
					pour démarrer la discussion WhatsApp instantanément avec notre expert.
				</div>

				<!-- Scrollable Form Area -->
				<div class="p-4 space-y-4" id="whatsapp-form-fields-container">
					<!-- Client Name Field -->
					<div class="space-y-1.5" id="wa-field-name">
						<label
							for="wa-input-name"
							class="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
						>
							Votre Nom / Entreprise / Quartier
						</label>
						<input
							type="text"
							id="wa-input-name"
							v-model="clientName"
							@blur="nameTouched = true"
							placeholder="Ex: David d'Essos"
							class="w-full text-xs px-3 py-2 border-2 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-extrabold focus:outline-none transition-all"
							:class="
								nameTouched && !isNameValid
									? 'border-rose-450 focus:border-rose-500'
									: 'focus:border-[#25D366]'
							"
						/>
						<p
							v-if="nameTouched && !isNameValid"
							class="text-rose-500 text-[9px] font-bold"
						>
							Le nom complet est requis (min 2 car.).
						</p>
					</div>

					<!-- Message Field -->
					<div class="space-y-1.5" id="wa-field-message">
						<div class="flex justify-between items-center">
							<label
								for="wa-input-msg"
								class="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
							>
								Votre Message
							</label>
							<span class="text-[9px] font-mono font-bold text-slate-400">
								{{ clientMessage.trim().length }}/5+
							</span>
						</div>
						<textarea
							id="wa-input-msg"
							v-model="clientMessage"
							@blur="messageTouched = true"
							rows="3"
							placeholder="Ex: Bonjour, j'ai besoin d'immatriculer ma clinique à Yaoundé et commander un autocollant officiel."
							class="w-full text-xs px-3 py-2 border-2 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-extrabold focus:outline-none transition-all resize-none"
							:class="
								messageTouched && !isMessageValid
									? 'border-rose-450 focus:border-rose-500'
									: 'focus:border-[#25D366]'
							"
						></textarea>
						<p
							v-if="messageTouched && !isMessageValid"
							class="text-rose-500 text-[9px] font-bold"
						>
							Veuillez détailler votre demande (min 5 car.).
						</p>
					</div>

					<!-- Live Dynamic Preview -->
					<div
						v-if="clientMessage.trim().length > 0"
						class="bg-emerald-50 dark:bg-slate-950 border border-[#25D366]/20 p-2.5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400"
						id="wa-preview-bubble"
					>
						<span
							class="text-[9px] text-[#128C7E] dark:text-emerald-400 uppercase font-black block mb-0.5"
							>Aperçu du texte envoyé :</span
						>
						<span class="line-clamp-2 italic"
							>"Bonjour l'équipe FindMe ! Nom: {{ clientName || "..." }} |
							Message: {{ clientMessage }}"</span
						>
					</div>

					<!-- Actions / Form Redirection Button -->
					<div class="space-y-2 pt-1" id="whatsapp-redirect-actions">
						<a
							:href="whatsappUrl"
							target="_blank"
							rel="noopener noreferrer"
							@click="handleSubmitClick"
							class="w-full h-11 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md select-none border-b-4 border-emerald-700 active:border-b-0 cursor-pointer"
							:class="{ 'opacity-50 pointer-events-none': !canSubmit }"
							id="whatsapp-opener-btn"
						>
							<Send class="w-4 h-4 shrink-0" />
							<span>Ouvrir dans WhatsApp</span>
						</a>

						<p class="text-[9px] text-slate-400 font-bold text-center">
							Le bouton ouvre l'application WhatsApp ou WhatsApp Web.
						</p>
					</div>
				</div>

				<!-- Success Simulated Overlay feedback inside the widget -->
				<div
					v-if="messageSentPlaceholder"
					class="absolute inset-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center p-4 space-y-3 z-10 transition-all"
					id="whatsapp-success-cover"
				>
					<div
						class="w-12 h-12 bg-emerald-50 dark:bg-slate-950 border-4 border-emerald-500 rounded-full flex items-center justify-center"
					>
						<Check class="w-6 h-6 text-emerald-500 stroke-[3]" />
					</div>
					<div>
						<h5 class="text-xs font-black text-slate-800 dark:text-white">
							Redirection en cours...
						</h5>
						<p
							class="text-[10px] text-slate-400 font-bold mt-1 max-w-[200px] mx-auto"
						>
							Nous préparons votre discussion WhatsApp sur le numéro +237 657
							997 770 !
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
		transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.slide-up-enter-from,
	.slide-up-leave-to {
		opacity: 0;
		transform: translateY(20px) scale(0.95);
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
