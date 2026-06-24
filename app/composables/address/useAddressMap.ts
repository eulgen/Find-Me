import { ref } from 'vue'

export function useAddressMap(formState: any) {
  let L: any = null
  let mapInstance: any = null
  let markerInstance: any = null

  const initMap = async (elementId: string = 'leaflet-stepper-map') => {
    if (typeof window !== 'undefined') {
      if (!L) L = (await import('leaflet')).default
      
      const mapEl = document.getElementById(elementId)
      if (!mapEl) return

      // Clean up old instance if exists
      if (mapInstance) {
        mapInstance.remove()
        mapInstance = null
      }

      const lat = parseFloat(formState.value.lat) || 3.8480
      const lng = parseFloat(formState.value.lng) || 11.5021

      mapInstance = L.map(elementId).setView([lat, lng], 13)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance)
      
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })
      
      markerInstance = L.marker([lat, lng], { icon }).addTo(mapInstance)

      mapInstance.on('click', async (e: any) => {
        const { lat: clickedLat, lng: clickedLng } = e.latlng
        formState.value.lat = clickedLat.toFixed(6)
        formState.value.lng = clickedLng.toFixed(6)
        markerInstance.setLatLng([clickedLat, clickedLng])
        mapInstance.setView([clickedLat, clickedLng])
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLat}&lon=${clickedLng}&accept-language=fr`)
          const data = await res.json()
          if (data && data.address) {
            if (data.address.country) formState.value.country = data.address.country;
            const city = data.address.city || data.address.town || data.address.village;
            if (city) formState.value.city = city;
            const neighborhood = data.address.suburb || data.address.neighbourhood;
            if (neighborhood) formState.value.neighborhood = neighborhood;
            if (data.address.road) formState.value.street = data.address.road;
          }
        } catch (err) {}
      })
    }
  }

  const updateMapFromInputs = () => {
    const lat = parseFloat(formState.value.lat)
    const lng = parseFloat(formState.value.lng)
    if (!isNaN(lat) && !isNaN(lng) && mapInstance && markerInstance) {
      markerInstance.setLatLng([lat, lng])
      mapInstance.setView([lat, lng])
    }
  }

  const setMapView = (lat: number, lng: number, zoom: number = 18) => {
    if (mapInstance && markerInstance) {
      mapInstance.setView([lat, lng], zoom)
      markerInstance.setLatLng([lat, lng])
    }
  }

  return {
    initMap, updateMapFromInputs, setMapView
  }
}
