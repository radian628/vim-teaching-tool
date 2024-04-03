import React, { useEffect, useState } from "react";
import { Editor } from "./editor/Editor";
import {} from "./wikipedia/fetch-random-article";
import { InsertMode1 } from "./levels/InsertMode1";

const rangeHighlights = [
  {
    from: 5,
    to: 6,
  },
];

export function App() {
  return (
    <div>
      <InsertMode1 onComplete={() => {}}></InsertMode1>
      {/* <Editor
        text={text}
        setText={setText}
        setCaret={setCaret}
        rangeHighlights={rangeHighlights}
      ></Editor> */}
    </div>
  );
}
