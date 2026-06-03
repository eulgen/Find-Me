/**
 * @file useLanguage.ts
 * @description Composable simple pour gérer la langue active (FR / EN).
 */

import { ref } from 'vue'

const currentLang = ref<'FR' | 'EN'>('FR')

export function useLanguage() {
  const toggleLanguage = () => {
    currentLang.value = currentLang.value === 'FR' ? 'EN' : 'FR'
  }

  return {
    currentLang,
    toggleLanguage
  }
}
