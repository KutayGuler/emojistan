import type { Rulebox } from '$src/lib';
import type { StringedNumber } from '$src/store';
import type {
	Branch,
	EditableMap,
	Pusher,
	Merger,
	Interactable as TInteractable,
	Controllable as TControllable,
	Effector as TEffector,
} from '$src/types';
import type { ComponentType } from 'svelte';
import type { ComponentProps, SvelteComponent } from 'svelte/internal';

export interface GameProps {
	dt?: Map<string, Branch>;
	map?: EditableMap;
	pushers?: Map<StringedNumber, Pusher>;
	mergers?: Map<StringedNumber, Merger>;
	interactables?: Map<StringedNumber, TInteractable>;
	controllables?: Map<StringedNumber, TControllable>;
	effectors?: Map<StringedNumber, TEffector>;
	mapClass?: string;
	SIZE?: number;
	showHP?: boolean;
	showInventory?: boolean;
}

export interface TutorialProps<T extends SvelteComponent> {
	header?: string;
	description: string;
	component: ComponentType;
	rbx: Rulebox;
	props: ComponentProps<T>;
	gameProps: GameProps;
	veilHeight?: number;
}
