import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { getSession, supabase },
	params,
}) => {
	const session = await getSession();

	let isOwner = false;
	let profileNotCreated = true;

	// TODO: get counts

	let { data: profileData, error } = await supabase
		.from('profiles')
		.select('id, username')
		.eq('username', params.username);

	if (profileData == null || profileData.length == 0) {
		isOwner = session?.user.id == params.username;

		if (isOwner) {
			let { data: _profileData, error } = await supabase
				.from('profiles')
				.select('id, username')
				.eq('id', params.username);

			profileNotCreated =
				_profileData != null && _profileData[0].username == null;
		}
	} else {
		isOwner = profileData[0].id == session?.user.id;
		profileNotCreated = profileData[0].username == null;
	}

	let {
		data: games,
		error: gamesError,
		count: gamesCount,
	} = await supabase
		.from('games')
		.select('id, name', { count: 'exact', head: true })
		.eq('username', params.username);

	// let { data: followers, error: followersError, count: followersCount } = await supabase
	// .from('follows')
	// .select('id, name', { count: 'exact', head: true })
	// .eq('following_id', params.username);

	// console.log(followers, followersCount);

	// TODO: get profile ID first.

	// let { data: games, error: gamesError, count: gamesCount } = await supabase
	// .from('follows')
	// .select('*', { count: 'exact', head: true })
	// .eq('following_id', params.username);

	// TODO: GET ALL DATA AT ONCE

	return {
		isOwner,
		profileNotCreated,
	};
};
