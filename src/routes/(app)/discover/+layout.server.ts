import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { getSession, supabase },
}) => {
	throw redirect(302, '/');
	const session = await getSession();

	let { data: newGames, error } = await supabase
		.from('games')
		.select(
			'id, name, description, profile:profiles!games_user_id_fkey(username)'
		)
		.order('created_at', { ascending: false })
		.range(0, 9);

	let followingGames, followingError, following_ids;

	if (session) {
		let { data: _following, error: _followingError } = await supabase
			.from('follows')
			.select('following_id')
			.eq('follower_id', session.user.id)
			.range(0, 9);

		following_ids = _following
			? _following?.map(({ following_id }) => following_id)
			: [];

		const { data, error } = await supabase
			.from('games')
			.select(
				'name, id, description, profile:profiles!games_user_id_fkey(username)'
			)
			.in('user_id', following_ids)
			.range(0, 9);

		followingGames = data;
	}

	return {
		newGames,
		followingGames,
		following_ids,
	};
};
