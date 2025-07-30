import {
  loadFontsAsync,
  once,
  on,
  emit,
  showUI,
} from '@create-figma-plugin/utilities';

import {
  InsertCodeHandler,
  ProcessVariablesHandler,
  ProcessVariablesCompleteHandler,
} from './types';
import { exportToJSON } from './utils/exportToJSON';

export default function () {
  once<InsertCodeHandler>('INSERT_CODE', async function (code: string) {
    const text = figma.createText();
    await loadFontsAsync([text]);
    text.characters = code;
    figma.currentPage.selection = [text];
    figma.viewport.scrollAndZoomIntoView([text]);
    figma.closePlugin();
  });

  on<ProcessVariablesHandler>('PROCESS_VARIABLES', async () => {
    console.clear();
    const files = await exportToJSON();
    emit<ProcessVariablesCompleteHandler>('PROCESS_VARIABLES_COMPLETE', files);
  });

  // Displays the Plugin
  showUI({ height: 232, width: 320 });
}
