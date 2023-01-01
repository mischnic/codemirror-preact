import { h, JSX } from "preact";
import { useRef, useEffect, useState, useCallback } from "preact/hooks";
import { memo } from "preact/compat";

import { EditorView } from "@codemirror/view";
import {
  Compartment,
  EditorState,
  type Extension,
  type Transaction,
} from "@codemirror/state";
import { setDiagnostics, type Diagnostic } from "@codemirror/lint";

let readOnlyCompartment = new Compartment();

export function createState(
  value: string,
  extensions: Array<Extension>
): EditorState {
  return EditorState.create({
    doc: value,
    extensions: [
      ...extensions,
      readOnlyCompartment.of(EditorView.editable.of(false)),
    ],
  });
}

const emittedStates = new WeakSet();

const Codemirror = memo(function ({
  state,
  onChange = null,
  readOnly = false,
  diagnostics = null,
  ...rest
}: {
  state: EditorState;
  onChange: (v: EditorState, t: Transaction) => void;
  readOnly: boolean;
  diagnostics: Array<Diagnostic> | null | undefined;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange">) {
  if (!state) {
    throw new Error("Missing state!");
  }

  const container = useRef<HTMLDivElement>(null);
  const view = useRef(null);
  const dispatchRefs = useRef<{
    onChange?: (v: EditorState, t: Transaction) => void;
  }>({});

  useEffect(() => {
    dispatchRefs.current.onChange = onChange;
  }, [onChange]);

  // --- State ---

  useEffect(() => {
    // (subsequent render)
    if (!view.current) {
      return;
    }

    if (emittedStates.has(state)) {
      return;
    }

    view.current.setState(state);
  }, [state]);

  useEffect(() => {
    // (first render)
    let v = (view.current = new EditorView({
      state,
      dispatch: (t) => {
        const { onChange } = dispatchRefs.current;

        v.update([t]);
        if (onChange) {
          emittedStates.add(v.state);
          onChange(v.state, t);
        }
      },
    }));

    container.current.appendChild(v.dom);
    return () => v.destroy();
  }, []);

  // --- readOnly ---

  useEffect(() => {
    // if readOnly changes (first and subsequent render)
    view.current.dispatch({
      effects: readOnlyCompartment.reconfigure(
        EditorState.readOnly.of(readOnly)
      ),
    });
  }, [readOnly]);

  useEffect(() => {
    // reapply readOnly if the state was changed externally
    if (emittedStates.has(state)) {
      return;
    }

    view.current.dispatch({
      effects: readOnlyCompartment.reconfigure(
        EditorState.readOnly.of(readOnly)
      ),
    });
  }, [readOnly, state]);

  // --- Diagnostics ---

  useEffect(() => {
    // if diagnostics changes (first and subsequent render)
    view.current.dispatch(
      setDiagnostics(
        view.current.state,
        diagnostics && diagnostics.length > 0 ? diagnostics : []
      )
    );
  }, [diagnostics]);
  useEffect(() => {
    // reapply diagnostics if the state was changed externally
    if (emittedStates.has(state)) {
      return;
    }
    view.current.dispatch(
      setDiagnostics(
        view.current.state,
        diagnostics && diagnostics.length > 0 ? diagnostics : []
      )
    );
  }, [diagnostics, state]);

  return <div ref={container} {...rest} />;
});

function CodemirrorEditor({
  value,
  onChange: _onChange,
  readOnly,
  diagnostics,
  extensions,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
  diagnostics: Array<Diagnostic> | null | undefined;
  extensions: Array<Extension>;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const [state, setState] = useState(createState(value, extensions));

  useEffect(() => {
    if (value !== state.doc.toString()) {
      setState(createState(value, extensions));
    }
  }, [value]);

  useEffect(() => {
    setState(createState(value, extensions));
  }, [extensions]);

  const onChange = useCallback(
    (newState: EditorState, transaction: Transaction) => {
      setState(newState);
      if (!transaction.changes.empty) {
        _onChange(newState.doc.toString());
      }
    },
    []
  );

  return (
    <Codemirror
      state={state}
      onChange={onChange}
      readOnly={readOnly}
      diagnostics={diagnostics}
      {...rest}
    />
  );
}

export { Codemirror, CodemirrorEditor };
