import React from "react";
import DefaultLayout from "./components/layout/DefaultLayout";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";


const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>} />
      </Routes>

    </>
  )
}

export default App;