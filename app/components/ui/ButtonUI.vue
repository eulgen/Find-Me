<!--
  @file app/components/ButtonUI.vue
  @description Composant de bouton haut de gamme animé avec icône dynamique et état de chargement.
  Respecte scrupuleusement la charte graphique : Vert (Primaire) et Bleu (Secondaire).
-->

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'danger'
    loading?: boolean
    icon?: any // Lucide icon component
    iconPosition?: 'left' | 'right'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    loading: false,
    icon: null,
    iconPosition: 'left',
    disabled: false,
    type: 'button'
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
    class="relative inline-flex items-center justify-center font-extrabold tracking-wide rounded-full px-5 py-2.5 transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none gap-2 font-mono text-xs uppercase"
    :class="[
      // Variant primary: Green
      variant === 'primary'
        ? 'bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white border-2 border-[#2E7D32] shadow-[4px_4px_0px_0px_#1A237E] active:shadow-none active:translate-y-0.5 focus:ring-[#2E7D32]'
        : '',
      // Variant secondary: Blue
      variant === 'secondary'
        ? 'bg-[#1A237E] hover:bg-[#1A237E]/90 text-white border-2 border-[#1A237E] shadow-[4px_4px_0px_0px_#2E7D32] active:shadow-none active:translate-y-0.5 focus:ring-[#1A237E]'
        : '',
      // Variant outline
      variant === 'outline'
        ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 border-2 border-[#1A237E]/20 text-[#1A237E] dark:text-[#E2E8F0] shadow-sm focus:ring-[#1A237E]'
        : '',
      // Variant danger
      variant === 'danger'
        ? 'bg-rose-600 hover:bg-rose-700 text-white border-2 border-rose-600 shadow-[4px_4px_0px_0px_#1A237E] active:shadow-none active:translate-y-0.5 focus:ring-rose-600'
        : ''
    ]"
  >
    <!-- Animation de chargement d'icône -->
    <transition name="fade-icon" mode="out-in">
      <div v-if="loading" class="flex items-center justify-center shrink-0" key="loading">
        <Loader2 class="w-4 h-4 animate-spin text-current" />
      </div>

      <div v-else-if="icon && iconPosition === 'left'" class="flex items-center justify-center shrink-0" key="icon-left">
        <component :is="icon" class="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110" />
      </div>
    </transition>

    <!-- Texte du bouton -->
    <span class="relative z-10 leading-none">
      <slot />
    </span>

    <!-- Icône à droite si configurée -->
    <transition name="fade-icon" mode="out-in">
      <div v-if="!loading && icon && iconPosition === 'right'" class="flex items-center justify-center shrink-0" key="icon-right">
        <component :is="icon" class="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110" />
      </div>
    </transition>
  </button>
</template>

<style scoped>
.fade-icon-enter-active,
.fade-icon-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-icon-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.fade-icon-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
