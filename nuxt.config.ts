// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	app: {
		head: {
			script: [
				{
					src: "https://accounts.google.com/gsi/client",
					async: true,
					defer: true,
				},
			],
		},
	},

	compatibilityDate: "2025-07-15",
	devtools: { enabled: false },
	css: ["./app/assets/css/main.css"],

	vite: {
		plugins: [tailwindcss()],
	},

	modules: ["@nuxt/image", "nuxt-vue3-google-signin"],

	runtimeConfig: {
		// Les variables ici sont privées (uniquement côté serveur)

		public: {
			// Les variables ici sont publiques (accessibles côté client et serveur)
			publicUrl: process.env.NUXT_PUBLIC_URL || "http://localhost:3000",
			mockServerUrl: process.env.NUXT_GEOLINK_FINDME || "http://localhost:3000",
		},
	},

	googleSignIn: {
		clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || "",
	},

	nitro: {
		routeRules: {
			"/**": {
				headers: {
					// Permet à la pop-up de Google de communiquer avec ton localhost
					"Cross-Origin-Opener-Policy": "unsafe-none",
				},
			},
		},
	},
});
