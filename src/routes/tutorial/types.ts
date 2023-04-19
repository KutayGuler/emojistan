import type { Rulebox } from '$src/lib';
import type { StringedNumber } from '$src/store';
import type {
	Branch,
	EditableMap,
	Pusher,
	Merger,
	Interactable,
	Controllable,
	Effector,
} from '$src/types';
import type { ComponentType } from 'svelte';

export interface GameProps {
	dt?: Map<string, Branch>;
	map?: EditableMap;
	pushers?: Map<StringedNumber, Pusher>;
	mergers?: Map<StringedNumber, Merger>;
	interactables?: Map<StringedNumber, Interactable>;
	controllables?: Map<StringedNumber, Controllable>;
	effectors?: Map<StringedNumber, Effector>;
	mapClass?: string;
	SIZE?: number;
	showHP?: boolean;
	showInventory?: boolean;
}

export interface TutorialProps {
	header?: string;
	description: string;
	component: ComponentType;
	rbx: Rulebox;
	props: object;
	gameProps: GameProps;
	veilHeight?: number;
}
