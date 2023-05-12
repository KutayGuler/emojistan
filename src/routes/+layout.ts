import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL,
} from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';
import type { Database } from '$api/types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	let username = '';

	let { data: usernames, error } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', session?.user.id);

	if (usernames && usernames[0]) {
		username = usernames[0].username || session?.user.id;
	}

	return { supabase, session, username };
};
