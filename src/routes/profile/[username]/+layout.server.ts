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
		.select('*')
		.eq('username', params.username);

	if (profileData == null || profileData.length == 0) {
		// check if ids are matching
		// if ids are matching that means the profile is not initialized
		let { data: _profileData, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', params.username);

		if (_profileData != null && _profileData.length != 0) {
			isOwner = _profileData[0].id == session?.user.id;
			profileNotCreated = _profileData[0].username == null;
		}
	} else {
		isOwner = profileData[0].id == session?.user.id;
		profileNotCreated = profileData[0].username == null;
	}

	return {
		isOwner,
		profileNotCreated,
	};
};
