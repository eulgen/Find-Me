<!--
  @file app/components/ui/ThemeToggle.vue
  @description Composant réutilisable de switch Thème Clair / Sombre avec animation circulaire (View Transitions API) et accessibilité WCAG AAA.
-->

<script setup lang="ts">
import { onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '~/composables/useTheme'

const props = withDefaults(defineProps<{
  showLabel?: boolean
  class?: string
}>(), {
  showLabel: false,
  class: ''
})

const { isDark, toggleDarkMode, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})

const handleToggle = (e: MouseEvent) => {
  toggleDarkMode(e)
}
</script>

<template>
  <button
    type="button"
    @click="handleToggle"
    :title="isDark ? 'Passer en Mode Clair' : 'Passer en Mode Sombre (Institutionnel)'"
    :aria-label="isDark ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'"
    class="relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border shadow-sm group select-none"
    :class="[
      isDark
        ? 'bg-slate-900/90 text-amber-400 border-amber-500/30 hover:bg-slate-800 hover:border-amber-400'
        : 'bg-white/90 text-slate-800 border-slate-200 hover:bg-slate-100 hover:text-emerald-700 hover:border-emerald-500/30',
      props.class
    ]"
  >
    <div class="relative w-5 h-5 flex items-center justify-center shrink-0">
      <Sun
        class="w-5 h-5 transition-all duration-500 absolute transform"
        :class="isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-amber-500'"
      />
      <Moon
        class="w-5 h-5 transition-all duration-500 absolute transform"
        :class="isDark ? 'rotate-0 scale-100 opacity-100 text-amber-300' : '-rotate-90 scale-0 opacity-0'"
      />
    </div>

    <span v-if="showLabel" class="text-xs font-bold font-sans tracking-wide">
      {{ isDark ? 'Mode Sombre' : 'Mode Clair' }}
    </span>
  </button>
</template>
