import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import { Toaster } from "sonner";

// only route nothing else here
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Details />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
