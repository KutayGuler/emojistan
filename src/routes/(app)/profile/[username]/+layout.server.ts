import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
  locals: { getSession, supabase },
  params,
}) => {
  throw redirect(302, '/');
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
        _profileData != null && _profileData[0]?.username == null;
    }

    return {
      isOwner,
      profileNotCreated,
    };
  }

  isOwner = profileData[0]?.id == session?.user.id;
  profileNotCreated = profileData[0]?.username == null;

  let games = await supabase
    .from('games')
    .select(
      'id, name, description, profile:profiles!games_user_id_fkey(username)',
      { count: 'exact' }
    )
    .eq('user_id', profileData[0]?.id)
    .range(0, 9);

  let follower = await supabase
    .from('follows')
    .select(
      'follower_id, profile:profiles!follows_follower_id_fkey(username)',
      { count: 'exact' }
    )
    .eq('following_id', profileData[0]?.id)
    .range(0, 9);

  let following = await supabase
    .from('follows')
    .select(
      'following_id, profile:profiles!follows_following_id_fkey(username)',
      { count: 'exact' }
    )
    .eq('follower_id', profileData[0]?.id)
    .range(0, 9);

  let likes = await supabase
    .from('likes')
    .select('games(id, name, description), profile:profiles(username)', {
      count: 'exact',
    })
    .eq('liker_id', profileData[0]?.id)
    .order('created_at', { ascending: false })
    .range(0, 9);

  likes.data = likes.data?.map(({ games, profile }) => ({
    id: games.id,
    name: games.name,
    profile,
  }));

  let youFollow = follower.data?.some(
    ({ follower_id }) => follower_id == session?.user.id
  );
  let followsYou = following.data?.some(
    ({ following_id }) => following_id == session?.user.id
  );

  return {
    profileData: profileData[0],
    isOwner,
    profileNotCreated,
    games,
    likes,
    follower,
    following,
    youFollow,
    followsYou,
  };
};
