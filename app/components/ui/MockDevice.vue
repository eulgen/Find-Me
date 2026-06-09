<script setup lang="ts">
import { Wifi, Battery, ChevronLeft, RotateCcw, Share } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  type: 'mobile' | 'desktop'
  title?: string
  carrier?: 'MTN CM' | 'Orange CM' | 'Camtel'
}>(), {
  title: 'https://findme.cm/address/create',
  carrier: 'MTN CM'
})
</script>

<template>
  <div v-if="type === 'mobile'"
    class="relative mx-auto w-[330px] h-[640px] rounded-[40px] border-8 border-[#1A237E] bg-[#FBF8FF] shadow-[12px_12px_0px_0px_#1A237E] flex flex-col overflow-hidden"
    id="mobile-frame-container"
  >
    <!-- Notch / Speaker bar -->
    <div class="absolute top-0 inset-x-0 h-6 bg-[#1A237E] flex justify-center items-center z-30 rounded-b-xl" id="mobile-notch">
      <div class="w-16 h-3.5 bg-black rounded-full flex items-center justify-between px-2 text-[8px] text-white">
        <span class="text-[7px] font-mono">12:00</span>
        <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
      </div>
    </div>

    <!-- Mobile Status Bar -->
    <div class="bg-[#1A237E] pt-7 px-6 pb-2 text-[9px] text-[#F9F7FC] font-extrabold flex items-center justify-between z-20 shrink-0" id="mobile-status-row">
      <span>{{ carrier }} 5G</span>
      <div class="flex items-center space-x-1.5">
        <Wifi class="w-3 h-3 text-[#4CAF50]" />
        <span class="font-mono">84%</span>
        <Battery class="w-3.5 h-3.5 text-[#4CAF50]" />
      </div>
    </div>

    <!-- Mock App Header -->
    <div class="bg-[#F5F2FB] border-b-2 border-[#1A237E]/10 py-2.5 px-4 flex items-center justify-between text-xs text-[#1A237E] shrink-0 font-bold" id="mobile-header-toolbar">
      <div class="flex items-center space-x-1">
        <ChevronLeft class="w-4 h-4 text-[#2E7D32]" />
        <span>Retour</span>
      </div>
      <span class="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#1A237E]/10 text-[#1A237E]/60 max-w-[120px] truncate">
        {{ title.replace('https://', '') }}
      </span>
      <Share class="w-3.5 h-3.5 text-[#2E7D32]" />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto p-4 bg-white" id="mobile-viewport-content">
      <slot />
    </div>

    <!-- Back pill home button -->
    <div class="bg-white py-2 flex justify-center items-center border-t border-[#1A237E]/5 shrink-0" id="mobile-home-indicator">
      <div class="w-28 h-1.5 bg-[#1A237E]/20 rounded-full" />
    </div>
  </div>

  <!-- Desktop Web Browser Mock Setup -->
  <div v-else
    class="w-full h-[540px] rounded-2xl border-4 border-[#1A237E] bg-white shadow-[12px_12px_0px_0px_#2E7D32] flex flex-col overflow-hidden"
    id="desktop-frame-container"
  >
    <!-- OS System Toolbar layout -->
    <div class="bg-[#1A237E] py-2.5 px-4 flex items-center justify-between shrink-0" id="desktop-window-bar">
      <!-- Window controls circles -->
      <div class="flex space-x-1.5 items-center">
        <div class="w-3 h-3 rounded-full bg-[#FFD5D0] border border-red-500" />
        <div class="w-3 h-3 rounded-full bg-[#F5F2FB] border border-yellow-500" />
        <div class="w-3 h-3 rounded-full bg-[#4CAF50] border border-green-600" />
      </div>
      
      <!-- Navigation Address search input box -->
      <div class="w-1/2 bg-[#FBF8FF]/10 text-[#FBF8FF] rounded-lg py-1 px-3.5 text-[10px] md:text-xs flex items-center justify-between border border-[#FBF8FF]/20 font-mono" id="desktop-url-box">
        <span class="truncate">{{ title }}</span>
        <RotateCcw class="w-3 h-3 opacity-60" />
      </div>

      <!-- Cameroon localized state -->
      <div class="flex items-center space-x-1">
        <span class="text-[10px] bg-[#2E7D32] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Portal CM
        </span>
      </div>
    </div>

    <!-- Primary viewport content -->
    <div class="flex-1 overflow-y-auto p-6 bg-[#F9F7FC]" id="desktop-viewport-content">
      <slot />
    </div>
  </div>
</template>
