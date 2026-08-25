<!--
  @file app/components/dashboard/UserProfile.vue
  @description Onglet "Profil" — affichage et modification des informations
  personnelles de l'utilisateur avec design glassmorphism à ton uni émeraude et squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { ref, computed } from "vue";
import {
	Camera, Check, Shield, MapPin, Clock, BadgeCheck, Lock, Edit,
	Upload, User, Mail, Phone, Save,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
import { useAuth } from "~/composables/useAuth";
import { useUserProfile } from "~/composables/useUserProfile";
import { useAddresses } from "~/composables/useAddresses";

const profilePhotoUploadInput = ref<HTMLInputElement | null>(null);

const isEditMode = ref(false);

const { currentUser } = useAuth();
const {
	profileForm,
	isUpdatingProfile,
	updateProfile,
	handleProfilePhotoUpload,
} = useUserProfile();
const { addressesList } = useAddresses();

const userInitials = computed(() => {
	const name = currentUser.value?.fullName || currentUser.value?.email || "??";
	return name.substring(0, 2).toUpperCase();
});

const fullName = computed(() =>
	(currentUser.value?.fullName || currentUser.value?.username || "Utilisateur FindMe").toUpperCase()
);

const userEmail = computed(() => currentUser.value?.email || "");

const userRole = computed(() => {
	const role = (currentUser.value?.role || "").toUpperCase();
	if (role === "ADMIN") return "Administrateur";
	if (role === "SUPPORT_AGENT") return "Agent Support";
	return "Utilisateur Citoyen";
});

const lastLogin = "Il y a 2 heures";
const actionsValidated = computed(() => addressesList?.value?.length ?? 0);

const handleSave = () => {
	updateProfile();
	isEditMode.value = false;
};
</script>

<template>
	<div class="flex-1 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 dark:text-white" id="user-profile-section">

		<!-- En-tête de page -->
		<div class="flex items-start justify-between gap-4 flex-wrap">
			<div>
				<h1 class="text-3xl font-black font-serif text-slate-900 dark:text-white">Mon Profil</h1>
				<p class="text-[15px] font-medium text-slate-600 dark:text-slate-300 mt-1">
					Gérez vos informations personnelles et sécurisez votre compte.
				</p>
			</div>
			<!-- Badge compte vérifié -->
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-full shadow-xs">
				<BadgeCheck class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				<span class="text-[12px] font-black tracking-widest uppercase text-emerald-700 dark:text-emerald-400">Compte Vérifié</span>
			</div>
		</div>

		<!-- SKELETON STATE lors du chargement de l'utilisateur -->
		<div v-if="!currentUser" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 p-8 flex flex-col items-center space-y-4">
				<SkeletonUI width="w-32" height="h-32" rounded="rounded-full" />
				<SkeletonUI width="w-48" height="h-6" />
				<SkeletonUI width="w-32" height="h-4" />
			</div>
			<div class="lg:col-span-2 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 p-8 space-y-6">
				<SkeletonUI width="w-40" height="h-6" />
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<SkeletonUI height="h-12" rounded="rounded-xl" />
					<SkeletonUI height="h-12" rounded="rounded-xl" />
					<SkeletonUI height="h-12" rounded="rounded-xl" />
					<SkeletonUI height="h-12" rounded="rounded-xl" />
				</div>
			</div>
		</div>

		<!-- Corps principal quand les données sont chargées -->
		<div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">

			<!-- COLONNE GAUCHE : Avatar + Badge identité -->
			<div class="space-y-6">
				<!-- Card Avatar -->
				<div class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 flex flex-col items-center text-center overflow-hidden group">
					
					<!-- Photo de profil -->
					<div class="relative mb-5">
						<div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl relative z-10">
							<ClientOnly>
								<img
									v-if="currentUser?.profileImage"
									:src="currentUser.profileImage"
									class="w-full h-full object-cover"
									alt="Photo de profil"
								/>
								<div v-else
									class="w-full h-full bg-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-inner"
								>
									{{ userInitials }}
								</div>
								<template #fallback>
									<div class="w-full h-full bg-emerald-600"></div>
								</template>
							</ClientOnly>
						</div>
						
						<!-- Bouton caméra overlay -->
						<label
							class="absolute bottom-1 right-1 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-emerald-600 hover:text-white transition-all z-20"
							title="Changer la photo"
							aria-label="Changer la photo de profil"
						>
							<Camera class="w-4 h-4 text-slate-600 dark:text-slate-300" />
							<input ref="profilePhotoUploadInput" id="profilePhotoUploadInput" type="file" accept="image/*" class="hidden" @change="handleProfilePhotoUpload" />
						</label>
					</div>

					<ClientOnly>
						<h2 class="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{{ fullName }}</h2>
						<p class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-6">{{ userRole }}</p>
					</ClientOnly>

					<!-- Stats profil rapides -->
					<div class="w-full grid grid-cols-2 gap-3 pt-6 border-t border-slate-200/60 dark:border-slate-800 text-center">
						<div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3">
							<p class="text-xl font-black text-slate-900 dark:text-white">{{ actionsValidated }}</p>
							<p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Adresses</p>
						</div>
						<div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3">
							<p class="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">Actif</p>
							<p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Statut BDD</p>
						</div>
					</div>
				</div>

				<!-- Info Sécurité -->
				<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 space-y-4">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
							<Shield class="w-5 h-5" />
						</div>
						<div>
							<h3 class="text-sm font-black text-slate-900 dark:text-white">Sécurité du compte</h3>
							<p class="text-xs text-slate-500 dark:text-slate-400">Double authentification active</p>
						</div>
					</div>
				</div>
			</div>

			<!-- COLONNE DROITE : Formulaire des données personnelles -->
			<div class="lg:col-span-2 space-y-6">
				<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl p-8 space-y-6">
					<div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-5">
						<div>
							<h2 class="text-xl font-black font-serif text-slate-900 dark:text-white">Informations Personnelles</h2>
							<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mettez à jour vos coordonnées officielles.</p>
						</div>

						<button
							v-if="!isEditMode"
							@click="isEditMode = true"
							class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer"
						>
							<Edit class="w-3.5 h-3.5" /> Modifier
						</button>
					</div>

					<form @submit.prevent="handleSave" class="space-y-6">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<!-- Nom complet -->
							<div class="space-y-2">
								<label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
									<User class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
									Nom Complet
								</label>
								<input
									v-model="profileForm.fullName"
									:disabled="!isEditMode || isUpdatingProfile"
									type="text"
									class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-75 transition-all"
								/>
							</div>

							<!-- Username -->
							<div class="space-y-2">
								<label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
									<User class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
									Nom d'utilisateur
								</label>
								<input
									v-model="profileForm.username"
									:disabled="!isEditMode || isUpdatingProfile"
									type="text"
									class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-75 transition-all"
								/>
							</div>

							<!-- Email -->
							<div class="space-y-2">
								<label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
									<Mail class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
									Adresse Email
								</label>
								<input
									:value="userEmail"
									disabled
									type="email"
									class="w-full bg-slate-100 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-500 dark:text-slate-400 font-semibold outline-none cursor-not-allowed"
								/>
							</div>

							<!-- Téléphone -->
							<div class="space-y-2">
								<label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
									<Phone class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
									Numéro de Téléphone
								</label>
								<input
									v-model="profileForm.phoneNumber"
									:disabled="!isEditMode || isUpdatingProfile"
									type="tel"
									placeholder="+237 6XX XX XX XX"
									class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-75 transition-all"
								/>
							</div>
						</div>

						<div v-if="isEditMode" class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
							<button
								type="button"
								@click="isEditMode = false"
								class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-full hover:bg-slate-200 cursor-pointer"
							>
								Annuler
							</button>
							<button
								type="submit"
								:disabled="isUpdatingProfile"
								class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
							>
								<Save class="w-4 h-4" />
								{{ isUpdatingProfile ? 'Enregistrement...' : 'Enregistrer' }}
							</button>
						</div>
					</form>
				</div>
			</div>

		</div>
	</div>
</template>
