import { html } from "@codemirror/next/lang-html";
// import { javascript } from "@codemirror/next/lang-javascript";
import {
  keymap,
  highlightSpecialChars,
  multipleSelections,
  indentOnInput,
} from "@codemirror/next/view";
import { Extension } from "@codemirror/next/state";
import { history, historyKeymap } from "@codemirror/next/history";
import { foldGutter, foldKeymap } from "@codemirror/next/fold";
import { lineNumbers } from "@codemirror/next/gutter";
import {
  defaultKeymap,
  indentMore,
  indentLess,
} from "@codemirror/next/commands";
import { bracketMatching } from "@codemirror/next/matchbrackets";
import {
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/next/closebrackets";
import { searchKeymap } from "@codemirror/next/search";
import {
  autocompletion,
  completionKeymap,
} from "@codemirror/next/autocomplete";
import { commentKeymap } from "@codemirror/next/comment";
import { rectangularSelection } from "@codemirror/next/rectangular-selection";
import { gotoLineKeymap } from "@codemirror/next/goto-line";
import {
  highlightActiveLine,
  highlightSelectionMatches,
} from "@codemirror/next/highlight-selection";
import { defaultHighlighter } from "@codemirror/next/highlight";
import { lintKeymap } from "@codemirror/next/lint";

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
  multipleSelections(),
  indentOnInput(),
  defaultHighlighter,
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
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
