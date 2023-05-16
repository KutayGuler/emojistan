import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { getSession, supabase },
}) => {
	const session = await getSession();

	let username = '';

	if (session) {
		let { data: usernames, error } = await supabase
			.from('profiles')
			.select('username')
			.eq('user_id', session.user.id);

		if (usernames && usernames.length > 0) {
			username = usernames[0].username;
		}
	}

	console.log(session, username);

	return {
		session,
		username,
	};
};
