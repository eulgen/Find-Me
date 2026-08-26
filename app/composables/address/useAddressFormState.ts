import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMemory } from '~/composables/useMemory'
import { useAddresses } from '~/composables/useAddresses'
import { useAuth } from '~/composables/useAuth'
import type { AddressData } from '~/types/types'

export function useAddressFormState() {
  const route = useRoute()
  const { addressesList, handleAddressCreated } = useAddresses()
  const { currentUser } = useAuth()
  const { data: draftsList } = useMemory<any[]>("findme_drafts_v2", []);

  const draftId = ref<string>(`draft-${Date.now()}`);
  const showLimitModal = ref(false);
  const currentStep = ref(1);

  const formState = ref({
    country: 'Cameroun',
    city: 'Yaoundé',
    neighborhood: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    lat: '3.8480',
    lng: '11.5021',
    photo: '',
    photoStats: null as any
  });

  const step1State = ref({
    askQR: true,
    showQRScanner: false,
    askGeolocation: false,
    geolocationStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    askManualLocation: false
  });

  const formErrors = ref({ neighborhood: '', photo: '' });

  // Sync draft functionality
  const initDraft = () => {
    const queryDraftId = route.query.draftId as string;
    if (queryDraftId) {
      const draft = draftsList.value.find((d: any) => d.id === queryDraftId);
      if (draft) {
        draftId.value = draft.id;
        formState.value = draft.form;
        currentStep.value = draft.step || 1;
      }
    }
  }

  watch(formState, () => {
    if (typeof window !== "undefined") {
      if (addressesList.value.length >= 4) return;
      if (!Array.isArray(draftsList.value)) draftsList.value = [];
      const index = draftsList.value.findIndex((d: any) => d.id === draftId.value);
      const draftData = {
        id: draftId.value,
        form: formState.value,
        step: currentStep.value,
        updatedAt: Date.now()
      };
      if (index !== -1) {
        draftsList.value[index] = draftData;
      } else {
        if (draftsList.value.length < 2 || index !== -1) {
          draftsList.value.push(draftData);
        }
      }
    }
  }, { deep: true });

  watch(currentStep, () => {
    if (addressesList.value.length >= 4) return;
    if (!Array.isArray(draftsList.value)) draftsList.value = [];
    const index = draftsList.value.findIndex((d: any) => d.id === draftId.value);
    if (index !== -1) {
      draftsList.value[index].step = currentStep.value;
    }
  });

  const validateStep2 = () => {
    let valid = true
    if (!formState.value.neighborhood.trim()) { formErrors.value.neighborhood = "Requis"; valid = false }
    else formErrors.value.neighborhood = ""
    
    // Champs optionnels pré-remplis "Non spécifié" si laissés vides par l'utilisateur
    if (!formState.value.street || !formState.value.street.trim()) {
      formState.value.street = "Non spécifié";
    }
    if (!formState.value.houseNumber || !formState.value.houseNumber.trim()) {
      formState.value.houseNumber = "Non spécifié";
    }
    if (!formState.value.postalCode || !formState.value.postalCode.trim()) {
      formState.value.postalCode = "Non spécifié";
    }

    if (valid) currentStep.value = 3
  }

  const removeDraft = () => {
    draftsList.value = draftsList.value.filter((d: any) => d.id !== draftId.value);
  };

  const createAddressPayload = () => {
    const cityAbbr = (formState.value.city || "YDE").substring(0, 3).toUpperCase();
    const qAbbr = (formState.value.neighborhood || "CTR").substring(0, 3).toUpperCase().replace(/\s/g, "");
    const housePart = (formState.value.houseNumber && formState.value.houseNumber !== "Non spécifié") ? `-${formState.value.houseNumber.trim()}` : "";
    const addrCode = `FM-${cityAbbr}-${qAbbr}${housePart}`;

    return {
      fullName: currentUser.value?.fullName || "Citoyen",
      phone: currentUser.value?.phoneNumber || "+237 600 00 00 00",
      country: formState.value.country || "Cameroun",
      city: formState.value.city || "Yaoundé",
      neighborhood: formState.value.neighborhood,
      streetName: formState.value.street || "Non spécifié",
      housePlateNumber: formState.value.houseNumber || "Non spécifié",
      postalCode: formState.value.postalCode || "Non spécifié",
      coordinates: {
        lat: parseFloat(formState.value.lat),
        lng: parseFloat(formState.value.lng),
      },
      addressCode: addrCode,
      photoRaw: formState.value.photo,
      photoStats: formState.value.photoStats,
    };
  };

  const submitForm = async (): Promise<AddressData | boolean> => {
    if (!formState.value.photo) {
      formErrors.value.photo = "Photo requise"
      return false;
    }

    if (currentUser.value && addressesList.value.length >= 4) {
      showLimitModal.value = true;
      return false;
    }

    const addressPayload = createAddressPayload();
    const { createPublicAddress } = useAddresses();
    const publicCreated = await createPublicAddress(addressPayload);
    if (publicCreated) {
      removeDraft();
      return publicCreated;
    }
    return false;
  }

  return {
    formState, step1State, currentStep, showLimitModal, formErrors, draftId,
    initDraft, removeDraft, submitForm, validateStep2, createAddressPayload,
    addressesList, handleAddressCreated, currentUser
  }
}
