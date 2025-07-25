import {
  loadFontsAsync,
  once,
  on,
  showUI,
} from '@create-figma-plugin/utilities';

import { InsertCodeHandler, MagicHandler } from './types';
import { processCollection } from './utils/processCollection';

export default function () {
  once<InsertCodeHandler>('INSERT_CODE', async function (code: string) {
    const text = figma.createText();
    await loadFontsAsync([text]);
    text.characters = code;
    figma.currentPage.selection = [text];
    figma.viewport.scrollAndZoomIntoView([text]);
    figma.closePlugin();
  });

  on<MagicHandler>('MAGIC', () => {
    // get all tokens and log them
    console.log('woot');
    figma.variables.getLocalVariableCollectionsAsync().then((collections) => {
      // const files: ReturnType<typeof processCollection>[];
      collections.forEach((collection) => {
        processCollection(collection).then((processed) => {
          console.log(JSON.stringify(processed));
        });
      });
    });

    console.log('click');
  });

  // Displays the Plugin
  showUI({ height: 232, width: 320 });
}
