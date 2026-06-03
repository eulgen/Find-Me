<!--
 * @file AdminSpace.vue
 * @description Vue d'administration globale centralisée findMe Cameroun.
 * Permet de gérer (CRUD) les comptes d'utilisateurs et de voir les adresses associées.
 * Affiche également des KPI d'activité globale (comptes, adresses).
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Users, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Filter, 
  TrendingUp, 
  Eye, 
  UserPlus, 
  LogOut, 
  LayoutDashboard,
  Map,
  ShieldAlert,
  Info
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useAddresses } from '../composables/useAddresses'
import { useLanguage } from '../composables/useLanguage'
import { useToasts } from '../composables/useToasts'
import { useNavigation } from '../composables/useNavigation'

const { currentLang } = useLanguage()
const { addToast } = useToasts()
const { currentView } = useNavigation()

const { 
  usersList, 
  currentUser,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
} = useAuth()

const { 
  addressesList, 
  openAddressDetails 
} = useAddresses()

// States
const currentTab = ref<'dashboard' | 'users' | 'addresses'>('dashboard')
const userSearchQuery = ref('')
const addressSearchQuery = ref('')
const roleFilter = ref<'all' | 'citizen' | 'admin'>('all')

// Create User state
const isCreateModalOpen = ref(false)
const createUsername = ref('')
const createEmail = ref('')
const createPhone = ref('')
const createRole = ref<'citizen' | 'admin'>('citizen')

// Edit User state
const isEditModalOpen = ref(false)
const editingUserId = ref<string | null>(null)
const editUsername = ref('')
const editEmail = ref('')
const editPhone = ref('')
const editRole = ref<'citizen' | 'admin'>('citizen')

// Delete Confirm state
const isDeleteConfirmOpen = ref(false)
const userToDeleteId = ref<string | null>(null)

// Stats Computed
const totalUsersCount = computed(() => usersList.value.length)
const totalAddressesCount = computed(() => addressesList.value.length)
const citizenUsersCount = computed(() => usersList.value.filter(u => u.role === 'citizen').length)
const adminUsersCount = computed(() => usersList.value.filter(u => u.role === 'admin').length)

// Filtered Lists
const filteredUsers = computed(() => {
  return usersList.value.filter(user => {
    const query = userSearchQuery.value.toLowerCase().trim()
    const matchesSearch = user.username.toLowerCase().includes(query) || 
                          user.email.toLowerCase().includes(query) ||
                          (user.phone && user.phone.includes(query))
    
    if (roleFilter.value === 'all') return matchesSearch
    return matchesSearch && user.role === roleFilter.value
  })
})

const filteredAddresses = computed(() => {
  return addressesList.value.filter(addr => {
    const query = addressSearchQuery.value.toLowerCase().trim()
    const matchesSearch = addr.fullName.toLowerCase().includes(query) || 
                          addr.addressCode.toLowerCase().includes(query) ||
                          addr.neighborhood.toLowerCase().includes(query) ||
                          addr.city.toLowerCase().includes(query)
    return matchesSearch
  })
})

// Count addresses for a specific user
const getUserAddressesCount = (email: string) => {
  const normEmail = email.toLowerCase().trim()
  return addressesList.value.filter(addr => {
    const creator = addr.creatorEmail?.toLowerCase().trim()
    // By default, if creatorEmail doesn't exist, we fallback to Brice Ndeng for default addresses
    if (!creator && normEmail === 'ndengbrice@gmail.com') return true
    return creator === normEmail
  }).length
}

// Actions
const handleOpenCreateModal = () => {
  createUsername.value = ''
  createEmail.value = ''
  createPhone.value = ''
  createRole.value = 'citizen'
  isCreateModalOpen.value = true
}

const handleCreateUser = () => {
  if (!createUsername.value.trim() || !createEmail.value.trim()) {
    addToast(currentLang.value === 'FR' ? 'Nom et E-mail obligatoires.' : 'Name and Email are required.', 'info')
    return
  }
  adminCreateUser({
    username: createUsername.value.trim(),
    email: createEmail.value.trim(),
    phone: createPhone.value.trim(),
    role: createRole.value
  })
  isCreateModalOpen.value = false
}

const handleOpenEditModal = (user: any) => {
  editingUserId.value = user.id
  editUsername.value = user.username
  editEmail.value = user.email
  editPhone.value = user.phone || ''
  editRole.value = user.role
  isEditModalOpen.value = true
}

const handleUpdateUser = () => {
  if (!editingUserId.value) return
  if (!editUsername.value.trim() || !editEmail.value.trim()) {
    addToast(currentLang.value === 'FR' ? 'Nom et E-mail obligatoires.' : 'Name and Email are required.', 'info')
    return
  }
  adminUpdateUser(editingUserId.value, {
    username: editUsername.value.trim(),
    email: editEmail.value.trim(),
    phone: editPhone.value.trim(),
    role: editRole.value
  })
  isEditModalOpen.value = false
  editingUserId.value = null
}

const triggerDeleteUser = (id: string) => {
  const user = usersList.value.find(u => u.id === id)
  if (user && user.role === 'admin' && user.username === 'eulgen') {
    addToast(currentLang.value === 'FR' ? 'Impossible de supprimer l\'administrateur principal.' : 'Cannot delete the master administrator.', 'info')
    return
  }
  userToDeleteId.value = id
  isDeleteConfirmOpen.value = true
}

const handleConfirmDelete = () => {
  if (userToDeleteId.value) {
    adminDeleteUser(userToDeleteId.value)
  }
  isDeleteConfirmOpen.value = false
  userToDeleteId.value = null
}

const logOutAdmin = () => {
  currentUser.value = null
  currentView.value = 'home'
  window.scrollTo({ top: 0, behavior: 'smooth' })
  addToast(currentLang.value === 'FR' ? 'Déconnexion du réseau Administrateur réussie.' : 'Administrator successfully signed out.', 'info')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 min-h-[80vh] text-black dark:text-slate-100" id="admin-space-root">
    
    <!-- En-tête de la Console Admin -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1A237E]/10 pb-6" id="admin-header-section">
      <div class="text-left space-y-1.5">
        <div class="inline-flex items-center space-x-1.5 bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-black px-3.5 py-1 rounded-full border border-[#2E7D32]/25">
          <span class="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
          <span>SESSION ADMINISTRATIVE ACTIVE</span>
        </div>
        <h1 class="text-3xl font-black text-[#1A237E] dark:text-sky-400">
          Superviseur findMe Cameroun
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-semibold">
          Console de gestion de l'adressage municipal unitaire. Consultation des certificats, audit des plaques citoyennes, et contrôle des accréditations.
        </p>
      </div>

      <!-- Action Déconnexion Admin -->
      <div class="flex items-center shrink-0">
        <ButtonUI 
          variant="danger" 
          @click="logOutAdmin"
          :icon="LogOut"
        >
          Quitter l'administration
        </ButtonUI>
      </div>
    </div>

    <!-- Navigation par Onglets -->
    <div class="flex flex-wrap gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3" id="admin-view-tablist">
      <ButtonUI
        :variant="currentTab === 'dashboard' ? 'primary' : 'outline'"
        @click="currentTab = 'dashboard'"
        :icon="LayoutDashboard"
      >
        Indicateurs Globaux
      </ButtonUI>
      
      <ButtonUI
        :variant="currentTab === 'users' ? 'primary' : 'outline'"
        @click="currentTab = 'users'"
        :icon="Users"
      >
        Gérer Utilisateurs
      </ButtonUI>

      <ButtonUI
        :variant="currentTab === 'addresses' ? 'primary' : 'outline'"
        @click="currentTab = 'addresses'"
        :icon="MapPin"
      >
        Contrôle des Adresses
      </ButtonUI>
    </div>

    <!-- TAB 1: DASHBOARD METRICS -->
    <div v-if="currentTab === 'dashboard'" class="space-y-8 animate-fadeIn" id="tab-dashboard-pane">
      <!-- Cartes de Statistiques (Metrics Bento Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- KPI 1 : Total Utilisateurs -->
        <div class="bg-white dark:bg-[#141627] border-3 border-[#2E7D32] rounded-[24px] p-6 shadow-[5px_5px_0px_0px_#1A237E] relative overflow-hidden flex flex-col justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-black uppercase text-[#2E7D32] tracking-wider block">Utilisateurs Enregistrés</span>
            <div class="text-4xl font-extrabold text-[#1A237E] dark:text-white font-mono flex items-baseline">
              {{ totalUsersCount }}
              <span class="text-xs font-bold text-slate-400 ml-1.5 shrink-0 uppercase font-sans">Comptes</span>
            </div>
          </div>
          <div class="flex items-center space-x-1 mt-4 text-xs font-bold text-emerald-600">
            <TrendingUp class="w-4 h-4 text-[#2E7D32]" />
            <span>+100% de croissance</span>
          </div>
          <Users class="absolute right-4 bottom-4 w-12 h-12 text-[#2E7D32]/10 pointer-events-none" />
        </div>

        <!-- KPI 2 : Total Adresses Crées -->
        <div class="bg-white dark:bg-[#141627] border-3 border-[#1A237E] rounded-[24px] p-6 shadow-[5px_5px_0px_0px_#2E7D32] relative overflow-hidden flex flex-col justify-between">
          <div class="space-y-1">
            <span class="text-[10px] font-black uppercase text-[#1A237E] dark:text-sky-400 tracking-wider block">Plaques Immatriculées</span>
            <div class="text-4xl font-extrabold text-[#2E7D32] font-mono flex items-baseline">
              {{ totalAddressesCount }}
              <span class="text-xs font-bold text-slate-400 ml-1.5 shrink-0 uppercase font-sans">Plaques</span>
            </div>
          </div>
          <div class="flex items-center space-x-1 mt-4 text-xs font-bold text-[#1A237E] dark:text-[#E2E8F0]">
            <MapPin class="w-4 h-4 text-[#1A237E]" />
            <span>Bastos, Yaoundé unifié</span>
          </div>
          <MapPin class="absolute right-4 bottom-4 w-12 h-12 text-[#1A237E]/10 pointer-events-none" />
        </div>

        <!-- KPI 3 : Citoyens Ordinaires -->
        <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 flex flex-col justify-between relative">
          <div class="space-y-1">
            <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Citoyens Libres</span>
            <div class="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">
              {{ citizenUsersCount }}
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-4 leading-relaxed">
            Citoyens rattachés au protocole décentralisé d'adressage unifié findMe Cameroun.
          </p>
        </div>

        <!-- KPI 4 : Administrateurs Réseau -->
        <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 flex flex-col justify-between relative">
          <div class="space-y-1">
            <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Superviseurs</span>
            <div class="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">
              {{ adminUsersCount }}
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-4 leading-relaxed">
            Administrateurs de l'homologation civique avec droit d'accréditation des parcelles métriques.
          </p>
        </div>
      </div>

      <!-- Quick Tips Dashboard panel -->
      <div class="bg-blue-50 dark:bg-slate-900/40 border border-blue-200 dark:border-blue-900/30 p-5 rounded-2xl flex items-start space-x-3.5 text-left" id="kpi-info-box">
        <Info class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
        <div class="space-y-1">
          <h4 class="text-sm font-black text-[#1A237E] dark:text-indigo-400">Notes pour l'administrateur</h4>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
            Toutes les modifications ou suppressions d'utilisateurs ou d'adresses ci-dessous prennent effet instantanément en mémoire locale. Pour des raisons d'authentification, l'utilisateur principal <span class="bg-[#1A237E]/10 px-1 rounded text-[#1A237E] font-bold">eulgen</span> ne peut pas être modifié ou effacé de la base de données.
          </p>
        </div>
      </div>

      <!-- Aperçu des dernières adresses enregistrées -->
      <div class="bg-white dark:bg-[#141627] border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="dashboard-recent-addr">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-black text-[#1A237E] dark:text-sky-400">
            Dernières plaques immatriculées (Système)
          </h3>
          <span class="text-xs font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full uppercase">
            {{ addressesList.length }} total
          </span>
        </div>

        <div v-if="!addressesList.length" class="text-center py-8 text-slate-400">
          Aucune adresse enregistrée sur le serveur pour le moment.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                <th class="py-3 px-4">Code findMe</th>
                <th class="py-3 px-4">Citoyen / Propriétaire</th>
                <th class="py-3 px-4">Secteur Ville</th>
                <th class="py-3 px-4">Coordonnées GPS</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(addr, idx) in addressesList" :key="idx" class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 font-bold">
                <td class="py-3 px-4">
                  <span class="font-mono bg-[#2E7D32]/10 text-[#2E7D32] px-2.5 py-1 rounded-md text-[10px] tracking-wide border border-[#2E7D32]/20">
                    {{ addr.addressCode }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                  {{ addr.fullName }}
                </td>
                <td class="py-3 px-4 text-slate-600 dark:text-slate-300">
                  {{ addr.city }}, {{ addr.neighborhood }}
                </td>
                <td class="py-3 px-4 font-mono text-slate-500 text-[10px]">
                  {{ addr.coordinates.lat.toFixed(4) }}°N, {{ addr.coordinates.lng.toFixed(4) }}°E
                </td>
                <td class="py-3 px-4 text-right">
                  <ButtonUI
                    variant="outline"
                    @click="openAddressDetails(idx)"
                    :icon="Eye"
                    class="py-1 px-3"
                  >
                    Voir Certificat
                  </ButtonUI>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: USER CRUD MANAGEMENT -->
    <div v-if="currentTab === 'users'" class="space-y-6 animate-fadeIn" id="tab-users-pane">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl" id="users-control-filters">
        <!-- Recherche -->
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            v-model="userSearchQuery"
            class="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            placeholder="Rechercher par nom, email, téléphone..."
          />
        </div>

        <!-- Filtre Rôle -->
        <div class="flex items-center space-x-2 shrink-0">
          <span class="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1">
            <Filter class="w-3.5 h-3.5 text-indigo-900" />
            <span>Filtre Rôle :</span>
          </span>
          <select 
            v-model="roleFilter"
            class="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-bold max-w-[130px] focus:outline-none"
          >
            <option value="all">Tous</option>
            <option value="citizen">Citoyen</option>
            <option value="admin">Admin</option>
          </select>

          <!-- Créer Utilisateur bouton -->
          <ButtonUI
            variant="primary"
            @click="handleOpenCreateModal"
            :icon="Plus"
          >
            Créer Utilisateur
          </ButtonUI>
        </div>
      </div>

      <!-- Users Table Grid -->
      <div class="bg-white dark:bg-[#141627] border border-slate-200 dark:border-slate-800 rounded-2xl p-6" id="users-list-wrapper">
        <h3 class="text-lg font-black text-[#1A237E] dark:text-sky-400 mb-4 flex items-center justify-between">
          <span>Annuaire des Utilisateurs Accrédités</span>
          <span class="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-right">
            {{ filteredUsers.length }} affiché(s)
          </span>
        </h3>

        <div v-if="!filteredUsers.length" class="text-center py-12 text-slate-400 font-bold space-y-2">
          <ShieldAlert class="w-10 h-10 mx-auto text-amber-500" />
          <p>Aucun utilisateur ne correspond à vos filtres actuels de recherche.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                <th class="py-3.5 px-4">Utilisateur</th>
                <th class="py-3.5 px-4 font-mono">E-mail</th>
                <th class="py-3.5 px-4">Téléphone</th>
                <th class="py-3.5 px-4">Accréditation (Rôle)</th>
                <th class="py-3.5 px-4 text-center">Adresses créées</th>
                <th class="py-3.5 px-4">Date Inscription</th>
                <th class="py-3.5 px-4 text-right">Ajuster</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 font-semibold font-sans">
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-3 text-left">
                    <div class="w-8 h-8 rounded-full bg-[#1A237E]/10 dark:bg-indigo-900/30 text-[#1A237E] dark:text-indigo-400 flex items-center justify-center font-black text-xs uppercase border border-slate-300/30">
                      {{ user.username.substring(0,2) }}
                    </div>
                    <div>
                      <span class="text-slate-800 dark:text-slate-100 font-black tracking-wide block text-sm">{{ user.username }}</span>
                      <span class="text-[9px] font-bold text-indigo-500 tracking-widest uppercase">ID: {{ user.id }}</span>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                  {{ user.email }}
                </td>
                <td class="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                  {{ user.phone || 'Non renseigné' }}
                </td>
                <td class="py-3 px-4">
                  <span 
                    class="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-center border"
                    :class="[
                      user.role === 'admin' 
                        ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40'
                    ]"
                  >
                    {{ user.role === 'admin' ? 'Administrateur' : 'Citoyen' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center font-mono font-black text-xs text-[#2E7D32]">
                  {{ getUserAddressesCount(user.email) }}
                </td>
                <td class="py-3 px-4 text-slate-400 text-[10px] font-medium font-mono">
                  {{ user.createdAt }}
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center justify-end space-x-1">
                    <ButtonUI 
                      variant="outline"
                      @click="handleOpenEditModal(user)" 
                      class="!py-1 !px-2.5 !text-[10px]"
                      title="Modifier les informations"
                    >
                      Éditer
                    </ButtonUI>
                    <!-- Bloquer suppression si Eulgen -->
                    <ButtonUI 
                      v-if="user.username !== 'eulgen'"
                      variant="danger"
                      @click="triggerDeleteUser(user.id)" 
                      class="!py-1 !px-2.5 !text-[10.5px]"
                      :icon="Trash2"
                      title="Supprimer définitivement l'utilisateur"
                    >
                    </ButtonUI>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: ADDRESSES CONTROL AUDIT -->
    <div v-if="currentTab === 'addresses'" class="space-y-6 animate-fadeIn" id="tab-addresses-pane">
      <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between" id="addresses-search-bar">
        <!-- Recherche Adresses -->
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            v-model="addressSearchQuery"
            class="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            placeholder="Rechercher plaque par propriétaire, code plaque findMe, quartier..."
          />
        </div>

        <span class="text-xs font-black text-slate-500 uppercase tracking-widest hidden md:inline">
          Yaoundé unifié, Cameroun
        </span>
      </div>

      <!-- Address Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="addresses-audit-grid">
        <div 
          v-for="(addr, idx) in filteredAddresses" 
          :key="idx" 
          class="bg-white dark:bg-[#141627] border-2 border-[#1A237E]/10 rounded-3xl p-5 shadow-sm space-y-4 text-left transition-all hover:border-[#2E7D32]"
        >
          <!-- Badge and Info Row -->
          <div class="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <span class="font-mono text-xs font-black bg-[#2E7D32]/10 text-[#2E7D32] px-3 py-1 rounded-full border border-[#2E7D32]/25 tracking-wide">
              {{ addr.addressCode }}
            </span>
            <div class="flex items-center space-x-2">
              <span class="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">
                Plaque active
              </span>
            </div>
          </div>

          <!-- Address Specific Parameters -->
          <div class="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
            <div>
              <span class="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Propriétaire / Titulaire</span>
              <span class="font-bold text-slate-800 dark:text-slate-100">{{ addr.fullName }}</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Téléphone raccordé</span>
              <span class="font-extrabold text-slate-800 dark:text-slate-100">{{ addr.phone }}</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Localité</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ addr.city }}, {{ addr.neighborhood }}</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Ligne de repère</span>
              <span class="text-slate-500 dark:text-slate-400 truncate max-w-[170px] block" :title="addr.landmark">{{ addr.landmark || 'En bordure' }}</span>
            </div>
          </div>

          <!-- Creator tag context -->
          <div class="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl flex items-center justify-between text-[11px]" id="creator-mapping-tag">
            <div class="flex items-center space-x-1 text-slate-500">
              <span>Créateur :</span>
              <span class="font-mono font-black text-[#1A237E] dark:text-sky-400">
                {{ addr.creatorEmail || 'ndengbrice@gmail.com' }}
              </span>
            </div>
            <div class="text-[#2E7D32] bg-[#2E7D32]/5 px-2 py-0.5 rounded text-[10px] font-semibold border border-[#2E7D32]/10">
              Validée
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800 pr-0.5">
            <ButtonUI
              variant="primary"
              @click="openAddressDetails(idx)"
              :icon="Eye"
              class="py-1.5 px-4"
            >
              Auditer le Certificat
            </ButtonUI>
          </div>
        </div>
      </div>

      <div v-if="!filteredAddresses.length" class="text-center py-12 text-slate-400 font-bold space-y-2" id="addresses-audit-empty">
        <ShieldAlert class="w-10 h-10 mx-auto text-amber-500" />
        <p>Aucune adresse ne correspond à la recherche.</p>
      </div>
    </div>

    <!-- MODAL 1: CREATE USER -->
    <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 bg-[#1A237E]/45 backdrop-blur-sm flex items-center justify-center p-4" id="create-user-modal-overlay">
      <div class="bg-white dark:bg-[#141627] border-4 border-[#1A237E] rounded-[32px] w-full max-w-md p-6 relative shadow-2xl space-y-5" role="dialog">
        <button @click="isCreateModalOpen = false" class="absolute top-4 right-4 text-[#1A237E] hover:text-slate-600 p-1 rounded-full border border-slate-100" aria-label="Fermer">
          <X class="w-4 h-4" />
        </button>

        <div class="text-left space-y-1">
          <h3 class="text-xl font-black text-[#1A237E] flex items-center space-x-2">
            <UserPlus class="w-5.5 h-5.5 text-[#2E7D32]" />
            <span>Créer un administrateur ou citoyen</span>
          </h3>
          <p class="text-[10px] text-slate-400 uppercase font-black tracking-wider">Formulaire d'enregistrement civique</p>
        </div>

        <form @submit.prevent="handleCreateUser" class="space-y-4 text-left">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Nom d'utilisateur / Entreprise</label>
            <input type="text" required v-model="createUsername" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none" placeholder="Ex: Jean Paul" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Adresse Email de raccordement</label>
            <input type="email" required v-model="createEmail" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none" placeholder="Ex: jeanpaul@domain.cm" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Téléphone raccord</label>
            <input type="text" v-model="createPhone" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none" placeholder="Ex: +237 600 00 00 00" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Role accrédité</label>
            <select v-model="createRole" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-bold focus:outline-none">
              <option value="citizen">Citoyen Ordinaire (Citizen)</option>
              <option value="admin">Administrateur Réseau (Admin)</option>
            </select>
          </div>

          <div class="flex items-center justify-end space-x-2 pt-2">
            <ButtonUI variant="outline" type="button" @click="isCreateModalOpen = false">Annuler</ButtonUI>
            <ButtonUI variant="primary" type="submit">Créer le compte</ButtonUI>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: EDIT USER -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 bg-[#1A237E]/45 backdrop-blur-sm flex items-center justify-center p-4" id="edit-user-modal-overlay">
      <div class="bg-white dark:bg-[#141627] border-4 border-[#1A237E] rounded-[32px] w-full max-w-md p-6 relative shadow-2xl space-y-5" role="dialog">
        <button @click="isEditModalOpen = false" class="absolute top-4 right-4 text-[#1A237E] hover:text-slate-600 p-1 rounded-full border border-slate-100" aria-label="Fermer">
          <X class="w-4 h-4" />
        </button>

        <div class="text-left space-y-1">
          <h3 class="text-xl font-black text-[#1A237E] flex items-center space-x-2">
            <Edit class="w-5.22 h-5.5 text-[#2E7D32]" />
            <span>Éditer les paramètres civiques</span>
          </h3>
          <p class="text-[10px] text-slate-400 uppercase font-black tracking-wider">Ajustement du profil utilisateur</p>
        </div>

        <form @submit.prevent="handleUpdateUser" class="space-y-4 text-left">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Nom d'utilisateur / Établissement</label>
            <input type="text" required v-model="editUsername" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Adresse Email de raccordement</label>
            <input type="email" required v-model="editEmail" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Téléphone de raccordement</label>
            <input type="text" v-model="editPhone" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-semibold focus:outline-none" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-[#1A237E] tracking-wider block">Niveau d'autorisation (Rôle)</label>
            <select v-model="editRole" :disabled="editUsername === 'eulgen'" class="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-bold focus:outline-none disabled:opacity-50">
              <option value="citizen">Citoyen Ordinaire (Citizen)</option>
              <option value="admin">Administrateur Réseau (Admin)</option>
            </select>
          </div>

          <div class="flex items-center justify-end space-x-2 pt-2">
            <ButtonUI variant="outline" type="button" @click="isEditModalOpen = false">Annuler</ButtonUI>
            <ButtonUI variant="primary" type="submit">Enregistrer les modifications</ButtonUI>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 3: DELETE PROFILE CONFIRM -->
    <div v-if="isDeleteConfirmOpen" class="fixed inset-0 z-50 bg-[#1A237E]/45 backdrop-blur-sm flex items-center justify-center p-4" id="delete-user-modal-overlay">
      <div class="bg-white dark:bg-[#141627] border-4 border-rose-600 rounded-[32px] w-full max-w-sm p-6 relative shadow-2xl space-y-5" role="dialog">
        <button @click="isDeleteConfirmOpen = false" class="absolute top-4 right-4 text-slate-500 hover:text-slate-600 p-1" aria-label="Fermer">
          <X class="w-4 h-4" />
        </button>

        <div class="text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mx-auto border border-rose-200">
            <Trash2 class="w-6 h-6 text-rose-600" />
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-black text-slate-800 dark:text-white">Désinscription définitive</h3>
            <p class="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-semibold">
              Voulez-vous vraiment retirer définitivement cet utilisateur de la base findMe Cameroun ? Cette action est irréversible.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-center space-x-2">
          <ButtonUI variant="outline" @click="isDeleteConfirmOpen = false">Annuler</ButtonUI>
          <ButtonUI variant="danger" @click="handleConfirmDelete">Supprimer définitivement</ButtonUI>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
