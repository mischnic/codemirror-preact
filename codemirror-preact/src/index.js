import { h } from "preact";
import { useRef, useEffect } from "preact/hooks";
import { memo } from "preact/compat";

import { EditorView } from "@codemirror/next/view";
import { EditorState } from "@codemirror/next/state";

const Codemirror = memo(function Codemirror({
	value = "",
	extensions = [],
	onUpdate = null,
	onTextChange = null,
	...rest
}) {
	const container = useRef(null);
	useEffect(() => {
		let view = new EditorView({
			state: EditorState.create({
				doc: value,
				extensions
			}),
			dispatch: t => {
				view.update([t]);

				if (onUpdate) {
					onUpdate(t);
				}

				if (onTextChange && t.changes.length > 0) {
					onTextChange({
						get text() {
							return view.state.doc.toString();
						}
					});
				}
				// console.log(t);
				// console.log(view.state.doc.toString());
			}
		});

		container.current.appendChild(view.dom);
		return () => view.destroy();
	});

	return <div ref={container} {...rest}/>;
});

export { Codemirror };
