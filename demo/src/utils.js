import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { history, historyKeymap } from "@codemirror/history";
import { foldGutter, foldKeymap } from "@codemirror/fold";
import { indentOnInput } from "@codemirror/language";
import { lineNumbers } from "@codemirror/gutter";
import { defaultKeymap, indentMore, indentLess } from "@codemirror/commands";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { commentKeymap } from "@codemirror/comment";
import { rectangularSelection } from "@codemirror/rectangular-selection";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { lintKeymap } from "@codemirror/lint";

import { html } from "@codemirror/lang-html";

export const DIAGNOSTICS = [
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

export const extensionsA = [
  lineNumbers(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  defaultHighlightStyle.fallback,
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  // highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...commentKeymap,
    ...completionKeymap,
    ...lintKeymap,
    {
      key: "Tab",
      preventDefault: true,
      run: indentMore,
    },
    {
      key: "Shift-Tab",
      preventDefault: true,
      run: indentLess,
    },
  ]),
  html(),
];

export const extensionsB = [...extensionsA, highlightActiveLine()];

export const EXAMPLE_1 = `<script>
  const {readFile} = require("fs");
  readFile("package.json", "utf8", (err, data) => {
    console.log(data);
  });
</script>`;

export const EXAMPLE_2 = `<style>
  body {
    color: red;
  }
  div {
    background: green;
    background: green;
    background: green;
    background: green;
    background: green;
    background: green;
    background: green;
    background: green;
  }
</style>`;
