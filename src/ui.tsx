import "!prismjs/themes/prism.css";

import { Button, Container, render, VerticalSpace, Text } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h, RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";

import styles from "./styles.css";
import { InsertCodeHandler } from "./types";

function Plugin() {
  const [json, setJson] = useState<string>("");

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      <Text>Ready for some action?</Text>
      <VerticalSpace space="large" />
      <div></div>
      <Button fullWidth onClick={() => emit("MAGIC")}>
        Make the magic happen
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
