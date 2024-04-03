import { EditorState, StateField } from "@codemirror/state";
import {
  WidgetType,
  DecorationSet,
  Decoration,
  EditorView,
  ViewUpdate,
  ViewPlugin,
} from "@codemirror/view";

class GoalTextWidget extends WidgetType {
  goalText: string;

  constructor(goalText: string) {
    super();
    this.goalText = goalText;
  }

  toDOM(view) {
    const deco = document.createElement("span");
    deco.className = "cm-goal-text";
    const existingTextSize = view.state.doc.length ?? 0;
    deco.innerText = this.goalText.slice(existingTextSize) ?? "";
    return deco;
  }
}
function updateGoalTextHighlightsSet(
  state: EditorState,
  set: DecorationSet,
  goalText: string
) {
  const existingTextSize = state.doc.length ?? 0;
  console.log(existingTextSize);
  set = set.update({
    filter: () => false,
    add: [
      Decoration.widget({
        widget: new GoalTextWidget(goalText),
        side: 1,
        inlineOrder: true,
        block: false,
      }).range(existingTextSize),
    ],
  });
  return set;
}

function getSimilarityRanges(testString: string, goalString: string) {
  let ranges: {
    type: "correct" | "shifted" | "incorrect";
    from: number;
    to: number;
  }[] = [];
  let currentRangeType: "correct" | "shifted" | "incorrect" = "correct";
  let currentRangeStart = 0;
  let currentTestStrIndex = 0;
  for (let i = 0; i < goalString.length; i++) {
    if (currentTestStrIndex >= testString.length) break;
    if (currentRangeType === "incorrect") {
      if (goalString[i] === testString[currentTestStrIndex]) {
        ranges.push({
          from: currentRangeStart,
          to: currentTestStrIndex,
          type: currentRangeType,
        });
        currentRangeStart = currentTestStrIndex;
        currentRangeType = "shifted";
      } else {
        i--;
        currentTestStrIndex++;
      }
      continue;
    }
    if (goalString[i] === testString[currentTestStrIndex]) {
      currentTestStrIndex++;
    } else {
      i--;
      ranges.push({
        from: currentRangeStart,
        to: currentTestStrIndex,
        type: currentRangeType,
      });
      currentRangeStart = currentTestStrIndex;
      currentRangeType = "incorrect";
    }
  }
  ranges.push({
    from: currentRangeStart,
    to: currentTestStrIndex + 1,
    type: currentRangeType,
  });
  return ranges;
}

function getSimilarityRangeDecorations(testString: string, goalString: string) {
  const ranges = getSimilarityRanges(testString, goalString);

  return ranges.map((r) => {
    return Decoration.mark({
      class: `cm-similarity-${r.type}`,
    }).range(r.from, r.to);
  });
}

export const goalTextPlugin = (goalText: string) => [
  // show "goal text" placeholder
  StateField.define<DecorationSet>({
    create(state) {
      return updateGoalTextHighlightsSet(state, Decoration.none, goalText);
    },
    update(value, tr) {
      return updateGoalTextHighlightsSet(tr.state, value, goalText);
    },
    provide: (f) => EditorView.decorations.from(f),
  }),
  ViewPlugin.fromClass(
    class {
      update(update: ViewUpdate) {
        console.log(
          getSimilarityRanges(
            update.view.state.doc.toString(),
            "test string 123"
          )
        );
      }
    }
  ),
  // color text based on whether it is correct or not
  StateField.define<DecorationSet>({
    create(state) {
      return Decoration.none.update({
        add: getSimilarityRangeDecorations(state.doc.toString(), goalText),
      });
    },
    update(value, tr) {
      return Decoration.none.update({
        add: getSimilarityRangeDecorations(tr.state.doc.toString(), goalText),
      });
    },
    provide: (f) => EditorView.decorations.from(f),
  }),
];
