import { useState, useCallback } from "preact/hooks";

import { Codemirror, createState } from "@mischnic/codemirror-preact";

import { extensionsA, DIAGNOSTICS, EXAMPLE_1, EXAMPLE_2 } from "./utils";
import { EditorState } from "@codemirror/state";

export function App1() {
  const [state, setState] = useState(createState(EXAMPLE_1, extensionsA));

  const [counter, setCounter] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [diagnostics, setDiagnostics] = useState(false);

  const onChange = useCallback((state: EditorState) => {
    setState(state);
  }, []);

  return (
    <>
      <button onClick={() => setState(createState(EXAMPLE_2, extensionsA))}>
        Update!
      </button>
      <button onClick={() => setReadOnly(!readOnly)}>
        {readOnly ? "Disable" : "Enable"} readOnly
      </button>
      <button onClick={() => setDiagnostics(!diagnostics)}>Build</button>
      <div>
        Counter: {counter}&nbsp;
        <button onClick={() => setCounter(counter + 1)}>&nbsp;</button>
      </div>
      <Codemirror
        state={state}
        onChange={onChange}
        readOnly={readOnly}
        diagnostics={diagnostics ? DIAGNOSTICS : undefined}
        class="editor"
      />
      State:
      <pre>
        <code>{state.doc.toString()}</code>
      </pre>
    </>
  );
}
