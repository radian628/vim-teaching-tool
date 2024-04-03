import React, { useEffect, useState } from "react";
import { Editor } from "./editor/Editor";
import {} from "./wikipedia/fetch-random-article";
import { InsertMode1 } from "./levels/InsertMode1";
import { HJKL1 } from "./levels/HJKL1";
import { LevelSequence } from "./levels-format/Levels";

const rangeHighlights = [
  {
    from: 5,
    to: 6,
  },
];

export function App() {
  return (
    <div>
      {/* <InsertMode1 onComplete={() => {}}></InsertMode1> */}
      {/* <HJKL1 onComplete={() => {}}></HJKL1> */}
      {/* <Editor
        text={text}
        setText={setText}
        setCaret={setCaret}
        rangeHighlights={rangeHighlights}
      ></Editor> */}
      <LevelSequence levels={[InsertMode1]}></LevelSequence>
    </div>
  );
}
