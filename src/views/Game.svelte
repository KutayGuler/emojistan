<script lang="ts">
	import { scale } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { createEventDispatcher, onMount } from 'svelte/internal';
	import { currentColor, currentEmoji, dialogueTree } from '../store';
	import {
		DEFAULT_MAP_CLASS,
		DEFAULT_SIDE_LENGTH,
		MAX_INVENTORY_SIZE,
	} from '$src/constants';
	import {
		Consumable,
		Equippable,
		Interactable,
		Item,
		type ArrowKey,
		type CollisionType,
		type EditableMap,
		type Mutations,
		type Wasd,
		type _Collisions,
		type _Interactable,
		type _Interactables,
		type _Consumables,
		type _Equippables,
		type Pusher,
		type Merger,
		type Branch,
		type _Controllable,
		type _Controllables,
		Controllable,
	} from '$src/types';
	import { AStarFinder } from 'astar-typescript';
	import Chat from './Chat.svelte';

	/* ## DATA ## */
	export let dt = new Map<string, Branch>(); // dialogue tree
	export let map: EditableMap;
	export let pushers = new Map<string, Pusher>();
	export let mergers = new Map<string, Merger>();
	export let equippables = new Map<string, Equippable>();
	export let interactables = new Map<string, Interactable>();
	export let controllables = new Map<string, Controllable>();
	export let consumables = new Map<string, Consumable>();
	export let mapClass = DEFAULT_MAP_CLASS;
	export let SIZE = DEFAULT_SIDE_LENGTH;
	export let showHP = true;
	export let showInventory = true;

	let completionMessage: 'Level Completed!' | 'Game Over. No players left.' =
		'Level Completed!';

	/* ## STATE ## */
	let levelCompleted = false;
	let ac = -2; // ACTIVE CELL
	let ic: number; // INTERACTED CELL
	let currentSection = map.startingSectionIndex;
	let directionKey: Wasd = 'KeyD';
	let currentInventoryIndex = 0;
	let items = new Map<string, Item | Equippable | Consumable>();
	let colors = new Map(map.colors);
	let backgrounds = new Map(map.backgrounds);
	let _interactables: _Interactables = {};
	let _controllables: _Controllables = {};
	let _consumables: _Consumables = {};
	let _equippables: _Equippables = {};

	/* ## DIALOGUE ## */
	let character = '';
	let dialogueID = '';
	let handDirection = '';

	onMount(() => {
		[$currentColor, $currentEmoji] = ['', ''];
		dt = $dialogueTree;
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
		let playerData = items.get(_id) as Item;
		items.delete(_id);
		currentSection += sectionSideEffect;
		ic += acSideEffect;
		ac += acSideEffect;
		items.set(currentSection + '_' + ac, playerData);
		items = items;
	}

	const calcOperation = true
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
						!items.has(currentSection - 1 + '_' + (ac + SIZE - 1))
					) {
						changeSection(SIZE - 1, -1);
					}
					return 0;
				}
				if (code === 'ArrowUp' && index < SIZE) {
					if (
						currentSection >= SIZE &&
						!items.has(currentSection - SIZE + '_' + (ac + SIZE * (SIZE - 1)))
					) {
						changeSection(SIZE * (SIZE - 1), -SIZE);
					}
					return 0;
				}
				if (code === 'ArrowRight' && (index + 1) % SIZE === 0) {
					if (
						(currentSection + 1) % SIZE != 0 &&
						!items.has(currentSection + 1 + '_' + (ac - SIZE + 1))
					) {
						changeSection(-(SIZE - 1), 1);
					}
					return 0;
				}
				if (code === 'ArrowDown' && index >= SIZE * SIZE - SIZE) {
					if (
						currentSection < SIZE * SIZE - SIZE &&
						!items.has(currentSection + SIZE + '_' + (ac - SIZE * (SIZE - 1)))
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
		items.set(_to, items.get(_from) as Equippable | Consumable | Item);
		items.delete(_from);
		items = items; // MAGIC UPDATE, NECESSARY FOR REACTIVITY

		if (ac === from) {
			ac = to;
			ic = ac + keys[directionKey].operation;
		}
	}

	function deleteFromInventory(index: number) {
		player.inventory.delete(index);
		player.inventory = player.inventory;
	}

	/**
	 * function mutates ac if it is equal to "from" parameter
	 * Transfers an item from "from" to "to" and applies mergeResult
	 */
	function transferAndMerge(fromID: number, toID: number, mergeResult: string) {
		let _fromID = currentSection + '_' + fromID;
		let _toID = currentSection + '_' + toID;

		let from = items.get(_fromID) as Item;
		let fromInventory: Map<number, Equippable> =
			from?.inventory || new Map<number, Equippable>();
		let fromHP = from?.hp.current || 1;
		let toInventory: Map<number, Equippable> =
			(items.get(_toID) as Item)?.inventory || new Map<number, Equippable>();
		let mergedInventory = new Map([...fromInventory, ...toInventory]);
		while (mergedInventory.size > MAX_INVENTORY_SIZE) {
			mergedInventory.delete(mergedInventory.keys().next().value);
		}

		items.set(
			_toID,
			new Item(
				mergeResult,
				mergedInventory,
				_interactables[mergeResult]?.hp || fromHP
			)
		);
		items.delete(_fromID);
		items = items; // MAGIC UPDATE, NECESSARY FOR REACTIVITY

		if (ac === fromID) {
			ac = toID;
			ic = ac + keys[directionKey].operation;
		}
	}

	for (let [id, interactable] of interactables) {
		const { emoji, ...args } = interactable;
		if (emoji === '') continue;
		_interactables[emoji] = {} as _Interactable;
		Object.assign(_interactables[emoji], args);
		_interactables[emoji].id = id;
	}

	for (let [id, controllable] of controllables) {
		const { emoji, ...args } = controllable;
		if (emoji === '') continue;
		_controllables[emoji] = {} as _Controllable;
		Object.assign(_controllables[emoji], args);
		_controllables[emoji].id = id;
	}

	for (let [id, consumable] of consumables) {
		const { emoji, ...args } = consumable;
		if (emoji === '') continue;
		_consumables[emoji] = {} as Consumable;
		Object.assign(_consumables[emoji], args);
	}

	for (let [id, equippable] of equippables) {
		const { emoji, ...args } = equippable;
		if (emoji === '') continue;
		_equippables[emoji] = {} as Equippable;
		Object.assign(_equippables[emoji], args);
	}

	function coordinateToPosObj(num: number) {
		return { x: num % SIZE, y: Math.floor(num / SIZE) };
	}

	function followPlayer(
		startPos: { x: number; y: number },
		goalPos: { x: number; y: number },
		relativeIndex: number
	) {
		let matrix: Array<Array<number>> = [];

		for (let i = 0; i < SIZE; i++) {
			matrix[i] = [];
			for (let j = 0; j < SIZE; j++) {
				let item = items.get(currentSection + '_' + (SIZE * i + j));
				if (item) {
					if (_interactables[item.emoji]) {
						matrix[i].push(0);
					} else {
						matrix[i].push(1);
					}
				} else {
					matrix[i].push(0);
				}
			}
		}

		console.log(matrix);

		let astar: {
			aStarInstance: AStarFinder;
		} = {
			aStarInstance: new AStarFinder({
				grid: {
					matrix,
				},
				diagonalAllowed: false,
			}),
		};

		console.log(startPos, goalPos);

		let pathway = astar.aStarInstance.findPath(startPos, goalPos);
		pathway.slice(0, 2);
		console.log(pathway);

		if (pathway?.length <= 1) return;

		let from = pathway[0][1] * SIZE + pathway[0][0];
		let to = pathway[1][1] * SIZE + pathway[1][0];

		if (!items.has(currentSection + '_' + to)) {
			transferItem(from, to);
			enemyIndexes[relativeIndex] = to;
		}
	}

	function initItems() {
		for (let [id, _emoji] of map.items) {
			if (_equippables[_emoji]) {
				items.set(id, new Equippable(_emoji, _equippables[_emoji].hp));
			} else if (_consumables[_emoji]) {
				let { hp, mutateConsumerTo } = _consumables[_emoji];
				items.set(id, new Consumable(_emoji, hp, mutateConsumerTo));
			} else {
				items.set(id, new Item(_emoji));
			}
		}

		console.log(_controllables);

		for (let [id, { emoji, hp }] of items) {
			if (typeof hp === 'number') continue; // consumable and equippables' hp types are numbers
			if (
				ac === -2 &&
				+id.split('_')[0] === currentSection &&
				_controllables[emoji]
			) {
				ac = +id.split('_')[1];
				ic = ac + 1;
				directionKey = 'KeyD';
			}

			hp.max = _interactables[emoji]?.hp || 1;
			hp.current = _interactables[emoji]?.hp || 1;
		}
	}

	initItems();

	let player = items.get(currentSection + '_' + ac) as Item;
	$: player = items.get(currentSection + '_' + ac) as Item;

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

	// MUTATIONS
	const m: Mutations = {
		paint({ index, background }) {
			colors.set(currentSection + '_' + index, background);
			colors = colors;
		},
		erase({ index }) {
			colors.delete(currentSection + '_' + index);
		},
		spawn({ index, emoji }) {
			items.set(currentSection + '_' + index, new Item(emoji));
			items = items;
		},
		destroy({ index }) {
			items.delete(currentSection + '_' + index);
		},
		dropEquippable({ emoji }) {
			if (emoji && player?.inventory.size != MAX_INVENTORY_SIZE) {
				// @ts-expect-error
				player?.inventory.push(emoji);
				items = items;
			}
		},
		resetLevel: () => {
			items.clear();
			colors = new Map(map.colors);
			ac = -2;
			initItems();
			items = items;
			levelCompleted = false;
		},
		completeLevel: () => (levelCompleted = true),
	};

	function getCollisionType(key1: string, key2: string): CollisionType {
		if (!_collisions[key1]) return 'bump';
		return _collisions[key1][key2] || 'bump';
	}

	function enactPushCollision(operation: number) {
		let collisionChain = [];
		let i = 0;

		while (items.has(currentSection + '_' + (ac + operation * i))) {
			collisionChain.push(
				items.get(currentSection + '_' + (ac + operation * i))?.emoji
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

	async function handle(e: KeyboardEvent) {
		e.preventDefault();
		handDirection = '';
		if (
			!items.has(currentSection + '_' + ac) ||
			(player?.hp.current || -1) <= 0 ||
			chatting
		)
			return;
		if (e.code.includes('Arrow')) {
			let operation = calcOperation(e.code as ArrowKey, ac);
			if (!player || operation === 0 || !_controllables[player.emoji]) return;
			let facingItem = items.get(currentSection + '_' + (ac + operation));

			if (!facingItem) {
				transferItem(ac, ac + operation);
				for (let i = 0; i < enemyIndexes.length; i++) {
					followPlayer(
						coordinateToPosObj(enemyIndexes[i]),
						coordinateToPosObj(ac),
						i
					);
				}
				console.log(enemyIndexes);

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
			const operation = calcOperation(wasdToArrow[directionKey], ac);
			if (operation === 0) {
				return;
			}
			let interactedItem = items.get(currentSection + '_' + ic);

			if (interactedItem === undefined) return;
			if (
				interactedItem instanceof Equippable ||
				interactedItem instanceof Consumable
			) {
				if (player.inventory.size != MAX_INVENTORY_SIZE) {
					for (let i = 0; i < MAX_INVENTORY_SIZE; i++) {
						if (!player.inventory.get(i)) {
							player.inventory.set(i, interactedItem);
							player.inventory = player.inventory;
							break;
						}
					}
					items.delete(currentSection + '_' + ic);
					items = items;
				}
				return;
			}

			let interactable: _Interactable = _interactables[interactedItem.emoji];

			if (!interactable) return;
			let { id, sideEffects, evolve, devolve } = interactable;

			// for (let { type } of sequence) {
			// 	if (type === 'dropEquippable') {
			// 		if (player?.inventory.length === MAX_INVENTORY_SIZE) {
			// 			return;
			// 		}
			// 	}
			// }

			let equippedItem = player?.inventory.get(currentInventoryIndex) || 'any';

			let sideEffect =
				sideEffects.find(
					([effect, value]) =>
						equippables.get(effect)?.emoji ===
						(equippedItem as Equippable).emoji
				) || sideEffects[0];

			if (sideEffect[1] === 'talk') {
				dialogueID = id.toString();
				character = interactedItem.emoji;
				chatting = true;
				return;
			}

			if (sideEffect[1] === 0) return;
			interactedItem.hp.current += sideEffect[1];

			handDirection = getHandDirection(operation);
			let timeout = setTimeout(() => {
				handDirection = '';
				clearTimeout(timeout);
			}, 50);

			const isEquippable = equippedItem instanceof Equippable;

			if (
				isEquippable &&
				sideEffect[0] === (equippedItem as Equippable).emoji
			) {
				// FIXME: equippedItem.hp not reducing on interaction
				(equippedItem as Equippable).hp -= 1;
			}

			// if it's not "ANY"
			if (typeof equippedItem !== 'string') {
				if (isEquippable && (equippedItem as Equippable).hp === 0) {
					deleteFromInventory(currentInventoryIndex);
				} else if (equippedItem instanceof Consumable) {
					deleteFromInventory(currentInventoryIndex);
				}
			}

			// for (let { type, ...args } of sequence) {
			// 	if (type === 'wait') {
			// 		await m.wait(args.duration);
			// 	} else {
			// 		let res = m[type](args);
			// 		if (res === 'cancelLoop') {
			// 			break;
			// 		}
			// 	}
			// }

			let playerEvolve = _interactables[player?.emoji || '']?.evolve;
			let playerDevolve = _interactables[player?.emoji || '']?.devolve;

			// EVOLVE & DEVOLVE PLAYER
			if (player && player?.hp.current <= 0) {
				if (playerDevolve?.enabled && playerDevolve.to != '') {
					player.emoji = playerDevolve.to;
				} else {
					items.delete(currentSection + '_' + ac);
				}
			} else if (
				playerEvolve?.enabled &&
				playerEvolve.at === player?.hp.current
			) {
				player.emoji = playerEvolve.to;
			}

			// EVOLVE & DEVOLVE INTERACTED ITEM
			if (interactedItem.hp.current <= 0) {
				if (devolve?.enabled && devolve.to != '') {
					interactedItem.emoji = devolve.to;
				} else {
					items.delete(currentSection + '_' + ic);
				}
			} else if (evolve?.enabled && evolve.at === interactedItem.hp.current) {
				interactedItem.emoji = evolve.to;
			}

			items = items;
			return;
		}

		console.log(e.code);

		if (e.code === 'KeyF') {
			let consumableItem = player.inventory.get(currentInventoryIndex);
			if (!(consumableItem instanceof Consumable)) return;
			let { sideEffect, mutateConsumerTo } = consumableItem;

			if (mutateConsumerTo != '') {
				player.emoji = mutateConsumerTo;
			} else {
				player.hp.add(sideEffect);

				if (player.hp.current <= 0) {
					let playerDevolve = _interactables[player?.emoji || '']?.devolve;

					if (playerDevolve.enabled) {
						player.emoji = playerDevolve.to;
						player.hp.max = _interactables[playerDevolve.to]?.hp || 1;
						player.hp.current = player.hp.max;
						progress.set(calcPlayerHpPercentage());
						deleteFromInventory(currentInventoryIndex);
						return;
					}

					deleteFromInventory(currentInventoryIndex);

					for (let [id, { emoji, hp }] of items) {
						if (typeof hp === 'number') continue; // consumables and equippables' hp types are numbers
						if (
							hp.current > 0 &&
							!_equippables[emoji] &&
							_controllables[emoji]
						) {
							player = items.get(id) as Item;
							ac = +id.split('_')[1];
							progress = tweened(calcPlayerHpPercentage(), {
								duration: 200,
								easing: cubicOut,
							});

							return;
						}
					}

					completionMessage = 'Game Over. No players left.';
					levelCompleted = true;
					return;
				}

				let playerEvolve = _interactables[player?.emoji || '']?.evolve;

				if (playerEvolve?.enabled && player.hp.current === playerEvolve?.at) {
					player.emoji = playerEvolve.to;
					player.hp.max = _interactables[playerEvolve.to]?.hp || 1;
					player.hp.current = player.hp.max;
				}

				progress.set(calcPlayerHpPercentage());
			}

			deleteFromInventory(currentInventoryIndex);
			return;
		}

		if (e.code.includes('Control')) {
			if (
				calcOperation(wasdToArrow[directionKey], ac) === 0 ||
				!player?.inventory.get(currentInventoryIndex) ||
				items.has(currentSection + '_' + ic)
			) {
				return;
			}
			console.log(currentInventoryIndex);

			let droppedItem = player?.inventory.get(currentInventoryIndex);
			if (!droppedItem) return;
			items.set(currentSection + '_' + ic, droppedItem);
			deleteFromInventory(currentInventoryIndex);
			items = items;
			return;
		}

		if (e.code === 'Escape') {
			dispatch('quit');
			return;
		}

		let closestDistance = 300;
		let closestID = ac;

		let _items = Array.from(items).filter(
			([id, { emoji }]) => !_equippables[emoji]
		);

		if (e.code === 'KeyR') {
			for (let [id, _] of _items) {
				let _id = +id.split('_')[1];
				if (_id === ac) continue;
				if (_id > ac && _id - ac < closestDistance) {
					closestDistance = _id - ac;
					closestID = _id;
				}
			}

			if (closestDistance === 300) {
				let smallest = 300;
				for (let [id, _] of _items) {
					let _id = +id.split('_')[1];
					if (_id < smallest) smallest = _id;
				}
				ac = smallest;
				ic = ac + keys[directionKey].operation;
			} else {
				ac = closestID;
				ic = ac + keys[directionKey].operation;
			}

			player = items.get(currentSection + '_' + ac) as Item;
			progress = tweened(calcPlayerHpPercentage(), {
				duration: 200,
				easing: cubicOut,
			});
			return;
		}

		// if (e.code === 'KeyQ') {
		// 	for (let [id, _] of _items) {
		// 		let _id = +id.split('_')[1];
		// 		if (_id === ac) continue;
		// 		if (ac > _id && ac - _id < closestDistance) {
		// 			closestDistance = ac - _id;
		// 			closestID = _id;
		// 		}
		// 	}

		// 	if (closestDistance === 300) {
		// 		let biggest = 0;
		// 		for (let [id, _] of _items) {
		// 			let _id = +id.split('_')[1];
		// 			if (_id > biggest) biggest = _id;
		// 		}
		// 		ac = biggest;
		// 		ic = ac + keys[directionKey].operation;
		// 	} else {
		// 		ac = closestID;
		// 		ic = ac + keys[directionKey].operation;
		// 	}

		// 	player = items.get(currentSection + '_' + ac) as Item;
		// 	progress = tweened(calcPlayerHpPercentage(), {
		// 		duration: 200,
		// 		easing: cubicOut,
		// 	});
		// 	return;
		// }
	}

	function noPlayer(rbx: any) {
		if (ac === -2) dispatch('noPlayer');
	}
</script>

<svelte:window on:keydown={handle} />

<div class="relative flex h-full flex-col items-center justify-center">
	{#key ac}
		{#if ac != -2 && showHP}
			{@const playerHP = $progress * (player?.hp.max || 1)}
			<div
				class=" flex h-full w-64 flex-grow flex-row items-center justify-center"
			>
				<i class="twa z-10 text-2xl twa-{player?.emoji}" />
				<progress title="Health Bar" class="progress h-8" value={$progress} />
				<p class="absolute pl-6">
					{Number.isInteger(playerHP) ? playerHP : playerHP.toFixed(1)}
				</p>
			</div>
		{/if}
	{/key}
	<div class={mapClass} use:noPlayer>
		{#if chatting}
			<Chat
				isTutorial={SIZE === 4}
				{character}
				{dialogueID}
				dialogueTree={dt}
				on:end={() => (chatting = false)}
			/>
		{/if}
		{#each { length: SIZE * SIZE } as _, i}
			{@const active = ac === i}
			{@const item = items.get(currentSection + '_' + i)}
			{@const background = backgrounds.get(currentSection + '_' + i)}
			{@const hand =
				player?.inventory.get(currentInventoryIndex)?.emoji ||
				keys[directionKey].emoji}
			<div
				class="cell"
				style:background={colors.get(currentSection + '_' + i) || map.dbg}
			>
				{#if active}
					<div class="absolute z-[2] text-base {directionKey} {handDirection}">
						<i class="twa twa-{hand}" />
					</div>
				{/if}
				{#if item}
					{@const equippable = item instanceof Equippable}
					{@const consumable = item instanceof Consumable}
					<span class:equippable class:consumable>
						<i class="twa twa-{item.emoji}" />
					</span>
				{:else}
					<i class="twa scale-75 opacity-50 twa-{background}" />
				{/if}
			</div>
		{/each}
		{#if levelCompleted}
			<dialog
				open
				style="background-color: rgba(0, 0, 0.5, 0.5);"
				class="absolute z-20 flex h-full w-full flex-col items-center justify-center gap-4 self-center "
				transition:scale|local
			>
				<p class="absolute top-4 w-full text-center text-white">
					{completionMessage}
				</p>
				<button
					class="btn-success btn-lg btn w-1/4 text-success-content"
					on:click={() => m.resetLevel()}>REPLAY</button
				>
				<button
					class="btn-error btn-lg btn w-1/4 text-error-content"
					on:click={() => dispatch('quit')}>QUIT</button
				>
			</dialog>
		{/if}
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
					<div
						class:equipped
						class="relative flex h-10 w-10 flex-col items-center justify-center rounded bg-base-300 p-2 2xl:h-12 2xl:w-12"
					>
						{#if item}
							<i class="twa twa-{item.emoji || ''}" />
							<div class="absolute -top-0.5 right-0.5 text-sm">
								{item.hp > 1 ? item.hp : ''}
							</div>
						{/if}
					</div>
					{#if item && item instanceof Consumable && currentInventoryIndex === i}
						<div class="absolute bottom-4">
							Press F to consume <i class="twa twa-{item.emoji}" />
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
		border: 2px solid black;
	}

	@keyframes equippable {
		100% {
			transform: translateY(-2px);
		}
	}

	@keyframes consumable {
		100% {
			transform: scale(0.85);
		}
	}

	.equippable {
		animation: equippable 500ms linear infinite alternate;
		scale: 0.618;
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

	.consumable {
		animation: consumable 1000ms linear infinite alternate;
		scale: 0.618;
	}

	progress::-webkit-progress-value {
		background: var(--consumable);
	}
</style>
