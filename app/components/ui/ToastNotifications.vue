<script setup lang="ts">
	import { X, CheckCircle, Mail, TriangleAlert, Info } from "lucide-vue-next";
	import { useToasts } from "../../composables/useToasts";

	const { toasts } = useToasts();
    
    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    }
</script>

<template>
	<div
		class="fixed top-6 right-6 z-[150] flex flex-col gap-3 w-[90%] sm:w-[400px] pointer-events-none"
		id="toast-notifications-container"
	>
        <TransitionGroup 
            enter-active-class="transition-all duration-400 ease-out"
            enter-from-class="opacity-0 translate-x-8"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-300 ease-in absolute w-full"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-8"
        >
            <div
                v-for="t in toasts"
                :key="t.id"
                class="pointer-events-auto flex items-start p-4 rounded-[1.25rem] backdrop-blur-xl border shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group w-full"
                :class="[
                    t.type === 'success' ? 'bg-emerald-600/95 border-emerald-500/50 text-white shadow-emerald-500/20' : '',
                    t.type === 'mail' || t.type === 'info' || (!['success', 'error', 'mail'].includes(t.type)) ? 'bg-[#0f172b]/95 border-slate-700/50 text-white shadow-[#0f172b]/20' : '',
                    t.type === 'error' ? 'bg-rose-600/95 border-rose-500/50 text-white shadow-rose-500/20' : ''
                ]"
            >
                <!-- Decoration -->
                <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[30px] opacity-40 pointer-events-none"
                    :class="t.type === 'success' ? 'bg-emerald-400' : t.type === 'error' ? 'bg-rose-400' : 'bg-blue-400'"
                ></div>

                <div class="flex items-center justify-center w-10 h-10 rounded-full shrink-0 mr-3.5 relative z-10 shadow-inner"
                    :class="t.type === 'success' ? 'bg-white/20' : t.type === 'error' ? 'bg-white/20' : 'bg-white/10'"
                >
                    <CheckCircle v-if="t.type === 'success'" class="w-5 h-5 text-emerald-50" />
                    <Mail v-else-if="t.type === 'mail'" class="w-5 h-5 text-blue-50" />
                    <TriangleAlert v-else-if="t.type === 'error'" class="w-5 h-5 text-rose-50" />
                    <Info v-else class="w-5 h-5 text-blue-50" />
                </div>

                <div class="flex-1 pr-6 relative z-10 mt-0.5">
                    <span class="text-[10px] font-black uppercase tracking-widest opacity-80 block mb-0.5">
                        {{ t.type === "success" ? "Opération Réussie" : t.type === "error" ? "Erreur" : t.type === "mail" ? "Message" : "Information" }}
                    </span>
                    <p class="text-sm font-bold leading-snug">{{ t.message }}</p>
                </div>

                <button
                    @click="removeToast(t.id)"
                    aria-label="Fermer"
                    class="text-white/60 hover:text-white transition-colors self-start cursor-pointer p-2 absolute top-2 right-2 rounded-full hover:bg-white/10 z-20"
                >
                    <X class="w-4 h-4" />
                </button>
            </div>
        </TransitionGroup>
	</div>
</template>
