import { page } from '$app/stores';
import { writable, get, type Writable, derived } from 'svelte/store';
import { DEFAULT_BG, storeNames } from './constants';
import {
	Choice,
	Consumable,
	EditableMap,
	Equippable,
	type Branch,
	type Interactable,
	type Merger,
	type Pusher,
	type SkinTone,
} from './types';
import { generateID } from './routes/utils';

// TODO: might switch key type to string

function createMapStore<K, V>(name: string) {
	const { set, subscribe, update } = writable(new Map<K, V>());

	return {
		set,
		subscribe,
		useStorage: (id: string) => {
			const val = JSON.parse(localStorage.getItem(id + '_' + name) as string);
			set(new Map(val) || new Map<number, V>());
			subscribe((state) => {
				localStorage.setItem(
					id + '_' + name,
					JSON.stringify(Array.from(state.entries()))
				);
			});
		},
		add: (id: K, value: V) =>
			update((state) => {
				state.set(id, value);
				return state;
			}),
		update: (id: K, value: V) =>
			update((state) => {
				state.set(id, value);
				return state;
			}),
		remove: (id: K) =>
			update((state) => {
				state.delete(id);
				return state;
			}),
	};
}

function createSaves() {
	const { set, subscribe, update } = writable({
		saves: new Map<string, string>(),
		currentSaveID: '',
		currentSaveName: '',
		loaded: false,
	});

	// if logged in, save on server
	// if not, save on localstorage

	return {
		set,
		subscribe,
		useStorage: () => {
			const currentSaveID = localStorage.getItem('currentSaveID');
			const saves = JSON.parse(localStorage.getItem('saves') as string);

			if (
				get(page).route.id == 'editor' &&
				(currentSaveID == '' || currentSaveID == null)
			) {
				return false;
			}

			let _saves = new Map<string, string>(saves) || new Map<string, string>();

			update((state) => {
				state.saves = _saves;
				state.currentSaveID = currentSaveID || '';
				state.currentSaveName = _saves.get(currentSaveID || '') || '';
				state.loaded = true;

				return state;
			});

			subscribe((state) => {
				localStorage.setItem(
					'saves',
					JSON.stringify(Array.from(state.saves.entries()))
				);
				localStorage.setItem('currentSaveID', state.currentSaveID);
			});

			return true;
		},
		rename: (id: string, title: string) =>
			update((state) => {
				state.saves.set(id, title);
				return state;
			}),
		add: (name: string) =>
			update((state) => {
				let id = generateID();
				state.currentSaveID = id;
				state.currentSaveName = name;
				state.saves.set(id, name);
				return state;
			}),
		delete: (id: string) =>
			update((state) => {
				for (let store of storeNames) {
					localStorage.removeItem(id + '_' + store);
				}
				state.currentSaveID = '';
				state.saves.delete(id);
				return state;
			}),
	};
}

function createEditableMap() {
	const { set, subscribe, update } = writable(new EditableMap());

	return {
		set,
		subscribe,
		useStorage: (id: string) => {
			const startingSectionIndex = parseInt(
				localStorage.getItem(id + '_ssi') || '0'
			);
			const dbg = localStorage.getItem(id + '_dbg') || DEFAULT_BG;
			const items = JSON.parse(localStorage.getItem(id + '_items') as string);
			const colors = JSON.parse(localStorage.getItem(id + '_colors') as string);
			const backgrounds = JSON.parse(
				localStorage.getItem(id + '_backgrounds') as string
			);

			update((state) => {
				state.startingSectionIndex = startingSectionIndex;
				state.items = new Map(items) || new Map();
				state.colors = new Map(colors) || new Map();
				state.backgrounds = new Map(backgrounds) || new Map();
				state.dbg = dbg || '';
				return state;
			});

			subscribe((state) => {
				localStorage.setItem(
					id + '_items',
					JSON.stringify(Array.from(state.items.entries()))
				);
				localStorage.setItem(
					id + '_colors',
					JSON.stringify(Array.from(state.colors.entries()))
				);
				localStorage.setItem(
					id + '_backgrounds',
					JSON.stringify(Array.from(state.backgrounds.entries()))
				);
				localStorage.setItem(id + '_dbg', state.dbg);
			});
		},
		updateStartingSection: (index: number) =>
			update((state) => {
				state.startingSectionIndex = index;
				return state;
			}),
		updateDefaultColor: (color: string) =>
			update((state) => {
				state.dbg = color;
				return state;
			}),
		updateColorAt: (sectionIndex: number, index: number, color: string) =>
			update((state) => {
				state.colors.set(sectionIndex + '_' + index, color);
				return state;
			}),
		deleteColorAt: (sectionIndex: number, index: number) =>
			update((state) => {
				state.colors.delete(sectionIndex + '_' + index);
				return state;
			}),
		clearColors: () =>
			update((state) => {
				state.colors.clear();
				return state;
			}),
		filterColors: () =>
			update((state) => {
				for (let [id, color] of state.colors) {
					if (color == state.dbg) state.colors.delete(id);
				}
				return state;
			}),
		updateBackgroundAt: (sectionIndex: number, index: number, emoji: string) =>
			update((state) => {
				state.backgrounds.set(sectionIndex + '_' + index, emoji);
				return state;
			}),
		deleteBackgroundAt: (sectionIndex: number, index: number) =>
			update((state) => {
				state.backgrounds.delete(sectionIndex + '_' + index);
				return state;
			}),
		addEmoji: (sectionIndex: number, index: number, emoji: string) =>
			update((state) => {
				state.items.set(sectionIndex + '_' + index, emoji);
				return state;
			}),
		removeEmoji: (sectionIndex: number, index: number) =>
			update((state) => {
				state.items.delete(sectionIndex + '_' + index);
				return state;
			}),
		clearItems: () =>
			update((state) => {
				state.items.clear();
				return state;
			}),
		clearAll: () =>
			update((state) => {
				state.items.clear();
				state.colors.clear();
				state.backgrounds.clear();
				return state;
			}),
	};
}

interface ModalData {
	header: string;
	content: string;
	confirmText: string;
	onConfirm: (arg?: string) => void | (() => void);
	input?: boolean;
	danger?: boolean;
}

function createModal() {
	const { set, subscribe, update } = writable({
		visible: false,
		header: '',
		content: '',
		confirmText: '',
		onConfirm: (arg?: string) => {},
		danger: false,
		input: false,
	});

	return {
		set,
		subscribe,
		show: (modalData: ModalData) =>
			update((state) => {
				// @ts-expect-error
				state = modalData;
				state.visible = true;
				return state;
			}),
	};
}

function createDialogueTree() {
	const { set, subscribe, update } = writable(new Map<string, Branch>());

	return {
		set,
		subscribe,
		useStorage: (id: string) => {
			const val = JSON.parse(localStorage.getItem(id + '_dialogue') as string);
			set(new Map(val) || new Map<number, Branch>());
			subscribe((state) => {
				localStorage.setItem(
					id + '_dialogue',
					JSON.stringify(Array.from(state.entries()))
				);
			});
		},
		add: (id: string) =>
			update((state) => {
				state.set(id, []);
				return state;
			}),
		remove: (id: string) =>
			update((state) => {
				state.delete(id);
				if (typeof state.get(id)?.at(-1) !== 'string') {
					// delete all subbranches
					state.forEach((_, key) => {
						if (key.includes(id)) {
							state.delete(key);
						}
					});
				}
				return state;
			}),
		addTextTo: (id: string, text: string) =>
			update((state) => {
				if (typeof state.get(id)?.at(-1) !== 'string') {
					state.get(id)?.splice(state.get(id)?.length - 1, 0, text);
				} else {
					state.get(id)?.push(text);
				}
				return state;
			}),
		addChoiceTo: (rootID: string, text: string) =>
			update((state) => {
				const branch = state.get(rootID);
				let id = '';

				if (rootID.includes('_')) {
					id = rootID.split('_')[0] + '_' + generateID();
				} else {
					id = rootID + '_' + generateID();
				}

				state.set(id, []);
				const choice = new Choice(text.slice(0, 4), text, id);

				if (typeof branch?.at(-1) == 'string') {
					branch?.push([choice]);
				} else {
					(branch?.at(-1) as Array<Choice>)?.push(choice);
				}
				return state;
			}),
	};
}

export const showLoading = writable(false);
export const modal = createModal();

// VANILLA
export const currentColor = writable('');
export const currentEmoji = writable('');
export const currentSkin: Writable<SkinTone> = writable('');

export const formattedEmoji = derived(
	[currentEmoji, currentSkin],
	([$currentEmoji, $currentSkin]) => $currentEmoji?.replace('_', $currentSkin)
);

// CUSTOM
export const saves = createSaves();
export const map = createEditableMap();

// MAPS
export const pushers = createMapStore<number, Pusher>('pushers');
export const mergers = createMapStore<number, Merger>('mergers');
export const consumables = createMapStore<number, Consumable>('consumables');
export const equippables = createMapStore<number, Equippable>('equippables');
export const interactables = createMapStore<number, Interactable>(
	'interactables'
);
export const dialogueTree = createDialogueTree();
