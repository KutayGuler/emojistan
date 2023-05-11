import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { getSession, supabase },
	params,
	route,
}) => {
	// console.log(route);
	// console.log(route.id.split('/').length);
	console.log('layout.server');

	const session = await getSession();

	let isOwner = false;
	let profileNotCreated = false;
	let username = '';

	let { data: usernames, error } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', params.id);

	if (params.id == session?.user.id) {
		isOwner = true;
	}

	if (usernames === null || usernames.length === 0) {
		profileNotCreated = true;
	} else {
		username = usernames[0].username;
	}

	return {
		username,
		isOwner,
		profileNotCreated,
	};
};
