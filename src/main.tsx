import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import "./wikipedia/fetch-random-article";

createRoot(document.getElementById("root")!).render(<App></App>);
