// import { notifications } from '$src/routes/notifications';
// import { controllables } from '$src/store';
// import { get } from 'svelte/store';

// function checkDuplicates(store: any, formattedEmoji: any) {
// 	for (let [_id, val] of get(controllables).entries()) {
// 		if (_id === id) continue;

// 		if (get(formattedEmoji) === val.emoji) {
// 			notifications.warning('Cannot have two controllables with same emoji');
// 			return;
// 		}
// 	}

// 	// TODO: need a global checker for this
// 	for (let val of [...$effectors.values()]) {
// 		if (
// 			(typeof val === 'string' && val != '' && $formattedEmoji === val) ||
// 			(typeof val === 'object' && $formattedEmoji === val.emoji)
// 		) {
// 			notifications.warning(
// 				'An emoji can only have one assigned type. Controllable, Interactable, Effector, or Equippable'
// 			);
// 			return;
// 		}
// 	}
// }
