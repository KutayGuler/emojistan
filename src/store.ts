import { page } from '$app/stores'
import { writable, get, type Writable } from 'svelte/store'
import { DEFAULT_BG, storeNames } from './constants'

import {
	Choice,
	Consumable,
	EditableMap,
	Equippable,
	type Interactable,
	type Merger,
	type Pusher,
} from './types'

function createMapStore<K, V>(name: string) {
	const { set, subscribe, update } = writable(new Map<K, V>())

	return {
		set,
		subscribe,
		useStorage: (id: string) => {
			const val = JSON.parse(localStorage.getItem(id + '_' + name) as string)
			set(new Map(val) || new Map<number, V>())
			subscribe((state) => {
				localStorage.setItem(
					id + '_' + name,
					JSON.stringify(Array.from(state.entries()))
				)
			})
		},
		add: (id: K, value: V) =>
			update((state) => {
				state.set(id, value)
				return state
			}),
		update: (id: K, value: V) =>
			update((state) => {
				state.set(id, value)
				return state
			}),
		remove: (id: K) =>
			update((state) => {
				state.delete(id)
				return state
			}),
	}
}

function createSaves() {
	const { set, subscribe, update } = writable({
		saves: new Map<string, string>(),
		currentSaveID: '',
		currentSaveName: '',
		loaded: false,
	})

	// if logged in, save on server
	// if not, save on localstorage

	return {
		set,
		subscribe,
		useStorage: () => {
			const currentSaveID = localStorage.getItem('currentSaveID')
			const saves = JSON.parse(localStorage.getItem('saves') as string)

			if (
				get(page).routeId == 'editor' &&
				(currentSaveID == '' || currentSaveID == null)
			) {
				return false
			}

			let _saves = new Map<string, string>(saves) || new Map<string, string>()

			update((state) => {
				state.saves = _saves
				state.currentSaveID = currentSaveID || ''
				state.currentSaveName = _saves.get(currentSaveID || '') || ''
				state.loaded = true

				return state
			})

			subscribe((state) => {
				localStorage.setItem(
					'saves',
					JSON.stringify(Array.from(state.saves.entries()))
				)
				localStorage.setItem('currentSaveID', state.currentSaveID)
			})

			return true
		},
		rename: (id: string, title: string) =>
			update((state) => {
				state.saves.set(id, title)
				return state
			}),
		add: (name: string) =>
			update((state) => {
				let id = (Math.random() + 1).toString(36).substring(7)
				state.currentSaveID = id
				state.currentSaveName = name
				state.saves.set(id, name)
				return state
			}),
		delete: (id: string) =>
			update((state) => {
				for (let store of storeNames) {
					localStorage.removeItem(id + '_' + store)
				}
				state.currentSaveID = ''
				state.saves.delete(id)
				return state
			}),
	}
}

function createEditableMap() {
	const { set, subscribe, update } = writable(new EditableMap())

	return {
		set,
		subscribe,
		useStorage: (id: string) => {
			const dbg = localStorage.getItem(id + '_dbg') || DEFAULT_BG
			const items = JSON.parse(localStorage.getItem(id + '_items') as string)
			const backgrounds = JSON.parse(
				localStorage.getItem(id + '_backgrounds') as string
			)

			update((state) => {
				state.items = new Map(items) || new Map()
				state.backgrounds = new Map(backgrounds) || new Map()
				state.dbg = dbg || ''
				return state
			})

			subscribe((state) => {
				localStorage.setItem(
					id + '_items',
					JSON.stringify(Array.from(state.items.entries()))
				)
				localStorage.setItem(
					id + '_backgrounds',
					JSON.stringify(Array.from(state.backgrounds.entries()))
				)
				localStorage.setItem(id + '_dbg', state.dbg)
			})
		},
		updateDbg: (color: string) =>
			update((state) => {
				state.dbg = color
				return state
			}),
		updateBackground: (index: number, color: string) =>
			update((state) => {
				state.backgrounds.set(index, color)
				return state
			}),
		deleteBackground: (index: number) =>
			update((state) => {
				state.backgrounds.delete(index)
				return state
			}),
		clearBackgrounds: () =>
			update((state) => {
				state.backgrounds.clear()
				return state
			}),

		filterBackgrounds: () =>
			update((state) => {
				for (let [id, color] of state.backgrounds) {
					if (color == state.dbg) state.backgrounds.delete(id)
				}
				return state
			}),
		addEmoji: (index: number, emoji: string) =>
			update((state) => {
				state.items.set(index, emoji)
				return state
			}),
		removeEmoji: (index: number) =>
			update((state) => {
				state.items.delete(index)
				return state
			}),
		clearItems: () =>
			update((state) => {
				state.items.clear()
				return state
			}),
		clearAll: () =>
			update((state) => {
				state.backgrounds.clear()
				state.items.clear()
				return state
			}),
	}
}

function createSetStore(name: string) {
	const { set, subscribe, update } = writable(new Set<string>())

	return {
		set,
		subscribe,
		useStorage: (id: string) => {
			const val = JSON.parse(localStorage.getItem(id + '_' + name) as string)
			set(new Set<string>(Array.from(val || [])))
			subscribe((state) => {
				localStorage.setItem(id + '_' + name, JSON.stringify(Array.from(state)))
			})
		},
		add: (value: string) =>
			value != '' &&
			update((state) => {
				state.add(value)

				return state
			}),
		remove: (value: string) =>
			value != '' &&
			update((state) => {
				state.delete(value)
				return state
			}),
	}
}

// VANILLA
export const currentColor = writable('')
export const currentEmoji = writable('')

// CUSTOM
export const saves = createSaves()
export const map = createEditableMap()

// SETS
export const statics = createSetStore('statics')

// MAPS
export const pushers = createMapStore<number, Pusher>('pushers')
export const mergers = createMapStore<number, Merger>('mergers')
export const consumables = createMapStore<number, Consumable>('consumables')
export const equippables = createMapStore<number, Equippable>('equippables')
export const interactables = createMapStore<number, Interactable>(
	'interactables'
)
export const dialogueTree = createMapStore<string, Array<string | Choice>>(
	'dialogue'
)
