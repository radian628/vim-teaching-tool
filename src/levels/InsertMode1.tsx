import React from "react";
import { useState } from "react";
import { Editor } from "../editor/Editor";

export function InsertMode1(props: LevelProps) {
  const [text, setText] = useState<string>("");

  return (
    <div>
      <p>
        Use <kbd>i</kbd> to enter <dfn>Insert Mode</dfn>. In Insert Mode, you
        can type text as you would in any text editor. This disables{" "}
        <kbd>hjkl</kbd> navigation and other forms of navigation &mdash; it is
        only for entering text.
      </p>
      <p>
        Use <kbd>ctrl+c</kbd> or <kbd>Esc</kbd> to exit Insert Mode and return
        to <dfn>Normal Mode</dfn>. In Normal Mode, you can use <kbd>hjkl</kbd>{" "}
        and other navigation methods.
      </p>
      <p>Enter the required text below:</p>
      <Editor text={text ?? ""} setText={setText}></Editor>
    </div>
  );
}
