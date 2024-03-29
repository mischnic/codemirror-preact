import { useState } from "preact/hooks";

import { CodemirrorEditor } from "@mischnic/codemirror-preact";

import {
  extensionsA,
  extensionsB,
  DIAGNOSTICS,
  EXAMPLE_1,
  EXAMPLE_2,
} from "./utils";

export function App2() {
  const [value, setValue] = useState(EXAMPLE_1);
  const [readOnly, setReadOnly] = useState(false);
  const [diagnostics, setDiagnostics] = useState(false);
  const [extensions, setExtensions] = useState(false);

  return (
    <>
      <button onClick={() => setValue(EXAMPLE_2)}>Update</button>
      <button onClick={() => setReadOnly(!readOnly)}>
        {readOnly ? "Disable" : "Enable"} readOnly
      </button>
      <button onClick={() => setExtensions(!extensions)}>
        Change extensions to {extensions ? "B" : "A"}
      </button>
      <button onClick={() => setDiagnostics(!diagnostics)}>Build</button>
      <CodemirrorEditor
        value={value}
        onChange={setValue}
        readOnly={readOnly}
        diagnostics={diagnostics && DIAGNOSTICS}
        extensions={extensions ? extensionsA : extensionsB}
        class="editor"
      />
      Value:
      <pre>
        <code>{value}</code>
      </pre>
    </>
  );
}
