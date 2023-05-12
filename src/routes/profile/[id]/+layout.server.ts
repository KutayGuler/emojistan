import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { getSession, supabase },
	params,
	route,
}) => {
	const session = await getSession();

	let isOwner = false;
	let profileNotCreated = false;
	let username = '';

	// TODO: get counts
	// TODO: change [id] with [username]

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
