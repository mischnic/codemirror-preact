if (process.env.NODE_ENV === "development") {
  require("preact/debug");
}

import { render, h, Fragment } from "preact";
import { useState, useCallback, useMemo } from "preact/hooks";

import {
  EditorState,
  EditorView,
  basicSetup,
} from "@codemirror/next/basic-setup";
import { html } from "@codemirror/next/lang-html";
// import { javascript } from "@codemirror/next/lang-javascript";

// import { esLint } from "@codemirror/next/lang-javascript";
// @ts-ignore
//import Linter from "eslint4b-prebuilt";
import { linter, openLintPanel, closeLintPanel } from "@codemirror/next/lint";

import { Codemirror, createState } from "@mischnic/codemirror-preact";

const DIAGNOSTICS = [
  {
    from: 18,
    to: 18,
    severity: "error",
    source: "MyLinter",
    message: "Unknown?",
  },
  {
    from: 101,
    to: 112,
    severity: "error",
    source: "MyLinter",
    message: "XYZ",
    actions: [
      { name: "Remove", apply() {} },
      { name: "Ignore", apply() {} },
    ],
  },
];

function extensions() {
  return [
    basicSetup,
    html(),
    // linter(() => DIAGNOSTICS),
    // keymap({
    //   "Mod-z": undo,
    //   "Mod-Shift-z": redo,
    //   // "Mod-u": view => undoSelection(view) || true,
    //   // [ /Mac/.test(navigator.platform) ? "Mod-Shift-u" : "Alt-u"]: redoSelection,
    //   // Tab: indentSelection,
    //   // "Ctrl-Space": startCompletion
    //   "Ctrl-Cmd-l": openLintPanel
    //   // "Shift-l": closeLintPanel
    // })
  ];
}

function App() {
  const [state, setState] = useState(
    createState(
      `<script>
  const {readFile} = require("fs");
  readFile("package.json", "utf8", (err, data) => {
    console.log(data);
  });
</script>`,
      extensions()
    )
  );

  const [counter, setCounter] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [diagnostics, setDiagnostics] = useState(false);

  const onChange = useCallback((state) => {
    setState(state);
  }, []);

  return (
    <>
      <button
        onClick={() =>
          setState(
            createState(
              `<style>
  body {
    color: red;
  }
</style>`,
              extensions()
            )
          )
        }
      >
        Update!
      </button>
      <button onClick={() => setReadOnly(!readOnly)}>Toggle readOnly</button>
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

render(<App />, document.getElementById("app"));
