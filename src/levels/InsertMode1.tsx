import React, { useEffect } from "react";
import { useState } from "react";
import { Editor } from "../editor/Editor";
import { getRandomFormattedWikipediaText } from "../wikipedia/fetch-random-article";
import { LevelProps } from "../levels-format/Levels";

export function InsertMode1(props: LevelProps) {
  const [text, setText] = useState<string>("");

  const [goalText, setGoalText] = useState<string>();

  useEffect(() => {
    if (goalText) return;
    (async () => {
      setGoalText(await getRandomFormattedWikipediaText(100));
    })();
  });

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
      <Editor text={text ?? ""} setText={setText} goalText={goalText}></Editor>
      {text === goalText && (
        <button
          onClick={() => {
            props.onComplete();
          }}
        >
          Continue
        </button>
      )}
    </div>
  );
}
