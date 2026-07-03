<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: string | number
}>(), {
  size: '48'
})

const computedWidth = computed(() => {
  const s = props.size;
  if (typeof s === 'number') return `${s}px`;
  if (typeof s === 'string' && /^\d+$/.test(s)) return `${s}px`;
  return s;
})
</script>

<template>
  <div class="findme-logo-wrapper" :style="{ width: computedWidth }">
    <img 
      src="/assets/images/findme-logo.svg" 
      alt="findMe" 
      width="160"
      height="50"
      class="w-full h-auto dark:hidden"
      style="aspect-ratio: 160/50"
      fetchpriority="high"
    />
    <img 
      src="/assets/images/findme-logo-dark.svg" 
      alt="findMe" 
      width="160"
      height="50"
      class="w-full h-auto hidden dark:block"
      style="aspect-ratio: 160/50"
      fetchpriority="high"
    />
  </div>
</template>

<style scoped>
.findme-logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
