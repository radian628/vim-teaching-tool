import { useEffect, useState } from "react";
import { LevelProps } from "../levels-format/Levels";
import { getRandomFormattedWikipediaText } from "../wikipedia/fetch-random-article";
import React from "react";
import { Editor } from "../editor/Editor";
import { Decoration } from "@codemirror/view";

const TARGET_COUNT = 10;

export function HJKL1(props: LevelProps) {
  const [text, setText] = useState<string>();

  const [targets, setTargets] = useState<number[]>([]);

  const [targetsReached, setTargetsReached] = useState<Set<number>>(new Set());

  const [caret, setCaret] = useState(0);

  useEffect(() => {
    if (text) return;

    (async () => {
      const text = await getRandomFormattedWikipediaText(600);
      setText(text);
      setTargets(
        new Array(TARGET_COUNT)
          .fill(0)
          .map((e) => {
            while (true) {
              const idx = Math.floor(Math.random() * text.length);
              if (text[idx] !== "\n") return idx;
            }
          })
          .sort((a, b) => a - b)
      );
    })();
  }, []);

  if (!text) return <div>Loading...</div>;

  return (
    <div>
      <p>Use the following keys to navigate:</p>
      <ul className="ms-2">
        <li>
          <kbd>h</kbd> &mdash; Left
        </li>
        <li>
          <kbd>j</kbd> &mdash; Down
        </li>
        <li>
          <kbd>k</kbd> &mdash; Up
        </li>
        <li>
          <kbd>l</kbd> &mdash; Right
        </li>
      </ul>
      <p>Navigate to all of the highlighted regions to continue.</p>
      <p className="text-2xl">
        {targetsReached.size} / {TARGET_COUNT}
      </p>
      <Editor
        readonly
        text={text}
        setText={setText}
        rangeHighlights={targets.map((t, i) => {
          return {
            from: t,
            to: t + 1,
            decoration: Decoration.mark({
              class: targetsReached.has(i)
                ? "cm-target-fulfilled"
                : "cm-target",
            }),
          };
        })}
        setCaret={(newCaret) => {
          const idx = targets.indexOf(newCaret);
          if (idx !== -1) {
            const newSet = new Set(targetsReached);
            newSet.add(idx);
            setTargetsReached(newSet);
          }
        }}
      ></Editor>
      {targetsReached.size === TARGET_COUNT && (
        <button
          onClick={(e) => {
            props.onComplete();
          }}
        >
          Continue
        </button>
      )}
    </div>
  );
}
