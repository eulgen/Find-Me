import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMemory } from '~/composables/useMemory'
import { useAddresses } from '~/composables/useAddresses'
import { useAuth } from '~/composables/useAuth'

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

  const formErrors = ref({ neighborhood: '', street: '', houseNumber: '', photo: '' });

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
    
    if (!formState.value.street.trim()) { formErrors.value.street = "Requis"; valid = false }
    else formErrors.value.street = ""
    
    if (!formState.value.houseNumber.trim()) { formErrors.value.houseNumber = "Requis"; valid = false }
    else formErrors.value.houseNumber = ""
    
    if (valid) currentStep.value = 3
  }

  const removeDraft = () => {
    draftsList.value = draftsList.value.filter((d: any) => d.id !== draftId.value);
  };

  const createAddressPayload = () => {
    const cityAbbr = formState.value.city.substring(0, 3).toUpperCase();
    const qAbbr = formState.value.neighborhood.substring(0, 3).toUpperCase().replace(/\s/g, "");
    const addrCode = `FM-${cityAbbr}-${qAbbr}-${formState.value.houseNumber}`;

    return {
      fullName: currentUser.value?.username || "Citoyen",
      phone: currentUser.value?.phoneNumber || "+237 600 00 00 00",
      country: formState.value.country,
      city: formState.value.city,
      neighborhood: formState.value.neighborhood,
      streetName: formState.value.street,
      housePlateNumber: formState.value.houseNumber,
      postalCode: formState.value.postalCode,
      coordinates: {
        lat: parseFloat(formState.value.lat),
        lng: parseFloat(formState.value.lng),
      },
      addressCode: addrCode,
      photoRaw: formState.value.photo,
      photoStats: formState.value.photoStats,
    };
  };

  const submitForm = () => {
    if (!formState.value.photo) {
      formErrors.value.photo = "Photo requise"
      return false;
    }

    if (addressesList.value.length >= 4) {
      showLimitModal.value = true;
      return false;
    }

    const addressPayload = createAddressPayload();
    handleAddressCreated(addressPayload);
    removeDraft();
    return true; // Success
  }

  return {
    formState, step1State, currentStep, showLimitModal, formErrors, draftId,
    initDraft, removeDraft, submitForm, validateStep2, createAddressPayload,
    addressesList, handleAddressCreated, currentUser
  }
}
