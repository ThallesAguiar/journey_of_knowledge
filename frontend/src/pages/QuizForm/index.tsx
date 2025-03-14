import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Update to use the new CSS file
import HoldButton from "../../components/HoldButton";

interface QuizParams {
  theme: string;
  discipline: string;
  description: string;
}

const QuizForm: React.FC = () => {
  const [formData, setFormData] = useState<QuizParams>({
    theme: "",
    discipline: "",
    description: "",
  });

  const submittedRef = useRef(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    navigate("/game", { state: formData });

    setTimeout(() => {
      submittedRef.current = false;
    }, 500);
  }, [formData, navigate]);

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Cadastrar Parâmetros do Quiz</h2>
        <form>
          <div className="form-group">
            <label className="form-label">
              Tema:
            </label>
            <input 
              type="text" 
              name="theme" 
              className="form-input"
              value={formData.theme} 
              onChange={handleChange}
              placeholder="Digite o tema do quiz" 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Disciplina:
            </label>
            <input 
              type="text" 
              name="discipline" 
              className="form-input"
              value={formData.discipline} 
              onChange={handleChange}
              placeholder="Digite a disciplina relacionada" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Descrição:
            </label>
            <textarea 
              name="description" 
              className="form-input"
              value={formData.description} 
              onChange={handleChange}
              placeholder="Forneça uma descrição detalhada para o seu quiz" 
            />
          </div>

          <div className="button-container">
            <HoldButton onComplete={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;