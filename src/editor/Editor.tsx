import { EditorState, RangeSetBuilder, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  drawSelection,
  lineNumbers,
} from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";
import React, { useEffect, useRef } from "react";
import { goalTextPlugin } from "./goal-text-plugin";

const noRangeHighlights = [];

export function Editor(props: {
  text: string;
  setText: (s: string) => void;
  readonly?: boolean;
  setCaret?: (number: number) => void;
  rangeHighlights?: { to: number; from: number; decoration: Decoration }[];
  goalText?: string;
}) {
  const rangeHighlights = props.rangeHighlights ?? noRangeHighlights;

  const containerRef = useRef<HTMLDivElement>(null);
  const codemirrorRef = useRef<EditorView>();

  function updateTargetHighlightsSet(set: DecorationSet) {
    set = set.update({
      filter: () => false,
      add: rangeHighlights.map((hl) => hl.decoration.range(hl.from, hl.to)),
    });
    return set;
  }

  function generateState() {
    return EditorState.create({
      selection: codemirrorRef.current?.state.selection ?? undefined,
      doc: props.text,
      extensions: [
        // caret tracking
        ViewPlugin.fromClass(
          class {
            update(update: ViewUpdate) {
              if (update.docChanged) {
                props.setText?.(update.view.state.doc.toString());
              }
              props.setCaret?.(
                update.view.state.selection.ranges[0]?.from ?? 0
              );
            }
          }
        ),
        // caret target locations
        StateField.define<DecorationSet>({
          create() {
            return updateTargetHighlightsSet(Decoration.none);
          },
          update(value, tr) {
            return updateTargetHighlightsSet(value);
          },
          provide: (f) => EditorView.decorations.from(f),
        }),
        lineNumbers(),
        vim(),
        EditorState.readOnly.of(props.readonly ?? false),
        drawSelection(),
        props.goalText ? goalTextPlugin(props.goalText) : [],
      ],
    });
  }

  useEffect(() => {
    codemirrorRef.current?.setState(generateState());
  }, [props.readonly, rangeHighlights, props.goalText]);

  useEffect(() => {
    if (!codemirrorRef.current) return;
    if (codemirrorRef.current.state.doc.toString() !== props.text)
      codemirrorRef.current.setState(generateState());
  }, [props.text]);

  useEffect(() => {
    if (!containerRef.current) return;
    codemirrorRef.current = new EditorView({
      state: generateState(),
      parent: containerRef.current,
    });

    return () => {
      codemirrorRef.current?.destroy();
    };
  }, []);

  return <div ref={containerRef}></div>;
}
