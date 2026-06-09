<!--
  @file FindMeLogo.vue
  @description Logo officiel findMe avec design géodésique pliable et insigne national vert-rouge-jaune du Cameroun.
-->

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: string | number
  variant?: 'default' | 'footer'
}>(), {
  size: '48',
  variant: 'default'
})

const isFooter = computed(() => props.variant === 'footer')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 160 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Origami Map Icon -->
    <g :stroke="isFooter ? '#FFF' : '#1A237E'" stroke-width="2.5" stroke-linejoin="round">
      <path d="M5 12 L18 6 L31 12 M5 42 L18 36 L31 42" />
      <path d="M5 12 V42 L18 36 V6 L31 12 V42" />
      <path d="M18 6 L31 12 L44 6 V36 L31 42 L18 36" :fill="isFooter ? 'none' : '#F0EDF6'" fill-opacity="0.4" />
      <path d="M31 12 L44 6 M31 42 L44 36 M44 6 V36" />
    </g>
    <!-- Circular green pin marker with white check mark -->
    <circle cx="28" cy="24" r="11" :fill="isFooter ? '#4CAF50' : '#2E7D32'" :stroke="isFooter ? '#FFF' : '#1A237E'" stroke-width="2" />
    <path d="M24 24.5 L27 27.5 L32 20.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Brand Text -->
    <text x="56" y="28" :fill="isFooter ? '#4CAF50' : '#2E7D32'" font-size="23" font-weight="800" font-family="sans-serif">
      find<tspan :fill="isFooter ? '#FFF' : '#1A237E'" font-weight="900">Me</tspan>
    </text>
    <text x="56" y="42" :fill="isFooter ? '#FFF' : '#1A237E'" :fill-opacity="isFooter ? '0.7' : '1'" font-size="6.5" letter-spacing="1.8" font-weight="600" font-family="sans-serif" class="opacity-90">
      ADRESSAGE URBAIN
    </text>
  </svg>
</template>
