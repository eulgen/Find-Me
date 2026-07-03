// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
			]
		},
	},

	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["./app/assets/css/main.css"],

	vite: {
		plugins: [tailwindcss()],
	},

	modules: ["@nuxt/image", "nuxt-vue3-google-signin"],

	runtimeConfig: {
		// Les variables ici sont privées (uniquement côté serveur)

		public: {
			// Les variables ici sont publiques (accessibles côté client et serveur)
			publicUrl: process.env.NUXT_PUBLIC_URL,
			mockServerUrl: process.env.NUXT_PUBLIC_GEOLINK_FINDME,
			mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN,
			whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER,
		},
	},

	googleSignIn: {
		clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
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
	devServer: {
		https: true,
		host: '0.0.0.0', // Expose on local network so phone can connect
	},
});
