import { loadFontsAsync, once, on, showUI } from "@create-figma-plugin/utilities";

import { InsertCodeHandler, MagicHandler } from "./types";

export default function () {
  once<InsertCodeHandler>("INSERT_CODE", async function (code: string) {
    const text = figma.createText();
    await loadFontsAsync([text]);
    text.characters = code;
    figma.currentPage.selection = [text];
    figma.viewport.scrollAndZoomIntoView([text]);
    figma.closePlugin();
  });

  on<MagicHandler>("MAGIC", () => {
    console.log("click");
  });

  // Displays the Plugin
  showUI({ height: 232, width: 320 });
}
