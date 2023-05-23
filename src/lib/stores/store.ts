import { writable, get } from 'svelte/store';
import { Rulebox, type RuleboxType } from '../types/types';
import type { StringedNumber } from '$src/store';

function createRuleboxes() {
	const arr: Array<Rulebox> = [];
	const { set, subscribe, update } = writable(arr);

	return {
		set,
		subscribe,
		update,
		useStorage: (id: string) => {
			const val = JSON.parse(localStorage.getItem(id + '_rbxs') as string);

			set(val || []);
			subscribe((state) => {
				localStorage.setItem(id + '_rbxs', JSON.stringify(Array.from(state)));
			});
		},

		spawn(
			component: RuleboxType,
			position: { x: number; y: number }
		): StringedNumber {
			let id: StringedNumber = '-1';

			update((state) => {
				state = state.filter((rbx) => rbx.type != 'ctxMenu');
				id = `${Math.max(...state.map((rbx) => +rbx.id), 0) + 1}`;
				state.push(new Rulebox(id, component, position));
				return state;
			});

			return id;
		},
		remove: (id: string) =>
			update((state) => {
				state = state.filter((rbx) => rbx.id != id);
				return state;
			}),
		removeCtxMenu: () =>
			update((state) => {
				state = state.filter((rbx) => rbx.type != 'ctxMenu');
				return state;
			}),
		adjustHeight: (id: string, sequenceLength: number, defaultHeight: number) =>
			update((state) => {
				for (let rbx of state) {
					if (rbx.id === id) {
						rbx.height = defaultHeight + sequenceLength * 56;
						break;
					}
				}
				return state;
			}),
	};
}

export const backgroundStore = writable(true);
export const movementStore = writable(true);
export const rbxSelected = writable(false);
export const rbxIdSelected = writable('-1');
export const d3Scale = writable(1);
export const rbxStore = createRuleboxes();

export const onMouseMove = (e: any, rbxID: string) => {
	rbxStore.update((rbx) => {
		rbx.forEach((rbx: Rulebox) => {
			if (rbx.id === rbxID) {
				//retrieve d3Scale value from store
				const scale = get(d3Scale);
				// divide the movement value by scale to keep it proportional to d3Zoom transformations
				rbx.position.x += e.movementX / scale;
				rbx.position.y += e.movementY / scale;
			}
		});
		return [...rbx];
	});
};

// if the user clicks a rbx without moving it, this function fires allowing a user to invoke the callback function
export const onRuleboxClick = (e: any, rbxID: string) => {
	get(rbxStore).forEach((rbx) => {
		if (rbx.id === get(rbxIdSelected)) {
			rbx.clickCallback?.(rbx);
		}
	});
};
