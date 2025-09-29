import { BrowserRouter, Routes, Route } from "react-router";
import PlayGround from "./views/Playground";
import HomePage from "./views/HomePage";
import BaseLayout from "./views/BaseLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout/>}>
          <Route path='/' element={<HomePage/>}/>
          <Route path="/plays" element={<PlayGround/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
