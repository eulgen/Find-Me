// plugins/api.ts
import { useToasts } from "~/composables/useToasts";

const { addToast } = useToasts();

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	// On surcharge l'instance globale de $fetch
	const api = $fetch.create({
		baseURL: config.public.mockServerUrl,
		onRequest({ request, options }) {
			// Vos règles d'interception ici
			options.headers = options.headers || {};
			console.log(`[Global Fetch] Requête : ${request}`);
		},
		onResponseError({ response }) {
			addToast(response._data.error, "error");
		},
		onResponse({ request, response }) {
			let res;
			const data = response._data;
			const url = request.toString();
			console.log(
				"[Intercepteur] JSON reçu avec succès :",
				data,
				" Requete : ",
				request,
			);

			if (
				url.includes("/api/auth/signin") ||
				url.includes("/api/auth/signup")
			) {
				if (!data.error) {
					if (data.user) {
						res = data.user;
					} else {
						res = data;
					}
					if (res && !res.id) {
						if (res.email === 'mastaflex65@gmail.com') {
							res.id = 'admin-1';
						} else if (res.email === 'ndengbrice@gmail.com') {
							res.id = 'u-1';
						} else if (res.email === 'ndengbrice@icloud.com') {
							res.id = 'u-1781120394757';
						} else if (res.email === 'alienx@gmail.com') {
							res.id = 'u-1781121101366';
						} else {
							res.id = 'u-' + Date.now();
						}
					}
					useCookie("findme_session", {
						maxAge: 60 * 60 * 24 * 7,
						sameSite: "lax",
						watch: true,
					}).value = JSON.stringify(res);
				}
			}
			if (
				url.includes("/api/auth/google") ||
				url.includes("/api/auth/icloud")
			) {
				if (!data.error && data.user) {
					const u = data.user;
					if (!u.id) {
						if (u.email === 'mastaflex65@gmail.com') {
							u.id = 'admin-1';
						} else if (u.email === 'ndengbrice@gmail.com') {
							u.id = 'u-1';
						} else if (u.email === 'ndengbrice@icloud.com') {
							u.id = 'u-1781120394757';
						} else if (u.email === 'alienx@gmail.com') {
							u.id = 'u-1781121101366';
						} else {
							u.id = 'u-' + Date.now();
						}
					}
					useCookie("findme_session", {
						maxAge: 60 * 60 * 24 * 7,
						sameSite: "lax",
						watch: true,
					}).value = JSON.stringify(u);
				}
			}
		},
	});

	return { provide: { api } };
});
