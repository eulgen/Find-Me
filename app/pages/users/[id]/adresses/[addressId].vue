<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAddresses } from '~/composables/useAddresses';
import { useAuth } from '~/composables/useAuth';
import AddressDetailsView from '~/components/dashboard/AddressDetailsView.vue';
import AddressManager from '~/components/dashboard/AddressManager.vue';
import { useCitizenSpacePage } from '~/composables/useCitizenSpacePage';

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const { currentUser } = useAuth();
const { addressesList } = useAddresses();
const { openEditForm } = useCitizenSpacePage();

const addressId = route.params.addressId as string;

const address = computed(() => {
  return addressesList.value.find(a => a.addressCode === addressId);
});

onMounted(() => {
  if (!address.value && addressesList.value.length > 0) {
    router.push(`/users/${currentUser.value?.id || 'me'}/adresses`);
  }
});

const handleClose = () => {
  router.push(`/users/${currentUser.value?.id || 'me'}/adresses`);
};

const handleEdit = () => {
  // Not used directly here anymore since we edit inline, but kept for legacy
  const idx = addressesList.value.findIndex(a => a.addressCode === addressId);
  if (idx !== -1) {
    openEditForm(idx);
  }
};

const handleSave = (updatedData: any) => {
  const idx = addressesList.value.findIndex(a => a.addressCode === addressId);
  if (idx !== -1) {
    addressesList.value[idx] = {
      ...addressesList.value[idx],
      ...updatedData,
      updatedAt: Date.now()
    };
  }
};

const handleShare = () => {
  alert('Fonctionnalité de partage à venir !');
};

</script>

<template>
  <ClientOnly>
    <div v-if="address" class="flex-1 flex flex-col p-4 sm:p-8 max-w-6xl mx-auto w-full">
      <AddressDetailsView
        :address="address"
        @close="handleClose"
        @edit="handleEdit"
        @save="handleSave"
        @share="handleShare"
      />
    </div>
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-[#2E7D32]/30 border-t-[#2E7D32] rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500 font-medium">Chargement des détails...</p>
      </div>
    </div>
  </ClientOnly>
</template>
