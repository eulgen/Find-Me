<!--
  @file app/components/dashboard/UserProfile.vue
  @description Onglet "Profil" — affichage et modification des informations
  personnelles de l'utilisateur avec design premium glassmorphism.
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
	const name = currentUser.value?.username || currentUser.value?.email || "??";
	return name.substring(0, 2).toUpperCase();
});

const fullName = computed(() =>
	(currentUser.value?.username || "Utilisateur FindMe").toUpperCase()
);

const userEmail = computed(() => currentUser.value?.email || "");

const userRole = computed(() => {
	const role = currentUser.value?.rule;
	if (role === "admin") return "Administrateur";
	return "Utilisateur";
});

const lastLogin = "Il y a 2 heures";
const actionsValidated = computed(() => addressesList?.value?.length ?? 0);

const handleSave = () => {
	updateProfile();
	isEditMode.value = false;
};
</script>

<template>
	<div class="flex-1 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700" id="user-profile-section">

		<!-- ── En-tête de page ── -->
		<div class="flex items-start justify-between gap-4 flex-wrap">
			<div>
				<h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Mon Profil</h1>
				<p class="text-[15px] font-medium text-slate-500 dark:text-slate-400 mt-1">
					Gérez vos informations personnelles et sécurisez votre compte.
				</p>
			</div>
			<!-- Badge compte vérifié -->
			<div class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 rounded-full shadow-sm">
				<BadgeCheck class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				<span class="text-[13px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">Compte Vérifié</span>
			</div>
		</div>

		<!-- ── Corps principal ── -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE GAUCHE : Avatar + Badge identité           -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="space-y-6">
				<!-- Card Avatar -->
				<div class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 flex flex-col items-center text-center overflow-hidden group">
					<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
					<div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[30px] group- transition-transform duration-700" />

					<!-- Photo de profil -->
					<div class="relative mb-5">
						<div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white/80 dark:border-slate-800 shadow-xl group-hover:shadow-emerald-500/20 transition-all duration-500 relative z-10">
							<ClientOnly>
								<img
									v-if="currentUser?.photo"
									:src="currentUser.photo"
									class="w-full h-full object-cover transition-transform duration-500"
									alt="Photo de profil"
								/>
								<div v-else
									class="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-4xl font-black shadow-inner"
								>
									{{ userInitials }}
								</div>
								<template #fallback>
									<div class="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 animate-pulse"></div>
								</template>
							</ClientOnly>
						</div>
						
						<!-- Bouton caméra overlay -->
						<label
							class="absolute bottom-1 right-1 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white dark:border-slate-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all z-20"
							title="Changer la photo"
							aria-label="Changer la photo de profil"
						>
							<Camera class="w-4 h-4 text-slate-600 dark:text-slate-300 transition-colors" />
							<input ref="profilePhotoUploadInput" id="profilePhotoUploadInput" type="file" accept="image/*" class="hidden" @change="handleProfilePhotoUpload" />
						</label>
					</div>

					<ClientOnly>
						<h2 class="text-xl font-black text-slate-800 dark:text-white mb-1 tracking-tight">{{ fullName }}</h2>
						<p class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-6">{{ userRole }}</p>
						<template #fallback>
							<div class="space-y-2 mb-6 w-full flex flex-col items-center">
								<div class="h-6 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl w-3/4 animate-pulse"></div>
								<div class="h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg w-1/3 animate-pulse"></div>
							</div>
						</template>
					</ClientOnly>
 
					<ButtonUI
						variant="outline"
						size="sm"
						:icon="Upload"
						class="w-full border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm hover:shadow-md"
						@click="profilePhotoUploadInput?.click()"
					>
						Remplacer l'image
					</ButtonUI>
				</div>

				<!-- Card Identité FindMe -->
				<div class="bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-black dark:to-slate-900 rounded-[32px] p-8 flex flex-col items-center text-center shadow-xl shadow-slate-900/20 relative overflow-hidden group transition-transform duration-500">
					<!-- Décorations -->
					<div class="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
					<div class="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
					
					<div class="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] flex items-center justify-center mb-4 relative z-10 shadow-lg transition-transform duration-500">
						<Shield class="w-8 h-8 text-emerald-400 drop-shadow-md" />
					</div>
					<p class="text-lg font-black text-white relative z-10 tracking-tight">Identité FindMe</p>
					<p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10 mt-1">Badge Officiel Certifié</p>
				</div>
			</div>

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE DROITE : Informations personnelles         -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Card Informations Personnelles -->
				<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden relative">
					
					<div class="p-8">
						<!-- En-tête section -->
						<div class="flex flex-wrap items-center justify-between mb-8 gap-4">
							<div class="flex items-center gap-4">
								<div class="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
									<User class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
								</div>
								<div>
									<h3 class="text-xl font-black text-slate-800 dark:text-white leading-tight">Dossier Personnel</h3>
									<p class="text-[13px] font-medium text-slate-500 dark:text-slate-400">Informations de votre compte</p>
								</div>
							</div>
							<span class="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20 shadow-sm flex items-center gap-1.5">
								<div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Actif
							</span>
						</div>

						<!-- Grille de champs -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<!-- Nom complet -->
							<div class="space-y-2">
								<label class="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Nom Complet</label>
								<div class="relative">
									<input
										v-if="isEditMode"
										v-model="profileForm.username"
										type="text"
										placeholder="Prénom"
										class="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-emerald-500/50 text-slate-900 dark:text-white rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-bold shadow-inner"
									/>
									<div v-else class="flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-2xl px-5 py-3.5">
										<ClientOnly>
											<span class="text-[15px] text-slate-800 dark:text-white font-bold flex-1">{{ fullName }}</span>
											<template #fallback><span class="flex-1">...</span></template>
										</ClientOnly>
										<User class="w-5 h-5 text-slate-400 shrink-0" />
									</div>
								</div>
							</div>

							<!-- Email -->
							<div class="space-y-2">
								<label class="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Adresse Email</label>
								<div class="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 rounded-2xl px-5 py-3.5 opacity-80">
									<ClientOnly>
										<span class="text-[15px] text-slate-600 dark:text-slate-400 flex-1 truncate font-medium">{{ userEmail }}</span>
										<template #fallback><span class="flex-1">...</span></template>
									</ClientOnly>
									<Mail class="w-5 h-5 text-slate-400 shrink-0" />
								</div>
							</div>

							<!-- Rôle -->
							<div class="space-y-2">
								<label class="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Rôle</label>
								<div class="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 rounded-2xl px-5 py-3.5 opacity-80">
									<ClientOnly>
										<span class="text-[15px] text-slate-600 dark:text-slate-400 font-bold flex-1">{{ userRole }}</span>
										<template #fallback><span class="flex-1">...</span></template>
									</ClientOnly>
									<Shield class="w-5 h-5 text-slate-400 shrink-0" />
								</div>
							</div>

							<!-- Téléphone -->
							<div class="space-y-2">
								<label class="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Téléphone</label>
								<div class="relative">
									<input
										v-if="isEditMode"
										v-model="profileForm.phone"
										type="tel"
										placeholder="+237 600 000 000"
										class="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-emerald-500/50 text-slate-900 dark:text-white rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-bold shadow-inner"
									/>
									<div v-else class="flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-2xl px-5 py-3.5">
										<ClientOnly>
											<span class="text-[15px] text-slate-800 dark:text-white font-bold flex-1">
												{{ currentUser?.phoneNumber || '+237 60 00 00 00' }}
											</span>
											<template #fallback><span class="flex-1">...</span></template>
										</ClientOnly>
										<Phone class="w-5 h-5 text-slate-400 shrink-0" />
									</div>
								</div>
							</div>
						</div>

						<!-- Card Région assignée -->
						<div class="mt-8 bg-gradient-to-r from-[#0F172A] to-[#1E293B] dark:from-slate-900 dark:to-black rounded-[24px] p-5 sm:p-6 flex items-center gap-4 shadow-lg relative overflow-hidden group">
							<div class="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none transition-transform duration-700"></div>
							
							<div class="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
								<MapPin class="w-6 h-6 text-white" />
							</div>
							<div class="relative z-10">
								<p class="text-[11px] text-indigo-300 font-black uppercase tracking-widest mb-0.5">Région assignée</p>
								<p class="text-lg font-black text-white tracking-tight">Yaoundé — Cameroun</p>
							</div>
						</div>
					</div>

					<!-- Footer actions -->
					<div class="px-8 py-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-t border-white/60 dark:border-slate-700/50 flex flex-wrap justify-end gap-3">
						<ButtonUI
							v-if="isEditMode"
							variant="outline"
							size="md"
							class="bg-white/50 dark:bg-slate-800/50 border-white/60 dark:border-slate-700/50 shadow-sm"
							@click="isEditMode = false"
						>
							Annuler
						</ButtonUI>
						<ButtonUI
							v-if="!isEditMode"
							variant="primary"
							size="md"
							:icon="Edit"
							class="shadow-lg shadow-emerald-500/20"
							@click="isEditMode = true"
						>
							Modifier le Profil
						</ButtonUI>
						<ButtonUI
							v-else
							variant="primary"
							size="md"
							:icon="Save"
							:loading="isUpdatingProfile"
							class="shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-teal-600 border-none"
							@click="handleSave"
						>
							Enregistrer
						</ButtonUI>
					</div>
				</div>
			</div>
		</div>

		<!-- ── Statistiques du compte ── -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<!-- Dernière connexion -->
			<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-800/50 shadow-sm p-6 flex items-center gap-5 transition-transform duration-300 group">
				<div class="w-14 h-14 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center shrink-0 border border-white/40 dark:border-slate-700/50 shadow-inner group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
					<Clock class="w-6 h-6 text-slate-500 dark:text-slate-400" />
				</div>
				<div>
					<p class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Dernière Connexion</p>
					<p class="text-lg font-black text-slate-800 dark:text-white">{{ lastLogin }}</p>
				</div>
			</div>

			<!-- Actions validées -->
			<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-800/50 shadow-sm p-6 flex items-center gap-5 transition-transform duration-300 group">
				<div class="w-14 h-14 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-inner group-hover:bg-emerald-500/20 transition-colors">
					<Check class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
				</div>
				<div>
					<p class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Adresses Créées</p>
					<ClientOnly>
						<p class="text-lg font-black text-slate-800 dark:text-white">{{ actionsValidated }} <span class="text-sm text-slate-500 font-bold">Actives</span></p>
						<template #fallback>
							<p class="text-lg font-black text-slate-800 dark:text-white animate-pulse">...</p>
						</template>
					</ClientOnly>
				</div>
			</div>

			<!-- Sécurité -->
			<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-800/50 shadow-sm p-6 flex items-center gap-5 transition-transform duration-300 group sm:col-span-2 lg:col-span-1">
				<div class="w-14 h-14 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-inner group-hover:bg-indigo-500/20 transition-colors">
					<Lock class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
				</div>
				<div>
					<p class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Sécurité du Compte</p>
					<div class="flex items-center gap-2">
						<p class="text-lg font-black text-slate-800 dark:text-white">MFA Activé</p>
						<div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
