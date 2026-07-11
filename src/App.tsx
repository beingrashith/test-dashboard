import "./App.css";
import CreateTest from "./components/CreateTest";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionCreation from "./components/QuestionCreation";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/questions" element={<QuestionCreation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
