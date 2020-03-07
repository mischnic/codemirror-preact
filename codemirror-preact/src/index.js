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

const onHandleUpdateDefault = (view, t) => view.update(t);

const Codemirror = memo(function Codemirror({
	value = "",
	extensions = [],
	onTextChange = null,
	onHandleUpdate = false,
	readOnly = false,
	...rest
}) {
	const container = useRef(null);
	const editor = useRef(null);
	const dispatchRefs = useRef({});

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
				if (readOnly) {
					if (t.selectionSet && !t.docChanged) {
						onHandleUpdate(view, [
							new Transaction(view.state).setSelection(
								t.selection
							)
						]);
					} else {
						onHandleUpdate(view, []);
					}
				} else {
					onHandleUpdate(view, [t]);
				}

				if (!readOnly && onTextChange && t.docChanged) {
					onTextChange(view);
				}
			}
		}));

		container.current.appendChild(view.dom);
		return () => view.destroy();
	}, [extensions]); // TODO handle extensions change more gracefully

	useEffect(() => {
		dispatchRefs.current.readOnly = readOnly;
		dispatchRefs.current.onHandleUpdate =
			onHandleUpdate || onHandleUpdateDefault;
		dispatchRefs.current.onTextChange = onTextChange;
	}, [readOnly, onHandleUpdate, onTextChange]);

	useEffect(() => {
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

		const t = new Transaction(editor.current.state).change(
			new Change(0, editor.current.state.doc.length, value.split("\n"))
		);
		if (selection) t.setSelection(selection);

		const handleUpdate = onHandleUpdate || onHandleUpdateDefault;
		editor.current.update([t]);
	}, [value]);

	return <div ref={container} {...rest} />;
});

export { Codemirror };
