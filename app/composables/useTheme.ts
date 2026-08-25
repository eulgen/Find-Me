/**
 * @file useTheme.ts
 * @description Composable gérant l'état visuel du thème graphique (Clair / Sombre)
 * avec animation circulaire (Circular Clip-Path Reveal via View Transitions API).
 */

import { ref, nextTick } from 'vue'

const isDark = ref<boolean>(false)

export function useTheme() {
  const applyThemeClass = (dark: boolean) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      if (dark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      localStorage.setItem('findme-theme', dark ? 'dark' : 'light')
    }
  }

  const executeToggle = () => {
    isDark.value = !isDark.value
    applyThemeClass(isDark.value)
  }

  const toggleDarkMode = async (event?: MouseEvent) => {
    const isAppearanceTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition || !event) {
      executeToggle()
      return
    }

    let x = event.clientX
    let y = event.clientY

    // Target the exact button center for a perfect circular origin
    if (event.currentTarget && event.currentTarget instanceof HTMLElement) {
      const rect = event.currentTarget.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    try {
      // @ts-ignore
      const transition = document.startViewTransition(async () => {
        executeToggle()
        await nextTick()
      })

      await transition.ready

      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: clipPath
        },
        {
          duration: 550,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    } catch (err) {
      console.warn('ViewTransition unsupported or failed, falling back:', err)
      executeToggle()
    }
  }

  const initTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('findme-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const active = savedTheme === 'dark' || (!savedTheme && prefersDark)
      isDark.value = active
      applyThemeClass(active)
    }
  }

  return {
    isDark,
    toggleDarkMode,
    initTheme
  }
}
