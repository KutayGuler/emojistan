import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	locals: { getSession, supabase },
	params,
}) => {
	const session = await getSession();

	let isOwner = false;
	let profileNotCreated = false;
	let username = "";

	let { data: usernames, error } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', params.id);

	console.log(usernames);

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
