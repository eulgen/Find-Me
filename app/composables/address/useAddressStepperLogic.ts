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
    
    let tempDiv: HTMLElement | null = null;
    try {
      let boxId = "hidden-qr-stepper-box";
      let boxEl = document.getElementById(boxId);
      
      if (!boxEl) {
        tempDiv = document.createElement("div");
        tempDiv.id = "temp-qr-scanner-box";
        tempDiv.style.display = "none";
        document.body.appendChild(tempDiv);
        boxId = "temp-qr-scanner-box";
      }

      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode(boxId);
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();

      if (tempDiv && tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
        tempDiv = null;
      }
      
      let resultData = null;
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed && (parsed.addressCode || parsed.city || parsed.neighborhood || parsed.streetName)) {
          resultData = parsed;
        } else {
          resultData = { raw: decodedText };
        }
      } catch(err) {
        const textClean = decodedText.trim();
        if (textClean.includes("code=")) {
          const codeMatch = textClean.match(/code=([^&]+)/);
          const extractedCode = codeMatch ? codeMatch[1] : textClean;
          resultData = { addressCode: extractedCode };
        } else if (textClean.startsWith("FM-") || textClean.includes("FM-")) {
          resultData = { addressCode: textClean };
        } else {
          resultData = { raw: textClean };
        }
      }
      
      if (resultData) {
        addToast("QR Code valide détecté !", "success");
        handleQRScanned(resultData);
      } else {
        addToast("Aucune donnée d'adresse valide trouvée dans ce QR Code.", "error");
      }
    } catch (err) {
      if (tempDiv && tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
      addToast("Impossible de lire un QR Code valide sur cette image.", "error");
    }
  }

  const handleQRNo = () => {
    step1State.value.askQR = false
    step1State.value.showQRScanner = false
    step1State.value.askGeolocation = true
  }

  const handleQRScanned = async (data: any) => {
    if (!data) return;
    step1State.value.showQRScanner = false;
    
    let fullData = { ...data };
    const codeToFetch = data.addressCode || data.raw;

    if (codeToFetch) {
      try {
        addToast("Récupération de l'adresse distante...", "info");
        const { $api } = useNuxtApp();
        
        let fetched: any = null;
        try {
          fetched = await ($api as any)(`/api/addresses/${codeToFetch}`);
        } catch (e) {
          const listRes: any = await ($api as any)(`/api/addresses?size=100`).catch(() => null);
          const items = listRes?.content || (Array.isArray(listRes) ? listRes : []);
          fetched = items.find((a: any) => a.addressCode === codeToFetch || String(a.id) === String(codeToFetch));
        }

        if (fetched) {
          fullData = { ...fullData, ...fetched };
          addToast("Adresse distante récupérée depuis le serveur !", "success");
        }
      } catch (err) {
        console.warn("Fallback de récupération QR distant activé:", err);
      }
    }

    if (fullData.country) formState.value.country = fullData.country;
    if (fullData.city) formState.value.city = fullData.city;
    if (fullData.neighborhood || fullData.district) formState.value.neighborhood = fullData.neighborhood || fullData.district;
    if (fullData.streetName || fullData.street) formState.value.street = fullData.streetName || fullData.street;
    if (fullData.housePlateNumber || fullData.houseNumber) formState.value.houseNumber = fullData.housePlateNumber || fullData.houseNumber;
    if (fullData.photoRaw || fullData.photo) formState.value.photo = fullData.photoRaw || fullData.photo;

    const lat = fullData.gps?.latitude ?? fullData.coordinates?.lat;
    const lng = fullData.gps?.longitude ?? fullData.coordinates?.lng;

    if (lat && lng) {
      formState.value.lat = String(lat);
      formState.value.lng = String(lng);
      setMapView(Number(lat), Number(lng), 18);
    }

    addToast("Données d'adresse du voisin intégrées avec succès !", "success");
    currentStep.value = 2;
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

  const finalSubmit = async () => {
    const success = await submitForm()
    if (success) {
      router.push(`/users/${currentUser.value?.id || 'me'}/adresses`)
    }
  }

  const cancelCreation = () => {
    showLimitModal.value = false;
    removeDraft();
    router.push(`/users/${currentUser.value?.id}/adresses`);
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
