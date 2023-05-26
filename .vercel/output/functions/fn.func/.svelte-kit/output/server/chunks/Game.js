import { t as assign, u as now, w as loop, x as identity, c as create_ssr_component, a as subscribe, p as onMount, g as createEventDispatcher, b as escape, n as null_to_empty, e as each, f as add_styles, y as set_store_value, d as add_attribute } from "./index3.js";
import { w as writable } from "./index2.js";
import { k as currentEmoji, n as currentColor, E as EditableMap, b as Effector, o as Entity } from "./store.js";
import { j as DEFAULT_MAP_CLASS, i as DEFAULT_SIDE_LENGTH, k as MAX_INVENTORY_SIZE } from "./constants.js";
/* empty css                                    */function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const css = {
  code: ":root{--off:-25%}.KeyW.svelte-isv29t{top:var(--off)}.KeyA.svelte-isv29t{left:var(--off)}.KeyS.svelte-isv29t{bottom:var(--off)}.KeyD.svelte-isv29t{right:var(--off)}.equipped.svelte-isv29t{scale:120%;border-width:2px}@keyframes svelte-isv29t-effector{100%{transform:scale(0.618)}}.up.svelte-isv29t{animation:svelte-isv29t-up 100ms linear}.down.svelte-isv29t{animation:svelte-isv29t-down 100ms linear}.right.svelte-isv29t{animation:svelte-isv29t-right 100ms linear}.left.svelte-isv29t{animation:svelte-isv29t-left 100ms linear}@keyframes svelte-isv29t-up{100%{transform:translateY(-20px)}}@keyframes svelte-isv29t-down{100%{transform:translateY(20px)}}@keyframes svelte-isv29t-right{100%{transform:translateX(20px)}}@keyframes svelte-isv29t-left{100%{transform:translateX(-20px)}}.effector.svelte-isv29t{animation:svelte-isv29t-effector 1000ms linear infinite alternate;scale:0.618}progress.svelte-isv29t::-webkit-progress-value{background:var(--controllable)}",
  map: null
};
const Game = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentEmoji, $$unsubscribe_currentEmoji;
  let $currentColor, $$unsubscribe_currentColor;
  let $progress, $$unsubscribe_progress;
  $$unsubscribe_currentEmoji = subscribe(currentEmoji, (value) => $currentEmoji = value);
  $$unsubscribe_currentColor = subscribe(currentColor, (value) => $currentColor = value);
  let { dt = /* @__PURE__ */ new Map() } = $$props;
  let { map = new EditableMap(/* @__PURE__ */ new Map()) } = $$props;
  let { pushers = /* @__PURE__ */ new Map() } = $$props;
  let { mergers = /* @__PURE__ */ new Map() } = $$props;
  let { interactables = /* @__PURE__ */ new Map() } = $$props;
  let { controllables = /* @__PURE__ */ new Map() } = $$props;
  let { effectors = /* @__PURE__ */ new Map() } = $$props;
  let { sequencers = /* @__PURE__ */ new Map() } = $$props;
  let { mapClass = DEFAULT_MAP_CLASS } = $$props;
  let { SIZE = DEFAULT_SIDE_LENGTH } = $$props;
  let { showHP = true } = $$props;
  let { showInventory = true } = $$props;
  let collideables = /* @__PURE__ */ new Map();
  let ac = -2;
  let currentSection = map.ssi;
  let directionKey = "KeyD";
  let currentInventoryIndex = 0;
  let entities = /* @__PURE__ */ new Map();
  let colors = new Map(map.colors);
  let backgrounds = new Map(map.backgrounds);
  let _interactables = {};
  let _controllables = {};
  let _effectors = {};
  for (let [id, controllable] of structuredClone(controllables)) {
    const { emoji, sideEffects, ...args } = controllable;
    if (emoji === "")
      continue;
    _controllables[emoji] = {};
    Object.assign(_controllables[emoji], args);
    _controllables[emoji].id = id;
    _controllables[emoji].sideEffects = {};
    for (let [id2, effect] of sideEffects) {
      let effector = structuredClone(effectors.get(id2));
      if (!effector)
        continue;
      _controllables[emoji].sideEffects[effector.emoji] = effect;
    }
  }
  for (let [id, effector] of effectors) {
    const { emoji, ...args } = effector;
    if (!emoji)
      continue;
    _effectors[emoji] = {};
    Object.assign(_effectors[emoji], args);
  }
  for (let [id, interactable] of structuredClone(interactables)) {
    const { emoji, sideEffects, ...args } = interactable;
    if (!emoji || !sideEffects)
      continue;
    _interactables[emoji] = {};
    Object.assign(_interactables[emoji], args);
    _interactables[emoji].id = id;
    _interactables[emoji].sideEffects = {};
    for (let [id2, effect, triggerID] of sideEffects) {
      if (effect == "trigger") {
        let sequencer = structuredClone(sequencers.get(triggerID));
        effect = sequencer?.sequence || [];
      }
      if (id2 === "any") {
        _interactables[emoji].sideEffects.any = effect;
        continue;
      }
      let effector = structuredClone(effectors.get(id2));
      if (!effector)
        continue;
      _interactables[emoji].sideEffects[effector.emoji] = effect;
    }
    const dropsID = _interactables[emoji].drops[0];
    if (dropsID) {
      _interactables[emoji].drops[0] = effectors.get(dropsID)?.emoji || "";
    }
  }
  let handDirection = "";
  onMount(() => {
    set_store_value(currentColor, [$currentColor, $currentEmoji] = ["", ""], $currentColor, currentEmoji.set($currentEmoji));
  });
  createEventDispatcher();
  const keys = {
    KeyW: { emoji: "up-arrow", operation: -SIZE },
    KeyA: { emoji: "left-arrow", operation: -1 },
    KeyS: { emoji: "down-arrow", operation: SIZE },
    KeyD: { emoji: "right-arrow", operation: 1 }
  };
  function initEntities() {
    for (let [id, _emoji] of map.items) {
      if (_effectors[_emoji]) {
        let { hp, type } = _effectors[_emoji];
        if (type == "collideable" || type == "both") {
          collideables.set(id, new Effector(_emoji, hp, type));
        } else {
          entities.set(id, new Effector(_emoji, hp, type));
        }
      } else if (_controllables[_emoji] || _interactables[_emoji]) {
        entities.set(id, new Entity(_emoji, /* @__PURE__ */ new Map(), 1));
      } else {
        entities.set(id, new Entity(_emoji));
      }
    }
    for (let [id, item] of entities) {
      if (item instanceof Effector)
        continue;
      if (ac === -2 && +id.split("_")[0] === currentSection && _controllables[item.emoji]) {
        ac = +id.split("_")[1];
        directionKey = "KeyD";
        if (item.hp) {
          item.hp.max = _controllables[item.emoji]?.hp || 1;
          item.hp.current = _controllables[item.emoji]?.hp || 1;
          return;
        }
      }
      if (item.hp) {
        item.hp.max = _interactables[item.emoji]?.hp || 1;
        item.hp.current = _interactables[item.emoji]?.hp || 1;
      }
    }
  }
  initEntities();
  let player = entities.get(currentSection + "_" + ac);
  let numbers = /* @__PURE__ */ new Map();
  for (let i = 0; i <= 100; i++) {
    numbers.set(i, i / 100);
  }
  function calcPlayerHpPercentage() {
    if (!player)
      return 0;
    let { hp } = player;
    if (!hp)
      return 0;
    if (hp.current > hp.max)
      return 1;
    return numbers.get(Math.floor(hp.current * 100 / hp.max)) || 0;
  }
  let progress = tweened(calcPlayerHpPercentage(), { duration: 200, easing: cubicOut });
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  let _collisions = {};
  for (let [id, _slots] of [...mergers, ...pushers]) {
    let [key1, key2, val] = _slots;
    if (key1 === "")
      continue;
    if (!_collisions[key1]) {
      _collisions[key1] = {};
    }
    _collisions[key1][key2] = val;
    if (val != "push" && key1 != key2) {
      if (!_collisions[key2]) {
        _collisions[key2] = {};
      }
      _collisions[key2][key1] = val;
    }
  }
  if ($$props.dt === void 0 && $$bindings.dt && dt !== void 0)
    $$bindings.dt(dt);
  if ($$props.map === void 0 && $$bindings.map && map !== void 0)
    $$bindings.map(map);
  if ($$props.pushers === void 0 && $$bindings.pushers && pushers !== void 0)
    $$bindings.pushers(pushers);
  if ($$props.mergers === void 0 && $$bindings.mergers && mergers !== void 0)
    $$bindings.mergers(mergers);
  if ($$props.interactables === void 0 && $$bindings.interactables && interactables !== void 0)
    $$bindings.interactables(interactables);
  if ($$props.controllables === void 0 && $$bindings.controllables && controllables !== void 0)
    $$bindings.controllables(controllables);
  if ($$props.effectors === void 0 && $$bindings.effectors && effectors !== void 0)
    $$bindings.effectors(effectors);
  if ($$props.sequencers === void 0 && $$bindings.sequencers && sequencers !== void 0)
    $$bindings.sequencers(sequencers);
  if ($$props.mapClass === void 0 && $$bindings.mapClass && mapClass !== void 0)
    $$bindings.mapClass(mapClass);
  if ($$props.SIZE === void 0 && $$bindings.SIZE && SIZE !== void 0)
    $$bindings.SIZE(SIZE);
  if ($$props.showHP === void 0 && $$bindings.showHP && showHP !== void 0)
    $$bindings.showHP(showHP);
  if ($$props.showInventory === void 0 && $$bindings.showInventory && showInventory !== void 0)
    $$bindings.showInventory(showInventory);
  $$result.css.add(css);
  player = entities.get(currentSection + "_" + ac);
  $$unsubscribe_currentEmoji();
  $$unsubscribe_currentColor();
  $$unsubscribe_progress();
  return `

<div class="relative flex h-full flex-col items-center justify-center">${ac != -2 && showHP ? (() => {
    let playerHP = $progress * (player?.hp?.max || 1);
    return `
			<div class="flex h-full w-64 flex-grow flex-row items-center justify-center"><i class="${"twa z-10 text-2xl twa-" + escape(player?.emoji, true) + " svelte-isv29t"}"></i>
				<progress title="Health Bar" class="progress h-8 svelte-isv29t"${add_attribute("value", $progress, 0)}></progress>
				<p class="absolute pl-6">${escape(Number.isInteger(playerHP) ? playerHP : playerHP.toFixed(1))}</p></div>`;
  })() : ``}
	<div class="${escape(null_to_empty(mapClass), true) + " svelte-isv29t"}">${``}
		${each({ length: SIZE * SIZE }, (_, i) => {
    let active = ac === i, item = entities.get(currentSection + "_" + i), collideable = collideables.get(`${currentSection}_${i}`), background = backgrounds.get(`${currentSection}_${i}`), hand = player?.inventory?.get(currentInventoryIndex)?.emoji || keys[directionKey].emoji;
    return `
			
			
			
			
			<div class="cell"${add_styles({
      "background": colors.get(`${currentSection}_${i}`) || map.dbg
    })}>${collideable ? `<div class="absolute z-[2] scale-150"><i class="${"twa twa-" + escape(collideable.emoji, true) + " svelte-isv29t"}"></i>
					</div>` : ``}
				${active ? `<div class="${"absolute z-[3] text-base " + escape(directionKey, true) + " " + escape(handDirection, true) + " svelte-isv29t"}"><i class="${"twa twa-" + escape(hand, true) + " svelte-isv29t"}"></i>
					</div>` : ``}
				${item ? (() => {
      let effector = item instanceof Effector;
      return `
					<span class="${["svelte-isv29t", effector ? "effector" : ""].join(" ").trim()}"><i class="${"twa twa-" + escape(item.emoji, true) + " svelte-isv29t"}"></i>
					</span>`;
    })() : `<i class="${"twa scale-75 opacity-50 twa-" + escape(background, true) + " svelte-isv29t"}"></i>`}
			</div>`;
  })}</div>
	${ac != -2 && showInventory ? `<div title="Inventory" class="relative flex h-full w-full flex-row items-center justify-center gap-2">${each({ length: MAX_INVENTORY_SIZE }, (_, i) => {
    let item = player?.inventory.get(i), equipped = i === currentInventoryIndex, isEffector = item instanceof Effector;
    return `
					
					
					<div class="${[
      "relative flex h-10 w-10 flex-col items-center justify-center rounded border " + escape(
        isEffector ? "border-purple-500 bg-purple-50" : "border-black bg-base-300",
        true
      ) + " p-2 2xl:h-12 2xl:w-12 svelte-isv29t",
      equipped ? "equipped" : ""
    ].join(" ").trim()}">${item && item.hp !== "Infinite" ? `<i class="${"twa twa-" + escape(item.emoji || "", true) + " svelte-isv29t"}"></i>
							<div class="${escape(isEffector ? "" : "hidden", true) + " absolute -top-0.5 right-0.5 text-sm"}">${escape(item.hp > 1 ? item.hp : "")}
							</div>` : ``}</div>
					${isEffector && equipped ? `<div class="${"absolute " + escape(SIZE == DEFAULT_SIDE_LENGTH ? "bottom-4" : "-bottom-12", true)}"><kbd class="kbd">F</kbd> to apply
							<i class="${"twa twa-" + escape(item.emoji, true) + " svelte-isv29t"}"></i> on self.
						</div>` : ``}`;
  })}</div>` : ``}
</div>`;
});
export {
  Game as G
};
