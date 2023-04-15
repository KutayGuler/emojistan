// EDITOR TYPES

export type CopyMode = 'Emoji' | 'Color' | 'Both';
export type EmojiMode = 'Foreground' | 'Background';

// GAME TYPES

import { DEFAULT_BG } from './constants';

export type CollisionType = 'bump' | 'push' | string;
export type Pusher = [string, string, CollisionType];
export type Merger = [string, string, CollisionType];

export interface HP {
	current: number;
	max: number;
	add(points: number): void;
}

export class HP {
	constructor(points: number) {
		this.current = points;
		this.max = points;
	}

	add(points: number) {
		this.current += points;
		if (this.current > this.max) {
			this.max = this.current;
		}
	}
}

export interface Item {
	emoji: string;
	inventory: Map<number, Equippable | Consumable>;
	hp: HP;
}

export class Item {
	constructor(
		emoji: string,
		inventory: Map<number, Equippable | Consumable> = new Map<
			number,
			Equippable | Consumable
		>(),
		hpPoints: number = 1
	) {
		this.emoji = emoji;
		this.inventory = inventory;
		this.hp = new HP(hpPoints);
	}
}

export interface Equippable {
	emoji: string;
	hp: number;
}

export class Equippable {
	constructor(emoji: string, hp: number) {
		this.emoji = emoji;
		this.hp = hp; // hp of item itself
	}
}

export interface _Equippables {
	[key: string]: Equippable;
}

export interface Consumable {
	emoji: string;
	hp: number; // side effect
	mutateConsumerTo: string;
}

export class Consumable {
	constructor(emoji: string, hp: number, mutateConsumerTo = '') {
		this.emoji = emoji;
		this.hp = hp;
		this.mutateConsumerTo = mutateConsumerTo;
	}
}

export interface _Consumables {
	[key: string]: Consumable;
}

export interface _Interactable {
	id: string;
	sequence: Array<SequenceItem>;
	points: number;
	hp: number;
	sideEffects: Array<[string, number | 'talk']>;
	evolve: Evolve;
	devolve: Devolve;
}

export interface _Interactables {
	[key: string]: _Interactable;
}

export interface _Controllable {
	id: string;
	emoji: string;
	hp: number;
	sideEffects: Array<[string, number]>;
	evolve: Evolve;
	devolve: Devolve;
}

export interface _Controllables {
	[key: string]: _Controllable;
}

export interface _Collisions {
	[key1: string]: {
		[key2: string]: CollisionType;
	};
}

export interface Mutations {
	paint(
		{ index, background }: { index: number; background: string },
		_start?: number
	): void;
	erase({ index }: { index: number }): void;
	spawn(
		{ index, emoji }: { index: number; emoji: string },
		_start?: number
	): void;
	destroy({ index }: { index: number }): void;
	dropEquippable({ emoji }: { emoji: string }): void;
	resetLevel: Function;
	completeLevel: Function;
}

export interface EditableMap {
	startingSectionIndex: number;
	items: Map<string, string>;
	colors: Map<string, string>;
	backgrounds: Map<string, string>;
	dbg: string;
}

export class EditableMap {
	constructor(
		items = new Map<string, string>(),
		colors = new Map<string, string>(),
		backgrounds = new Map<string, string>(),
		dbg = DEFAULT_BG
	) {
		this.startingSectionIndex = 0;
		this.items = items;
		this.colors = colors;
		this.backgrounds = backgrounds;
		this.dbg = dbg;
	}
}

export interface SequenceItem {
	type: keyof Mutations;
	index: number;
	background: string;
	duration: number;
	points: number;
	emoji: string;
}

export class SequenceItem {
	constructor(
		type: keyof Mutations,
		index: number,
		background: string,
		duration: number,
		points: number,
		emoji: string
	) {
		this.type = type;
		this.index = index;
		this.background = background;
		this.duration = duration;
		this.points = points;
		this.emoji = emoji;
	}
}

export interface Evolve {
	enabled: boolean;
	to: string;
	at: number;
}

export class Evolve {
	constructor(enabled: boolean, to: string, at: number) {
		this.enabled = enabled;
		this.to = to;
		this.at = at;
	}
}

export interface Devolve {
	enabled: boolean;
	to: string;
}

export class Devolve {
	constructor(enabled: boolean, to: string) {
		this.enabled = enabled;
		this.to = to;
	}
}

export interface Interactable {
	emoji: string;
	sequence: Array<SequenceItem>;
	points: number;
	hp: number;
	sideEffects: Array<[string | 'any', number | 'talk']>;
	evolve: Evolve;
	devolve: Devolve;
}

export class Interactable {
	constructor(
		emoji: string,
		sequence: Array<SequenceItem>,
		hp: number,
		points: number,
		sideEffects: Array<[string | 'any', number | 'talk']>,
		evolve: Evolve,
		devolve: Devolve
	) {
		this.emoji = emoji;
		this.sequence = sequence;
		this.hp = hp;
		this.points = points; // TODO: figure out what the fuck is this
		this.sideEffects = sideEffects;
		this.evolve = evolve;
		this.devolve = devolve;
	}
}

export interface Controllable {
	emoji: string;
	hp: number;
	sideEffects: Array<[string, number]>;
	evolve: Evolve;
	devolve: Devolve;
}

export class Controllable {
	constructor(
		emoji: string,
		hp: number,
		sideEffects: Array<[string, number]>,
		evolve: Evolve,
		devolve: Devolve
	) {
		this.emoji = emoji;
		this.hp = hp;
		this.sideEffects = sideEffects;
		this.evolve = evolve;
		this.devolve = devolve;
	}
}

export type Branch =
	| []
	| [...texts: Array<string>, lastItem: Array<Choice> | string];

export interface Choice {
	label: string;
	text: string;
	next: string;
}

export class Choice {
	constructor(label: string, text: string, next: string) {
		this.label = label;
		this.text = text;
		this.next = next;
	}
}

export type Wasd = 'KeyW' | 'KeyA' | 'KeyS' | 'KeyD';
export type ArrowKey = 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown';

export type SkinTone =
	| '-light-skin-tone'
	| '-medium-light-skin-tone'
	| '-medium-skin-tone'
	| '-medium-dark-skin-tone'
	| '-dark-skin-tone'
	| '';
