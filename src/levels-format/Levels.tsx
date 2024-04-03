import React from "react";
import { FunctionComponent, useState } from "react";

export type LevelProps = {
  onComplete: () => void;
};

export function LevelSequence(props: {
  levels: FunctionComponent<LevelProps>[];
}) {
  const [levelIndex, setLevelIndex] = useState(0);

  let CurrentLevel = props.levels[levelIndex];

  return (
    <CurrentLevel
      onComplete={() => {
        setLevelIndex(levelIndex + 1);
      }}
    ></CurrentLevel>
  );
}
