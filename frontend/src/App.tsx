import { Route, Routes } from "react-router-dom";

import Chat from "./pages/chat";
import Chart from "./pages/chart";
import LandingPage from "./pages/landing";

function App() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<Chat />} path="/chat" />
      <Route element={<Chart />} path="/chart" />
    </Routes>
  );
}

export default App;
