import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { getSession, supabase },
	params,
}) => {
	const session = await getSession();

	let isOwner = false;
	let profileNotCreated = true;

	let { data: profileData, error } = await supabase
		.from('profiles')
		.select('id, username, bio')
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

		return {
			isOwner,
			profileNotCreated,
		};
	}

	isOwner = profileData[0].id == session?.user.id;
	profileNotCreated = profileData[0].username == null;

	let games = await supabase
		.from('games')
		.select('id, name, profile:profiles!games_user_id_fkey(username)', { count: 'exact' })
		.eq('username', params.username)
		.range(0, 10);


	let follower = await supabase
		.from('follows')
		.select('follower_id, profile:profiles!follows_follower_id_fkey(username)', { count: 'exact'})
		.eq('following_id', profileData[0].id)
		.range(0, 10);

	console.log(follower.data)

	let following = await supabase
		.from('follows')
		.select('following_id', { count: 'exact' })
		.eq('follower_id', profileData[0].id)
		.range(0, 10);


	// console.log(games, follower, following);

	return {
		bio: profileData[0].bio,
		isOwner,
		profileNotCreated,
		games,
		follower,
		following,
	};
};
