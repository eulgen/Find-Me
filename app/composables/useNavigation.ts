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

const isPageLoading = ref<boolean>(true);
const pageLoadingProgress = ref<number>(0);

const isFinalCtaLoading = ref<boolean>(false);
const isFinalDemoLoading = ref<boolean>(false);

export function useNavigation() {
	const { addToast } = useToasts();

	const initLoaderSimulation = () => {
		let currentVal = 0;
		const interval = setInterval(() => {
			currentVal += Math.floor(Math.random() * 12) + 6;
			if (currentVal >= 100) {
				currentVal = 100;
				pageLoadingProgress.value = 100;
				clearInterval(interval);
				setTimeout(() => {
					isPageLoading.value = false;
					addToast(
						"🇨🇲 Adresse municipale findMe synchronisée avec succès !",
						"info",
					);
				}, 500);
			} else {
				pageLoadingProgress.value = currentVal;
			}
		}, 85);
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
		if (currentUser.value?.rule === "admin") {
			navigateTo("/admin");
		} else {
			navigateTo(`/users/${currentUser.value?.id}`);
		}
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
		addToast(
			currentUser.value?.rule === "admin"
				? "Accès sécurisé à l'Espace Administrateur..."
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
