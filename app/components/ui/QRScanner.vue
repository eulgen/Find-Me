<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
import { Html5Qrcode } from "html5-qrcode";
import { X, QrCode, Camera, Upload, AlertCircle } from "lucide-vue-next";
import { useToasts } from "../../composables/useToasts";

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "scan-success", data: any): void;
}>();

const { addToast } = useToasts();

const hasCameraError = ref(false);
const cameraErrorMsg = ref("");
const isScanning = ref(false);
const html5QrCode = ref<Html5Qrcode | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const captureRef = ref<HTMLInputElement | null>(null);
const isProcessingFile = ref(false);

const startCamera = async () => {
    hasCameraError.value = false;
    isScanning.value = true;

    await nextTick();

    try {
        if (html5QrCode.value) {
            await html5QrCode.value.stop().catch(() => {});
            html5QrCode.value.clear();
        }

        html5QrCode.value = new Html5Qrcode("qr-reader-video-box");

        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
            let cameraId = cameras[0]!.id;
            const backCamera = cameras.find(c =>
                c.label.toLowerCase().includes('back') ||
                c.label.toLowerCase().includes('rear') ||
                c.label.toLowerCase().includes('environment')
            );
            if (backCamera) cameraId = backCamera.id;

            await html5QrCode.value.start(
                cameraId,
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => { handleSuccessfulScan(decodedText); },
                () => {}
            );
        } else {
            throw new Error("Aucune caméra détectée par le navigateur.");
        }
    } catch (err: any) {
        console.warn("Accès caméra refusé ou erreur.", err);
        hasCameraError.value = true;
        cameraErrorMsg.value = err?.message || String(err);
        isScanning.value = false;
    }
};

const scanFile = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    isProcessingFile.value = true;
    try {
        // Use a hidden div for file scanning to avoid conflicting with the video box
        const tempDiv = document.createElement('div');
        tempDiv.id = 'qr-file-scanner-temp';
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        const scanner = new Html5Qrcode("qr-file-scanner-temp");
        const decodedText = await scanner.scanFile(file, true);
        scanner.clear();
        document.body.removeChild(tempDiv);

        handleSuccessfulScan(decodedText);
    } catch (err) {
        addToast("Aucun QR Code trouvé sur cette image.", "error");
    } finally {
        isProcessingFile.value = false;
        if (fileInputRef.value) fileInputRef.value.value = '';
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
    let resultData = null;
    try {
        const parsed = JSON.parse(text);
        if (parsed && (parsed.addressCode || parsed.city || parsed.neighborhood || parsed.streetName)) {
            resultData = parsed;
        } else {
            resultData = { raw: text };
        }
    } catch (e) {
        if (text.startsWith("FM-") || text.includes("FM-")) {
            resultData = { addressCode: text, city: "", neighborhood: "" };
        } else {
            resultData = { raw: text };
        }
    }

    addToast("QR Code détecté avec succès !", "success");
    emit("scan-success", resultData);
    closeScanner();
};

const closeScanner = () => {
    stopCamera();
    emit('close');
};

watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
        hasCameraError.value = false;
        cameraErrorMsg.value = "";
        await nextTick();
        setTimeout(() => {
            startCamera();
        }, 450);
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
            <div class="flex-1 relative flex flex-col min-h-[400px]">

                <!-- Camera View (shown when no error) -->
                <div v-if="!hasCameraError" class="absolute inset-0 w-full h-full bg-black flex flex-col justify-center items-center">
                    <div id="qr-reader-video-box" class="absolute inset-0 w-full h-full"></div>

                    <!-- Scan overlay -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10 shadow-[inset_0_0_0_2000px_rgba(0,0,0,0.6)]">
                        <div class="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-white/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(46,125,50,0.3)]">
                            <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#2E7D32] rounded-tl-xl"></div>
                            <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#2E7D32] rounded-tr-xl"></div>
                            <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#2E7D32] rounded-bl-xl"></div>
                            <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#2E7D32] rounded-br-xl"></div>
                            <div class="absolute inset-x-0 h-1 bg-[#2E7D32] shadow-[0_0_15px_4px_#2E7D32] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                        </div>
                    </div>

                    <div class="absolute bottom-6 inset-x-0 text-center z-20 pointer-events-none">
                        <span class="bg-[#1A237E]/80 backdrop-blur-md text-white font-mono text-[10px] px-4 py-2 rounded-full uppercase tracking-widest font-black inline-block">
                            Pointez le QR Code du voisin
                        </span>
                    </div>
                </div>

                <!-- Camera Error Fallback: Image upload ONLY -->
                <div v-else class="absolute inset-0 bg-[#0a0f1c] p-6 flex flex-col justify-center">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle class="w-8 h-8 text-amber-400" />
                        </div>
                        <h3 class="text-white font-black text-xl mb-2">Caméra indisponible</h3>
                        <p class="text-gray-400 text-sm leading-relaxed">
                            Votre navigateur a bloqué l'accès à la caméra. Utilisez l'une des options ci-dessous.
                        </p>
                        <p v-if="cameraErrorMsg" class="text-xs text-rose-400 mt-3 font-mono bg-rose-500/10 p-2 rounded-lg">
                            {{ cameraErrorMsg }}
                        </p>
                    </div>

                    <div class="space-y-3 w-full">
                        <!-- Option 1: Native camera capture (works on mobile without HTTPS permission) -->
                        <div class="relative w-full">
                            <input type="file" accept="image/*" capture="environment" ref="captureRef" @change="scanFile" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" :disabled="isProcessingFile" />
                            <button class="w-full bg-[#2E7D32] text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl shadow-[0_0_20px_rgba(46,125,50,0.4)] hover:bg-[#236026] active:scale-95 transition-all flex items-center justify-center gap-3">
                                <Camera class="w-5 h-5" />
                                <span>Prendre en photo le QR Code</span>
                            </button>
                        </div>

                        <!-- Option 2: Upload from gallery -->
                        <div class="relative w-full">
                            <input type="file" accept="image/*" ref="fileInputRef" @change="scanFile" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" :disabled="isProcessingFile" />
                            <button class="w-full bg-white/10 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3" :class="{ 'opacity-60 cursor-wait': isProcessingFile }">
                                <Upload class="w-4 h-4" />
                                <span v-if="isProcessingFile">Analyse en cours...</span>
                                <span v-else>Importer depuis la galerie</span>
                            </button>
                        </div>
                    </div>
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

:deep(#qr-reader-video-box video) {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
}

:deep(#qr-reader-video-box > img) {
    display: none !important;
}
</style>
