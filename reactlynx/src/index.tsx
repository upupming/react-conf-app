import "@lynx-js/preact-devtools";
import { root } from "@lynx-js/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { Schedule } from "./App.jsx";
import "./index.css";
import "./App.css";
import TalkDetail from "./routes/talk.jsx";

root.render(
  <view
    class={"flex-column root " + (lynx.__globalProps.theme?.toLowerCase() ?? "light")}
  >
    <MemoryRouter>
      <Schedule />
      <Routes>
        <Route path="/talk/:talk" element={<TalkDetail />} />
      </Routes>
    </MemoryRouter>
  </view>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
