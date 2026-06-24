<!--
  @file app/components/dashboard/UserProfile.vue
  @description Onglet "Profil" — affichage et modification des informations
  personnelles de l'utilisateur connecté. Calqué sur la maquette "profil utilisateur.png".
  Utilise ButtonUI pour tous les boutons conformément aux exigences.
-->

<script setup lang="ts">
import { ref } from "vue";
import {
	Camera, Check, Shield, MapPin, Clock, BadgeCheck, Lock, Edit,
	Upload, User, Mail, Phone,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import { useAuth } from "~/composables/useAuth";
import { useUserProfile } from "~/composables/useUserProfile";

const profilePhotoUploadInput = ref<HTMLInputElement | null>(null);

// ─── État local pour le mode édition ──────────────────────────────────────
const isEditMode = ref(false);

// ─── Composables ──────────────────────────────────────────────────────────
const { currentUser } = useAuth();
const {
	profileForm,
	isUpdatingProfile,
	updateProfile,
	handleProfilePhotoUpload,
} = useUserProfile();

// ─── Données dérivées ─────────────────────────────────────────────────────
/** Initiales pour l'avatar par défaut */
const userInitials = computed(() => {
	const name = currentUser.value?.username || currentUser.value?.email || "??";
	return name.substring(0, 2).toUpperCase();
});

/** Nom complet affiché */
const fullName = computed(() =>
	(currentUser.value?.username || "Utilisateur FindMe").toUpperCase()
);

/** Email de l'utilisateur */
const userEmail = computed(() => currentUser.value?.email || "");

/** Rôle formaté */
const userRole = computed(() => {
	const role = currentUser.value?.rule;
	if (role === "admin") return "Administrateur";
	return "Utilisateur";
});

/** Dernier accès simulé */
const lastLogin = "Il y a 2 heures";

/** Actions validées simulées */
const actionsValidated = computed(() => addressesList?.value?.length ?? 0);

// Import pour les stats
import { useAddresses } from "~/composables/useAddresses";
const { addressesList } = useAddresses();

/** Handler de soumission du formulaire */
const handleSave = () => {
	updateProfile();
	isEditMode.value = false;
};
</script>

<template>
	<div class="flex-1 space-y-6 max-w-4xl mx-auto w-full animate-in fade-in duration-300" id="user-profile-section">

		<!-- ── En-tête de page ── -->
		<div class="flex items-start justify-between gap-4 flex-wrap">
			<div>
				<h1 class="text-2xl font-black text-gray-800 dark:text-white">Mon Profil</h1>
				<p class="text-sm text-gray-500 dark:text-slate-400 mt-1">
					Gérez vos informations personnelles et vos paramètres.
				</p>
			</div>
			<!-- Badge compte vérifié -->
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-[#2E7D32]/20 rounded-full shadow-sm">
				<BadgeCheck class="w-4 h-4 text-[#2E7D32]" />
				<span class="text-xs font-black text-[#2E7D32]">Compte Vérifié v2.5</span>
			</div>
		</div>

		<!-- ── Corps principal ── -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE GAUCHE : Avatar + Badge identité           -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="space-y-4">
				<!-- Card Avatar -->
				<div class="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
					<!-- Photo de profil avec bouton de changement -->
					<div class="relative group mb-4">
						<div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl">
							<ClientOnly>
								<img
									v-if="currentUser?.photo"
									:src="currentUser.photo"
									class="w-full h-full object-cover"
									alt="Photo de profil"
								/>
								<div v-else
									class="w-full h-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center text-white text-3xl font-black"
								>
									{{ userInitials }}
								</div>
								<template #fallback>
									<div class="w-full h-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]"></div>
								</template>
							</ClientOnly>
						</div>
						<!-- Bouton caméra overlay -->
						<label
							class="absolute bottom-0 right-0 w-9 h-9 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
							title="Changer la photo"
						>
							<Camera class="w-4 h-4 text-gray-600 dark:text-white" />
							<input ref="profilePhotoUploadInput" id="profilePhotoUploadInput" type="file" accept="image/*" class="hidden" @change="handleProfilePhotoUpload" />
						</label>
					</div>

					<ClientOnly>
						<h2 class="text-lg font-black text-gray-800 dark:text-white mb-0.5">{{ fullName }}</h2>
						<p class="text-xs font-bold text-[#2E7D32] uppercase tracking-wider mb-4">{{ userRole }}</p>
						<template #fallback>
							<div class="space-y-2 mb-4 w-full flex flex-col items-center">
								<div class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-2/3 animate-pulse"></div>
								<div class="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
							</div>
						</template>
					</ClientOnly>
 
					<!-- Bouton remplacer image -->
					<ButtonUI
						variant="outline"
						size="sm"
						:icon="Upload"
						class="w-full border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400"
						@click="profilePhotoUploadInput?.click()"
					>
						Remplacer l'image
					</ButtonUI>
				</div>

				<!-- Card Identité FindMe -->
				<div class="bg-gradient-to-br from-[#1A237E] via-[#1A237E] to-[#0D144A] rounded-[24px] p-6 flex flex-col items-center text-center shadow-xl shadow-[#1A237E]/30 relative overflow-hidden">
					<!-- Décorations -->
					<div class="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
					<div class="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-3 relative z-10">
						<Shield class="w-8 h-8 text-white" />
					</div>
					<p class="text-base font-black text-white relative z-10">Identité FindMe</p>
					<p class="text-xs text-indigo-300 relative z-10 mt-0.5">Badge Officiel Certifié</p>
				</div>
			</div>

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE DROITE : Informations personnelles         -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="lg:col-span-2 space-y-4">
				<!-- Card Informations Personnelles -->
				<div class="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
					<div class="p-6">
						<!-- En-tête section -->
						<div class="flex items-center justify-between mb-5">
							<div class="flex items-center gap-2">
								<div class="w-8 h-8 bg-[#2E7D32]/10 rounded-xl flex items-center justify-center">
									<User class="w-4 h-4 text-[#2E7D32]" />
								</div>
								<span class="text-base font-black text-gray-800 dark:text-white">Informations Personnelles</span>
							</div>
							<span class="px-2.5 py-1 bg-[#2E7D32]/10 text-[#2E7D32] text-[10px] font-black rounded-full uppercase tracking-wider">
								Actif
							</span>
						</div>

						<!-- Grille de champs -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<!-- Nom complet -->
							<div class="space-y-1">
								<label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nom Complet</label>
								<div class="relative">
									<input
										v-if="isEditMode"
										v-model="profileForm.username"
										type="text"
										placeholder="Prénom"
										class="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all text-sm font-medium"
									/>
									<div v-else class="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-2.5">
										<ClientOnly>
											<span class="text-sm text-gray-800 dark:text-white font-semibold flex-1">{{ fullName }}</span>
											<template #fallback><span class="flex-1">...</span></template>
										</ClientOnly>
										<User class="w-4 h-4 text-gray-400 shrink-0" />
									</div>
								</div>
							</div>

							<!-- Email -->
							<div class="space-y-1">
								<label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Adresse Email</label>
								<div class="flex items-center gap-2 bg-gray-100 dark:bg-slate-800/80 border border-transparent rounded-xl px-4 py-2.5">
									<ClientOnly>
										<span class="text-sm text-gray-500 flex-1 truncate">{{ userEmail }}</span>
										<template #fallback><span class="flex-1">...</span></template>
									</ClientOnly>
									<Mail class="w-4 h-4 text-gray-400 shrink-0" />
								</div>
							</div>

							<!-- Rôle -->
							<div class="space-y-1">
								<label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Rôle</label>
								<div class="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-2.5">
									<ClientOnly>
										<span class="text-sm text-gray-800 dark:text-white font-semibold flex-1">{{ userRole }}</span>
										<template #fallback><span class="flex-1">...</span></template>
									</ClientOnly>
									<Shield class="w-4 h-4 text-gray-400 shrink-0" />
								</div>
							</div>

							<!-- Téléphone -->
							<div class="space-y-1">
								<label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Téléphone</label>
								<div class="relative">
									<input
										v-if="isEditMode"
										v-model="profileForm.phone"
										type="tel"
										placeholder="+237 600 000 000"
										class="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all text-sm font-medium"
									/>
									<div v-else class="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-2.5">
										<ClientOnly>
											<span class="text-sm text-gray-800 dark:text-white font-semibold flex-1">
												{{ currentUser?.phoneNumber || '+237 60 00 00 00' }}
											</span>
											<template #fallback><span class="flex-1">...</span></template>
										</ClientOnly>
										<Phone class="w-4 h-4 text-gray-400 shrink-0" />
									</div>
								</div>
							</div>
						</div>

						<!-- Card Région assignée -->
						<div class="mt-4 bg-gradient-to-r from-[#1A237E] to-[#0D144A] rounded-2xl p-4 flex items-center gap-3">
							<div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
								<MapPin class="w-5 h-5 text-white" />
							</div>
							<div>
								<p class="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Région assignée</p>
								<p class="text-base font-black text-white">Yaoundé — Cameroun</p>
							</div>
						</div>
					</div>

					<!-- Footer actions -->
					<div class="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap justify-end gap-3">
						<ButtonUI
							v-if="isEditMode"
							variant="outline"
							size="sm"
							class="border-gray-200 dark:border-slate-700"
							@click="isEditMode = false"
						>
							Annuler
						</ButtonUI>
						<ButtonUI
							v-if="!isEditMode"
							variant="outline"
							:icon="Edit"
							@click="isEditMode = true"
						>
							Modifier le Profil
						</ButtonUI>
						<ButtonUI
							v-else
							variant="primary"
							:icon="Check"
							:loading="isUpdatingProfile"
							@click="handleSave"
						>
							Enregistrer
						</ButtonUI>
					</div>
				</div>
			</div>
		</div>

		<!-- ── Statistiques du compte ── -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<!-- Dernière connexion -->
			<div class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
				<div class="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
					<Clock class="w-5 h-5 text-gray-400" />
				</div>
				<div>
					<p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Dernière Connexion</p>
					<p class="text-base font-black text-gray-800 dark:text-white">{{ lastLogin }}</p>
				</div>
			</div>

			<!-- Actions validées -->
			<div class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
				<div class="w-10 h-10 bg-[#2E7D32]/10 rounded-xl flex items-center justify-center shrink-0">
					<Check class="w-5 h-5 text-[#2E7D32]" />
				</div>
				<div>
					<p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Actions Validées</p>
					<ClientOnly>
						<p class="text-base font-black text-gray-800 dark:text-white">{{ actionsValidated }} Adresses</p>
						<template #fallback>
							<p class="text-base font-black text-gray-800 dark:text-white">...</p>
						</template>
					</ClientOnly>
				</div>
			</div>

			<!-- Sécurité -->
			<div class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm p-5 flex items-center gap-4">
				<div class="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
					<Lock class="w-5 h-5 text-blue-500" />
				</div>
				<div>
					<p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Sécurité du Compte</p>
					<p class="text-base font-black text-gray-800 dark:text-white">MFA Activé</p>
				</div>
			</div>
		</div>

	</div>
</template>
