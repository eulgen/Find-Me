/**
 * @file useCameraAndPhoto.ts
 * @description Composable spécialisé dans la capture média d'image (webcam) et la compression/redimensionnement.
 * 
 * Il encapsule l'accès à la caméra de l'appareil (navigator.mediaDevices.getUserMedia)
 * ainsi que la génération d'un instantané réaliste avec simulation de réduction
 * de poids pour une performance offline idéale.
 */

import { ref, type Ref } from 'vue'

export function useCameraAndPhoto() {
  const useWebcam = ref(false)
  const cameraStream = ref<MediaStream | null>(null)
  const selectedPhoto = ref<string | null>(null)
  const photoCompressedName = ref<string | null>(null)
  const originalSize = ref<string | null>(null)
  const compressedSize = ref<string | null>(null)
  const compressionRatio = ref<number | null>(null)
  const isCompressing = ref(false)
  const mockCameraActive = ref(false)

  const stopCamera = () => {
    if (cameraStream.value) {
      cameraStream.value.getTracks().forEach(track => track.stop())
      cameraStream.value = null
    }
    useWebcam.value = false
    mockCameraActive.value = false
  }

  const startCamera = async (videoEl: HTMLVideoElement | null) => {
    useWebcam.value = true
    mockCameraActive.value = false
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        cameraStream.value = stream
        setTimeout(() => {
          if (videoEl) {
            videoEl.srcObject = stream
          }
        }, 100)
      } else {
        mockCameraActive.value = true
      }
    } catch (err) {
      console.warn("Accès caméra refusé. Utilisation du simulateur pictural.", err)
      mockCameraActive.value = true
    }
  }

  const captureSnapshot = (videoEl: HTMLVideoElement | null) => {
    isCompressing.value = true
    
    setTimeout(() => {
      const canvas = document.createElement('canvas')
      canvas.width = 480
      canvas.height = 360
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        if (!mockCameraActive.value && videoEl) {
          try {
            ctx.drawImage(videoEl, 0, 0, 480, 360)
          } catch (e) {
            drawFallbackScene(ctx)
          }
        } else {
          drawFallbackScene(ctx)
        }
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.65)
      selectedPhoto.value = dataUrl
      photoCompressedName.value = 'Instantané_Façade_Bastos.jpg'
      
      // Simulation des statistiques de compression de l'image
      const originalBytes = 1.8 * 1024 * 1024 // ~1.8MB original
      const compressedBytes = Math.floor(originalBytes * 0.12) // réduit de 88%
      
      originalSize.value = "1.8 Mo"
      compressedSize.value = (compressedBytes / 1024).toFixed(1) + " Ko"
      compressionRatio.value = 88
      
      isCompressing.value = false
      stopCamera()
    }, 1200)
  }

  // Scène vectorielle de façade camerounaise de secours en cas d'absence de flux caméra
  const drawFallbackScene = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#1A237E' // Bleu
    ctx.fillRect(0, 0, 480, 360)
    ctx.fillStyle = '#2E7D32' // Vert
    ctx.fillRect(40, 100, 400, 260)
    ctx.fillStyle = '#FFD5D0' // Crème
    ctx.fillRect(160, 160, 160, 200)
    
    // Toit
    ctx.beginPath()
    ctx.moveTo(20, 100)
    ctx.lineTo(240, 30)
    ctx.lineTo(460, 100)
    ctx.closePath()
    ctx.fillStyle = '#D32F2F'
    ctx.fill()
    
    // Titre
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText('FACADE ENREGISTREE - REPERE VISUEL', 70, 135)
    
    // Plaque de facade findMe
    ctx.fillStyle = '#1A237E'
    ctx.fillRect(190, 80, 100, 30)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 10px monospace'
    ctx.fillText('FM-YDE-BAS-28', 198, 98)
  }

  const handleFileUpload = (file: File) => {
    isCompressing.value = true
    const reader = new FileReader()
    reader.onload = (e) => {
      setTimeout(() => {
        selectedPhoto.value = e.target?.result as string
        photoCompressedName.value = file.name
        
        const originalBytes = file.size
        const compressedBytes = Math.floor(originalBytes * 0.18)
        
        originalSize.value = (originalBytes / (1024 * 1024)).toFixed(1) + " Mo"
        compressedSize.value = (compressedBytes / 1024).toFixed(1) + " Ko"
        compressionRatio.value = 82
        
        isCompressing.value = false
      }, 1000)
    }
    reader.readAsDataURL(file)
  }

  return {
    useWebcam,
    cameraStream,
    selectedPhoto,
    photoCompressedName,
    originalSize,
    compressedSize,
    compressionRatio,
    isCompressing,
    mockCameraActive,
    startCamera,
    stopCamera,
    captureSnapshot,
    handleFileUpload
  }
}
