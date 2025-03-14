import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // Certifique-se de que está usando a versão correta
import QuizForm from "./pages/QuizForm";
import QuizGame from "./pages/QuizGame";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>  {/* Corrija para usar <Routes> e não <Switch> */}
        <Route path="/" element={<QuizForm />} />
        <Route path="/game" element={<QuizGame />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
