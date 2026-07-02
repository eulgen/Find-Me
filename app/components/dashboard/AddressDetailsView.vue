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

const qrCodeDataUrl = ref<string>('');
const qrIsGenerating = ref(false);

let L: any = null;
let mapInstance: any = null;
let markerInstance: any = null;

watch(() => props.address, (newVal) => {
  editForm.value = JSON.parse(JSON.stringify(newVal));
  generateQR();
}, { deep: true });

const generateQR = async () => {
  qrIsGenerating.value = true;
  let QRCode: any;
  try {
    QRCode = (await import('qrcode')).default;
  } catch {
    qrIsGenerating.value = false;
    return;
  }

  const opts = { errorCorrectionLevel: 'M', margin: 1, width: 200, color: { dark: '#0A0D1A', light: '#ffffff00' } };

  try {
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
  generateQR();
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
  const shareData = { title: 'Mon adresse certifiée FindMe', text: shareText };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err: any) {
      if (err.name !== 'AbortError') fallbackCopy(shareText);
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
  <div class="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-20 sm:pb-0">
    
    <!-- Top header area -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <button @click="$emit('close')" class="p-2.5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-full hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/60 dark:border-slate-700/50 group">
          <ArrowLeft class="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h1 class="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Modifier l'adresse</h1>
      </div>
      <ButtonUI @click="saveChanges" :loading="isSaving" variant="primary" class="hidden sm:flex rounded-full px-6 shadow-lg shadow-emerald-500/20" :icon="Save">
        Enregistrer
      </ButtonUI>
    </div>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      
      <!-- LEFT COLUMN: Form Inputs -->
      <div class="lg:col-span-7 space-y-5 sm:space-y-6">
        
        <!-- Editable Info Card -->
        <div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl border border-white/60 dark:border-slate-800/50 rounded-[32px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-all duration-700" />
          
          <div class="relative z-10 flex flex-wrap items-center gap-3 mb-8">
            <div class="flex items-center gap-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-slate-800 dark:text-white px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-widest border border-white/40 dark:border-slate-700/50 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> CODE: <span class="text-indigo-600 dark:text-indigo-400 font-mono">{{ address.addressCode }}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-widest border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
              <CheckCircle class="w-3.5 h-3.5" /> CERTIFIÉE
            </div>
          </div>
          
          <div class="relative z-10 space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Ville</label>
                <input v-model="editForm.city" type="text" class="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-slate-700/50 text-slate-900 dark:text-white rounded-2xl px-5 py-3.5 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner" />
              </div>
              <div class="space-y-1.5">
                <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Quartier</label>
                <input v-model="editForm.neighborhood" type="text" class="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-slate-700/50 text-slate-900 dark:text-white rounded-2xl px-5 py-3.5 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Rue</label>
                <input v-model="editForm.streetName" type="text" class="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-slate-700/50 text-slate-900 dark:text-white rounded-2xl px-5 py-3.5 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner" />
              </div>
              <div class="space-y-1.5">
                <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Numéro Résidence</label>
                <input v-model="editForm.housePlateNumber" type="text" class="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl px-5 py-3.5 font-black focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all shadow-inner placeholder:text-emerald-300" />
              </div>
            </div>
          </div>
        </div>

        <!-- Editable Photo Card -->
        <div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl border border-white/60 dark:border-slate-800/50 rounded-[32px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div class="flex items-center justify-between mb-5">
            <label class="block text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Photo du bâtiment</label>
            <input type="file" id="photo-upload-input" accept="image/*" class="hidden" @change="handlePhotoUpload" />
            <ButtonUI @click="triggerFileInput" variant="outline" size="sm" class="h-9 text-[11px] border-white/60 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 rounded-full" :icon="Camera">
              Remplacer la photo
            </ButtonUI>
          </div>
          <div class="bg-slate-100/50 dark:bg-slate-900/50 border border-white/60 dark:border-slate-700/50 rounded-[24px] relative overflow-hidden h-56 sm:h-72 shadow-inner flex items-center justify-center group cursor-pointer" @click="triggerFileInput">
             <img v-if="editForm.photoRaw" :src="editForm.photoRaw" class="w-full h-full object-cover transition-transform duration-700 " />
             <div v-else class="text-slate-400 text-center">
               <Camera class="w-12 h-12 mx-auto mb-3 opacity-50 group-hover:text-emerald-500 transition-colors" />
               <p class="text-sm font-bold">Cliquer pour ajouter une photo</p>
             </div>
             <!-- Overlay Hover -->
             <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
               <div class="bg-white/20 backdrop-blur-xl text-white rounded-full p-4 shadow-2xl transition-transform duration-300">
                 <Camera class="w-8 h-8" />
               </div>
             </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Map, QR & Status -->
      <div class="lg:col-span-5 space-y-5 sm:space-y-6">
        
        <!-- Editable Map GPS Card -->
        <div class="bg-slate-800 rounded-[32px] overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.1)] h-72 sm:h-80 border border-white/20 dark:border-slate-700/50 flex flex-col justify-end p-4 group">
          <div id="leaflet-edit-map" class="absolute inset-0 z-0"></div>

          <!-- Panneau d'édition superposé (Glassmorphism sur la carte) -->
          <div class="relative z-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[24px] p-4 border border-white/40 shadow-2xl flex flex-col gap-3 pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div class="flex items-center gap-3">
               <div class="flex-1">
                 <label class="text-[9px] text-slate-800 dark:text-slate-300 font-black uppercase tracking-widest block mb-1">Latitude</label>
                 <input v-model="editForm.coordinates.lat" @input="updateMapFromInputs" type="text" class="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/50 text-slate-900 dark:text-white font-mono text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-all shadow-inner" />
               </div>
               <div class="flex-1">
                 <label class="text-[9px] text-slate-800 dark:text-slate-300 font-black uppercase tracking-widest block mb-1">Longitude</label>
                 <input v-model="editForm.coordinates.lng" @input="updateMapFromInputs" type="text" class="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/50 text-slate-900 dark:text-white font-mono text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-all shadow-inner" />
               </div>
            </div>
            <ButtonUI @click="handleLocate" variant="primary" size="sm" class="w-full text-xs h-10 shadow-md" :icon="LocateFixed">
              Localisation automatique
            </ButtonUI>
          </div>
        </div>

        <!-- Real QR Code Card -->
        <div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl border border-white/60 dark:border-slate-800/50 rounded-[32px] p-6 sm:p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-[30px]" />
          
          <h3 class="text-lg font-black text-slate-800 dark:text-white mb-1">Plaque Digitale QR</h3>
          <p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-6">Scannez ce code pour retrouver l'adresse complète instantanément.</p>
          
          <div class="w-48 h-48 mx-auto bg-white/60 dark:bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/60 dark:border-white/20 shadow-lg mb-6 flex items-center justify-center transform transition-transform duration-500">
            <!-- Spinner -->
            <div v-if="qrIsGenerating" class="w-10 h-10 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
            <!-- QR -->
            <img v-else-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code adresse complète" class="w-full h-full object-contain rounded-xl mix-blend-multiply dark:mix-blend-normal" />
            <div v-else class="text-slate-400 text-xs font-bold">Génération...</div>
          </div>
          
          <div class="flex gap-3">
            <ButtonUI @click="downloadAddressPDF(editForm)" variant="outline" class="flex-1 bg-white/50 dark:bg-slate-800/50 border-white/60 dark:border-slate-700/50 shadow-sm text-[13px]" :icon="FileDown">
              Télécharger
            </ButtonUI>
            <ButtonUI @click="handleShare" variant="primary" class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-slate-200 dark:text-blue-900 shadow-md text-[13px]" :icon="Share2">
              Partager
            </ButtonUI>
          </div>
        </div>

        <!-- Validation Status -->
        <div class="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-2xl border border-emerald-500/20 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 bg-white/60 dark:bg-slate-900/60 shadow-sm rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p class="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-0.5">STATUT</p>
              <p class="text-[13px] font-bold text-slate-800 dark:text-white">Active et Validée</p>
            </div>
          </div>
          <div class="h-10 w-px bg-emerald-500/20"></div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5">MISE À JOUR</p>
              <p class="text-[13px] font-bold text-slate-800 dark:text-white">À l'instant</p>
            </div>
            <div class="w-11 h-11 bg-white/60 dark:bg-slate-900/60 shadow-sm rounded-full flex items-center justify-center shrink-0">
              <Clock class="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Mobile Fixed Bottom Save Button -->
    <div class="sm:hidden fixed bottom-4 left-4 right-4 z-50">
      <ButtonUI @click="saveChanges" :loading="isSaving" variant="primary" class="w-full rounded-[20px] shadow-[0_8px_32px_rgba(16,185,129,0.3)] py-4 text-base bg-gradient-to-r from-emerald-500 to-teal-600 border-none" :icon="Save">
        Enregistrer les modifications
      </ButtonUI>
    </div>

  </div>
</template>
