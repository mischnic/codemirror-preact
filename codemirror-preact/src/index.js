import { h } from "preact";
import { useRef, useEffect, useState, useCallback } from "preact/hooks";
import { memo } from "preact/compat";

import { EditorView } from "@codemirror/next/view";
import {
	EditorState,
	Change,
	Transaction,
	EditorSelection,
	SelectionRange,
} from "@codemirror/next/state";
import { setDiagnostics } from "@codemirror/next/lint";
import { StateEffect, StateField } from "@codemirror/next/state";

const setReadOnlyEffect = StateEffect.define();
const readOnlyState = StateField.define({
	create() {
		return true;
	},
	update(value, tr) {
		for (let effect of tr.effects) {
			if (effect.is(setReadOnlyEffect)) {
				value = effect.value;
			}
		}

		return value;
	},
});

export function createState(value, extensions) {
	return EditorState.create({
		doc: value,
		extensions: [
			...extensions,
			readOnlyState,
			EditorState.changeFilter.of(
				({ startState }) => !startState.field(readOnlyState, false)
			),
		],
	});
}

const emittedStates = new WeakSet();

export const Codemirror = memo(function Codemirror({
	state,
	onChange = null,
	readOnly = false,
	diagnostics = null,
	...rest
}) {
	if (!state) {
		throw new Error("Missing state!");
	}

	const container = useRef(null);
	const view = useRef(null);
	const dispatchRefs = useRef({});

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
			effects: setReadOnlyEffect.of(readOnly),
		});
	}, [readOnly]);

	useEffect(() => {
		// reapply readOnly if the state was changed externally
		if (emittedStates.has(state)) {
			return;
		}

		view.current.dispatch({
			effects: setReadOnlyEffect.of(readOnly),
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

export function CodemirrorEditor({
	value,
	onChange: _onChange,
	readOnly,
	diagnostics,
	extensions,
}) {
	const [state, setState] = useState(createState(value, extensions));

	useEffect(() => {
		if (value !== state.doc.toString()) {
			setState(createState(value, extensions));
		}
	}, [value]);

	useEffect(() => {
		setState(createState(value, extensions));
	}, [extensions]);

	const onChange = useCallback((newState, transaction) => {
		setState(newState);
		if (!transaction.changes.empty) {
			_onChange(newState.doc.toString());
		}
	}, []);

	return (
		<Codemirror
			state={state}
			onChange={onChange}
			readOnly={readOnly}
			diagnostics={diagnostics}
			class="editor"
		/>
	);
}
