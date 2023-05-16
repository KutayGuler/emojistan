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
		.select('user_id, username')
		.eq('username', params.username);

	if (profileData == null || profileData.length == 0) {
		isOwner = session?.user.id == params.username;

		if (isOwner) {
			let { data: _profileData, error } = await supabase
				.from('profiles')
				.select('user_id, username')
				.eq('id', params.username);

			profileNotCreated =
				_profileData != null && _profileData[0].username == null;
		}
	} else {
		isOwner = profileData[0].user_id == session?.user.id;
		profileNotCreated = profileData[0].username == null;
	}

	return {
		isOwner,
		profileNotCreated,
	};
};
