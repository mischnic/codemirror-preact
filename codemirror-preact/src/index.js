import { h } from "preact";
import { useRef, useEffect } from "preact/hooks";
import { memo } from "preact/compat";

import { EditorView } from "@codemirror/next/view";
import {
	EditorState,
	Change,
	Transaction,
	EditorSelection,
	SelectionRange
} from "@codemirror/next/state";
import { setDiagnostics } from "@codemirror/next/lint";

const onHandleUpdateDefault = (view, t) => view.update(t);

const Codemirror = memo(function Codemirror({
	value = "",
	extensions = [],
	onTextChange = null,
	onHandleUpdate = false,
	readOnly = false,
	diagnostics = null,
	...rest
}) {
	const container = useRef(null);
	const editor = useRef(null);
	const dispatchRefs = useRef({});

	useEffect(() => {
		dispatchRefs.current.readOnly = readOnly;
		dispatchRefs.current.onHandleUpdate =
			onHandleUpdate || onHandleUpdateDefault;
		dispatchRefs.current.onTextChange = onTextChange;
	}, [readOnly, onHandleUpdate, onTextChange]);

	useEffect(() => {
		if (!editor.current) return;

		// rerenders
		const ranges = editor.current.state.selection.ranges
			.map(v => {
				if (v.from > value.length) {
					return false;
				} else if (value.length < v.to) {
					return new SelectionRange(
						v.anchor,
						v.head - (v.to - value.length)
					);
				} else return v;
			})
			.filter(Boolean);
		let selection = ranges.length > 0 && EditorSelection.create(ranges, 0);

		const t = editor.current.state
			.t()
			.change(
				new Change(
					0,
					editor.current.state.doc.length,
					value.split("\n")
				)
			);
		if (selection) t.setSelection(selection);

		const handleUpdate = onHandleUpdate || onHandleUpdateDefault;
		editor.current.update([t]);
	}, [value]);

	useEffect(() => {
		// first render
		let view = (editor.current = new EditorView({
			state: EditorState.create({
				doc: value,
				extensions
			}),
			dispatch: t => {
				const {
					current: { onTextChange, readOnly, onHandleUpdate }
				} = dispatchRefs;
				onHandleUpdate(view, readOnly && t.docChanged ? [] : [t]);

				if (!readOnly && onTextChange && t.docChanged) {
					onTextChange(view);
				}
			}
		}));

		container.current.appendChild(view.dom);
		return () => view.destroy();
	}, [extensions]); // TODO handle extensions change more gracefully

	useEffect(() => {
		// first and subsequent render

		const t = editor.current.state
			.t()
			.annotate(setDiagnostics, diagnostics);
		editor.current.update([t]);
	}, [diagnostics]);

	return <div ref={container} {...rest} />;
});

export { Codemirror };
