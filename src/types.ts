import { EventHandler } from '@create-figma-plugin/utilities';

// Event Handlers
export interface InsertCodeHandler extends EventHandler {
  name: 'INSERT_CODE';
  handler: (code: string) => void;
}

export interface ProcessVariablesCompleteHandler extends EventHandler {
  name: 'PROCESS_VARIABLES_COMPLETE';
  handler: (data: TokenFile[]) => void;
}

export interface ProcessVariablesHandler extends EventHandler {
  name: 'PROCESS_VARIABLES';
  handler: () => void;
}

export type TokenValue = boolean | string | number | RGB | RGBA;

export type TokenValueObject = {
  $type: string; // TODO define and narrow these types
  $value: TokenValue;
  $description?: string;
};

export type TokenFileNode = {
  [key: string]: TokenFileNode | TokenValue | TokenValueObject;
};

export type TokenFile = {
  body: TokenFileNode;
  fileName: string;
};
