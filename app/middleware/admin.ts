export default defineNuxtRouteMiddleware((to, from) => {
	const authToken = useCookie("findme_session");

	if (!authToken.value) {
		if (to.path !== "/auth/signin") {
			return navigateTo("/auth/signin");
		}
	}

	let user: any = null;
	try {
		user = typeof authToken.value === 'string' ? JSON.parse(authToken.value as string) : authToken.value;
	} catch (e) {
		return navigateTo("/auth/signin");
	}

	if (!user || user.rule !== "admin") {
		return navigateTo("/");
	}
});
