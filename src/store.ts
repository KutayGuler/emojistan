import { page } from '$app/stores';
import { writable, get, type Writable, derived } from 'svelte/store';
import { DEFAULT_BG, storeNames } from './constants';
import {
	Choice,
	Effector,
	EditableMap,
	Controllable,
	Sequencer,
	Interactable,
	type Branch,
	type Merger,
	type Pusher,
	type SkinTone,
	type MapLocation,
} from './types';
import { generateID } from './routes/utils';
import type { RuleboxType } from './lib';

function createMapStore<K, V>(name: `${RuleboxType}s`) {
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

	return {
		set,
		subscribe,
		useStorage: () => {
			const currentSaveID = localStorage.getItem('currentSaveID');
			const saves = JSON.parse(localStorage.getItem('saves') as string);

			if (
				get(page).route.id === 'editor' &&
				(currentSaveID === '' || currentSaveID === null)
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
			const ssi = parseInt(localStorage.getItem(id + '_ssi') || '0');
			const dbg = localStorage.getItem(id + '_dbg') || DEFAULT_BG;
			const items = JSON.parse(localStorage.getItem(id + '_items') as string);
			const colors = JSON.parse(localStorage.getItem(id + '_colors') as string);
			const backgrounds = JSON.parse(
				localStorage.getItem(id + '_backgrounds') as string
			);

			update((state) => {
				state.ssi = ssi;
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
				// @ts-expect-error
				localStorage.setItem(id + '_ssi', state.ssi);
			});
		},
		updateStartingSection: (index: number) =>
			update((state) => {
				state.ssi = index;
				return state;
			}),
		updateDefaultColor: (color: string) =>
			update((state) => {
				state.dbg = color;
				return state;
			}),
		updateColorAt: (sectionIndex: number, index: number, color: string) =>
			update((state) => {
				state.colors.set(`${sectionIndex}_${index}`, color);
				return state;
			}),
		deleteColorAt: (sectionIndex: number, index: number) =>
			update((state) => {
				state.colors.delete(`${sectionIndex}_${index}`);
				return state;
			}),
		clearColors: (sectionIndex: number) =>
			update((state) => {
				let keys = [];

				for (let key of state.colors.keys()) {
					if (+key.split('_')[0] == sectionIndex) {
						keys.push(key);
					}
				}

				for (let key of keys) {
					state.colors.delete(key as MapLocation);
				}
				return state;
			}),
		filterColors: () =>
			update((state) => {
				for (let [id, color] of state.colors) {
					if (color === state.dbg) state.colors.delete(id);
				}
				return state;
			}),
		updateBackgroundAt: (sectionIndex: number, index: number, emoji: string) =>
			update((state) => {
				state.backgrounds.set(`${sectionIndex}_${index}`, emoji);
				return state;
			}),
		deleteBackgroundAt: (sectionIndex: number, index: number) =>
			update((state) => {
				state.backgrounds.delete(`${sectionIndex}_${index}`);
				return state;
			}),
		clearBackgrounds: (sectionIndex: number) => update((state) => {
			let keys = [];

			for (let key of state.backgrounds.keys()) {
				if (+key.split('_')[0] == sectionIndex) {
					keys.push(key);
				}
			}

			for (let key of keys) {
				state.items.delete(key as MapLocation);
			}
			return state;
		}),
		addEmoji: (sectionIndex: number, index: number, emoji: string) =>
			update((state) => {
				state.items.set(`${sectionIndex}_${index}`, emoji);
				return state;
			}),
		removeEmoji: (sectionIndex: number, index: number) =>
			update((state) => {
				state.items.delete(`${sectionIndex}_${index}`);
				return state;
			}),
		clearItems: (sectionIndex: number) =>
			update((state) => {
				let keys = [];

				for (let key of state.items.keys()) {
					if (+key.split('_')[0] == sectionIndex) {
						keys.push(key);
					}
				}

				for (let key of keys) {
					state.items.delete(key as MapLocation);
				}
				return state;
			}),
		clearAll: (sectionIndex: number) =>
			update((state) => {
				let keys = [];

				for (let key of state.items.keys()) {
					if (+key.split('_')[0] == sectionIndex) {
						keys.push(key);
					}
				}

				for (let key of keys) {
					state.items.delete(key as MapLocation);
				}

				keys = [];

				for (let key of state.colors.keys()) {
					if (+key.split('_')[0] == sectionIndex) {
						keys.push(key);
					}
				}

				for (let key of keys) {
					state.colors.delete(key as MapLocation);
				}

				keys = [];

				for (let key of state.backgrounds.keys()) {
					if (+key.split('_')[0] == sectionIndex) {
						keys.push(key);
					}
				}

				for (let key of keys) {
					state.backgrounds.delete(key as MapLocation);
				}
				return state;
			}),
		hasControllable: () => {
			let _hasControllable = false;

			update((state) => {
				let controllableEmojis = []
	
				for (let { emoji } of get(controllables).values()) {
					controllableEmojis.push(emoji)
				}
				
				for (let [key, val] of state.items.entries()) {
					if (state.ssi == +key.split("_")[0] && controllableEmojis.includes(val)) {
						_hasControllable = true;
						return state;
					}
				}
				
				return state;
			})

			return _hasControllable
		}
	};
}

interface ModalData {
	header: string;
	content: string;
	confirmText: string;
	onConfirm?: (arg?: string) => void | (() => void);
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
			const val = JSON.parse(localStorage.getItem(id + '_dt') as string);
			set(new Map(val) || new Map<number, Branch>());
			subscribe((state) => {
				localStorage.setItem(
					id + '_dt',
					JSON.stringify(Array.from(state.entries()))
				);
			});
		},
		add: (id: string) =>
			update((state) => {
				state.set(id, []);
				return state;
			}),
		removeChoice: (parentBranchName: string, choiceID: string) =>
			update((state) => {
				let length = state.get(parentBranchName)?.length 
				state.get(parentBranchName)[length - 1] = state.get(parentBranchName)?.at(-1).filter(({ next }) => next != choiceID);;
				state.delete(choiceID);
				if (typeof state.get(choiceID)?.at(-1) !== 'string') {
					// delete all related subbranches
					state.forEach((_, key) => {
						if (key.includes(choiceID)) {
							state.delete(key);
						}
					});
				}
				return state;
			}),
		remove: (id: string,) =>
			update((state) => {
				state.delete(id);
				if (typeof state.get(id)?.at(-1) !== 'string') {
					// delete all related subbranches
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
					let _state = state.get(id);
					_state?.splice(_state?.length - 1, 0, text);
				} else {
					// @ts-expect-error
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

				if (typeof branch?.at(-1) === 'string') {
					// @ts-expect-error
					branch?.push([choice]);
				} else {
					(branch?.at(-1) as Array<Choice>)?.push(choice);
				}

				return state;
			}),
	};
}

function createRecentlyUsed() {
	const { set, subscribe, update } = writable(new Set<string>())

	return {
		set,
		subscribe,
		update,
		useStorage: (id: string) => {
			const val = JSON.parse(localStorage.getItem(id + '_ru') as string);
			set(new Set(val) || new Set<string>());
			subscribe((state) => {
				localStorage.setItem(
					id + '_ru',
					JSON.stringify(Array.from(state.values()))
				);
			});
		},
		add: (emoji: string) => update((state) => {
			if (state.has(emoji)) {
				state.delete(emoji);
				state.add(emoji);
			} else {
				state.add(emoji);
			}

			if (state.size > 16) {
				for (let _emoji of state) {
					if (emoji != _emoji) {
						state.delete(_emoji);
						break;
					}
				}
			}

			return state;
		})
	}

}

export const showLoading = writable(false);
export const loadedEmojis = writable(false);
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

export type StringedNumber = `${number}`;

// MAPS
export const pushers = createMapStore<StringedNumber, Pusher>('pushers');
export const mergers = createMapStore<StringedNumber, Merger>('mergers');
export const effectors = createMapStore<StringedNumber | 'any', Effector>('effectors');
export const interactables = createMapStore<StringedNumber, Interactable>(
	'interactables'
);
export const sequencers = createMapStore<StringedNumber, Sequencer>(
	'sequencers'
);
export const controllables = createMapStore<StringedNumber, Controllable>(
	'controllables'
);
export const dialogueTree = createDialogueTree();

// USER
export const liked_game_ids: Writable<Set<string>> = writable(new Set());

// QUALITY OF LIFE
export const recentlyUsed = createRecentlyUsed();
