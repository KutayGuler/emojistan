import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// TODO: should add updated_at to sort
	let { data: games, error } = await supabase
		.from('games')
		.select('id, user_id, name, profiles(username)')
		.range(0, 10);

	console.log(games);

	return {
		games,
	};
};
