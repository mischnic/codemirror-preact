import { render, h, Fragment } from "preact";
import { useState, useCallback, useMemo, useEffect } from "preact/hooks";

import { Codemirror, createState } from "@mischnic/codemirror-preact";

import { extensions, DIAGNOSTICS, EXAMPLE_1, EXAMPLE_2 } from "./utils.js";

export function App1() {
  const [state, setState] = useState(createState(EXAMPLE_1, extensions));

  const [counter, setCounter] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [diagnostics, setDiagnostics] = useState(false);

  const onChange = useCallback((state) => {
    setState(state);
  }, []);

  return (
    <>
      <button onClick={() => setState(createState(EXAMPLE_2, extensions))}>
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
        diagnostics={diagnostics && DIAGNOSTICS}
        class="editor"
      />
      State:
      <pre>
        <code>{state.doc.toString()}</code>
      </pre>
    </>
  );
}
