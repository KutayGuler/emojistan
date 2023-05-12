import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	locals: { getSession, supabase },
}) => {
	// const session = await getSession();

	let { data: games, error } = await supabase.from('games').select('*');
	// TODO: Paginate

	// console.log(games);

	return {
		games,
	};
};
