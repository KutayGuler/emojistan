import { get, type Readable } from 'svelte/store';
import { formattedEmoji, } from '$src/store';
import { notifications } from '$src/routes/notifications';
import type { Controllable, Effector, Interactable, StringedNumber } from '$src/types';
import { controllables, effectors, interactables } from '$src/store';
import type { RuleboxType } from '$src/lib';

// CF #10
export function hasDuplicateIn<
	R extends Controllable | Effector | Interactable
>(
	id: StringedNumber,
	store: Readable<Map<StringedNumber, R>>,
	storeName: Exclude<RuleboxType, 'merger' | 'pusher' | 'ctxMenu'>
) {
	for (let [_id, val] of (get(store) as Map<StringedNumber, R>).entries()) {
		if (_id === id) continue;

		if (get(formattedEmoji) === val.emoji) {
			notifications.warning(
				`Cannot have two ${storeName}s with the same emoji.`
			);
			return true;
		}
	}

	return false;
}

// CF #11
export function hasDuplicate() {
	for (let val of [
		...get(controllables).values(),
		...get(effectors).values(),
		...get(interactables).values(),
	]) {
		if (
			(typeof val === 'string' && val != '' && get(formattedEmoji) === val) ||
			(typeof val === 'object' && get(formattedEmoji) === val.emoji)
		) {
			notifications.warning(
				'An emoji can only have one assigned type. Controllable, Interactable or Effector.'
			);
			return true;
		}
	}

	return false;
}
