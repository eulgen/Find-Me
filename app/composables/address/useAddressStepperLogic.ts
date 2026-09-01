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
      
      const textClean = decodedText ? decodedText.trim() : "";
      
      if (textClean) {
        addToast("QR Code détecté !", "success");
        handleQRScanned(textClean);
      } else {
        addToast("Aucune donnée trouvée dans ce QR Code.", "error");
      }
    } catch (err) {
      if (tempDiv && tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
      addToast("Impossible de lire un QR Code sur cette image.", "error");
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
    
    const codeToFetch = typeof data === 'string' 
      ? data.trim() 
      : String(data.addressCode || data.raw || data.code || data).trim();

    if (codeToFetch) {
      try {
        addToast("Recherche de l'adresse du voisin (GET /api/public/addresses)...", "info");
        const { $api } = useNuxtApp();
        const { handleAddressCreated } = deps;
        
        let publicData: any = null;

        try {
          // Official public endpoint defined in api-docs.json: GET /api/public/addresses/{addressCode}
          publicData = await ($api as any)(`/api/public/addresses/${codeToFetch}`);
        } catch (getErr: any) {
          const msg = getErr?.data?.message || getErr?.data?.title || getErr?.data?.detail || getErr?.message;
          addToast(msg ? `⚠️ ${msg}` : "⚠️ Adresse non trouvée (404)", "error");
          return;
        }

        if (publicData) {
          const photoSrc = publicData.photoUrl || publicData.photoRaw || publicData.photo || "";
          const payload = {
            country: publicData.country || "Cameroun",
            city: publicData.city || "Yaoundé",
            neighborhood: publicData.district || publicData.neighborhood || "Non spécifié",
            streetName: publicData.street || publicData.streetName || "Non spécifié",
            housePlateNumber: publicData.houseNumber || publicData.housePlateNumber || "Non spécifié",
            postalCode: publicData.postalCode || "Non spécifié",
            addressCode: publicData.addressCode || codeToFetch,
            coordinates: {
              lat: parseFloat(publicData.gps?.latitude ?? publicData.coordinates?.lat ?? 3.8480),
              lng: parseFloat(publicData.gps?.longitude ?? publicData.coordinates?.lng ?? 11.5021)
            },
            photoRaw: photoSrc.startsWith("/api/files/") ? `http://localhost:8080${photoSrc}` : photoSrc
          };

          const createdSuccess = await handleAddressCreated(payload);
          if (createdSuccess) {
            removeDraft();
            router.push('/users/me/adresses');
            return;
          }
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération publique d'adresse par QR Code:", err);
      }
    }

    addToast("⚠️ Adresse non trouvée (404)", "error");
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

  const createdPublicAddress = ref<any>(null);
  const showExportPdfModal = ref<boolean>(false);
  const showSignupModal = ref<boolean>(false);

  const finalSubmit = async () => {
    const res = await submitForm();
    if (res && typeof res === 'object') {
      createdPublicAddress.value = res;
      showExportPdfModal.value = true;
    }
  }

  const handleExportPdf = async () => {
    if (createdPublicAddress.value) {
      const { downloadAddressPDF } = useAddresses();
      await downloadAddressPDF(createdPublicAddress.value);
    }
    showExportPdfModal.value = false;
    showSignupModal.value = true;
  }

  const skipExportPdf = () => {
    showExportPdfModal.value = false;
    showSignupModal.value = true;
  }

  const handleSignupConfirm = async () => {
    showSignupModal.value = false;
    const code = createdPublicAddress.value?.addressCode;

    if (currentUser.value) {
      if (code) {
        const { linkAddressToAccount } = useAddresses();
        await linkAddressToAccount(code);
      }
      router.push('/users/me/adresses');
    } else {
      if (code && typeof window !== "undefined") {
        localStorage.setItem("pendingAddressCode", code);
      }
      router.push({
        path: '/auth/signup',
        query: code ? { addressCode: code } : {}
      });
    }
  }

  const skipSignup = () => {
    showSignupModal.value = false;
    if (currentUser.value) {
      router.push('/users/me/adresses');
    } else {
      router.push('/');
    }
  }

  const cancelCreation = () => {
    showLimitModal.value = false;
    removeDraft();
    if (currentUser.value) {
      router.push('/users/me/adresses');
    } else {
      router.push('/');
    }
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
    cancelCreation,
    createdPublicAddress,
    showExportPdfModal,
    showSignupModal,
    handleExportPdf,
    skipExportPdf,
    handleSignupConfirm,
    skipSignup
  }
}
