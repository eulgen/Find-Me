<!--
  @file app/components/dashboard/AddressDetailsView.vue
  @description Vue de détails et d'édition d'une adresse citoyenne — design glassmorphism à ton uni émeraude et squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  MapPin, FileDown, ShieldCheck, Clock, Share2, ArrowLeft, CheckCircle, Camera, Save, LocateFixed
} from 'lucide-vue-next';
import ButtonUI from '~/components/ui/ButtonUI.vue';
import SkeletonUI from '~/components/ui/SkeletonUI.vue';
import { useAddressExporter } from '~/composables/useAddressExporter';
import { useToasts } from '~/composables/useToasts';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  address: any;
}>();

const emit = defineEmits(['close', 'save', 'share']);

const { downloadAddressPDF } = useAddressExporter();
const { addToast } = useToasts();

const editForm = ref(props.address ? JSON.parse(JSON.stringify(props.address)) : {});
const isSaving = ref(false);

const qrCodeDataUrl = ref<string>('');
const qrIsGenerating = ref(false);

let L: any = null;
let mapInstance: any = null;
let markerInstance: any = null;

watch(() => props.address, (newVal) => {
  if (newVal) {
    editForm.value = JSON.parse(JSON.stringify(newVal));
    generateQR();
  }
}, { deep: true });

const generateQR = async () => {
  if (!editForm.value?.addressCode) return;
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

onMounted(() => {
  generateQR();
  setTimeout(() => {
    initMiniMap();
  }, 200);
});

const initMiniMap = async () => {
  if (typeof window === 'undefined') return;
  const container = document.getElementById('details-mini-map');
  if (!container) return;

  L = (await import('leaflet')).default;

  const initialLat = editForm.value.coordinates?.lat || 3.8480;
  const initialLng = editForm.value.coordinates?.lng || 11.5021;

  if (mapInstance) {
    mapInstance.remove();
  }

  mapInstance = L.map('details-mini-map', { zoomControl: false }).setView([initialLat, initialLng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(mapInstance);

  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  markerInstance = L.marker([initialLat, initialLng], { icon: customIcon, draggable: true }).addTo(mapInstance);

  markerInstance.on('dragend', (e: any) => {
    const latlng = e.target.getLatLng();
    editForm.value.coordinates = {
      lat: Number(latlng.lat.toFixed(6)),
      lng: Number(latlng.lng.toFixed(6))
    };
  });
};

const handleSave = () => {
  isSaving.value = true;
  setTimeout(() => {
    emit('save', editForm.value);
    isSaving.value = false;
  }, 600);
};

const onPhotoChange = (e: any) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      editForm.value.photoRaw = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 dark:text-white">

    <!-- Bouton Retour -->
    <div class="flex items-center justify-between">
      <button
        @click="emit('close')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-full text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
      >
        <ArrowLeft class="w-4 h-4" />
        Retour aux adresses
      </button>

      <div class="flex items-center gap-2">
        <button
          @click="emit('share', editForm)"
          class="px-4 py-2 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-full text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <Share2 class="w-4 h-4" /> Partager
        </button>
        <button
          @click="downloadAddressPDF(editForm)"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-600/20"
        >
          <FileDown class="w-4 h-4" /> Exporter PDF
        </button>
      </div>
    </div>

    <!-- State SKELETON si props.address est absent ou en cours de chargement -->
    <div v-if="!address" class="space-y-6">
      <SkeletonUI height="h-64" rounded="rounded-[32px]" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonUI height="h-48" rounded="rounded-[32px]" />
        <SkeletonUI height="h-48" rounded="rounded-[32px]" />
      </div>
    </div>

    <!-- Contenu normal de l'adresse -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- COLONNE GAUCHE : Visual Certificat Plaque -->
      <div class="space-y-6">
        <div class="relative bg-emerald-600 text-white rounded-[32px] p-8 shadow-xl border-4 border-emerald-400 overflow-hidden flex flex-col justify-between min-h-[320px]">
          <div class="flex items-center justify-between text-xs font-black uppercase tracking-widest text-emerald-100">
            <span>CERTIFICAT NATIONALE</span>
            <span class="px-2.5 py-1 bg-white/20 rounded-md">CAMEROUN</span>
          </div>

          <div class="my-6 text-center space-y-2">
            <p class="text-xs font-bold text-emerald-100 uppercase tracking-widest">Code Digital Certifié</p>
            <p class="text-3xl font-black font-mono tracking-widest text-white drop-shadow-sm">{{ editForm.addressCode }}</p>
            <p class="text-sm font-bold opacity-90">{{ editForm.neighborhood }}, {{ editForm.city }}</p>
          </div>

          <!-- QR Code certifié -->
          <div class="flex items-center justify-between pt-4 border-t border-white/20">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Plaque Officielle</p>
              <p class="text-xs font-black font-mono">N° {{ editForm.housePlateNumber }}</p>
            </div>
            <div class="w-16 h-16 bg-white p-1 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="QR Code" class="w-full h-full object-contain" />
              <SkeletonUI v-else width="w-full" height="h-full" rounded="rounded-lg" />
            </div>
          </div>
        </div>

        <!-- Photo du bâtiment -->
        <div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl space-y-4">
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Photo de la Façade</h3>
          <div class="h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative group">
            <img v-if="editForm.photoRaw" :src="editForm.photoRaw" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <MapPin class="w-10 h-10" />
              <span class="text-xs font-medium">Aucune photo téléversée</span>
            </div>

            <label class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer">
              <Camera class="w-5 h-5 mr-2" /> Changer la photo
              <input type="file" accept="image/*" class="hidden" @change="onPhotoChange" />
            </label>
          </div>
        </div>
      </div>

      <!-- COLONNE DROITE : Formulaire d'édition des détails + Carte -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Formulaire d'édition -->
        <div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
            <div>
              <h2 class="text-xl font-black font-serif text-slate-900 dark:text-white">Informations d'Adressage</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Modifiez les champs géodésiques de votre plaque.</p>
            </div>
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save class="w-4 h-4" />
              {{ isSaving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1.5">
              <label class="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ville</label>
              <input v-model="editForm.city" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
            </div>

            <div class="space-y-1.5">
              <label class="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quartier</label>
              <input v-model="editForm.neighborhood" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
            </div>

            <div class="space-y-1.5">
              <label class="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Rue</label>
              <input v-model="editForm.streetName" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
            </div>

            <div class="space-y-1.5">
              <label class="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">N° de Porte</label>
              <input v-model="editForm.housePlateNumber" type="text" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
            </div>
          </div>

          <!-- Mini carte interactive -->
          <div class="space-y-2 pt-4">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <LocateFixed class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Positionnement GPS (Faites glisser le marqueur)
              </label>
              <span class="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {{ editForm.coordinates?.lat }}, {{ editForm.coordinates?.lng }}
              </span>
            </div>

            <div id="details-mini-map" class="w-full h-52 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner"></div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
