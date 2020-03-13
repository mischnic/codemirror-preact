if (process.env.NODE_ENV === "development") {
  require("preact/debug");
}

import { render, h, Fragment } from "preact";
import { useState, useCallback, useMemo } from "preact/hooks";

import { lineNumbers } from "@codemirror/next/gutter";
import { keymap } from "@codemirror/next/keymap";
import {
  history,
  redo,
  redoSelection,
  undo,
  undoSelection
} from "@codemirror/next/history";
import { foldCode, unfoldCode, foldGutter } from "@codemirror/next/fold";
import { baseKeymap, indentSelection } from "@codemirror/next/commands";
import { bracketMatching } from "@codemirror/next/matchbrackets";
import { closeBrackets } from "@codemirror/next/closebrackets";
import { specialChars } from "@codemirror/next/special-chars";
import { multipleSelections } from "@codemirror/next/multiple-selections";
import { search, defaultSearchKeymap } from "@codemirror/next/search";
import { html } from "@codemirror/next/lang-html";
import { defaultHighlighter } from "@codemirror/next/highlight";
// import { javascript } from "@codemirror/next/lang-javascript";

// import { esLint } from "@codemirror/next/lang-javascript";
// @ts-ignore
//import Linter from "eslint4b-prebuilt";
import {
  linter,
  linting,
  openLintPanel,
  closeLintPanel
} from "@codemirror/next/lint";

import { Codemirror } from "@mischnic/codemirror-preact";

const DIAGNOSTICS = [
  {
    from: 18,
    to: 18,
    severity: "error",
    source: "MyLinter",
    message: "Unknown?"
  },
  {
    from: 101,
    to: 112,
    severity: "error",
    source: "MyLinter",
    message: "Don't log\nNext line",
    actions: [
      { name: "Remove", apply() {} },
      { name: "Ignore", apply() {} }
    ]
  }
];

function App() {
  const [doc, setDoc] = useState(`<script>
  const {readFile} = require("fs");
  readFile("package.json", "utf8", (err, data) => {
    console.log(data);
  });
</script>`);

  const [counter, setCounter] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [diagnostics, setDiagnostics] = useState(null);

  const onTextChange = useCallback(view => {
    setDoc(view.state.doc.toString());
  }, []);

  // const onHandleUpdate = useCallback((view, t) => {
  //   view.update(t);
  // }, []);

  const extensions = useMemo(
    () => [
      lineNumbers(),
      specialChars(),
      history(),
      foldGutter(),
      multipleSelections(),
      html(),
      // linter(MyLinter),
      linting(),
      search({ keymap: defaultSearchKeymap }),
      defaultHighlighter,
      bracketMatching(),
      closeBrackets,
      // autocomplete(),
      keymap(baseKeymap),
      keymap({
        "Mod-z": undo,
        "Mod-Shift-z": redo,
        // "Mod-u": view => undoSelection(view) || true,
        // [ /Mac/.test(navigator.platform) ? "Mod-Shift-u" : "Alt-u"]: redoSelection,
        // Tab: indentSelection,
        // "Ctrl-Space": startCompletion
        "Ctrl-Cmd-l": openLintPanel
        // "Shift-l": closeLintPanel
      })
    ],
    []
  );

  return (
    <>
      <button
        onClick={() =>
          setDoc(`<style>
  body {
    color: red;
  }
</style>`)
        }
      >
        Update!
      </button>
      <button onClick={() => setReadOnly(!readOnly)}>Toggle readOnly</button>
      <button onClick={() => setDiagnostics(DIAGNOSTICS)}>Build</button>
      <div>
        Counter: {counter}&nbsp;
        <button onClick={() => setCounter(counter + 1)}>&nbsp;</button>
      </div>
      <Codemirror
        value={doc}
        extensions={extensions}
        onTextChange={onTextChange}
        // onHandleUpdate={onHandleUpdate}
        readOnly={readOnly}
        diagnostics={diagnostics}
        class="editor"
      />
      State:{" "}
      <pre>
        <code>{doc}</code>
      </pre>
    </>
  );
}

render(<App />, document.getElementById("app"));
