import {
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {
  indentOnInput,
  foldGutter,
  foldKeymap,
  bracketMatching,
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import {
  defaultKeymap,
  indentMore,
  indentLess,
  history,
  historyKeymap,
} from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { Diagnostic, lintKeymap } from "@codemirror/lint";

import { html } from "@codemirror/lang-html";

export const DIAGNOSTICS: Array<Diagnostic> = [
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
  syntaxHighlighting(defaultHighlightStyle),
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
