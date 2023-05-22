// EDITOR TYPES

export type CopyMode = 'Emoji' | 'Color' | 'Both';
export type EmojiMode = 'Foreground' | 'Background';

// GAME TYPES

import { DEFAULT_BG } from './constants';
import type { StringedNumber } from './store';

export type MapLocation = `${number}_${number}`;
export type CollisionType = 'bump' | 'push' | string;
export type Pusher = [string, string, CollisionType];
export type Merger = [string, string, CollisionType];
export type Inventory = Map<number, Effector>;

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

export interface Entity {
	emoji: string;
	inventory?: Inventory;
	hp?: HP;
}

export class Entity {
	constructor(emoji: string, inventory?: Inventory, hpPoints?: number) {
		this.emoji = emoji;
		if (inventory) {
			this.inventory = inventory;
		}

		if (hpPoints) {
			this.hp = new HP(hpPoints);
		}
	}
}

export interface Effector {
	emoji: string;
	hp: number | 'Infinite';
	// speed: number;
	// range: number;
	// type: 'equippable' | 'collidable'
	// could be higher in z-index, and be stored in a different Map
}

export class Effector {
	constructor(emoji: string, hp: number | 'Infinite') {
		this.emoji = emoji;
		this.hp = hp;
	}
}

export interface _Effectors {
	[key: string]: Effector;
}

interface _InteractableSideEffects {
	[emoji: string]: SideEffect;
}

export interface _Interactable {
	id: string;
	sequenceID: StringedNumber;
	points: number;
	hp: number;
	sideEffects: _InteractableSideEffects;
	evolve: Evolve;
	devolve: Devolve;
	drops: _Drops;
}

export interface _Interactables {
	[key: string]: _Interactable;
}

interface _ControllableSideEffects {
	[emoji: string]: number | 'Infinite';
}

export interface _Controllable {
	id: string;
	emoji: string;
	hp: number;
	sideEffects: _ControllableSideEffects;
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

export interface Actions {
	paint(
		{ index, background }: { index: number; background: string },
		_start?: number
	): void;
	erase({ index }: { index: number }): void;
	spawn(
		{ index, emoji }: { index: number; emoji: string },
		_start?: number
	): void;
	// spawnRTP(
	// 	{ index, emoji }: { index: number; emoji: string },
	// 	_start?: number
	// ): void;
	destroy({ index }: { index: number }): void;
	reset: Function;
	complete: Function;
	// addquest
}

interface Quest {
	status: "completed" | "failed" | "in progress"
	title: string
	description: string
	type: string
	checker: Function
}

// quests
// collect 5 stars
// dialogues will also trigger stuff
// dialogues will branch based on quests

export interface EditableMap {
	/**
	 * starting section index
	 */
	ssi: number;
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
		this.ssi = 0;
		this.items = items;
		this.colors = colors;
		this.backgrounds = backgrounds;
		this.dbg = dbg;
	}
}

export interface Sequencer {
	name: string;
	sequence: Array<SequenceItem>;
}

export class Sequencer {
	constructor(name: string, sequence: Array<SequenceItem>) {
		this.name = name;
		this.sequence = sequence;
	}
}

export interface SequenceItem {
	type: keyof Actions;
	index: number;
	background: string;
	duration: number;
	points: number;
	emoji: string;
}

export class SequenceItem {
	constructor(
		type: keyof Actions,
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
	to: string;
	at: number;
}

export class Evolve {
	constructor(to: string, at: number) {
		this.to = to;
		this.at = at;
	}
}

export interface Devolve {
	to: string;
}

export class Devolve {
	constructor(to: string) {
		this.to = to;
	}
}

export type Drops = [id: StringedNumber, amount: number];
export type _Drops = [id: string, amount: number];

export type SideEffect = number | 'talk' | 'trigger';

export interface Interactable {
	emoji: string;
	sequenceID: StringedNumber;
	hp: number;
	sideEffects: Array<[StringedNumber | 'any', SideEffect]>;
	evolve: Evolve;
	devolve: Devolve;
	drops: Drops;
}

export class Interactable {
	constructor(
		emoji: string,
		sequenceID: StringedNumber,
		hp: number,
		sideEffects: Array<[StringedNumber | 'any', SideEffect]>,
		evolve: Evolve,
		devolve: Devolve,
		drops: Drops
	) {
		this.emoji = emoji;
		this.sequenceID = sequenceID;
		this.hp = hp;
		this.sideEffects = sideEffects;
		this.evolve = evolve;
		this.devolve = devolve;
		this.drops = drops;
	}
}

export interface Controllable {
	emoji: string;
	hp: number;
	sideEffects: Array<['any' | StringedNumber, number]>;
	evolve: Evolve;
	devolve: Devolve;
}

export class Controllable {
	constructor(
		emoji: string,
		hp: number,
		sideEffects: Array<['any' | StringedNumber, number]>,
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
