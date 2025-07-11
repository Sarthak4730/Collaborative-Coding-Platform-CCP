import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Landing /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/login" element={ <Login /> } />

        <Route 
          path="/create-room"
          element={
            <ProtectedRoute>
              <CreateRoom /> 
            </ProtectedRoute>
          }
        />
        <Route 
          path="/join-room"
          element={
            <ProtectedRoute>
              <JoinRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App;