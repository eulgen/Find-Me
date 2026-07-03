<!--
  @file app/components/ButtonUI.vue
  @description Composant de bouton premium findMe â€” design épuré, micro-animations fluides.
  Logique métier inchangée : loading, disabled, icon, variant, emit click.
-->

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    icon?: any // Lucide icon component
    iconPosition?: 'left' | 'right'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
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
    class="btn-findme  relative inline-flex items-center justify-center gap-2.5 font-bold tracking-wide select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
    :class="[
      variant === 'primary'   ? 'btn-primary'   : '',
      variant === 'secondary' ? 'btn-secondary' : '',
      variant === 'outline'   ? 'btn-outline'   : '',
      variant === 'danger'    ? 'btn-danger'    : '',
      size === 'sm' ? 'btn-sm' : '',
      size === 'lg' ? 'btn-lg' : '',
    ]"
  >
    <!-- Shimmer overlay (chargement) -->
    <span v-if="loading" class="btn-shimmer" aria-hidden="true" />

    <!-- Icône gauche ou spinner -->
    <transition name="icon-swap" mode="out-in">
      <span v-if="loading" key="spinner" class="btn-icon-wrap" aria-hidden="true">
        <Loader2 class="w-4 h-4 animate-spin" />
      </span>
      <span v-else-if="icon && iconPosition === 'left'" key="icon-left" class="btn-icon-wrap">
        <component :is="icon" class="w-4 h-4 transition-transform duration-200 " />
      </span>
    </transition>

    <!-- Label -->
    <span class="relative z-10 leading-none text-sm">
      <slot />
    </span>

    <!-- Icône droite -->
    <transition name="icon-swap" mode="out-in">
      <span v-if="!loading && icon && iconPosition === 'right'" key="icon-right" class="btn-icon-wrap">
        <component :is="icon" class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </transition>
  </button>
</template>

<style scoped>
/* â”€â”€ Base â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.btn-findme {
  padding: 0.65rem 1.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease, opacity 0.2s;
}
.btn-findme:active:not(:disabled) {
  transform: translateY(1px);
}

/* â”€â”€ Sizes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.btn-sm {
  padding: 0.4rem 0.9rem;
  font-size: 0.8125rem;
  border-radius: 10px;
  gap: 0.35rem;
}
.btn-lg {
  padding: 0.85rem 2rem;
  font-size: 1rem;
  border-radius: 14px;
}

/* â”€â”€ Variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* Primary â€” Vert findMe */
.btn-primary {
  background: #00bc7d;
  color: #ffffff;
  border: none;
  box-shadow:
    0 1px 3px rgba(0, 188, 125,0.35),
    0 4px 14px rgba(0, 188, 125,0.28),
    inset 0 1px 0 rgba(255,255,255,0.12);
}
.btn-primary:hover:not(:disabled) {
  background: #01c684;
  box-shadow:
    0 2px 6px rgba(0, 188, 125,0.4),
    0 8px 24px rgba(0, 188, 125,0.3),
    inset 0 1px 0 rgba(255,255,255,0.15);
  transform: translateY(-1px);
}
.btn-primary:focus-visible {
  ring-color: #00bc7d;
}

/* Secondary â€” Bleu findMe */
.btn-secondary {
  background: #155dfc;
  color: #ffffff;
  border: none;
  box-shadow:
    0 1px 3px rgba(21, 93, 252,0.4),
    0 4px 14px rgba(21, 93, 252,0.28),
    inset 0 1px 0 rgba(255,255,255,0.10);
}
.btn-secondary:hover:not(:disabled) {
  background: #283593;
  box-shadow:
    0 2px 6px rgba(21, 93, 252,0.45),
    0 8px 24px rgba(21, 93, 252,0.32),
    inset 0 1px 0 rgba(255,255,255,0.13);
  transform: translateY(-1px);
}
.btn-secondary:focus-visible {
  ring-color: #155dfc;
}

/* Outline */
.btn-outline {
  background: transparent;
  color: #155dfc;
  border: 1.5px solid rgba(21, 93, 252,0.3);
  box-shadow: 0 1px 3px rgba(21, 93, 252,0.06);
}
.btn-outline:hover:not(:disabled) {
  background: rgba(21, 93, 252,0.04);
  border-color: rgba(21, 93, 252,0.55);
  box-shadow: 0 2px 8px rgba(21, 93, 252,0.1);
  transform: translateY(-1px);
}
/* dark mode outline */
@media (prefers-color-scheme: dark) {
  .btn-outline {
    color: #E2E8F0;
    border-color: rgba(226,232,240,0.2);
  }
  .btn-outline:hover:not(:disabled) {
    background: rgba(255,255,255,0.05);
    border-color: rgba(226,232,240,0.45);
  }
}

/* Danger */
.btn-danger {
  background: #DC2626;
  color: #ffffff;
  border: none;
  box-shadow:
    0 1px 3px rgba(220,38,38,0.35),
    0 4px 14px rgba(220,38,38,0.25);
}
.btn-danger:hover:not(:disabled) {
  background: #B91C1C;
  box-shadow:
    0 2px 6px rgba(220,38,38,0.45),
    0 8px 20px rgba(220,38,38,0.3);
  transform: translateY(-1px);
}

/* â”€â”€ Shimmer (chargement) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.btn-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.18) 45%,
    rgba(255,255,255,0.32) 50%,
    rgba(255,255,255,0.18) 55%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
}

@keyframes shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* â”€â”€ Icon wrap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.btn-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

/* â”€â”€ Icon transition â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: scale(0.7) rotate(-10deg);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.7) rotate(10deg);
}
</style>
