/**
 * @file useAddresses.ts
 * @description Composable centralisant l'état réactif et les opérations CRUD simples sur les adresses citoyennes.
 * 
 * Les validations ont été déléguées à `useValidation.ts` et les téléchargements
 * de certificats PDF ou SVG ont été délégués à `useAddressExporter.ts`.
 */

import { ref } from 'vue'
import { type AddressData } from '../types'
import { useToasts } from './useToasts'
import { useAuth } from './useAuth'
import { useAddressExporter } from './useAddressExporter'

const defaultAddress: AddressData = {
  fullName: 'Famille Ndeng Brice',
  phone: '+237 699 12 34 56',
  city: 'Yaoundé',
  neighborhood: 'Bastos',
  streetName: 'Rue de la Joie',
  housePlateNumber: '28B',
  landmark: 'En face de la Pharmacie de l\'Europe, près du grand manguier',
  coordinates: {
    lat: 3.8480,
    lng: 11.5021
  },
  addressCode: 'FM-YDE-BAS-28B'
}

const address = ref<AddressData>({ ...defaultAddress })
const isCreateAddressOpen = ref<boolean>(false)

const addressesList = ref<any[]>([
  {
    fullName: 'Brice Ndeng',
    phone: '+237 699 12 34 56',
    city: 'Yaoundé',
    arrondissement: 'Yaoundé I',
    neighborhood: 'Bastos',
    postalCode: '00237',
    housePlateNumber: '28B',
    streetName: 'Rue de la Joie',
    landmark: 'En face de la Pharmacie de l\'Europe, près du grand manguier',
    coordinates: {
      lat: 3.8480,
      lng: 11.5021
    },
    addressCode: 'FM-YDE-BAS-28B',
    photoRaw: '/assets/images/cameroon_house_address_1780109511639.png',
    photoStats: {
      compressed: '194 KB',
      ratio: '84'
    }
  }
])

const selectedAddressDetails = ref<any | null>(null)
const selectedAddressDetailsIndex = ref<number | null>(null)
const showDetailsModal = ref<boolean>(false)

const showDeleteConfirm = ref<boolean>(false)
const addressToDeleteIndex = ref<number | null>(null)

export function useAddresses() {
  const { addToast } = useToasts()
  const { currentUser } = useAuth()
  const { downloadAddressFile, downloadAddressPDF } = useAddressExporter()

  const openAddressDetails = (idx: number) => {
    selectedAddressDetailsIndex.value = idx
    selectedAddressDetails.value = addressesList.value[idx]
    showDetailsModal.value = true
  }

  const handleAddressCreated = (newAddress: any) => {
    addressesList.value = [newAddress, ...addressesList.value]
    address.value = newAddress

    // Connexion automatique si l'utilisateur n'est pas encore connecté
    if (!currentUser.value) {
      currentUser.value = {
        email: 'ndengbrice@gmail.com',
        username: 'Brice Ndeng'
      }
    }

    addToast('🎉 Votre adresse findMe a été créée avec succès !', 'success')
    addToast(`📧 Un e-mail de vérification a été envoyé à l'adresse (${currentUser.value?.email || 'ndengbrice@gmail.com'}) pour confirmer.`, 'mail')
  }

  const confirmDeleteAddress = (idx: number) => {
    addressToDeleteIndex.value = idx
    showDeleteConfirm.value = true
  }

  const executeDeleteAddress = () => {
    if (addressToDeleteIndex.value !== null) {
      const deleted = addressesList.value[addressToDeleteIndex.value]
      addressesList.value = addressesList.value.filter((_, i) => i !== addressToDeleteIndex.value)
      
      // Réinitialiser la sélection si l'adresse visualisée est celle supprimée
      if (selectedAddressDetailsIndex.value === addressToDeleteIndex.value) {
        selectedAddressDetails.value = null
        selectedAddressDetailsIndex.value = null
        showDetailsModal.value = false
      }
      
      addToast(`🗑️ L'adresse (${deleted.addressCode}) a été retirée définitivement.`, 'success')
    }
    showDeleteConfirm.value = false
    addressToDeleteIndex.value = null
  }

  return {
    address,
    isCreateAddressOpen,
    addressesList,
    selectedAddressDetails,
    selectedAddressDetailsIndex,
    showDetailsModal,
    showDeleteConfirm,
    addressToDeleteIndex,
    openAddressDetails,
    handleAddressCreated,
    confirmDeleteAddress,
    executeDeleteAddress,
    downloadAddressFile,
    downloadAddressPDF
  }
}
