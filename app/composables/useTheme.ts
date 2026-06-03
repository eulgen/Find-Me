/**
 * @file useTheme.ts
 * @description Composable gérant l'état visuel du thème graphique (Clair / Sombre).
 * 
 * Il sauvegarde les choix visuels de l'utilisateur dans le stockage
 * local de son navigateur (localStorage) pour les sessions futures.
 */

import { ref } from 'vue'

const isDark = ref<boolean>(false)

export function useTheme() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('findme-theme', isDark.value ? 'dark' : 'light')
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const initTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('findme-theme')
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true
        document.documentElement.classList.add('dark')
      }
    }
  }

  return {
    isDark,
    toggleDarkMode,
    initTheme
  }
}
