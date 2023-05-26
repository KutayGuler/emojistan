import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
export const component = async () => (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.8db52637.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/store.55a48864.js","_app/immutable/chunks/stores.986fa1bf.js","_app/immutable/chunks/index.8e69b878.js","_app/immutable/chunks/singletons.7082b28b.js","_app/immutable/chunks/index.17127d3e.js","_app/immutable/chunks/index.8d01d5d1.js","_app/immutable/chunks/utils.56bee90e.js","_app/immutable/chunks/notifications.048afdce.js","_app/immutable/chunks/Loading.e774e7cd.js","_app/immutable/chunks/Background.ad4eb048.js","_app/immutable/chunks/emojis.b121f429.js","_app/immutable/chunks/navigation.bc243d4b.js"];
export const stylesheets = ["_app/immutable/assets/0.251da566.css","_app/immutable/assets/Loading.f9bb032c.css","_app/immutable/assets/Background.c91fc62f.css"];
export const fonts = [];
