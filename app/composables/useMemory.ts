// useMemory composable pour interagir avec localStorage
// Fournit des données réactives, une persistance automatique et des fonctions utilitaires.

import { ref, watch, type Ref } from "vue";

/**
 * Composable générique pour synchroniser une valeur avec `localStorage`.
 *
 * @template T - Type de la valeur stockée.
 * @param key - La clé `localStorage` sous laquelle les données sont enregistrées.
 * @param defaultValue - Valeur utilisée lorsqu'aucune donnée n'est encore présente.
 * @returns Un objet exposant la donnée réactive `data` et des méthodes d'aide.
 */
export function useMemory<T>(
	key: string,
	defaultValue: T,
): {
	data: Ref<T>;
	loadInStorage: () => void;
	saveInStorage: () => void;
	clearStorage: () => void;
	filterInStorage: (predicate: (item: any) => boolean) => any[];
} {
	// Protéger contre le rendu côté serveur où `window`/`localStorage` n'existent pas.
	const isClient =
		typeof window !== "undefined" && typeof localStorage !== "undefined";

	const data = ref<T>(defaultValue) as Ref<T>;

	// Charger les données depuis localStorage si elles existent.
	const loadInStorage = (): void => {
		if (!isClient) return;
		const raw = localStorage.getItem(key);
		if (raw) {
			try {
				data.value = JSON.parse(raw) as T;
			} catch (e) {
				// Si le parse échoue, conserver la valeur par défaut.
				console.warn(
					`[useMemory] Échec du parsing JSON stocké pour la clé "${key}":`,
					e,
				);
			}
		}
	};

	// Persister la valeur actuelle dans localStorage.
	const saveInStorage = (): void => {
		if (!isClient) return;
		try {
			const serialized = JSON.stringify(data.value);
			localStorage.setItem(key, serialized);
		} catch (e) {
			console.error(
				`[useMemory] Impossible de sérialiser la valeur pour la clé "${key}":`,
				e,
			);
		}
	};

	// Supprimer l'entrée de localStorage et réinitialiser à la valeur par défaut.
	const clearStorage = (): void => {
		if (!isClient) return;
		localStorage.removeItem(key);
		data.value = defaultValue;
	};

	/**
	 * Filtrer la valeur stockée lorsqu'il s'agit d'un tableau ou d'un objet.
	 * - Pour les tableaux, retourne le tableau filtré.
	 * - Pour les objets, retourne un tableau de clés dont les valeurs satisfont le prédicat.
	 * - Pour les autres types, retourne un tableau vide.
	 */
	const filterInStorage = (predicate: (item: any) => boolean): any[] => {
		const val = data.value as unknown;
		if (Array.isArray(val)) {
			return (val as any[]).filter(predicate);
		}
		if (val && typeof val === "object") {
			return Object.entries(val as Record<string, any>)
				.filter(([, v]) => predicate(v))
				.map(([k]) => k);
		}
		return [];
	};

	// Initialiser depuis le stockage.
	loadInStorage();

	// Auto‑sauvegarder à chaque modification de `data` (watch profond pour les structures imbriquées).
	watch(
		data,
		() => {
			saveInStorage();
		},
		{ deep: true },
	);

	return { data, loadInStorage, saveInStorage, clearStorage, filterInStorage };
}

/**
 * Exemple d'utilisation dans un composant :
 *
 * const { data, filter } = useMemory<string[]>('my-items', [])
 * // `data` est réactif et persiste automatiquement.
 * // Pour obtenir uniquement les éléments contenant "foo" :
 * const fooItems = filter(item => item.includes('foo'))
 */
