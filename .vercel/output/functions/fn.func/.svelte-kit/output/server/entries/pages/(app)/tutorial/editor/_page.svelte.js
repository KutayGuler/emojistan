import { c as create_ssr_component, e as each, b as escape, d as add_attribute } from "../../../../../chunks/index3.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const data = [
    {
      header: "MAP EDITOR",
      icon: "world-map",
      description: "As the name suggests, map editor lets you structure your world with emojis and colors.",
      gifs: [
        {
          header: "Palette",
          description: 'The first tool we will look at is the palette. You can paint the map however you want. If you want to paint the entire map with a color, simply select that color and click "SET AS DEFAULT".',
          src: "/images/palette.webm",
          alt: ""
        },
        {
          header: "Emoji Mode",
          description: "Emoji mode will let you choose whether you want the emoji in the background or foreground. Emojis on the background can be walked over and will have lower opacity.",
          src: "/images/emoji-mode.webm",
          alt: ""
        },
        {
          header: "Copy/Delete Mode",
          description: 'Choose "Emoji" if you only want to change emojis. Choose "Color" if you only want to change the color. Choose both if you want to change both of them in a single cell.<br/><br/>This will also work for copying things. Right click on a cell to copy its contents.',
          src: "/images/copy-mode.webm",
          alt: ""
        }
      ]
    },
    {
      header: "RULEBOX EDITOR",
      icon: "books",
      description: "This is where you spawn ruleboxes and assign emojis to them. Most of your game logic will be created here. Right click on Rulebox Editor's canvas and spawn the Rulebox you like.",
      gifs: [
        {
          header: "",
          description: "",
          src: "/images/rulebox.webm",
          alt: ""
        }
      ]
    },
    {
      header: "DIALOGUE EDITOR",
      icon: "speech-balloon",
      description: "Dialogue editor lets you create branching dialogues for Interactables. Create an Interactable in the Rulebox Editor, and edit its dialogue in Dialogue Editor.",
      gifs: [
        {
          header: "",
          description: "",
          src: "/images/dialogue.webm",
          alt: ""
        },
        {
          header: "",
          description: "You can create branching dialogues with player choices.",
          src: "/images/branching-dialogue.webm",
          alt: ""
        }
      ]
    }
  ];
  let width;
  return `${$$result.head += `<!-- HEAD_svelte-3xifz4_START -->${$$result.title = `<title>Emojistan | Tutorial - Editor</title>`, ""}<!-- HEAD_svelte-3xifz4_END -->`, ""}

<div class="relative flex h-full w-full flex-row items-start justify-center gap-4 overflow-y-auto"><div class="relative flex w-full flex-col items-center justify-center"><div class="flex w-full self-start p-4"><div><span class="flex-inline flex items-center"><h1>Editor</h1></span>
				<p class="h-32 pt-2 text-slate-500">We have learned about the ruleboxes, now let&#39;s see how we can
					integrate them to our game. But to do that we have to understand the
					different types of editors in Emojistan.
				</p></div></div>

		<div class="flex w-full flex-col gap-96 p-4">${each(data, ({ header, icon, description, gifs }) => {
    return `<div class="self-start"><div class="divider pb-4"><h1>${escape(header)} <i class="${"twa twa-" + escape(icon, true)}"></i></h1></div>
					<p class="text-slate-500">${escape(description)}</p>
					${each(gifs, ({ src, alt, header: header2, description: description2 }) => {
      return `<div class="py-8"><h1>${escape(header2)}</h1>
							<p class="pb-8 text-slate-500"><!-- HTML_TAG_START -->${description2}<!-- HTML_TAG_END --></p>
							<img${add_attribute("src", src, 0)}${add_attribute("alt", alt, 0)}>
							<video${add_attribute("width", width, 0)} autoplay loop controls><track kind="captions"><source${add_attribute("src", src, 0)} type="video/webm"></video>
						</div>`;
    })}
				</div>`;
  })}</div>
		<a href="/" class="btn-lg btn my-32">BACK TO MENU</a></div></div>`;
});
export {
  Page as default
};
