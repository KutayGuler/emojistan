/// <reference types="@sveltejs/kit" />

import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './DatabaseDefinitions';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
		// interface Session {}
		// interface Stuff {}
		// interface Error {}
		// interface Platform {}
	}
}

declare namespace svelte.JSX {
	interface DOMAttributes<T extends EventTarget> {
		onlongpress?: EventHandler<Event, T> | undefined | null;
		onoutsideclick?: EventHandler<Event, T> | undefined | null;
	}
}
