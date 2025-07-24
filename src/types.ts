import { EventHandler } from "@create-figma-plugin/utilities";

export interface InsertCodeHandler extends EventHandler {
  name: "INSERT_CODE";
  handler: (code: string) => void;
}

export interface Magic extends EventHandler {
  name: "MAGIC";
  handler: () => void;
}
