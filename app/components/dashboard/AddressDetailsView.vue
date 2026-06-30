<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  MapPin, FileDown, ShieldCheck, Clock, Share2, ArrowLeft, CheckCircle, Camera, Save, LocateFixed
} from 'lucide-vue-next';
import ButtonUI from '~/components/ui/ButtonUI.vue';
import { useAddressExporter } from '~/composables/useAddressExporter';
import { useToasts } from '~/composables/useToasts';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  address: any;
}>();

const emit = defineEmits(['close', 'save', 'share']);

const { downloadAddressPDF } = useAddressExporter();
const { addToast } = useToasts();

const editForm = ref(JSON.parse(JSON.stringify(props.address)));
const isSaving = ref(false);

// QR code state — generated client-side via the `qrcode` package
const qrCodeDataUrl = ref<string>('');
const qrIsGenerating = ref(false);

let L: any = null;
let mapInstance: any = null;
let markerInstance: any = null;

watch(() => props.address, (newVal) => {
  editForm.value = JSON.parse(JSON.stringify(newVal));
  generateQR();
}, { deep: true });

// Génération asynchrone du QR code contenant uniquement le code de l'adresse
const generateQR = async () => {
  qrIsGenerating.value = true;

  // Charger le module une seule fois
  let QRCode: any;
  try {
    QRCode = (await import('qrcode')).default;
  } catch {
    qrIsGenerating.value = false;
    return; // module introuvable
  }

  const opts = { errorCorrectionLevel: 'M', margin: 1, width: 200, color: { dark: '#000000', light: '#ffffff' } };

  try {
    // Le QR code contient désormais uniquement l'addressCode
    // Le scanner l'utilisera pour appeler : /api/users/user/user_12345/addresses/{addressCode}
    qrCodeDataUrl.value = await QRCode.toDataURL(editForm.value.addressCode, opts);
  } catch (e) {
    console.error("Erreur génération QR:", e);
  }

  qrIsGenerating.value = false;
};


const handlePhotoUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // --- Full-size image (for display, max 720px, quality 0.72) ---
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
      editForm.value.photoRaw = canvas.toDataURL("image/jpeg", 0.72);

      addToast("Photo mise à jour", "success");
      // Régénérer le QR avec la nouvelle photo (photoRaw complet inclus)
      generateQR();
    };
    img.src = event.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const initMap = async () => {
  if (typeof window !== 'undefined') {
    if (!L) L = (await import('leaflet')).default;
    
    const mapEl = document.getElementById('leaflet-edit-map');
    if (!mapEl) return;

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    const lat = parseFloat(editForm.value.coordinates?.lat) || 3.8480;
    const lng = parseFloat(editForm.value.coordinates?.lng) || 11.5021;

    mapInstance = L.map('leaflet-edit-map').setView([lat, lng], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);
    
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    
    markerInstance = L.marker([lat, lng], { icon }).addTo(mapInstance);

    mapInstance.on('click', async (e: any) => {
      const { lat: clickedLat, lng: clickedLng } = e.latlng;
      if (!editForm.value.coordinates) editForm.value.coordinates = {};
      editForm.value.coordinates.lat = clickedLat.toFixed(6);
      editForm.value.coordinates.lng = clickedLng.toFixed(6);
      markerInstance.setLatLng([clickedLat, clickedLng]);
      mapInstance.setView([clickedLat, clickedLng]);
    });
  }
};

const updateMapFromInputs = () => {
  const lat = parseFloat(editForm.value.coordinates?.lat);
  const lng = parseFloat(editForm.value.coordinates?.lng);
  if (!isNaN(lat) && !isNaN(lng) && mapInstance && markerInstance) {
    mapInstance.setView([lat, lng]);
    markerInstance.setLatLng([lat, lng]);
  }
};


onMounted(() => {
  initMap();
  generateQR(); // Génère le QR avec le payload complet au montage
});

const handleLocate = () => {
  if (!navigator.geolocation) {
    addToast("La géolocalisation n'est pas supportée par votre navigateur.", "error");
    return;
  }
  addToast("Recherche de votre position...", "info");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!editForm.value.coordinates) editForm.value.coordinates = {};
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      editForm.value.coordinates.lat = lat.toFixed(6);
      editForm.value.coordinates.lng = lng.toFixed(6);
      
      if (mapInstance && markerInstance) {
        mapInstance.setView([lat, lng], 18);
        markerInstance.setLatLng([lat, lng]);
      }
      
      addToast("Position GPS mise à jour !", "success");
    },
    (err) => {
      addToast("Impossible d'obtenir la position", "error");
    }
  );
};

const triggerFileInput = () => {
  document.getElementById('photo-upload-input')?.click();
};

const saveChanges = () => {
  isSaving.value = true;
  setTimeout(() => {
    emit('save', editForm.value);
    addToast("Adresse mise à jour avec succès !", "success");
    isSaving.value = false;
  }, 500);
};

const handleShare = async () => {
  const shareText = `📍 ${editForm.value.city}, ${editForm.value.neighborhood}\n🏠 ${editForm.value.streetName}, N° ${editForm.value.housePlateNumber}\n🔑 Code FindMe: ${editForm.value.addressCode}\n\n🌍 Lien GPS: https://maps.google.com/?q=${editForm.value.coordinates?.lat},${editForm.value.coordinates?.lng}`;

  const shareData = {
    title: 'Mon adresse certifiée FindMe',
    text: shareText,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      // The user successfully shared it
    } catch (err: any) {
      // AbortError happens if the user cancels the share sheet
      if (err.name !== 'AbortError') {
        fallbackCopy(shareText);
      }
    }
  } else {
    fallbackCopy(shareText);
  }
};

const fallbackCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    addToast("Adresse copiée dans le presse-papier ! Vous pouvez la coller où vous voulez.", "success");
  } catch (err) {
    addToast("Impossible de copier l'adresse.", "error");
  }
};
</script>

<template>
  <div class="space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-300 w-full pb-20 sm:pb-0">
    
    <!-- Top header area -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3">
        <button @click="$emit('close')" class="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm border border-gray-200 dark:border-slate-700">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 class="text-xl sm:text-2xl font-black text-[#2E7D32] dark:text-green-500">Modifier l'adresse</h1>
      </div>
      <ButtonUI @click="saveChanges" :loading="isSaving" variant="primary" class="hidden sm:flex rounded-full px-5 shadow-md" :icon="Save">
        Enregistrer
      </ButtonUI>
    </div>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
      
      <!-- LEFT COLUMN: Form Inputs -->
      <div class="lg:col-span-7 space-y-4 sm:space-y-5">
        
        <!-- Editable Info Card -->
        <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[20px] p-5 sm:p-6 shadow-sm">
          <div class="flex items-center gap-2 mb-6">
            <div class="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-[#1A237E] dark:text-indigo-400 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider border border-indigo-100 dark:border-indigo-500/20">
              <span class="w-2 h-2 rounded-full bg-[#1A237E] dark:bg-indigo-400"></span> CODE: {{ address.addressCode }}
            </div>
            <div class="flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 text-[#2E7D32] dark:text-green-400 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider border border-green-100 dark:border-green-500/20">
              <CheckCircle class="w-3.5 h-3.5" /> CERTIFIÉE
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Ville</label>
                <input v-model="editForm.city" type="text" class="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 font-semibold focus:ring-2 focus:ring-[#2E7D32]/20 outline-none transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Quartier</label>
                <input v-model="editForm.neighborhood" type="text" class="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 font-semibold focus:ring-2 focus:ring-[#2E7D32]/20 outline-none transition-all" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Rue</label>
                <input v-model="editForm.streetName" type="text" class="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 font-semibold focus:ring-2 focus:ring-[#2E7D32]/20 outline-none transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Numéro Résidence</label>
                <input v-model="editForm.housePlateNumber" type="text" class="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-[#1A237E] dark:text-blue-400 rounded-xl px-4 py-2.5 font-black focus:ring-2 focus:ring-[#2E7D32]/20 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        <!-- Editable Photo Card -->
        <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[20px] p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Photo du bâtiment</label>
            <input type="file" id="photo-upload-input" accept="image/*" class="hidden" @change="handlePhotoUpload" />
            <ButtonUI @click="triggerFileInput" variant="outline" size="sm" class="h-8 text-xs border-gray-200 dark:border-slate-700 rounded-full" :icon="Camera">
              Modifier
            </ButtonUI>
          </div>
          <div class="bg-[#F3F1E7] dark:bg-[#1A1F2C] border border-gray-200 dark:border-slate-700 rounded-xl relative overflow-hidden h-48 sm:h-64 shadow-inner flex items-center justify-center group cursor-pointer" @click="triggerFileInput">
             <img v-if="editForm.photoRaw" :src="editForm.photoRaw" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
             <div v-else class="text-gray-400 text-center">
               <Camera class="w-10 h-10 mx-auto mb-2 opacity-50" />
               <p class="text-sm font-semibold">Ajouter une photo</p>
             </div>
             <!-- Overlay Hover -->
             <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <div class="bg-white/20 backdrop-blur-md text-white rounded-full p-3">
                 <Camera class="w-6 h-6" />
               </div>
             </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Map, QR & Status -->
      <div class="lg:col-span-5 space-y-4 sm:space-y-5">
        
        <!-- Editable Map GPS Card -->
        <div class="bg-slate-800 rounded-[20px] overflow-hidden relative shadow-sm h-64 border border-gray-200 dark:border-slate-800 flex flex-col justify-end p-4 group">
          <div id="leaflet-edit-map" class="absolute inset-0 z-0"></div>

          <div class="relative z-20 bg-white/40 backdrop-blur-md rounded-xl p-3 border border-white/40 shadow-lg flex flex-col gap-2 pointer-events-auto">
            <div class="flex items-center gap-2">
               <div class="flex-1">
                 <label class="text-[10px] text-gray-900 font-bold uppercase tracking-wider block">Latitude</label>
                 <input v-model="editForm.coordinates.lat" @input="updateMapFromInputs" type="text" class="w-full bg-white/60 text-gray-900 font-mono text-xs rounded px-2 py-1 outline-none" />
               </div>
               <div class="flex-1">
                 <label class="text-[10px] text-gray-900 font-bold uppercase tracking-wider block">Longitude</label>
                 <input v-model="editForm.coordinates.lng" @input="updateMapFromInputs" type="text" class="w-full bg-white/60 text-gray-900 font-mono text-xs rounded px-2 py-1 outline-none" />
               </div>
            </div>
            <ButtonUI @click="handleLocate" variant="primary" size="sm" class="w-full bg-[#1A237E] text-white hover:bg-blue-900 text-xs h-8" :icon="LocateFixed">
              Localisation automatique
            </ButtonUI>
          </div>
        </div>



        <!-- Real QR Code Card -->
        <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[20px] p-5 sm:p-6 text-center shadow-sm">
          <h3 class="font-bold text-gray-900 dark:text-white mb-1">Code QR d'accès</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-5">Scannez pour retrouver l'adresse complète</p>
          
          <div class="w-40 h-40 mx-auto bg-white p-2 rounded-xl border border-gray-100 dark:border-slate-700 shadow-inner mb-5 flex items-center justify-center">
            <!-- Spinner de génération -->
            <div v-if="qrIsGenerating" class="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#2E7D32] animate-spin" />
            <!-- QR généré localement avec photoRaw complet -->
            <img v-else-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code adresse complète" class="w-full h-full object-contain" />
            <div v-else class="text-gray-300 text-xs">QR indisponible</div>
          </div>
          
          <div class="flex gap-2">
            <ButtonUI @click="downloadAddressPDF(editForm)" variant="outline" class="flex-1 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300" :icon="FileDown">
              PDF
            </ButtonUI>
            <ButtonUI @click="handleShare" variant="outline" class="flex-1 bg-black text-white border-black hover:bg-gray-800" :icon="Share2">
              Partager
            </ButtonUI>
          </div>
        </div>


        <!-- Validation Status (Compact) -->
        <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[20px] p-4 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck class="w-5 h-5 text-[#2E7D32]" />
            </div>
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">STATUT</p>
              <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">Validé</p>
            </div>
          </div>
          <div class="h-8 w-px bg-gray-100 dark:bg-slate-800"></div>
          <div class="flex items-center gap-3">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 text-right">MISE À JOUR</p>
              <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 text-right">Aujourd'hui</p>
            </div>
            <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
              <Clock class="w-5 h-5 text-indigo-500" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Mobile Fixed Bottom Save Button -->
    <div class="sm:hidden fixed bottom-4 left-4 right-4 z-50">
      <ButtonUI @click="saveChanges" :loading="isSaving" variant="primary" class="w-full rounded-2xl shadow-xl shadow-[#2E7D32]/30 py-4 text-base" :icon="Save">
        Enregistrer les modifications
      </ButtonUI>
    </div>

  </div>
</template>
