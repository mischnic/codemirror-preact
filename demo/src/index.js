if (process.env.NODE_ENV === "development") {
  require("preact/debug");
}

import { useRef, useEffect, useState } from "preact/hooks";
import { render, h } from "preact";

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
// import { autocomplete, startCompletion } from "@codemirror/next/autocomplete";

import { html } from "@codemirror/next/lang-html";
// import { javascript } from "@codemirror/next/lang-javascript";
import { defaultHighlighter } from "@codemirror/next/highlight";

//import { esLint } from "@codemirror/next/lang-javascript";
// @ts-ignore
//import Linter from "eslint4b-prebuilt";
//import { linter, openLintPanel } from "@codemirror/next/lint";

import { Codemirror } from "@mischnic/codemirror-preact";

function App() {
  let [doc, setDoc] = useState(`<script>
  const {readFile} = require("fs");
  readFile("package.json", "utf8", (err, data) => {
    console.log(data);
  });
</script>`);

  return (
    <div>
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
      <Codemirror
        doc={doc}
        extensions={[
          lineNumbers(),
          specialChars(),
          history(),
          foldGutter(),
          multipleSelections(),
          html(),
          // linter(esLint(new Linter())),
          search({ keymap: defaultSearchKeymap }),
          defaultHighlighter,
          bracketMatching(),
          closeBrackets,
          // autocomplete(),
          keymap({
            "Mod-z": undo,
            "Mod-Shift-z": redo
            // "Mod-u": view => undoSelection(view) || true,
            // [ /Mac/.test(navigator.platform) ? "Mod-Shift-u" : "Alt-u"]: redoSelection,
            // Tab: indentSelection,
            // "Ctrl-Space": startCompletion
            // "Shift-Mod-m": openLintPanel
          }),
          keymap(baseKeymap)
        ]}
        onTextChange={({ text }) => console.log(text)}
      />
    </div>
  );
}

render(<App />, document.getElementById("app"));
