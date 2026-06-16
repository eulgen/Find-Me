/**
 * @file useToasts.ts
 * @description Composable de notification temporaire à l'écran (Toasts).
 *
 * Permet l'envoi de bulles d'information avec un cycle de vie autonome
 * configuré selon le type de message (succès, info simple ou email/alerte longue).
 */

import { ref } from "vue";

export interface ToastItem {
	id: string;
	message: string;
	type: "success" | "info" | "mail" | "error";
}

const toasts = ref<ToastItem[]>([]);

export function useToasts() {
	const addToast = (
		message: string,
		type: "success" | "info" | "mail" | "error" = "success",
	) => {
		const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
		toasts.value.push({ id, message, type });
		// const duration = type === 'mail' ? 7000 : 4500
		let duration = Number(0);
		if (type === "error") {
			duration = 10000;
		}
		if (type === "mail" || type === "info" || type === "success") {
			duration = 7000;
		}
		setTimeout(() => {
			toasts.value = toasts.value.filter((t) => t.id !== id);
		}, duration);
	};

	return {
		toasts,
		addToast,
	};
}
