// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
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
			publicUrl: process.env.NUXT_PUBLIC_URL || "http://localhost:3000",
		},
	},
	googleSignIn: {
		clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || "",
	},
});