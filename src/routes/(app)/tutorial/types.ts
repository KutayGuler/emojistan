import type { Rulebox } from '$src/lib';
import type { ComponentType } from 'svelte';
import type { ComponentProps, SvelteComponent } from 'svelte/internal';
import type Game from '../../../views/Game.svelte';

export interface TutorialProps<T extends SvelteComponent> {
	header?: string;
	description?: string;
	component: ComponentType;
	rbx: Rulebox;
	props: ComponentProps<T>;
	gameProps: ComponentProps<Game>;
	veilHeight?: number;
	veilColor?: string;
}
