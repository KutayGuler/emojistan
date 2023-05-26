import * as server from '../entries/pages/(app)/discover/_layout.server.ts.js';

export const index = 3;
export const component = async () => (await import('../entries/pages/(app)/discover/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/discover/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.a33115fe.js","_app/immutable/chunks/index.8e69b878.js","_app/immutable/chunks/stores.986fa1bf.js","_app/immutable/chunks/singletons.7082b28b.js","_app/immutable/chunks/index.17127d3e.js"];
export const stylesheets = [];
export const fonts = [];
