import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL,
} from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';
import type { Database } from '$api/types';
import { liked_game_ids } from '$src/store';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	// depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (browser) {
		liked_game_ids.set(data.liked_game_ids);
	}

	return { supabase, session, username: data.username };
};
