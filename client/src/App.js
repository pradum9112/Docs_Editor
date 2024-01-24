import TextEditor from "./TextEditor";
import { Routes, Route } from "react-router-dom";
import Signup from "./LogInSignup/Signup";
import Login from "./LogInSignup/Login";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<TextEditor />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
