<script setup lang="ts">
	import ButtonUI from "./ButtonUI.vue";

	const {
		isGoogleLoading,
		isAuthSubmitLoading,
		isIcloudLoading,
		handleIcloudAuth,
	} = useAuth();
</script>

<template>
	<div>
		<ButtonUI
			variant="outline"
			:loading="isIcloudLoading"
			:disabled="isGoogleLoading || isIcloudLoading || isAuthSubmitLoading"
			@click="handleIcloudAuth"
			class="w-full flex items-center justify-center h-12 border-[#1A237E]/20 hover:border-[#1A237E]"
			id="icloud-signin-btn-signup"
		>
			<span class="flex items-center space-x-2.5 font-bold">
				<svg
					class="w-5 h-5 fill-current text-slate-800 dark:text-white shrink-0"
					viewBox="0 0 170 170"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.36-6.13-2.92-2.38-6.73-6.93-11.45-13.67-4.71-6.73-8.58-13.67-11.59-20.82-3.01-7.15-5.29-14.39-6.83-21.72-1.53-7.32-2.3-14.28-2.3-20.89 0-16.24 3.81-29.35 11.43-39.31 7.62-9.96 17-14.99 28.16-15.09 4.58 0 9.69 1.25 15.34 3.74 5.65 2.5 9.21 3.74 10.66 3.74 1.17 0 4.8-.97 10.87-2.9 6.07-1.93 11-2.9 14.79-2.9 10.51 0 19.34 3.1 26.5 9.3 5.31 4.58 9.3 10.15 11.97 16.71-11.55 7.02-17.26 16.14-17.13 27.36.13 8.35 3.01 15.3 8.65 20.82 5.64 5.51 12.39 8.71 20.25 9.6-2.58 7.42-5.61 14.43-9.1 21.05zM119.22 34.62c0-8.19-2.86-15.22-8.57-21.1C105 7.65 97.94 4.52 89.47 4.52c-.13 1.05-.13 1.94-.13 2.68 0 8.01 2.97 14.93 8.92 20.76 5.95 5.84 12.91 8.95 20.89 9.35.07-.8.07-1.61.07-2.69z"
					/>
				</svg>
				<span>
					{{
						isIcloudLoading
							? "Sécurisation iCloud en cours..."
							: "S'inscrire avec iCloud"
					}}
				</span>
			</span>
		</ButtonUI>
	</div>
</template>
