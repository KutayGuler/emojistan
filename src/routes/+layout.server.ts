import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { getSession, supabase }
}) => {
  const session = await getSession();

  let username = '';
  let liked_game_ids = new Set<string>();

  if (session) {
    let { data: usernames, error } = await supabase
      .from('profiles')
      .select('username, likes(game_id)')
      .eq('id', session.user.id);

    if (usernames && usernames.length > 0) {
      username = usernames[0].username;

      if (usernames[0].likes) {
        for (let { game_id } of usernames[0].likes) {
          liked_game_ids.add(game_id);
        }
      }
    }
  }

  return {
    session,
    username,
    liked_game_ids
  };
};
