import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// TODO: should add updated_at to sort
	let { data: games, error } = await supabase
		.from('games')
		.select('id, name, profile:profiles(username)')
		.range(0, 10);

	return {
		games,
	};
};
