<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
import { Html5Qrcode } from "html5-qrcode";
import { X, QrCode, MapPin, AlertCircle, Camera } from "lucide-vue-next";
import { useToasts } from "../../composables/useToasts";

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "scan-success", data: any): void;
}>();

const { addToast } = useToasts();

const scannerMode = ref<"camera" | "manual">("camera");
const hasCameraError = ref(false);
const cameraErrorMsg = ref("");
const isScanning = ref(false);
const manualCode = ref("");
const html5QrCode = ref<Html5Qrcode | null>(null);

const startCamera = async () => {
    hasCameraError.value = false;
    isScanning.value = true;
    
    await nextTick(); // Ensure DOM is fully updated
    
    try {
        if (html5QrCode.value) {
            await html5QrCode.value.stop().catch(() => {});
            html5QrCode.value.clear();
        }

        html5QrCode.value = new Html5Qrcode("qr-reader-video-box");

        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
            let cameraId = cameras[0]!.id;
            const backCamera = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear') || c.label.toLowerCase().includes('environment'));
            if (backCamera) {
                cameraId = backCamera.id;
            }

            await html5QrCode.value.start(
                cameraId,
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    handleSuccessfulScan(decodedText);
                },
                () => {}
            );
        } else {
            throw new Error("Aucune caméra détectée par le navigateur.");
        }
    } catch (err: any) {
        console.warn("Accès caméra refusé ou erreur.", err);
        hasCameraError.value = true;
        cameraErrorMsg.value = err?.message || String(err);
        scannerMode.value = "manual";
        
        if (cameraErrorMsg.value.includes("https") || cameraErrorMsg.value.includes("secure context")) {
             addToast("La caméra nécessite une connexion sécurisée (HTTPS). Utilisez une image.", "error");
        } else {
             addToast("Impossible d'accéder à la caméra. Saisie manuelle activée.", "error");
        }
    }
};

const scanFile = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    try {
        if (!html5QrCode.value) {
            html5QrCode.value = new Html5Qrcode("qr-reader-video-box");
        }
        const decodedText = await html5QrCode.value.scanFile(file, true);
        handleSuccessfulScan(decodedText);
    } catch (err) {
        addToast("Aucun QR Code trouvé sur cette image.", "error");
    }
};

const stopCamera = () => {
    if (html5QrCode.value && html5QrCode.value.isScanning) {
        html5QrCode.value.stop().then(() => {
            html5QrCode.value?.clear();
        }).catch(() => {});
    }
    isScanning.value = false;
};

const handleSuccessfulScan = (text: string) => {
    if (!isScanning.value) return;
    
    let resultData = null;
    try {
        const parsed = JSON.parse(text);
        if (parsed && (parsed.addressCode || parsed.city || parsed.neighborhood || parsed.streetName)) {
            resultData = parsed;
        } else {
            resultData = { raw: text };
        }
    } catch(e) {
        if (text.startsWith("FM-") || text.includes("FM-")) {
            resultData = { addressCode: text, city: "", neighborhood: "" };
        } else {
            resultData = { raw: text };
        }
    }

    addToast("QR Code voisin détecté avec succès !", "success");
    emit("scan-success", resultData);
    closeScanner();
};

const validateManual = () => {
    if (!manualCode.value.trim()) return;
    emit("scan-success", { addressCode: manualCode.value.trim(), city: "", neighborhood: "" });
    closeScanner();
};

const closeScanner = () => {
    stopCamera();
    emit('close');
};

watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
        manualCode.value = "";
        if (scannerMode.value === "camera") {
            // 1. On attend que Vue injecte le HTML dans le DOM
            await nextTick();
            
            // 2. On laisse 450ms (plus que les 300ms du timeout) pour que l'animation CSS 
            // de la modal soit totalement stabilisée
            setTimeout(() => {
                startCamera();
            }, 450);
        }
    } else {
        stopCamera();
    }
});

onBeforeUnmount(() => {
    stopCamera();
});
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6" aria-modal="true" role="dialog">
        <!-- Main Scanner Container -->
        <div class="relative w-full max-w-md bg-[#0a0f1c] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]">
            
            <!-- Header -->
            <div class="absolute top-0 inset-x-0 z-20 flex justify-between items-center p-4 sm:p-5 bg-gradient-to-b from-black/80 to-transparent">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-[#2E7D32]/20 flex items-center justify-center border border-[#2E7D32]/50">
                        <QrCode class="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <span class="text-white font-black text-sm uppercase tracking-widest">Scanner FindMe</span>
                </div>
                <button @click="closeScanner" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-rose-500 transition-colors backdrop-blur-md">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- Content Area -->
            <div class="flex-1 relative flex flex-col">
                
                <!-- Camera View -->
                <div class="absolute inset-0 w-full h-full bg-black flex flex-col justify-center items-center transition-opacity duration-300"
                     :class="scannerMode === 'camera' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'">
                    <div id="qr-reader-video-box" class="absolute inset-0 w-full h-full object-cover"></div>
                    
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10 shadow-[inset_0_0_0_2000px_rgba(0,0,0,0.6)]">
                        <div class="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-white/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(46,125,50,0.3)]">
                            <!-- Corner brackets -->
                            <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#2E7D32] rounded-tl-xl"></div>
                            <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#2E7D32] rounded-tr-xl"></div>
                            <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#2E7D32] rounded-bl-xl"></div>
                            <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#2E7D32] rounded-br-xl"></div>
                            
                            <!-- Laser scan line -->
                            <div class="absolute inset-x-0 h-1 bg-[#2E7D32] shadow-[0_0_15px_4px_#2E7D32] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                    
                    <div class="absolute bottom-6 inset-x-0 text-center z-20 pointer-events-none">
                         <span class="bg-[#1A237E]/80 backdrop-blur-md text-white font-mono text-[10px] px-4 py-2 rounded-full uppercase tracking-widest font-black inline-block">
                              Pointez le QR Code du voisin
                         </span>
                    </div>
                </div>

                <!-- Manual Input Fallback -->
                <div class="absolute inset-0 bg-[#0a0f1c] p-6 flex flex-col justify-center transition-opacity duration-300"
                     :class="scannerMode === 'manual' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'">
                    <div class="text-center mb-6">
                        <AlertCircle class="w-12 h-12 text-[#2E7D32] mx-auto mb-4 opacity-80" />
                        <h3 class="text-white font-black text-xl mb-2">Caméra indisponible</h3>
                        <p v-if="cameraErrorMsg" class="text-xs text-rose-400 mb-2 font-mono bg-rose-500/10 p-2 rounded">{{ cameraErrorMsg }}</p>
                        <p class="text-gray-400 text-sm">Entrez le code numérique (ex: FM-YDE-BAS-28B) ou importez une photo du QR Code.</p>
                    </div>
                    
                    <div class="space-y-4">
                        <input type="text" v-model="manualCode" placeholder="Code FindMe..." @keyup.enter="validateManual" class="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl text-center text-lg font-mono font-bold uppercase focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all placeholder:text-gray-600" />
                        <button @click="validateManual" class="w-full bg-[#2E7D32] text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-[0_0_20px_rgba(46,125,50,0.4)] hover:bg-[#236026] active:scale-95 transition-all">
                            Valider le Code
                        </button>
                        
                        <div class="relative w-full mt-4">
                            <input type="file" accept="image/*" @change="scanFile" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <button class="w-full bg-white/10 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                <Camera class="w-4 h-4" /> Importer une photo (Galerie)
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Footer Tabs -->
            <div class="bg-[#111827] border-t border-white/5 p-4 z-20">
                <div class="flex bg-black/40 rounded-xl p-1">
                    <button @click="scannerMode = 'camera'; startCamera()" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all" :class="scannerMode === 'camera' ? 'bg-[#2E7D32] text-white shadow-lg' : 'text-gray-500 hover:text-white'">
                        <Camera class="w-4 h-4" /> Caméra
                    </button>
                    <button @click="scannerMode = 'manual'; stopCamera()" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all" :class="scannerMode === 'manual' ? 'bg-[#2E7D32] text-white shadow-lg' : 'text-gray-500 hover:text-white'">
                        <MapPin class="w-4 h-4" /> Manuel
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
@keyframes scan {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
}

/* Specific overrides for html5-qrcode generated elements to keep it clean */
:deep(#qr-reader-video-box video) {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
}
</style>
