/**
 * @file useNavigation.ts
 * @description Composable gérant la navigation interne, le chargement initial et les onglets de l'application.
 *
 * Il pilote les sections présentées sur l'écran d'accueil ainsi que le passage
 * à l'Espace Citoyen et à la nouvelle console d'Espace Administrateur.
 */

import { ref } from "vue";
import { useToasts } from "./useToasts";
import { useAuth } from "./useAuth";

const currentView = ref<"home" | "citizen-space" | "admin-space">("home");
const citizenSpaceTab = ref<"list" | "map">("list");

const isPageLoading = ref<boolean>(false);
const pageLoadingProgress = ref<number>(100);

const isFinalCtaLoading = ref<boolean>(false);
const isFinalDemoLoading = ref<boolean>(false);

export function useNavigation() {
	const { addToast } = useToasts();

	const initLoaderSimulation = () => {
		isPageLoading.value = false;
		pageLoadingProgress.value = 100;
	};

	const scrollToSection = (id: string) => {
		if (currentView.value !== "home") {
			currentView.value = "home";
			setTimeout(() => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: "smooth" });
				}
			}, 120);
		} else {
			const el = document.getElementById(id);
			if (el) {
				el.scrollIntoView({ behavior: "smooth" });
			}
		}
	};

	const handleGoHome = () => {
		currentView.value = "home";
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleProfileClick = () => {
		const { currentUser } = useAuth();
		const role = (currentUser.value?.role || "").toUpperCase();
		redirectBasedOnRole(currentUser.value);
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
		addToast(
			role === "ADMIN"
				? "Accès sécurisé à l'Espace Administrateur..."
				: role === "SUPPORT_AGENT"
				? "Accès sécurisé à l'Espace Support Agent..."
				: "Accès sécurisé à votre Espace Utilisateur...",
			"info",
		);
	};

	return {
		currentView,
		citizenSpaceTab,
		isPageLoading,
		pageLoadingProgress,
		isFinalCtaLoading,
		isFinalDemoLoading,
		initLoaderSimulation,
		scrollToSection,
		handleGoHome,
		handleProfileClick,
	};
}
