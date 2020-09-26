if (process.env.NODE_ENV === "development") {
  require("preact/debug");
}

import { render, h, Fragment } from "preact";
import { useState, useCallback, useMemo } from "preact/hooks";

import { html } from "@codemirror/next/lang-html";
// import { javascript } from "@codemirror/next/lang-javascript";
import {keymap, highlightSpecialChars, multipleSelections, indentOnInput} from "@codemirror/next/view"
import {Extension} from "@codemirror/next/state"
import {history, historyKeymap} from "@codemirror/next/history"
import {foldGutter, foldKeymap} from "@codemirror/next/fold"
import {lineNumbers} from "@codemirror/next/gutter"
import {defaultKeymap} from "@codemirror/next/commands"
import {bracketMatching} from "@codemirror/next/matchbrackets"
import {closeBrackets, closeBracketsKeymap} from "@codemirror/next/closebrackets"
import {searchKeymap} from "@codemirror/next/search"
import {autocompletion, completionKeymap} from "@codemirror/next/autocomplete"
import {commentKeymap} from "@codemirror/next/comment"
import {rectangularSelection} from "@codemirror/next/rectangular-selection"
import {gotoLineKeymap} from "@codemirror/next/goto-line"
import {highlightActiveLine, highlightSelectionMatches} from "@codemirror/next/highlight-selection"
import {defaultHighlighter} from "@codemirror/next/highlight"
import {lintKeymap} from "@codemirror/next/lint"

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
    lineNumbers(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    multipleSelections(),
    indentOnInput(),
    defaultHighlighter,
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...commentKeymap,
      ...gotoLineKeymap,
      ...completionKeymap,
      ...lintKeymap
    ]),
    html(),
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
      <button onClick={() => setReadOnly(!readOnly)}>{readOnly ? "Disable" : "Enable"} readOnly</button>
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
