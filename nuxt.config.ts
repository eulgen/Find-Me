// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'fr'
			},
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
				{ rel: 'preconnect', href: 'https://www.transparenttextures.com' },
				{ rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap', media: 'print', onload: "this.media='all'" }
			],
			noscript: [
				{ children: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" />' }
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
			"/": { prerender: true },
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
