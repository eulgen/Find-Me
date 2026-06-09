<!--
  @file CitizenSpace.vue
  @description Composant d'espace citoyen regroupant la gestion des plaques d'adressage et de la carte globale.
-->

<script setup lang="ts">
	import { MapPin, Sparkles, Share2, Trash2, Check } from "lucide-vue-next";
	import { useAuth } from "../../composables/useAuth";
	import { useAddresses } from "../../composables/useAddresses";
	import { useNavigation } from "../../composables/useNavigation";
	import { useShare } from "../../composables/useShare";

	const { currentUser } = useAuth();
	const {
		address,
		addressesList,
		isCreateAddressOpen,
		openAddressDetails,
		confirmDeleteAddress,
		downloadAddressFile,
	} = useAddresses();

	const { currentView, citizenSpaceTab, handleGoHome } = useNavigation();

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	const { handleShareLink } = useShare();
</script>

<template>
	<section
		v-if="currentView === 'citizen-space' && currentUser"
		class="bg-[#FAF8FD] dark:bg-[#0E111F] border-b-4 border-[#1A237E] py-16 px-6 min-h-[70vh]"
		id="mon-espace-citoyen-section"
	>
		<div class="max-w-6xl mx-auto space-y-10">
			<!-- Fil d'Ariane pour la navigation arrière -->
			<div
				class="flex items-center space-x-2 text-sm text-[#1A237E]/70 dark:text-slate-300 mb-2 font-semibold"
				id="citizen-breadcrumbs"
			>
				<ButtonUI variant="outline" @click="handleGoHome" id="go-home-btn">
					&larr; Retour à l'accueil
				</ButtonUI>
				<span class="text-[#1A237E]/40 font-bold">/</span>
				<span class="text-[#1A237E]/70 dark:text-slate-300 font-black"
					>Mon Espace Citoyen</span
				>
			</div>

			<!-- Carte de bienvenue utilisateur -->
			<div
				class="bg-white dark:bg-slate-900 border-4 border-[#1A237E] dark:border-[#2E7D32] rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_0px_#1A237E] dark:shadow-[8px_8px_0px_0px_#2E7D32] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
				id="espace-header-card"
			>
				<div class="space-y-2">
					<div class="flex items-center space-x-2 flex-wrap gap-y-2">
						<span
							class="bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-full"
						>
							PORTAIL CITOYEN HOMOLOGUÉ
						</span>
						<span
							class="bg-amber-100 text-amber-800 border border-amber-200 font-black uppercase text-[9px] tracking-wider px-2 py-0.5 rounded-md"
						>
							Vérification en Cours 📧
						</span>
					</div>
					<h2
						class="text-2xl md:text-3xl font-black text-[#1A237E] dark:text-white leading-tight"
					>
						Bienvenue dans votre Espace Citoyen, {{ currentUser.username }} !
					</h2>
					<p
						class="text-xs md:text-sm text-[#1A237E]/75 dark:text-gray-300 leading-relaxed font-semibold"
					>
						Gérez ci-dessous vos adresses municipales normées pour l'email
						{{ currentUser.email }}, suivez la performance de compression de
						photo ou créez un code.
					</p>
				</div>

				<!-- Bouton de création d'adresse -->
				<div class="shrink-0 w-full md:w-auto" id="espace-controls-wrapper">
					<ButtonUI
						variant="primary"
						:icon="Sparkles"
						@click="isCreateAddressOpen = true"
						class="w-full md:w-auto"
						id="user-add-address-btn"
					>
						Créer une nouvelle adresse
					</ButtonUI>
				</div>
			</div>

			<!-- Liste des plaques d'adressage -->
			<div class="space-y-6" id="user-addresses-flow">
				<div
					class="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#1A237E]/10 pb-3 gap-4"
					id="addresses-flow-header-wrapper"
				>
					<h3
						class="text-xs md:text-sm font-black uppercase tracking-widest text-[#1A237E] dark:text-white flex items-center"
						id="section-addresses-heading"
					>
						<MapPin class="w-4.5 h-4.5 mr-1.5 text-[#2E7D32]" />
						<span
							>Vos Plaques d'Adressage Actives ({{
								addressesList.length
							}})</span
						>
					</h3>

					<!-- Sélecteur de mode d'affichage -->
					<div
						class="flex items-center bg-white dark:bg-slate-950 border-2 border-[#1A237E] dark:border-slate-800 rounded-xl p-1 shadow-[2px_2px_0px_0px_#1A237E]"
						id="view-mode-selector-tabs"
					>
						<button
							type="button"
							@click="citizenSpaceTab = 'list'"
							class="px-3.5 py-1.5 font-black text-xs rounded-lg transition-all cursor-pointer flex items-center space-x-1.5"
							:class="
								citizenSpaceTab === 'list'
									? 'bg-[#1A237E] text-white'
									: 'text-[#1A237E] dark:text-slate-300 hover:bg-[#F5F2FB] dark:hover:bg-slate-900'
							"
							id="tab-list-view-btn"
							aria-label="Afficher sous forme de liste de cartes"
						>
							<span class="font-bold">☰</span>
							<span>Liste</span>
						</button>
						<button
							type="button"
							@click="citizenSpaceTab = 'map'"
							class="px-3.5 py-1.5 font-black text-xs rounded-lg transition-all cursor-pointer flex items-center space-x-1.5"
							:class="
								citizenSpaceTab === 'map'
									? 'bg-[#2E7D32] text-white'
									: 'text-[#1A237E] dark:text-slate-300 hover:bg-[#F5F2FB] dark:hover:bg-slate-900'
							"
							id="tab-map-view-btn"
							aria-label="Afficher sur la carte interactive globale"
						>
							<span>🗺️</span>
							<span>Carte Interactive</span>
						</button>
					</div>
				</div>

				<!-- Mode Liste de Cartes d'Adresse -->
				<div
					v-if="citizenSpaceTab === 'list'"
					class="grid grid-cols-1 md:grid-cols-2 gap-8"
					id="addresses-cards-grid"
				>
					<div
						v-for="(addr, idx) in addressesList"
						:key="idx"
						class="bg-white dark:bg-slate-900 border-4 border-[#1A237E] dark:border-slate-800 rounded-[32px] p-6 shadow-[8px_8px_0px_0px_#2E7D32] relative overflow-hidden flex flex-col justify-between"
						:id="`user-addr-item-${idx}`"
					>
						<div
							class="absolute top-0 right-0 bg-[#1A237E] text-white font-mono text-[9px] px-4 py-1.5 rounded-bl-2xl font-black uppercase tracking-widest"
						>
							ID: #{addressesList.length - idx}
						</div>

						<div
							@click="openAddressDetails(idx)"
							class="space-y-4 cursor-pointer hover:opacity-95 transition-opacity group"
						>
							<div class="space-y-0.5">
								<span
									class="text-[8px] font-black uppercase text-[#1A237E]/50 dark:text-gray-400 tracking-wider block"
									>PROPRIÉTAIRE</span
								>
								<span
									class="text-xs font-black text-[#1A237E] dark:text-white flex items-center gap-1 group-hover:text-[#2E7D32] transition-colors"
								>
									<span>{{ addr.fullName }}</span>
									<span
										class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
										>👁️ Voir</span
									>
								</span>
							</div>

							<div class="space-y-0.5">
								<span
									class="text-[8px] font-black uppercase text-[#2E7D32] tracking-wider block"
									>LOCALISATION</span
								>
								<h4
									class="text-lg font-black text-[#1A237E] dark:text-white leading-tight"
								>
									{{ addr.housePlateNumber }},
									{{ addr.arrondissement || "Yaoundé II" }} •
									{{ addr.neighborhood }}
								</h4>
								<span
									class="text-[11px] font-bold text-[#1A237E]/75 dark:text-gray-300"
								>
									{{ addr.city }}, Cameroun
									{{ addr.postalCode ? `(CP: ${addr.postalCode})` : "" }}
								</span>
							</div>

							<!-- Aperçu Photo -->
							<div
								class="border-2 border-[#1A237E]/10 rounded-2xl overflow-hidden h-40 bg-[#F5F2FB] dark:bg-slate-950 relative"
								:id="`addr-photo-prev-${idx}`"
							>
								<template v-if="addr.photoRaw">
									<img
										:src="addr.photoRaw"
										alt="Frontage"
										class="w-full h-full object-cover"
										referrerPolicy="no-referrer"
										:id="`addr-prev-img-${idx}`"
									/>
									<div
										class="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[9px] leading-relaxed font-semibold flex items-center justify-between border border-white/5 shadow-md"
									>
										<span>Photo vérifiée findMe</span>
										<span
											v-if="addr.photoStats"
											class="font-mono text-[8.5px] bg-[#2E7D32] px-2 py-0.5 rounded text-white font-black whitespace-nowrap shrink-0"
										>
											{{ addr.photoStats.compressed }} (-{{
												addr.photoStats.ratio
											}}%)
										</span>
										<span
											v-else
											class="font-mono text-[8.5px] bg-[#2E7D32] px-2 py-0.5 rounded text-white font-black whitespace-nowrap shrink-0"
											>210 KB</span
										>
									</div>
								</template>
								<div
									v-else
									class="w-full h-full flex flex-col items-center justify-center text-center p-4 text-[#1A237E]/40 dark:text-slate-400 space-y-1"
								>
									<span
										class="w-9 h-9 rounded-full bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32]"
									>
										<Check class="w-4.5 h-4.5 stroke-[3]" />
									</span>
									<p
										class="text-[9px] uppercase font-black tracking-widest text-[#1A237E]/80 mb-0.5"
									>
										Validation Cadastrale
									</p>
									<p
										class="text-[9px] text-[#1A237E]/65 max-w-[200px] leading-tight"
									>
										Plaque municipale standard sans photo personnalisée.
									</p>
								</div>
							</div>

							<!-- GPS Coordonnées -->
							<div class="grid grid-cols-2 gap-2 text-center" id="addr-gps-row">
								<div
									class="bg-[#1A237E]/5 dark:bg-slate-800 px-2.5 py-2 rounded-xl border border-[#1A237E]/10 dark:border-slate-800"
								>
									<span
										class="text-[7px] uppercase font-black text-[#1A237E]/50 dark:text-gray-400 block"
										>Latitude</span
									>
									<span
										class="text-[11px] font-mono font-bold text-[#1A237E] dark:text-sky-300"
										>{{ addr.coordinates.lat }}° N</span
									>
								</div>
								<div
									class="bg-[#1A237E]/5 dark:bg-slate-800 px-2.5 py-2 rounded-xl border border-[#1A237E]/10 dark:border-slate-800"
								>
									<span
										class="text-[7px] uppercase font-black text-[#1A237E]/50 dark:text-gray-400 block"
										>Longitude</span
									>
									<span
										class="text-[11px] font-mono font-bold text-[#1A237E] dark:text-sky-300"
										>{{ addr.coordinates.lng }}° E</span
									>
								</div>
							</div>

							<!-- Code Unique d'Adressage -->
							<div
								class="bg-[#2E7D32]/15 border-2 border-[#2E7D32]/35 p-3.5 rounded-2xl text-center"
							>
								<span
									class="text-[8.5px] font-black text-[#2E7D32] uppercase tracking-widest block leading-none mb-1"
									>CODE D'ADRESSAGE UNIQUE</span
								>
								<span
									class="font-mono text-base md:text-lg font-black text-[#1A237E] dark:text-white block tracking-widest uppercase"
								>
									{{ addr.addressCode }}
								</span>
							</div>
						</div>

						<!-- Actions par plaque -->
						<div
							class="mt-5 pt-4 border-t-2 border-[#1A237E]/10 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap"
						>
							<button
								type="button"
								@click="openAddressDetails(idx)"
								class="flex-1 min-w-[70px] bg-[#1A237E] hover:bg-[#1A237E]/95 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors flex items-center justify-center space-x-1"
							>
								<span>👁️</span>
								<span>Détails</span>
							</button>

							<button
								type="button"
								@click="downloadAddressFile(addr)"
								class="flex-1 min-w-[70px] bg-[#2E7D32] hover:bg-[#2E7D32]/95 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors flex items-center justify-center space-x-1"
							>
								<span>💾</span>
								<span>Télécharger</span>
							</button>

							<button
								type="button"
								@click="handleShareLink(addr.addressCode)"
								class="flex-1 min-w-[70px] flex items-center justify-center space-x-1 border-2 border-[#1A237E] bg-white text-[#1A237E] font-bold text-xs py-2 rounded-xl cursor-pointer transition-colors"
							>
								<Share2 class="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
								<span>Partager</span>
							</button>

							<button
								type="button"
								@click="confirmDeleteAddress(idx)"
								class="bg-rose-50 hover:bg-rose-100 text-[#D32F2F] border-2 border-[#D32F2F] p-2 rounded-xl cursor-pointer transition-all flex items-center justify-center shrink-0"
							>
								<Trash2 class="w-3.5 h-3.5 text-[#D32F2F]" />
							</button>
						</div>
					</div>
				</div>

				<!-- Mode Carte Interactive Globale -->
				<GlobalCitizenMap
					v-else-if="citizenSpaceTab === 'map'"
					:addresses="addressesList"
					:isDark="currentView === 'citizen-space'"
					@share="handleShareLink"
					@print="handlePrint"
					@delete="confirmDeleteAddress"
					id="global-citizen-map-viewport"
				/>
			</div>
		</div>
	</section>
</template>
