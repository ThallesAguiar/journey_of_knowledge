import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

const HoldButton: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false); // 🔹 Impede execuções múltiplas

  useEffect(() => {
    if (holding) {
      completedRef.current = false; // Reset ao segurar
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100 && !completedRef.current) {
            completedRef.current = true; // 🔹 Marca como concluído
            clearInterval(timerRef.current!);
            setTimeout(() => onComplete(), 0); // ✅ Chama apenas uma vez
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    } else {
      clearInterval(timerRef.current!);
      setProgress(0);
    }

    return () => clearInterval(timerRef.current!);
  }, [holding, onComplete]);

  return (
    <div className="button-container">
      <button
        className="hold-button"
        onMouseDown={() => setHolding(true)}
        onMouseUp={() => setHolding(false)}
        onTouchStart={() => setHolding(true)}
        onTouchEnd={() => setHolding(false)}
      >
        Segure para iniciar
        <div className="progress-circle" style={{ "--progress": `${progress}%` } as React.CSSProperties}></div>
      </button>
    </div>
  );
};

export default HoldButton;
