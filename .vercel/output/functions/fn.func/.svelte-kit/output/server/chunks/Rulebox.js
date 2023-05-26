import { c as create_ssr_component, a as subscribe, e as each, b as escape, o as onDestroy, d as add_attribute, f as add_styles, p as onMount, q as merge_ssr_styles, v as validate_component } from "./index3.js";
import { r as rbxStore, m as movementStore, a as rbxSelected, b as rbxIdSelected } from "./Rulebox.svelte_svelte_type_style_lang.js";
import { c as sequencers, S as Sequencer, i as interactables, d as controllables, e as effectors, f as mergers, p as pushers, b as Effector, C as Controllable, a as Evolve, D as Devolve, I as Interactable, g as formattedEmoji, h as map, j as dialogueTree } from "./store.js";
import { h as MAX_SIDE_EFFECT, E as EFFECTOR_BORDER, C as CROSS, p as palette, i as DEFAULT_SIDE_LENGTH } from "./constants.js";
import "./notifications.js";
const ContextMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $sequencers, $$unsubscribe_sequencers;
  $$unsubscribe_sequencers = subscribe(sequencers, (value) => $sequencers = value);
  let { position } = $$props;
  function spawn(component, value) {
    const id = rbxStore.spawn(component, position);
    switch (component) {
      case "pusher":
        pushers.add(id, value);
        break;
      case "merger":
        mergers.add(id, value);
        break;
      case "effector":
        effectors.add(id, value);
        break;
      case "controllable":
        controllables.add(id, value);
        break;
      case "interactable":
        interactables.add(id, value);
        break;
      case "sequencer":
        sequencers.add(id, value);
        break;
    }
  }
  let menuItems = [
    {
      name: "Pusher",
      onClick: () => spawn("pusher", ["", "", "push"])
    },
    {
      name: "Merger",
      onClick: () => spawn("merger", ["", "", ""])
    },
    {
      name: "Effector",
      onClick: () => spawn("effector", new Effector("", 1, "equippable"))
    },
    {
      name: "Controllable",
      onClick: () => spawn("controllable", new Controllable("", 1, [], new Evolve("", 2), new Devolve("")))
    },
    {
      name: "Interactable",
      onClick: () => spawn("interactable", new Interactable("", "-1", 1, [["any", "talk", "none"]], new Evolve("", 2), new Devolve(""), ["-1", 0]))
    },
    {
      name: "Sequencer",
      onClick: () => spawn("sequencer", new Sequencer("Event_" + $sequencers.size, []))
    }
  ];
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$unsubscribe_sequencers();
  return `<ul class="w-full bg-white">${each(menuItems, ({ name, onClick }) => {
    return `<button class="${escape(name, true) + " box-border h-8 w-full p-1 text-start"}">${escape(name)}
		</button>`;
  })}</ul>`;
});
const css$1 = {
  code: ".enabled.svelte-1yjl60b{opacity:1}",
  map: null
};
const Interactable_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let droppables;
  let $effectors, $$unsubscribe_effectors;
  let $$unsubscribe_formattedEmoji;
  let $$unsubscribe_interactables;
  let $sequencers, $$unsubscribe_sequencers;
  $$unsubscribe_effectors = subscribe(effectors, (value) => $effectors = value);
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => value);
  $$unsubscribe_interactables = subscribe(interactables, (value) => value);
  $$unsubscribe_sequencers = subscribe(sequencers, (value) => $sequencers = value);
  let hps = [];
  let modifierPoints = [];
  for (let i = 0; i < 100; i++) {
    hps[i] = i + 1;
    modifierPoints[i] = i + 1;
  }
  modifierPoints.unshift("trigger");
  modifierPoints.unshift("talk");
  for (let i = 0; i >= -100; i--) {
    modifierPoints.unshift(i);
  }
  let { id } = $$props;
  let { emoji = "" } = $$props;
  let { sequenceID = "-1" } = $$props;
  let { hp = 1 } = $$props;
  let { sideEffects = [["any", "talk", "none"]] } = $$props;
  let { pseudoSideEffects = [] } = $$props;
  let { evolve = new Evolve("", 2) } = $$props;
  let { devolve = new Devolve("") } = $$props;
  let { drops = ["-1", 1] } = $$props;
  function updateStore() {
    interactables.update(id, new Interactable(emoji, sequenceID, hp, sideEffects, evolve, devolve, drops));
  }
  onDestroy(() => {
    updateStore();
  });
  let hasInteraction = true;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.emoji === void 0 && $$bindings.emoji && emoji !== void 0)
    $$bindings.emoji(emoji);
  if ($$props.sequenceID === void 0 && $$bindings.sequenceID && sequenceID !== void 0)
    $$bindings.sequenceID(sequenceID);
  if ($$props.hp === void 0 && $$bindings.hp && hp !== void 0)
    $$bindings.hp(hp);
  if ($$props.sideEffects === void 0 && $$bindings.sideEffects && sideEffects !== void 0)
    $$bindings.sideEffects(sideEffects);
  if ($$props.pseudoSideEffects === void 0 && $$bindings.pseudoSideEffects && pseudoSideEffects !== void 0)
    $$bindings.pseudoSideEffects(pseudoSideEffects);
  if ($$props.evolve === void 0 && $$bindings.evolve && evolve !== void 0)
    $$bindings.evolve(evolve);
  if ($$props.devolve === void 0 && $$bindings.devolve && devolve !== void 0)
    $$bindings.devolve(devolve);
  if ($$props.drops === void 0 && $$bindings.drops && drops !== void 0)
    $$bindings.drops(drops);
  $$result.css.add(css$1);
  hasInteraction = sideEffects.some((m) => m[1] != 0);
  droppables = [...$effectors].filter(([id2, e]) => e.emoji != "");
  evolve.at = hp > evolve.at ? hp + 1 : evolve.at;
  $$unsubscribe_effectors();
  $$unsubscribe_formattedEmoji();
  $$unsubscribe_interactables();
  $$unsubscribe_sequencers();
  return `<div class="absolute -top-8 flex flex-row items-center justify-center gap-2"><div class="flex scale-75 flex-col items-center justify-center"><button title="Devolve Emoji" class="slot-lg"><i class="${"twa twa-" + escape(devolve.to, true) + " svelte-1yjl60b"}"></i></button>
		<div class="absolute -bottom-4"><select disabled class="select-bordered select select-sm text-xl" title="HP"><option${add_attribute("value", 0, 0)}>0</option></select></div>
		<div class="absolute -bottom-12">Devolve</div></div>
	<div class="flex flex-col items-center justify-center"><button title="Interactable Emoji" class="slot-lg"><i class="${"twa twa-" + escape(emoji, true) + " svelte-1yjl60b"}"></i></button>
		<div class="absolute -bottom-4"><select class="select-bordered select select-sm text-xl" title="HP">${each(hps, (_hp) => {
    return `<option${add_attribute("value", _hp, 0)}>${escape(_hp)}</option>`;
  })}</select></div></div>
	<div class="flex scale-75 flex-col items-center justify-center"><button title="Evolve Emoji" class="slot-lg"><i class="${"twa twa-" + escape(evolve.to, true) + " svelte-1yjl60b"}"></i></button>
		<div class="absolute -bottom-4"><select class="select-bordered select select-sm text-xl" title="HP">${each(hps, (_hp) => {
    return `<option${add_attribute("value", _hp, 0)}>${escape(_hp)}</option>`;
  })}</select></div>
		<div class="absolute -bottom-12">Evolve</div></div></div>
<main class="flex w-full flex-col items-center justify-center gap-4 pt-16"><div class="form-control flex w-full flex-col p-4"><div class="divider flex flex-row pb-6"><p>SIDE EFFECTS (${escape(sideEffects.length)} / ${escape(MAX_SIDE_EFFECT)})</p>
			${emoji ? `<div class="dropdown-right dropdown">
					<label for="" tabindex="0" class="${"btn text-2xl " + escape(emoji ? "bg-purple-500" : "pointer-events bg-purple-100", true)}"${add_styles({ "background": EFFECTOR_BORDER })}>+</label>
					
					<ul tabindex="0" class="dropdown-content menu rounded-box bg-base-100 p-2 shadow">${droppables.length ? each(droppables, ([id2, { emoji: emoji2 }]) => {
    return `<button class="rounded-md p-1 hover:bg-base-200"><i class="${"twa twa-" + escape(emoji2, true) + " svelte-1yjl60b"}"></i>
							</button>`;
  }) : `<div class="rounded-md p-1">No effectors defined.</div>`}</ul></div>` : ``}</div>
		${!hasInteraction ? `<p class="text-error">An interactable needs at least one side effect with positive or negative
				value to be interactable!
			</p>` : ``}
		<div class="flex items-center justify-center px-12"><div class="flex w-fit flex-wrap items-start justify-start gap-x-9 gap-y-14">${each(sideEffects, ([effectorID, value, triggerID], i) => {
    let modifierEmoji = $effectors.get(effectorID)?.emoji;
    return `
					<div class="relative flex flex-col items-center">${value == "trigger" ? `<select title="Sequencer name" name="Sequence name" class="select-bordered select select-sm absolute -bottom-10 border-amber-500"><option value="none">none</option>${each([...$sequencers], ([id2, sequencer]) => {
      return `<option${add_attribute("value", id2, 0)}>${escape(sequencer.name)}</option>`;
    })}</select>` : ``}
						${effectorID === "any" ? `<div class="slot-lg scale-75">${escape(effectorID)}
							</div>` : `${modifierEmoji ? `<button class="absolute -right-2 -top-2 text-lg">${escape(CROSS)}</button>
							<div class="slot-lg scale-75"><i class="${"twa twa-" + escape(modifierEmoji, true) + " svelte-1yjl60b"}"></i>
							</div>` : ``}`}
						<select class="select-bordered select select-sm absolute -bottom-4">${each(modifierPoints, (point) => {
      return `<option${add_attribute("value", point, 0)}>${escape(typeof point === "number" && point > 0 ? `+${point}` : point)}</option>`;
    })}</select>
					</div>`;
  })}
				${each(pseudoSideEffects, ([emoji2, value]) => {
    return `<div class="relative flex flex-col items-center"><button class="absolute -right-2 -top-2 text-lg">${escape(CROSS)}</button>
						<div class="slot-lg scale-75"><i class="${"twa twa-" + escape(emoji2, true) + " svelte-1yjl60b"}"></i></div>
						<select class="select-bordered select select-sm absolute -bottom-4"><option selected${add_attribute("value", value, 0)}>${escape(value)}</option><option value="+100">+100</option></select>
					</div>`;
  })}</div></div></div>
	<div class="flex w-full flex-col items-center justify-center p-4"><div class="divider w-full">DROPS</div>
		<div class="relative flex flex-col items-center justify-center"><div class="dropdown-right dropdown cursor-pointer">
				
				<label tabindex="0" class="slot-lg m-1"><i class="${"twa twa-" + escape($effectors.get(drops[0])?.emoji || drops[0], true) + " svelte-1yjl60b"}"></i></label>
				
				<ul tabindex="0" class="dropdown-content menu rounded-box w-fit bg-base-100 p-2 shadow">${droppables.length ? each(droppables, ([id2, { emoji: emoji2 }]) => {
    return `<button class="w-fit rounded-md p-1 hover:bg-base-200"><i class="${"twa twa-" + escape(emoji2, true) + " svelte-1yjl60b"}"></i>
						</button>`;
  }) : `<div class="rounded-md p-1">No effectors defined.</div>`}</ul></div>
			<div class="absolute -bottom-4"><select class="select-bordered select select-sm text-xl" title="HP">${each([0, ...hps], (_hp) => {
    return `<option${add_attribute("value", _hp, 0)}>${escape(_hp)}</option>`;
  })}</select></div></div></div>
</main>`;
});
const Pusher = create_ssr_component(($$result, $$props, $$bindings, slots$1) => {
  let $$unsubscribe_formattedEmoji;
  let $$unsubscribe_pushers;
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => value);
  $$unsubscribe_pushers = subscribe(pushers, (value) => value);
  let { id } = $$props;
  let { slots = ["", "", "push"] } = $$props;
  onDestroy(() => {
    if (slots.includes("")) {
      pushers.remove(id);
      rbxStore.remove(id);
    }
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.slots === void 0 && $$bindings.slots && slots !== void 0)
    $$bindings.slots(slots);
  $$unsubscribe_formattedEmoji();
  $$unsubscribe_pushers();
  return `<div class="flex h-full flex-row items-center justify-center gap-2"><button class="slot"><i class="${"twa twa-" + escape(slots[0], true)}"></i></button>
	<i class="twa twa-dashing-away text-2xl"></i>
	
	<button class="slot"><i class="${"twa twa-" + escape(slots[1], true)}"></i></button></div>`;
});
const Merger = create_ssr_component(($$result, $$props, $$bindings, slots$1) => {
  let $$unsubscribe_formattedEmoji;
  let $$unsubscribe_mergers;
  let $$unsubscribe_pushers;
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => value);
  $$unsubscribe_mergers = subscribe(mergers, (value) => value);
  $$unsubscribe_pushers = subscribe(pushers, (value) => value);
  let { id } = $$props;
  let { slots = ["", "", ""] } = $$props;
  onDestroy(() => {
    if (slots.includes("")) {
      mergers.remove(id);
      rbxStore.remove(id);
    }
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.slots === void 0 && $$bindings.slots && slots !== void 0)
    $$bindings.slots(slots);
  $$unsubscribe_formattedEmoji();
  $$unsubscribe_mergers();
  $$unsubscribe_pushers();
  return `<div class="flex h-full flex-row items-center justify-center gap-2"><button class="slot"><i class="${"twa twa-" + escape(slots[0], true)}"></i></button>
	<div class="text-2xl">+</div>
	<button class="slot"><i class="${"twa twa-" + escape(slots[1], true)}"></i></button>
	<div class="text-2xl">=</div>
	<button class="slot"><i class="${"twa twa-" + escape(slots[2], true)}"></i></button></div>`;
});
const Effector_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_formattedEmoji;
  let $$unsubscribe_effectors;
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => value);
  $$unsubscribe_effectors = subscribe(effectors, (value) => value);
  let { id } = $$props;
  let { emoji = "" } = $$props;
  let { hp = 1 } = $$props;
  let { type = "equippable" } = $$props;
  let modifierPoints = ["Infinite"];
  for (let i = 1; i <= 100; i++) {
    modifierPoints[i] = i;
  }
  onDestroy(() => {
    if (emoji === "") {
      effectors.remove(id);
      return;
    }
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.emoji === void 0 && $$bindings.emoji && emoji !== void 0)
    $$bindings.emoji(emoji);
  if ($$props.hp === void 0 && $$bindings.hp && hp !== void 0)
    $$bindings.hp(hp);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  $$unsubscribe_formattedEmoji();
  $$unsubscribe_effectors();
  return `<div class="absolute -top-8 flex flex-col items-center justify-center gap-2"><div class="relative flex flex-col items-center justify-center"><button class="slot-lg"><i class="${"twa twa-" + escape(emoji, true)}"></i></button>
		<div class="absolute -bottom-4"><select class="select-bordered select select-sm text-xl" title="sideEffect">${each(modifierPoints, (point) => {
    return `<option${add_attribute("value", point, 0)}>${escape(point)}</option>`;
  })}</select></div></div>
	<div class="flex flex-col items-start pt-8"><label class="label cursor-pointer" title="Collideable"><input class="radio checked:bg-purple-500" name="type" value="collideable" type="radio"${"collideable" === type ? add_attribute("checked", true, 1) : ""}>
			<span class="label-text pl-4 text-lg"><i class="twa twa-collision"></i></span></label>
		<label class="label cursor-pointer" title="Equippable"><input class="radio checked:bg-purple-500" name="type" value="equippable" type="radio"${"equippable" === type ? add_attribute("checked", true, 1) : ""}>
			<span class="label-text pl-4 text-lg"><i class="twa twa-gloves"></i></span></label>
		<label class="label cursor-pointer" title="Collideable & Equippable"><input class="radio checked:bg-purple-500" name="type" value="both" type="radio"${"both" === type ? add_attribute("checked", true, 1) : ""}>
			<span class="label-text pl-4 text-lg"><i class="twa twa-collision"></i>
				&amp;
				<i class="twa twa-gloves"></i></span></label></div></div>`;
});
const Controllable_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let droppables;
  let $effectors, $$unsubscribe_effectors;
  let $$unsubscribe_formattedEmoji;
  let $$unsubscribe_controllables;
  $$unsubscribe_effectors = subscribe(effectors, (value) => $effectors = value);
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => value);
  $$unsubscribe_controllables = subscribe(controllables, (value) => value);
  let hps = [];
  let modifierPoints = [];
  for (let i = 0; i < 100; i++) {
    hps[i] = i + 1;
    modifierPoints[i] = i + 1;
  }
  for (let i = 0; i >= -100; i--) {
    modifierPoints.unshift(i);
  }
  let { id } = $$props;
  let { emoji = "" } = $$props;
  let { hp = 1 } = $$props;
  let { sideEffects = [] } = $$props;
  let { pseudoSideEffects = [] } = $$props;
  let { evolve = new Evolve("", 2) } = $$props;
  let { devolve = new Devolve("") } = $$props;
  function updateStore() {
    controllables.update(id, new Controllable(emoji, hp, sideEffects, evolve, devolve));
  }
  onDestroy(() => {
    updateStore();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.emoji === void 0 && $$bindings.emoji && emoji !== void 0)
    $$bindings.emoji(emoji);
  if ($$props.hp === void 0 && $$bindings.hp && hp !== void 0)
    $$bindings.hp(hp);
  if ($$props.sideEffects === void 0 && $$bindings.sideEffects && sideEffects !== void 0)
    $$bindings.sideEffects(sideEffects);
  if ($$props.pseudoSideEffects === void 0 && $$bindings.pseudoSideEffects && pseudoSideEffects !== void 0)
    $$bindings.pseudoSideEffects(pseudoSideEffects);
  if ($$props.evolve === void 0 && $$bindings.evolve && evolve !== void 0)
    $$bindings.evolve(evolve);
  if ($$props.devolve === void 0 && $$bindings.devolve && devolve !== void 0)
    $$bindings.devolve(devolve);
  droppables = [...$effectors].filter(([id2, e]) => e.emoji != "");
  evolve.at = hp > evolve.at ? hp + 1 : evolve.at;
  $$unsubscribe_effectors();
  $$unsubscribe_formattedEmoji();
  $$unsubscribe_controllables();
  return `<div class="absolute -top-8 flex flex-row items-center justify-center gap-2"><div class="flex scale-75 flex-col items-center justify-center"><button title="Devolve Emoji" class="slot-lg"><i class="${"twa twa-" + escape(devolve.to, true)}"></i></button>
		<div class="absolute -bottom-4"><select disabled class="select-bordered select select-sm text-xl" title="HP"><option${add_attribute("value", 0, 0)}>0</option></select></div>
		<div class="absolute -bottom-12">Devolve</div></div>
	<div class="flex flex-col items-center justify-center"><button title="Controllable Emoji" class="slot-lg"><i class="${"twa twa-" + escape(emoji, true)}"></i></button>
		<div class="absolute -bottom-4"><select class="select-bordered select select-sm text-xl" title="HP">${each(hps, (_hp) => {
    return `<option${add_attribute("value", _hp, 0)}>${escape(_hp)}</option>`;
  })}</select></div></div>
	<div class="flex scale-75 flex-col items-center justify-center"><button title="Evolve Emoji" class="slot-lg"><i class="${"twa twa-" + escape(evolve.to, true)}"></i></button>
		<div class="absolute -bottom-4"><select class="select-bordered select select-sm text-xl" title="HP">${each(hps, (_hp) => {
    return `<option${add_attribute("value", _hp, 0)}>${escape(_hp)}</option>`;
  })}<option${add_attribute("value", 101, 0)}>${escape(101)}</option></select></div>
		<div class="absolute -bottom-12">Evolve</div></div></div>
<main class="flex w-full flex-col items-center justify-center gap-4 pt-16"><div class="form-control flex w-full flex-col p-4"><div class="divider flex flex-row pb-6"><p>SIDE EFFECTS (${escape(sideEffects.length)} / ${escape(MAX_SIDE_EFFECT)})</p>
			<div class="dropdown-right dropdown">
				<label for="" tabindex="0" class="btn text-2xl"${add_styles({ "background": EFFECTOR_BORDER })}>+</label>
				
				<ul tabindex="0" class="dropdown-content menu rounded-box bg-base-100 p-2 shadow">${droppables.length ? each(droppables, ([id2, { emoji: emoji2 }]) => {
    return `<button class="rounded-md p-1 hover:bg-base-200"><i class="${"twa twa-" + escape(emoji2, true)}"></i>
						</button>`;
  }) : `<div class="rounded-md p-1">No equippables defined.</div>`}</ul></div></div>
		<div class="flex items-center justify-center px-12"><div class="flex w-fit flex-wrap items-start justify-start gap-8">${each(sideEffects, ([effectorID, value], i) => {
    let modifierEmoji = $effectors.get(effectorID)?.emoji;
    return `
					<div class="relative flex flex-col items-center">${effectorID === "any" ? `<div class="slot-lg scale-75">${escape(effectorID)}</div>
							<select class="select-bordered select select-sm absolute -bottom-4">${each(modifierPoints, (point) => {
      return `<option${add_attribute("value", point, 0)}>${escape(point > 0 ? `+${point}` : point)}</option>`;
    })}</select>` : `${modifierEmoji ? `<button class="absolute -right-2 -top-2 text-lg">${escape(CROSS)}</button>
							<div class="slot-lg scale-75"><i class="${"twa twa-" + escape(modifierEmoji, true)}"></i></div>
							<select class="select-bordered select select-sm absolute -bottom-4">${each(modifierPoints, (point) => {
      return `<option${add_attribute("value", point, 0)}>${escape(point > 0 ? `+${point}` : point)}</option>`;
    })}</select>` : `<div></div>`}`}
					</div>`;
  })}
				${each(pseudoSideEffects, ([emoji2, value]) => {
    return `<div class="relative flex flex-col items-center"><button class="absolute -right-2 -top-2 text-lg">${escape(CROSS)}</button>
						<div class="slot-lg scale-75"><i class="${"twa twa-" + escape(emoji2, true)}"></i></div>
						<select class="select-bordered select select-sm absolute -bottom-4"><option selected${add_attribute("value", value, 0)}>${escape(value)}</option><option value="+100">+100</option></select>
					</div>`;
  })}</div></div></div></main>`;
});
const Sequencer_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_formattedEmoji;
  let $map, $$unsubscribe_map;
  let $sequencers, $$unsubscribe_sequencers;
  $$unsubscribe_formattedEmoji = subscribe(formattedEmoji, (value) => value);
  $$unsubscribe_map = subscribe(map, (value) => $map = value);
  $$unsubscribe_sequencers = subscribe(sequencers, (value) => $sequencers = value);
  let { id } = $$props;
  let { name } = $$props;
  let { sequence = [] } = $$props;
  onMount(() => {
    let obj = $sequencers.get(id);
    if (obj) {
      ({ name, sequence } = obj);
    }
  });
  let defaultBackground = $map.dbg;
  let indexes = [];
  let modifierPoints = [];
  for (let i = 0; i < 100; i++) {
    modifierPoints[i] = i + 1;
  }
  modifierPoints.unshift("talk");
  for (let i = 0; i >= -100; i--) {
    modifierPoints.unshift(i);
  }
  for (let i = 0; i < DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH; i++) {
    indexes[i] = i;
  }
  const types = {
    Map: ["spawn", "destroy"],
    Background: ["paint", "erase"],
    Game: ["reset", "complete"]
  };
  const typeDescriptions = {
    paint: "paint\n\nPaint the specificied cell in the current section.",
    erase: "erase\n\nErase a color from the specified cell in the current section.",
    spawn: "spawn\n\nSpawn an emoji in the specified cell.",
    // spawnRTP:
    // 	'spawnRTP\n\nGiven player is the origin (x: 0, y: 0);\nprovide X and Y values to spawn an object relative to player.',
    destroy: "destory\n\nDestroy the emoji in the specified cell.",
    reset: "reset\n\nReset the game state to default.",
    complete: "complete\n\nComplete the game."
  };
  const typeIcons = {
    // Player: '👾',
    Map: "🗺️",
    Background: "🖌️",
    Game: "🎬"
  };
  let type = types.Map[0];
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.sequence === void 0 && $$bindings.sequence && sequence !== void 0)
    $$bindings.sequence(sequence);
  $$unsubscribe_formattedEmoji();
  $$unsubscribe_map();
  $$unsubscribe_sequencers();
  return `<div class="flex w-full flex-col gap-2 p-4"><div class="divider">${`${escape(name)}
			<button title="Change name" class="btn-xs btn w-fit self-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg></button>`}</div>
	${each(sequence, (s, i) => {
    return `<span class="flex w-full flex-row items-center justify-center gap-2"><select class="select-bordered select"${add_attribute("title", typeDescriptions[s.type], 0)}>${each(Object.entries(types), ([group, values]) => {
      return `<optgroup${add_attribute("label", `${group} ${typeIcons[group]}`, 0)}>${each(values, (t) => {
        return `<option${add_attribute("value", t, 0)}>${escape(t)}</option>`;
      })}</optgroup>`;
    })}</select>
			${s.type === "spawn" ? `<button class="slot"><i class="${"twa twa-" + escape(s.emoji, true)}"></i></button>
				at
				<select class="select-bordered select" title="index" id="index">${each(indexes, (j) => {
      return `<option${add_attribute("value", j, 0)}>${escape(j)}</option>`;
    })}</select>` : `${s.type === "destroy" || s.type === "erase" ? `<select class="select-bordered select" title="index" id="index">${each(indexes, (j) => {
      return `<option${add_attribute("value", j, 0)}>${escape(j)}</option>`;
    })}</select>
				` : `${s.type === "paint" ? `<select class="select-bordered select" title="index" id="index">${each(indexes, (j) => {
      return `<option${add_attribute("value", j, 0)}>${escape(j)}</option>`;
    })}</select>
				to
				<select class="select-bordered select" title="color"${add_styles({ "background": s.background })}>${each(palette.filter((color) => color != defaultBackground), (color) => {
      return `<option${add_attribute("value", color, 0)}${add_styles({ "background": color })}></option>`;
    })}</select>` : ``}`}`}
			<div class="flex flex-grow justify-end"><button class="text-2xl" id="remove">${escape(CROSS)}</button></div>
		</span>`;
  })}
	<label class="flex items-center justify-center gap-2"><select class="select-bordered select"${add_attribute("title", typeDescriptions[type], 0)}>${each(Object.entries(types), ([group, values]) => {
    return `<optgroup${add_attribute("label", `${group} ${typeIcons[group]}`, 0)}>${each(values, (t) => {
      return `<option${add_attribute("value", t, 0)}>${escape(t)}</option>`;
    })}</optgroup>`;
  })}</select>
		<button class="btn text-2xl">+</button></label></div>`;
});
const css = {
  code: ".rulebox.svelte-g2nyvf{transition:height 150ms ease-out;position:absolute;display:flex;flex-direction:column;justify-content:start;align-items:center;-webkit-user-select:none;-moz-user-select:none;user-select:none;overscroll-behavior:auto;font-size:14px;text-align:center}",
  map: null
};
const Rulebox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_interactables;
  let $$unsubscribe_controllables;
  let $$unsubscribe_dialogueTree;
  let $$unsubscribe_movementStore;
  let $$unsubscribe_rbxSelected;
  let $$unsubscribe_rbxIdSelected;
  $$unsubscribe_interactables = subscribe(interactables, (value) => value);
  $$unsubscribe_controllables = subscribe(controllables, (value) => value);
  $$unsubscribe_dialogueTree = subscribe(dialogueTree, (value) => value);
  $$unsubscribe_movementStore = subscribe(movementStore, (value) => value);
  $$unsubscribe_rbxSelected = subscribe(rbxSelected, (value) => value);
  $$unsubscribe_rbxIdSelected = subscribe(rbxIdSelected, (value) => value);
  let { rbx } = $$props;
  let { props = {} } = $$props;
  if ($$props.rbx === void 0 && $$bindings.rbx && rbx !== void 0)
    $$bindings.rbx(rbx);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  $$result.css.add(css);
  $$unsubscribe_interactables();
  $$unsubscribe_controllables();
  $$unsubscribe_dialogueTree();
  $$unsubscribe_movementStore();
  $$unsubscribe_rbxSelected();
  $$unsubscribe_rbxIdSelected();
  return `

<div class="rulebox cursor-auto border-2 border-black shadow-xl svelte-g2nyvf" style="${"left: " + escape(rbx.position.x, true) + "px; top: " + escape(rbx.position.y, true) + "px; width: " + escape(rbx.width, true) + "px; height: " + escape(rbx.height, true) + "px; background-color: " + escape(rbx.bgColor, true) + ";"}" id="${"svelvet-" + escape(rbx.id, true)}"><nav class="min-h-6 w-full cursor-move"${add_styles({
    "display": rbx.type === "ctxMenu" ? "none" : "block",
    "background-color": rbx.borderColor
  })}></nav>
	
	<button${add_styles(merge_ssr_styles("border-color: " + escape(rbx.borderColor, true), {
    "display": rbx.type === "ctxMenu" ? "none" : "flex"
  }))} class="absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-2 bg-white text-center text-xl">${escape(CROSS)}</button>
	
	${rbx.type === "ctxMenu" ? `${validate_component(ContextMenu, "ContextMenu").$$render($$result, Object.assign({}, { position: rbx.position }, props), {}, {})}` : `${rbx.type === "interactable" ? `${validate_component(Interactable_1, "Interactable").$$render($$result, Object.assign({}, { id: rbx.id }, props), {}, {})}` : `${rbx.type === "controllable" ? `${validate_component(Controllable_1, "Controllable").$$render($$result, Object.assign({}, { id: rbx.id }, props), {}, {})}` : `${rbx.type === "effector" ? `${validate_component(Effector_1, "Effector").$$render($$result, Object.assign({}, { id: rbx.id }, props), {}, {})}` : `${rbx.type === "pusher" ? `${validate_component(Pusher, "Pusher").$$render($$result, Object.assign({}, { id: rbx.id }, props), {}, {})}` : `${rbx.type === "sequencer" ? `${validate_component(Sequencer_1, "Sequencer").$$render($$result, Object.assign({}, { id: rbx.id }, props), {}, {})}` : `${rbx.type === "merger" ? `${validate_component(Merger, "Merger").$$render($$result, Object.assign({}, { id: rbx.id }, props), {}, {})}` : ``}`}`}`}`}`}`}
</div>`;
});
export {
  Controllable_1 as C,
  Effector_1 as E,
  Interactable_1 as I,
  Merger as M,
  Pusher as P,
  Rulebox as R
};
