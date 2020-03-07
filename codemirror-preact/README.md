# codemirror-preact

Use https://github.com/codemirror/codemirror.next with Preact.

```js
import { Codemirror } from "@mischnic/codemirror-preact";

<Codemirror
	value={"<b>Hello!</b>"}
	extensions={extensions}
	onHandleUpdate={(view, t) => view.update(t)}
	onTextChange={(view) => console.log(view.state.doc.toString())}
	readOnly={false},
	...rest //, other props for the wrapper <div>
/>;
```

**`useMemo` the props to prevent unnecessary updates!**

-   Use `onHandleUpdate` if you want to efficiently prevent updates to the editor (apart from `readOnly`).
-   You can use `onTextChange` for a "controlled input" by updating the state that sets `value` (might be less performant).
