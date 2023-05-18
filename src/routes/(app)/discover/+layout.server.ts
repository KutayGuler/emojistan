import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { getSession, supabase },
}) => {
	const session = await getSession();

let { data: newGames, error } = await supabase
  .from('games')
  .select('id, name')
  .range(0, 10)

  let followingGames, followingError;

  if (session) {
    let { data: _following, error: _followingError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', session.user.id)
    .range(0, 10)

    let following_ids = _following ? _following?.map(({ following_id }) => following_id) : [];
    
    const { data, error } = await supabase
      .from('games')
      .select('name, id, profile:profiles!games_user_id_fkey(username)')
      .in('user_id', following_ids)

      console.log(data, error)
    followingGames = data;
  }

	return {
    newGames,
    followingGames
	};
};
