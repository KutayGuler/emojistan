export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["fonts/Montserrat-ExtraBold.ttf","fonts/MouseMemoirs.ttf","images/branching-dialogue.webm","images/copy-mode.webm","images/dialogue.webm","images/emoji-mode.webm","images/facebook-logo.png","images/palette.webm","images/rulebox.webm"]),
	mimeTypes: {".ttf":"font/ttf",".webm":"video/webm",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.0e9f0c69.js","app":"_app/immutable/entry/app.d1f7db27.js","imports":["_app/immutable/entry/start.0e9f0c69.js","_app/immutable/chunks/index.8e69b878.js","_app/immutable/chunks/singletons.7082b28b.js","_app/immutable/chunks/index.17127d3e.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/entry/app.d1f7db27.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/index.8e69b878.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js'),
			() => import('../output/server/nodes/2.js'),
			() => import('../output/server/nodes/3.js'),
			() => import('../output/server/nodes/4.js'),
			() => import('../output/server/nodes/5.js'),
			() => import('../output/server/nodes/6.js'),
			() => import('../output/server/nodes/7.js'),
			() => import('../output/server/nodes/8.js'),
			() => import('../output/server/nodes/9.js'),
			() => import('../output/server/nodes/10.js'),
			() => import('../output/server/nodes/11.js'),
			() => import('../output/server/nodes/12.js'),
			() => import('../output/server/nodes/13.js'),
			() => import('../output/server/nodes/14.js'),
			() => import('../output/server/nodes/15.js'),
			() => import('../output/server/nodes/16.js'),
			() => import('../output/server/nodes/17.js'),
			() => import('../output/server/nodes/18.js'),
			() => import('../output/server/nodes/19.js'),
			() => import('../output/server/nodes/20.js'),
			() => import('../output/server/nodes/21.js'),
			() => import('../output/server/nodes/22.js'),
			() => import('../output/server/nodes/23.js'),
			() => import('../output/server/nodes/24.js'),
			() => import('../output/server/nodes/25.js'),
			() => import('../output/server/nodes/26.js'),
			() => import('../output/server/nodes/27.js'),
			() => import('../output/server/nodes/28.js'),
			() => import('../output/server/nodes/29.js'),
			() => import('../output/server/nodes/30.js')
		],
		routes: [
			{
				id: "/(app)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/discover",
				pattern: /^\/discover\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/discover/following",
				pattern: /^\/discover\/following\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/discover/new",
				pattern: /^\/discover\/new\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/discover/search",
				pattern: /^\/discover\/search\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(game)/editor",
				pattern: /^\/editor\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/(game)/games/[id]",
				pattern: /^\/games\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/(app)/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(app)/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/(app)/logout/_server.ts.js')
			},
			{
				id: "/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/(app)/profile/[username]",
				pattern: /^\/profile\/([^/]+?)\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(app)/profile/[username]/followers",
				pattern: /^\/profile\/([^/]+?)\/followers\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(app)/profile/[username]/following",
				pattern: /^\/profile\/([^/]+?)\/following\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(app)/profile/[username]/games",
				pattern: /^\/profile\/([^/]+?)\/games\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(app)/profile/[username]/likes",
				pattern: /^\/profile\/([^/]+?)\/likes\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(app)/saves",
				pattern: /^\/saves\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(app)/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial",
				pattern: /^\/tutorial\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/controllable",
				pattern: /^\/tutorial\/controllable\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/controls",
				pattern: /^\/tutorial\/controls\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/editor",
				pattern: /^\/tutorial\/editor\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/effector",
				pattern: /^\/tutorial\/effector\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/interactable",
				pattern: /^\/tutorial\/interactable\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/merger",
				pattern: /^\/tutorial\/merger\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/pusher",
				pattern: /^\/tutorial\/pusher\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(app)/tutorial/ruleboxes",
				pattern: /^\/tutorial\/ruleboxes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
