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
				({startState}) => !startState.field(readOnlyState, false)
			),
		],
	});
}

let emittedStates = new Set();

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
	const view = useRef(null);
	const dispatchRefs = useRef({});

	useEffect(() => {
		dispatchRefs.current.onChange = onChange;
	}, [onChange]);

	useEffect(() => {
		// subsequent render
		if (!view.current) {
			return;
		}

		if (emittedStates.has(state)) {
			emittedStates.delete(state);
			return;
		}

		view.current.setState(state);
	}, [state]);

	useEffect(() => {
		// first render
		let v = (view.current = new EditorView({
			state,
			dispatch: (t) => {
				const { onChange } = dispatchRefs.current;

				v.update([t]);
				if (onChange) {
					emittedStates.add(v.state);
					onChange(v.state);
				}
			},
		}));

		container.current.appendChild(v.dom);
		return () => v.destroy();
	}, []);

	useEffect(() => {
		// first and subsequent render
		view.current.dispatch({
			effects: setReadOnlyEffect.of(readOnly),
		});
	}, [readOnly]);

	useEffect(() => {
		// first and subsequent render
		view.current.dispatch(
			setDiagnostics(
				view.current.state,
				diagnostics && diagnostics.length > 0 ? diagnostics : []
			)
		);
	}, [diagnostics]);

	return <div ref={container} {...rest} />;
});

export { Codemirror };
