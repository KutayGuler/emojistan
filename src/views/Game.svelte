<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { createEventDispatcher, onMount } from 'svelte/internal';
	import { currentColor, currentEmoji, modal } from '../store';
	import {
		DEFAULT_MAP_CLASS,
		DEFAULT_SIDE_LENGTH,
		MAX_INVENTORY_SIZE,
	} from '$src/constants';
	import {
		Effector,
		Interactable,
		Entity,
		Controllable,
		HP,
		EditableMap,
		Sequencer,
		type ArrowKey,
		type CollisionType,
		type SequenceActions,
		type Wasd,
		type _Collisions,
		type _Interactable,
		type _Interactables,
		type _Effectors,
		type Pusher,
		type Merger,
		type Branch,
		type _Controllable,
		type _Controllables,
		type Inventory,
		type MapLocation,
	} from '$src/types';
	// import { AStarFinder } from 'astar-typescript';
	import Chat from './Chat.svelte';

	/* ## DATA ## */
	export let dt = new Map<string, Branch>(); // dialogue tree
	export let map = new EditableMap(new Map<MapLocation, string>());
	export let pushers = new Map<string, Pusher>();
	export let mergers = new Map<string, Merger>();
	export let interactables = new Map<string, Interactable>();
	export let controllables = new Map<string, Controllable>();
	export let effectors = new Map<string, Effector>();
	export let sequencers = new Map<string, Sequencer>();
	export let mapClass = DEFAULT_MAP_CLASS;
	export let SIZE = DEFAULT_SIDE_LENGTH;
	export let showHP = true;
	export let showInventory = true;
	let collideables = new Map<MapLocation, Effector>();

	/* ## STATE ## */
	let levelCompleted = false;
	let ac = -2; // ACTIVE CELL
	let ic: number; // INTERACTED CELL
	let currentSection = map.ssi;
	let directionKey: Wasd = 'KeyD';
	let currentInventoryIndex = 0;
	let entities = new Map<string, Entity | Effector>();
	let colors = new Map(map.colors);
	let backgrounds = new Map(map.backgrounds);
	let _interactables: _Interactables = {};
	let _controllables: _Controllables = {};
	let _effectors: _Effectors = {};

	for (let [id, controllable] of structuredClone(controllables)) {
		const { emoji, sideEffects, ...args } = controllable;
		if (emoji === '') continue;
		_controllables[emoji] = {} as _Controllable;
		Object.assign(_controllables[emoji], args);
		_controllables[emoji].id = id;
		_controllables[emoji].sideEffects = {};

		for (let [id, effect] of sideEffects) {
			let effector = structuredClone(effectors.get(id));
			if (!effector) continue;
			_controllables[emoji].sideEffects[effector.emoji] = effect;
		}
	}

	for (let [id, effector] of effectors) {
		const { emoji, ...args } = effector;
		if (!emoji) continue;
		_effectors[emoji] = {} as Effector;
		Object.assign(_effectors[emoji], args);
	}

	for (let [id, interactable] of structuredClone(interactables)) {
		const { emoji, sideEffects, ...args } = interactable;
		if (!emoji || !sideEffects) continue;
		_interactables[emoji] = {} as _Interactable;
		Object.assign(_interactables[emoji], args);
		_interactables[emoji].id = id;
		_interactables[emoji].sideEffects = {};

		for (let [id, effect, triggerID] of sideEffects) {
			if (effect == 'trigger') {
				let sequencer = structuredClone(sequencers.get(triggerID));
				effect = sequencer?.sequence || [];
			}

			if (id === 'any') {
				_interactables[emoji].sideEffects.any = effect;
				continue;
			}

			let effector = structuredClone(effectors.get(id));
			if (!effector) continue;
			_interactables[emoji].sideEffects[effector.emoji] = effect;
		}

		const dropsID = _interactables[emoji].drops[0];
		if (dropsID) {
			_interactables[emoji].drops[0] = effectors.get(dropsID)?.emoji || '';
		}
	}

	/* ## DIALOGUE ## */
	let character = '';
	let dialogueID = '';
	let handDirection = '';

	onMount(() => {
		[$currentColor, $currentEmoji] = ['', ''];
	});

	let enemyIndexes: Array<number> = [];

	const dispatch = createEventDispatcher();
	const keys: {
		[key in Wasd]: { emoji: string; operation: number };
	} = {
		KeyW: { emoji: 'up-arrow', operation: -SIZE },
		KeyA: { emoji: 'left-arrow', operation: -1 },
		KeyS: { emoji: 'down-arrow', operation: SIZE },
		KeyD: { emoji: 'right-arrow', operation: 1 },
	};

	const wasd = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

	const wasdToArrow: { [key in Wasd]: ArrowKey } = {
		KeyW: 'ArrowUp',
		KeyA: 'ArrowLeft',
		KeyD: 'ArrowRight',
		KeyS: 'ArrowDown',
	};

	function changeSection(acSideEffect: number, sectionSideEffect: number) {
		let _id = currentSection + '_' + ac;
		let playerData = entities.get(_id) as Entity;
		entities.delete(_id);
		currentSection += sectionSideEffect;
		ic += acSideEffect;
		ac += acSideEffect;
		entities.set(currentSection + '_' + ac, playerData);
		entities = entities;
	}

	const calcOperation =
		SIZE == 4
			? (code: ArrowKey, index: number) => {
					if (code === 'ArrowLeft' && index % SIZE === 0) return 0;
					if (code === 'ArrowUp' && index < SIZE) return 0;
					if (code === 'ArrowRight' && (index + 1) % SIZE === 0) return 0;
					if (code === 'ArrowDown' && index >= SIZE * SIZE - SIZE) return 0;

					switch (code) {
						case 'ArrowUp':
							return -SIZE;
						case 'ArrowRight':
							return 1;
						case 'ArrowDown':
							return SIZE;
						case 'ArrowLeft':
							return -1;
					}
			  }
			: (code: ArrowKey, index: number) => {
					if (code === 'ArrowLeft' && index % SIZE === 0) {
						if (
							currentSection % SIZE != 0 &&
							!entities.has(currentSection - 1 + '_' + (ac + SIZE - 1))
						) {
							changeSection(SIZE - 1, -1);
						}
						return 0;
					}
					if (code === 'ArrowUp' && index < SIZE) {
						if (
							currentSection >= SIZE &&
							!entities.has(
								currentSection - SIZE + '_' + (ac + SIZE * (SIZE - 1))
							)
						) {
							changeSection(SIZE * (SIZE - 1), -SIZE);
						}
						return 0;
					}
					if (code === 'ArrowRight' && (index + 1) % SIZE === 0) {
						if (
							(currentSection + 1) % SIZE != 0 &&
							!entities.has(currentSection + 1 + '_' + (ac - SIZE + 1))
						) {
							changeSection(-(SIZE - 1), 1);
						}
						return 0;
					}
					if (code === 'ArrowDown' && index >= SIZE * SIZE - SIZE) {
						if (
							currentSection < SIZE * SIZE - SIZE &&
							!entities.has(
								currentSection + SIZE + '_' + (ac - SIZE * (SIZE - 1))
							)
						) {
							changeSection(-(SIZE * (SIZE - 1)), SIZE);
						}
						return 0;
					}
					return (
						(['ArrowUp', 'ArrowDown'].includes(code) ? SIZE : 1) *
						(['ArrowRight', 'ArrowDown'].includes(code) ? 1 : -1)
					);
			  };

	/**
	 * function mutates ac if it is equal to "from" parameter
	 * Transfers an item from "from" to "to"
	 */
	function transferItem(from: number, to: number) {
		let _to = currentSection + '_' + to;
		let _from = currentSection + '_' + from;
		entities.set(_to, entities.get(_from) as Effector | Entity);
		entities.delete(_from);
		entities = entities; // MAGIC UPDATE, NECESSARY FOR REACTIVITY

		if (ac === from) {
			ac = to;
			ic = ac + keys[directionKey].operation;
		}
	}

	function deleteFromInventory(index: number) {
		player.inventory.delete(index);
		player.inventory = player.inventory;
	}

	function addToInventory(items: Array<Effector>) {
		let emptyIndexes = [];

		for (let i = 0; i < MAX_INVENTORY_SIZE; i++) {
			if (!player.inventory.get(i)) {
				emptyIndexes.push(i);
			}
		}

		for (let i = 0; i < emptyIndexes.length; i++) {
			if (items[i]) {
				player.inventory.set(emptyIndexes[i], items[i]);
			}
		}

		player.inventory = player.inventory;
	}

	/**
	 * function mutates ac if it is equal to "from" parameter
	 * Transfers an item from "from" to "to" and applies mergeResult
	 */
	function transferAndMerge(fromID: number, toID: number, mergeResult: string) {
		let _fromID = currentSection + '_' + fromID;
		let _toID = currentSection + '_' + toID;

		let from = entities.get(_fromID) as Entity;
		let fromInventory: Inventory =
			from?.inventory || new Map<number, Effector>();
		let fromHP = from?.hp?.current || 1;
		let toInventory: Inventory =
			(entities.get(_toID) as Entity)?.inventory || new Map<number, Effector>();
		let mergedInventory = new Map([...fromInventory, ...toInventory]);
		while (mergedInventory.size > MAX_INVENTORY_SIZE) {
			mergedInventory.delete(mergedInventory.keys().next().value);
		}

		entities.set(
			_toID,
			new Entity(
				mergeResult,
				mergedInventory,
				_interactables[mergeResult]?.hp || fromHP
			)
		);
		entities.delete(_fromID);
		entities = entities; // MAGIC UPDATE, NECESSARY FOR REACTIVITY

		if (ac === fromID) {
			ac = toID;
			ic = ac + keys[directionKey].operation;
		}
	}

	function attemptPlayerEvolution() {
		if (player.hp.current <= 0) {
			let playerDevolve = _controllables[player?.emoji || '']?.devolve;

			if (playerDevolve.to !== '') {
				player.emoji = playerDevolve.to;
				player.hp.max = _controllables[playerDevolve.to]?.hp || 1;
				player.hp.current = player.hp.max;
				progress.set(calcPlayerHpPercentage());
				return;
			}

			modal.show({
				content: 'No players left.',
				header: 'Game Over',
				confirmText: 'REPLAY',
				// @ts-expect-error
				onConfirm: m.reset,
				input: false,
				danger: false,
			});
			return;
		}

		let playerEvolve = _controllables[player?.emoji || '']?.evolve;

		if (playerEvolve?.to !== '' && player.hp.current >= playerEvolve?.at) {
			player.emoji = playerEvolve.to;
			player.hp.max = _controllables[playerEvolve.to]?.hp || 1;
			player.hp.current = player.hp.max;
		}

		progress.set(calcPlayerHpPercentage());
	}

	// A-STAR
	// function coordinateToPosObj(num: number) {
	// 	return { x: num % SIZE, y: Math.floor(num / SIZE) };
	// }

	// A-STAR
	// function followPlayer(
	// 	startPos: { x: number; y: number },
	// 	goalPos: { x: number; y: number },
	// 	relativeIndex: number
	// ) {
	// 	let matrix: Array<Array<number>> = [];

	// 	for (let i = 0; i < SIZE; i++) {
	// 		matrix[i] = [];
	// 		for (let j = 0; j < SIZE; j++) {
	// 			let item = entities.get(currentSection + '_' + (SIZE * i + j));
	// 			if (item) {
	// 				if (_interactables[item.emoji]) {
	// 					matrix[i].push(0);
	// 				} else {
	// 					matrix[i].push(1);
	// 				}
	// 			} else {
	// 				matrix[i].push(0);
	// 			}
	// 		}
	// 	}

	// 	let astar: {
	// 		aStarInstance: AStarFinder;
	// 	} = {
	// 		aStarInstance: new AStarFinder({
	// 			grid: {
	// 				matrix,
	// 			},
	// 			diagonalAllowed: false,
	// 		}),
	// 	};

	// 	let pathway = astar.aStarInstance.findPath(startPos, goalPos);
	// 	pathway.slice(0, 2);

	// 	if (pathway?.length <= 1) return;

	// 	let from = pathway[0][1] * SIZE + pathway[0][0];
	// 	let to = pathway[1][1] * SIZE + pathway[1][0];

	// 	if (!entities.has(currentSection + '_' + to)) {
	// 		transferItem(from, to);
	// 		enemyIndexes[relativeIndex] = to;
	// 	}
	// }

	function initEntities() {
		for (let [id, _emoji] of map.items) {
			if (_effectors[_emoji]) {
				let { hp, type } = _effectors[_emoji];

				if (type == 'collideable' || type == 'both') {
					collideables.set(id, new Effector(_emoji, hp, type));
				} else {
					entities.set(id, new Effector(_emoji, hp, type));
				}
			} else if (_controllables[_emoji] || _interactables[_emoji]) {
				entities.set(id, new Entity(_emoji, new Map<number, Effector>(), 1));
			} else {
				entities.set(id, new Entity(_emoji));
			}
		}

		for (let [id, item] of entities) {
			if (item instanceof Effector) continue;
			if (
				ac === -2 &&
				+id.split('_')[0] === currentSection &&
				_controllables[item.emoji]
			) {
				ac = +id.split('_')[1];
				ic = ac + 1;
				directionKey = 'KeyD';

				if (item.hp) {
					item.hp.max = _controllables[item.emoji]?.hp || 1;
					item.hp.current = _controllables[item.emoji]?.hp || 1;
					return;
				}
			}

			if (item.hp) {
				item.hp.max = _interactables[item.emoji]?.hp || 1;
				item.hp.current = _interactables[item.emoji]?.hp || 1;
			}
		}
	}

	initEntities();

	interface ControllableEntity extends Entity {
		emoji: string;
		inventory: Inventory;
		hp: HP;
	}

	let player = entities.get(currentSection + '_' + ac) as ControllableEntity;
	$: player = entities.get(currentSection + '_' + ac) as ControllableEntity;

	let numbers = new Map<number, number>();

	for (let i = 0; i <= 100; i++) {
		numbers.set(i, i / 100);
	}

	function calcPlayerHpPercentage(): number {
		if (!player) return 0;
		let { hp } = player;

		if (!hp) return 0;
		if (hp.current > hp.max) return 1;
		return numbers.get(Math.floor((hp.current * 100) / hp.max)) || 0;
	}

	let progress = tweened(calcPlayerHpPercentage(), {
		duration: 200,
		easing: cubicOut,
	});

	let _collisions: _Collisions = {};

	for (let [id, _slots] of [...mergers, ...pushers]) {
		let [key1, key2, val] = _slots;
		if (key1 === '') continue;
		if (!_collisions[key1]) {
			_collisions[key1] = {};
		}

		_collisions[key1][key2] = val;

		// making emoji merge both ways
		if (val != 'push' && key1 != key2) {
			if (!_collisions[key2]) {
				_collisions[key2] = {};
			}

			_collisions[key2][key1] = val;
		}
	}

	// Actions
	const m: SequenceActions = {
		paint({ index, background }) {
			colors.set(`${currentSection}_${index}`, background);
			colors = colors;
		},
		erase({ index }) {
			colors.delete(`${currentSection}_${index}`);
		},
		spawn({ index, emoji }) {
			entities.set(currentSection + '_' + index, new Entity(emoji));
			entities = entities;
		},
		// spawnRTP({ index, emoji }) {
		// 	// entities.set(currentSection + '_' + index, new Entity(emoji));
		// 	// entities = entities;
		// },
		destroy({ index }) {
			entities.delete(currentSection + '_' + index);
		},
		reset: () => {
			entities.clear();
			colors = new Map(map.colors);
			ac = -2;
			initEntities();
			entities = entities;
			levelCompleted = false;
		},
		drop: () => {
			// TODO
		},
		complete: () => (levelCompleted = true),
	};

	function getCollisionType(key1: string, key2: string): CollisionType {
		if (!_collisions[key1]) return 'bump';
		return _collisions[key1][key2] || 'bump';
	}

	function enactPushCollision(operation: number) {
		let collisionChain = [];
		let i = 0;

		while (entities.has(currentSection + '_' + (ac + operation * i))) {
			collisionChain.push(
				entities.get(currentSection + '_' + (ac + operation * i))?.emoji
			);
			i++;
		}

		let collisionTypeSequence: Array<CollisionType> = [];
		for (let i = 0; i < collisionChain.length - 1; i++) {
			collisionTypeSequence.push(
				getCollisionType(
					collisionChain[i] as CollisionType,
					collisionChain[i + 1] as CollisionType
				)
			);
		}

		let finalIndex = ac + operation * (i - 1);
		let code = '';

		switch (operation) {
			case 1:
				code = 'ArrowRight';
				break;
			case -1:
				code = 'ArrowLeft';
				break;
			case SIZE:
				code = 'ArrowDown';
				break;
			case -SIZE:
				code = 'ArrowUp';
				break;
		}

		if (calcOperation(code as ArrowKey, finalIndex) === 0) return;

		if (collisionTypeSequence.every((str) => str === 'push')) {
			let length = collisionChain.length;
			collisionChain.reverse();

			for (let i = length - 1; i >= 0; i--) {
				let from = ac + i * operation;
				let to = ac + (i + 1) * operation;
				transferItem(from, to);
			}
		} else {
			if (collisionTypeSequence.includes('bump')) {
				collisionTypeSequence = collisionTypeSequence.slice(
					0,
					collisionTypeSequence.findIndex((str) => str === 'bump')
				);
			} else {
				collisionTypeSequence = collisionTypeSequence.slice(
					0,
					collisionTypeSequence.findIndex((str) => str != 'push') + 1
				);
			}

			if (
				collisionTypeSequence.length === 0 ||
				collisionTypeSequence.at(-1) === 'push'
			)
				return;

			for (let i = collisionTypeSequence.length - 1; i >= 0; i--) {
				let from = ac + i * operation;
				let to = ac + (i + 1) * operation;

				if (collisionTypeSequence[i] != 'push') {
					transferAndMerge(from, to, collisionTypeSequence[i]);
				} else {
					transferItem(from, to);
				}
			}
		}
	}

	let chatting = false;

	function getHandDirection(operation: number) {
		switch (operation) {
			case -1:
				return 'left';
			case 1:
				return 'right';
			case SIZE:
				return 'down';
			case -SIZE:
				return 'up';
			default:
				return '';
		}
	}

	async function handle(
		e: KeyboardEvent | { code: ArrowKey | 'Space' | `Digit${string}` | Wasd }
	) {
		// e.preventDefault();
		console.log(e.code);
		handDirection = '';
		if (
			!entities.has(currentSection + '_' + ac) ||
			(player?.hp?.current || -1) <= 0 ||
			chatting
		) {
			return;
		}

		if (e.code.includes('Arrow')) {
			let operation = calcOperation(e.code as ArrowKey, ac);
			if (!player || operation === 0 || !_controllables[player.emoji]) return;
			let facingItem = entities.get(currentSection + '_' + (ac + operation));

			if (!facingItem) {
				transferItem(ac, ac + operation);

				// A-STAR
				// for (let i = 0; i < enemyIndexes.length; i++) {
				// 	followPlayer(
				// 		coordinateToPosObj(enemyIndexes[i]),
				// 		coordinateToPosObj(ac),
				// 		i
				// 	);
				// }

				let collideable = collideables.get(`${currentSection}_${ac}`);
				if (collideable) {
					let sideEffect =
						_controllables[player.emoji].sideEffects[collideable.emoji];
					if (!sideEffect || sideEffect === 0) {
						return;
					}

					player.hp.add(sideEffect);

					if (collideable.hp !== 'Infinite') {
						collideable.hp -= 1;
						if (collideable.hp <= 0) {
							collideables.delete(`${currentSection}_${ac}`);
							collideables = collideables;
						}
					}

					attemptPlayerEvolution();
				}

				return;
			}

			let collisionType = getCollisionType(player.emoji, facingItem.emoji);

			switch (collisionType) {
				case 'push':
					enactPushCollision(operation);
					break;
				case 'bump':
					break;
				default:
					transferAndMerge(ac, ac + operation, collisionType);
					break;
			}
			return;
		}

		if (e.code.includes('Digit')) {
			let digit = +e.code.replace('Digit', '');
			currentInventoryIndex =
				digit - 1 === currentInventoryIndex ? -1 : digit - 1;
			return;
		}

		if (wasd.includes(e.code)) {
			directionKey = e.code as Wasd;
			ic = ac + keys[directionKey].operation;
			return;
		}

		if (e.code === 'Space' && !chatting) {
			// required so that items are not overflowing from the map
			// (this comment was added before switching to larger world map)
			const operation = calcOperation(wasdToArrow[directionKey], ac);
			if (operation === 0) {
				return;
			}
			let interactedItem =
				entities.get(currentSection + '_' + ic) ||
				collideables.get(`${currentSection}_${ic}`);
			let pickedFromEntities = entities.has(currentSection + '_' + ic);

			if (interactedItem instanceof Effector) {
				if (player.inventory.size != MAX_INVENTORY_SIZE) {
					for (let i = 0; i < MAX_INVENTORY_SIZE; i++) {
						if (!player.inventory.get(i)) {
							player.inventory.set(i, interactedItem);
							player.inventory = player.inventory;
							break;
						}
					}

					if (pickedFromEntities) {
						entities.delete(currentSection + '_' + ic);
						entities = entities;
					} else {
						collideables.delete(`${currentSection}_${ic}`);
						collideables = collideables;
					}
				}
				return;
			}

			if (!interactedItem || !interactedItem.hp || !interactedItem.inventory) {
				return;
			}

			let _interactable: _Interactable = _interactables[interactedItem.emoji];

			if (!_interactable) return;

			let effectorItem =
				player.inventory?.get(currentInventoryIndex)?.emoji || 'any';

			let { id, evolve, sideEffects, devolve } = _interactable;
			const sideEffect = sideEffects[effectorItem];

			if (!sideEffect || sideEffect === 0) {
				return;
			} else if (sideEffect === 'talk') {
				dialogueID = id.toString();
				character = interactedItem.emoji;
				chatting = true;
				return;
			} else if (Array.isArray(sideEffect)) {
				for (let { type, ...args } of sideEffect) {
					m[type](args);
				}
				return;
			}

			interactedItem.hp.current += sideEffect;

			handDirection = getHandDirection(operation);
			let timeout = setTimeout(() => {
				handDirection = '';
				clearTimeout(timeout);
			}, 50);

			let equippedItem = player?.inventory.get(currentInventoryIndex) || 'any';

			if (equippedItem instanceof Effector && equippedItem.hp !== 'Infinite') {
				equippedItem.hp -= 1;
			}

			// if it's not "ANY"
			if (
				typeof equippedItem !== 'string' &&
				equippedItem instanceof Effector &&
				equippedItem.hp === 0
			) {
				deleteFromInventory(currentInventoryIndex);
			}

			// EVOLVE & DEVOLVE INTERACTED ITEM
			if (interactedItem.hp.current <= 0) {
				const _drops = _interactables[interactedItem.emoji].drops;

				if (_drops[0]) {
					const { hp, type } = _effectors[_drops[0]];
					addToInventory(
						new Array(_drops[1]).fill(new Effector(_drops[0], hp, type))
					);
				}

				if (devolve.to !== '') {
					interactedItem.emoji = devolve.to;
				} else {
					entities.delete(currentSection + '_' + ic);
				}
			} else if (evolve?.to !== '' && interactedItem.hp.current >= evolve.at) {
				interactedItem.emoji = evolve.to;
			}

			entities = entities;
			return;
		}

		if (e.code === 'KeyF') {
			let effectorItem = player.inventory.get(currentInventoryIndex);
			if (!(effectorItem instanceof Effector)) return;

			const sideEffect =
				_controllables[player.emoji].sideEffects[effectorItem.emoji];
			if (!sideEffect || sideEffect === 0) return;

			player.hp.add(sideEffect);

			if (effectorItem.hp !== 'Infinite') {
				effectorItem.hp -= 1;
				if (effectorItem.hp <= 0) {
					deleteFromInventory(currentInventoryIndex);
				}
			}

			attemptPlayerEvolution();
			return;
		}

		if (e.code.includes('Control')) {
			if (
				calcOperation(wasdToArrow[directionKey], ac) === 0 ||
				!player?.inventory.get(currentInventoryIndex) ||
				entities.has(currentSection + '_' + ic)
			) {
				return;
			}

			let droppedItem = player?.inventory.get(currentInventoryIndex);
			if (!droppedItem) return;

			if (droppedItem.type == 'equippable') {
				entities.set(currentSection + '_' + ic, droppedItem);
				deleteFromInventory(currentInventoryIndex);
				entities = entities;
			} else if (['collideable', 'both'].includes(droppedItem.type)) {
				collideables.set(`${currentSection}_${ic}`, droppedItem);
				deleteFromInventory(currentInventoryIndex);
				collideables = collideables;
			}

			return;
		}

		if (e.code === 'Escape') {
			dispatch('quit');
			return;
		}
	}
</script>

<svelte:window on:keydown={handle} />

<div class="relative flex h-full flex-col items-center justify-center">
	{#key ac}
		{#if ac != -2 && showHP}
			{@const playerHP = $progress * (player?.hp?.max || 1)}
			<div
				class="flex h-full w-64 flex-grow flex-row items-center justify-center"
			>
				<i class="twa z-10 text-base md:text-2xl twa-{player?.emoji}" />
				<progress
					title="Health Bar"
					class="progress h-4 md:h-8"
					value={$progress}
				/>
				<p class="absolute pl-6 text-xs md:text-base">
					{Number.isInteger(playerHP) ? playerHP : playerHP.toFixed(1)}
				</p>
			</div>
		{/if}
	{/key}
	<div class="flex w-full flex-row items-center justify-center">
		<div class={mapClass}>
			{#if chatting}
				<Chat
					isTutorial={SIZE === 4}
					history={entities.get(currentSection + '_' + ac)?.history}
					{character}
					{dialogueID}
					dialogueTree={dt}
					on:end={(e) => {
						// @ts-expect-error
						entities.get(`${currentSection}_${ac}`).history = e.detail.history;
						chatting = false;
					}}
				/>
			{/if}
			{#each { length: SIZE * SIZE } as _, i}
				{@const active = ac === i}
				{@const item = entities.get(currentSection + '_' + i)}
				{@const collideable = collideables.get(`${currentSection}_${i}`)}
				{@const background = backgrounds.get(`${currentSection}_${i}`)}
				{@const hand =
					player?.inventory?.get(currentInventoryIndex)?.emoji ||
					keys[directionKey].emoji}
				<div
					class="cell"
					style:background={colors.get(`${currentSection}_${i}`) || map.dbg}
				>
					{#if collideable}
						<div class="absolute z-[2] scale-150">
							<i class="twa twa-{collideable.emoji}" />
						</div>
					{/if}
					{#if active}
						<div
							class="absolute z-[3] text-xs md:text-base {directionKey} {handDirection}"
						>
							<i class="twa twa-{hand}" />
						</div>
					{/if}
					{#if item}
						{@const effector = item instanceof Effector}
						<span class:effector>
							<i class="twa twa-{item.emoji}" />
						</span>
					{:else if background}
						<i class="twa scale-75 opacity-50 twa-{background}" />
					{/if}
				</div>
			{/each}
		</div>
		<div
			class="absolute flex h-full w-screen flex-col items-center justify-center"
		>
			<!-- LEFT -->
			<div class="absolute bottom-52 left-8">
				<kbd
					class="kbd"
					on:click={() => {
						currentInventoryIndex = -1;
					}}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
						/>
					</svg>
				</kbd>
			</div>
			<div class="absolute bottom-40 left-8 flex flex-row items-start">
				<kbd
					class="kbd"
					on:click={() => {
						if (currentInventoryIndex == 0) return;
						currentInventoryIndex -= 1;
					}}>◀︎</kbd
				>
				<kbd
					class="kbd"
					on:click={() => {
						if (currentInventoryIndex == 7) return;
						currentInventoryIndex += 1;
					}}>▶︎</kbd
				>
			</div>
			<div class="absolute bottom-8 left-8 flex flex-col items-start">
				<kbd class="kbd" on:click={() => handle({ code: 'KeyW' })}>▲</kbd>
				<div class="flex flex-row">
					<kbd class="kbd" on:click={() => handle({ code: 'KeyA' })}>◀︎</kbd>
					<kbd class="kbd" on:click={() => handle({ code: 'KeyD' })}>▶︎</kbd>
				</div>
				<kbd class="kbd" on:click={() => handle({ code: 'KeyS' })}>▼</kbd>
			</div>
			<!-- RIGHT -->
			<div class="absolute bottom-40 right-8">
				<kbd class="kbd" on:click={() => handle({ code: 'Space' })}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
						/>
					</svg>
				</kbd>
			</div>
			<div class="absolute bottom-8 right-8 flex flex-col items-end">
				<kbd class="kbd" on:click={() => handle({ code: 'ArrowUp' })}>▲</kbd>
				<div class="flex flex-row">
					<kbd class="kbd" on:click={() => handle({ code: 'ArrowLeft' })}
						>◀︎</kbd
					>
					<kbd class="kbd" on:click={() => handle({ code: 'ArrowRight' })}
						>▶︎</kbd
					>
				</div>
				<kbd class="kbd" on:click={() => handle({ code: 'ArrowDown' })}>▼</kbd>
			</div>
		</div>
	</div>
	{#key ac}
		{#if ac != -2 && showInventory}
			<div
				title="Inventory"
				class="relative flex h-full w-full flex-row items-center justify-center gap-2"
			>
				{#each { length: MAX_INVENTORY_SIZE } as _, i}
					{@const item = player?.inventory.get(i)}
					{@const equipped = i === currentInventoryIndex}
					{@const isEffector = item instanceof Effector}
					<div
						class:equipped
						class="relative flex h-5 w-5 flex-col items-center justify-center rounded border md:h-10 md:w-10 {isEffector
							? 'border-purple-500 bg-purple-50'
							: 'border-black bg-base-300'} p-2 2xl:h-12 2xl:w-12"
					>
						{#if item && item.hp !== 'Infinite'}
							<i class="twa twa-{item.emoji || ''}" />
							<div
								class="{isEffector
									? ''
									: 'hidden'} absolute -top-0.5 right-0.5 text-sm"
							>
								{item.hp > 1 ? item.hp : ''}
							</div>
						{/if}
					</div>
					{#if isEffector && equipped}
						<div
							class="absolute {SIZE == DEFAULT_SIDE_LENGTH
								? 'bottom-4'
								: '-bottom-12'}"
						>
							<kbd class="kbd">F</kbd> to apply
							<i class="twa twa-{item.emoji}" /> on self.
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	{/key}
</div>

<style>
	/* DIRECTIONS */
	:root {
		--off: -25%;
	}

	.KeyW {
		top: var(--off);
	}

	.KeyA {
		left: var(--off);
	}

	.KeyS {
		bottom: var(--off);
	}

	.KeyD {
		right: var(--off);
	}

	.equipped {
		scale: 120%;
		border-width: 2px;
	}

	@keyframes effector {
		100% {
			transform: scale(0.618);
		}
	}

	.up {
		animation: up 100ms linear;
	}

	.down {
		animation: down 100ms linear;
	}

	.right {
		animation: right 100ms linear;
	}

	.left {
		animation: left 100ms linear;
	}

	@keyframes up {
		100% {
			transform: translateY(-20px);
		}
	}

	@keyframes down {
		100% {
			transform: translateY(20px);
		}
	}

	@keyframes right {
		100% {
			transform: translateX(20px);
		}
	}

	@keyframes left {
		100% {
			transform: translateX(-20px);
		}
	}

	.effector {
		animation: effector 1000ms linear infinite alternate;
		scale: 0.618;
	}

	progress::-webkit-progress-value {
		background: var(--controllable);
	}

	kbd {
		width: 2.5rem; /* 40px */
		height: 2.5rem; /* 40px */
	}
</style>
