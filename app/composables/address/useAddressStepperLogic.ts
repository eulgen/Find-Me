import { ref } from 'vue'
// Removed static import to avoid loading html5-qrcode globally
import { useNuxtApp } from '#imports'

export function useAddressStepperLogic(deps: any) {
  const {
    formState,
    step1State,
    currentStep,
    addToast,
    setMapView,
    initMap,
    submitForm,
    router,
    currentUser,
    removeDraft,
    showLimitModal
  } = deps

  // -- Geolocation Logic --
  const handleGeolocationYes = () => {
    step1State.value.geolocationStatus = 'loading'
    addToast("Recherche de votre position...", "info")
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          formState.value.lat = pos.coords.latitude.toFixed(6)
          formState.value.lng = pos.coords.longitude.toFixed(6)
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=fr`)
            const data = await res.json()
            if (data && data.address) {
              if (data.address.country) formState.value.country = data.address.country;
              const city = data.address.city || data.address.town || data.address.village;
              if (city) formState.value.city = city;
              const neighborhood = data.address.suburb || data.address.neighbourhood;
              if (neighborhood) formState.value.neighborhood = neighborhood;
              if (data.address.road) formState.value.street = data.address.road;
            }
          } catch (e) {}

          step1State.value.geolocationStatus = 'success'
          addToast("Position trouvée !", "success")

          setMapView(pos.coords.latitude, pos.coords.longitude, 18)
          
          step1State.value.askGeolocation = false
          setTimeout(() => {
            currentStep.value = 2
          }, 1200)
        },
        () => {
          step1State.value.geolocationStatus = 'error'
          addToast("Impossible de récupérer la position.", "error")
          step1State.value.askGeolocation = false
          step1State.value.askManualLocation = true
        },
        { enableHighAccuracy: true }
      )
    } else {
      step1State.value.askGeolocation = false
      step1State.value.askManualLocation = true
    }
  }

  const handleGeolocationNo = () => {
    step1State.value.askGeolocation = false
    step1State.value.askManualLocation = true
  }

  // -- Manual Location Logic --
  const handleManualLocationDone = () => {
    step1State.value.askManualLocation = false
    currentStep.value = 2
  }

  // -- QR Logic --
  const handleQRYes = () => {
    step1State.value.askQR = false
    step1State.value.showQRScanner = true
  }

  const handleImageUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    addToast("Analyse de l'image en cours...", "info");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("hidden-qr-stepper-box");
      const decodedText = await html5QrCode.scanFile(file, true);
      
      let resultData = null;
      try {
          resultData = JSON.parse(decodedText);
      } catch(err) {
          resultData = { addressCode: decodedText.trim() };
      }
      
      if (resultData) {
          handleQRScanned(resultData);
      } else {
          addToast("Aucune donnée d'adresse trouvée dans ce QR Code.", "error");
      }
    } catch (err) {
      addToast("Impossible de lire un QR Code valide sur cette image.", "error");
    }
  }

  const handleQRNo = () => {
    step1State.value.askQR = false
    step1State.value.showQRScanner = false
    step1State.value.askGeolocation = true
  }

  const handleQRScanned = async (data: any) => {
    if (data) {
      step1State.value.showQRScanner = false
      
      let fullData = data;
      if ((data.addressCode && !data.city) || data.raw) {
        try {
          addToast("Récupération de l'adresse depuis le serveur...", "info");
          const { $api } = useNuxtApp();
          const codeToFetch = data.addressCode || data.raw;
          const userId = currentUser.value?.id || 'user_12345';
          const fetched = await $api(`/api/users/user/${userId}/addresses/${codeToFetch}`);
          if (fetched) {
            fullData = fetched;
          }
        } catch(err) {
          addToast("Impossible de récupérer les détails de l'adresse distante.", "error");
        }
      }

      if (fullData.country) formState.value.country = fullData.country;
      if (fullData.city) formState.value.city = fullData.city;
      if (fullData.neighborhood) formState.value.neighborhood = fullData.neighborhood;
      if (fullData.streetName || fullData.street) formState.value.street = fullData.streetName || fullData.street;
      if (fullData.housePlateNumber || fullData.houseNumber) formState.value.houseNumber = fullData.housePlateNumber || fullData.houseNumber;
      if (fullData.photoRaw || fullData.photo) formState.value.photo = fullData.photoRaw || fullData.photo;
      if (fullData.coordinates) {
        formState.value.lat = fullData.coordinates.lat;
        formState.value.lng = fullData.coordinates.lng;
      }
      
      const isComplete = formState.value.city && formState.value.neighborhood && formState.value.houseNumber && formState.value.photo;

      if (isComplete) {
        addToast("Données complètes récupérées. Création automatique...", "success");
        setTimeout(() => {
          if (submitForm()) {
            addToast("Adresse créée avec succès !", "success")
            router.push(`/users/${currentUser.value?.id || 'me'}?section=addresses`)
          }
        }, 800);
      } else {
        addToast("Données du QR Code récupérées. Veuillez compléter les informations.", "success");
        currentStep.value = 2;
      }
    }
  }

  const goBackToStep1 = () => {
    currentStep.value = 1
    step1State.value.askGeolocation = true
    step1State.value.geolocationStatus = 'idle'
    step1State.value.askManualLocation = false
    step1State.value.askQR = false
    step1State.value.showQRScanner = false
    setTimeout(() => {
      initMap('leaflet-stepper-map')
    }, 300)
  }

  // --- PHOTO UPLOAD LOGIC ---
  const photoInput = ref<HTMLInputElement | null>(null)

  const triggerPhotoUpload = () => {
    if (photoInput.value) photoInput.value.click()
  }

  const handlePhotoUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxDim = 720;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.72);
        const origSizeKB = Math.round(file.size / 1024);
        const compSizeKB = Math.round((compressedBase64.length * 3) / 4 / 1024);
        const ratio = Math.round(((origSizeKB - compSizeKB) / origSizeKB) * 100);

        formState.value.photo = compressedBase64;
        formState.value.photoStats = {
          compressed: `${compSizeKB} KB`,
          ratio: ratio > 0 ? ratio.toString() : "0",
          format: (file.type.split('/')[1] || 'JPEG').toUpperCase()
        };
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  const finalSubmit = () => {
    if (submitForm()) {
      addToast("Adresse créée avec succès !", "success")
      router.push(`/users/${currentUser.value?.id || 'me'}?section=addresses`)
    }
  }

  const cancelCreation = () => {
    showLimitModal.value = false;
    removeDraft();
    router.push(`/users/${currentUser.value?.id || 'me'}?section=addresses`);
  }

  return {
    handleGeolocationYes,
    handleGeolocationNo,
    handleManualLocationDone,
    handleQRYes,
    handleImageUpload,
    handleQRNo,
    handleQRScanned,
    goBackToStep1,
    photoInput,
    triggerPhotoUpload,
    handlePhotoUpload,
    finalSubmit,
    cancelCreation
  }
}
