import { on, emit, showUI } from '@create-figma-plugin/utilities';

import {
  ProcessVariablesHandler,
  ProcessVariablesCompleteHandler,
} from './types';
import { exportToJSON } from './utils/exportToJSON';

export default function () {
  on<ProcessVariablesHandler>('PROCESS_VARIABLES', async () => {
    console.clear();
    const files = await exportToJSON();
    emit<ProcessVariablesCompleteHandler>('PROCESS_VARIABLES_COMPLETE', files);
  });

  // Displays the Plugin
  showUI({ height: 320, width: 320 });
}
