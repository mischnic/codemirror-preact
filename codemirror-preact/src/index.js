import { h } from "preact";
import { useRef, useEffect } from "preact/hooks";
import { memo } from "preact/compat";

import { EditorView } from "@codemirror/next/view";
import {
	EditorState,
	Change,
	Transaction,
	EditorSelection,
	SelectionRange,
} from "@codemirror/next/state";
import { setDiagnostics, linter } from "@codemirror/next/lint";
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
				(_, state) => !state.field(readOnlyState, false)
			),
		],
	});
}

const Codemirror = memo(function Codemirror({
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
	const editor = useRef(null);
	const dispatchRefs = useRef({});

	useEffect(() => {
		dispatchRefs.current.readOnly = readOnly;
		dispatchRefs.current.onChange = onChange;
	}, [readOnly, onChange]);

	useEffect(() => {
		// subsequent render
		if (!editor.current) {
			return;
		}

		if (editor.current.state === state) {
			return;
		}

		console.log("change!");

		editor.current.setState(state);
	}, [state]);

	useEffect(() => {
		// first render
		let view = (editor.current = new EditorView({
			state,
			dispatch: (t) => {
				const {
					current: { onChange, readOnly },
				} = dispatchRefs;

				view.update([t]);
				onChange && onChange(view.state);
			},
		}));

		container.current.appendChild(view.dom);
		return () => view.destroy();
	}, []);

	useEffect(() => {
		// first and subsequent render
		editor.current.dispatch({
			effects: setReadOnlyEffect.of(readOnly),
		});
	}, [readOnly]);

	useEffect(() => {
		// first and subsequent render
		editor.current.dispatch(
			setDiagnostics(
				editor.current.state,
				diagnostics && diagnostics.length > 0 ? diagnostics : []
			)
		);
	}, [diagnostics]);

	return <div ref={container} {...rest} />;
});

export { Codemirror };
