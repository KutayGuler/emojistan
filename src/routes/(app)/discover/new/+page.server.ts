import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	let { data: games, error } = await supabase
		.from('games')
		.select('id, name, profile:profiles(username)')
		.range(0, 10);

	return {
		games,
	};
};
