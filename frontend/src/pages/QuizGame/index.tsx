import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

interface Answer {
  [key: string]: string;
}

interface QuestionData {
  question: string;
  answers: Answer[];
  correct_answer: string;
}

const QuizGame: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizParams = location.state;

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<{ key: string, value: string }[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Estado para o simulador de dado
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceRolled, setDiceRolled] = useState(false);
  const [questionLoaded, setQuestionLoaded] = useState(false);

  // Novos estados para os botões
  const [isFinishLoading, setIsFinishLoading] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [showKnowledgeScroll, setShowKnowledgeScroll] = useState(false);
  const [knowledgeText, setKnowledgeText] = useState({ title: "", content: "" });

  useEffect(() => {
    if (!quizParams) {
      console.error("Nenhum parâmetro encontrado!");
      return;
    }
    // Não buscar pergunta automaticamente, esperamos o dado ser rolado primeiro
  }, [quizParams]);

  const fetchQuestion = () => {
    // Resetando estados para nova pergunta
    setQuestionData(null);
    setShowAnswers(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowNextButton(false);
    setTimerActive(false);
    setQuestionLoaded(false);

    axios.post("http://localhost:3333/api/questions", quizParams)
      .then((response) => {
        const fetchedQuestion = response.data.result.question;
        setQuestionData(fetchedQuestion);

        // Shuffle answers and set them
        const shuffled = shuffleAnswers(fetchedQuestion.answers);
        setShuffledAnswers(shuffled);

        // Timer para mostrar as respostas após 3 segundos
        setTimeout(() => {
          setShowAnswers(true);
          setTimeLeft(20); // 20 segundos para responder
          setTimerActive(true);
        }, 3000);
      })
      .catch((error) => {
        console.error("Erro ao buscar a pergunta:", error);
      });
  };

  useEffect(() => {
    if (showAnswers && timeLeft !== null && timerActive) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Tempo acabou
        handleTimeUp();
      }
    }
  }, [timeLeft, showAnswers, timerActive]);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer || timeLeft === 0) return; // Já respondeu ou tempo acabou

    setSelectedAnswer(answer);
    setTimerActive(false); // Parar o timer quando responder

    if (questionData && answer === questionData.correct_answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    // Mostrar botão de próxima rodada
    setShowNextButton(true);
  };

  const handleTimeUp = () => {
    setSelectedAnswer("timeout");
    setIsCorrect(false);
    setTimerActive(false);
    setShowNextButton(true);
  };

  const handleNextRound = () => {
    // Resetar para uma nova rodada (começando com o dado)
    setDiceRolled(false);
    setDiceValue(null);
    setIsCorrect(null);
    setShowNextButton(false);
  };

  // Função para rolar o dado
  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);

    // Simulação da animação de rolagem do dado
    let rollCount = 0;
    const maxRolls = 10; // Número de "rolagens" na animação
    const rollInterval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1; // Valores de 1-6
      setDiceValue(randomValue);

      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setIsRolling(false);
        setDiceRolled(true);

        // Após rolar o dado, buscamos a pergunta
        fetchQuestion();
      }
    }, 150);
  };

  // Novas funções para os botões
  const handleFinish = () => {
    if (isFinishLoading) return;
  
    setIsFinishLoading(true);
  
    axios.post("http://localhost:3333/api/parchments", quizParams)
      .then((response) => {
        const parchment = response.data.result.parchment;
        setTimeout(() => {
          setIsFinishLoading(false);
          setShowKnowledgeScroll(true);
          
          // Salva como objeto
          setKnowledgeText({ title: parchment.title, content: parchment.content });
        }, 5000);
      })
      .catch((error) => {
        console.error("Erro ao buscar o pergaminho:", error);
      });
  };
  


  const handleBackToParameters = () => {
    if (isBackLoading) return;

    setIsBackLoading(true);

    // Timer de 5 segundos para simular carregamento
    setTimeout(() => {
      setIsBackLoading(false);
      // Navegando de volta para a tela de parâmetros (supondo que seja a rota '/')
      navigate('/', { replace: true });
    }, 5000);
  };

  // Formato do timer em MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Renderização do dado
  const renderDice = (value: number | null) => {
    if (value === null) return null;

    // Array com a posição dos pontos para cada valor do dado
    const dotPositions = {
      1: ['middle'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'middle', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'middle', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    const dots = dotPositions[value as keyof typeof dotPositions].map((pos, index) => (
      <div key={index} className={`dice-dot dice-dot-${pos}`}></div>
    ));

    return (
      <div className={`dice ${isRolling ? 'dice-rolling' : ''}`}>
        {dots}
      </div>
    );
  };

  // New function to shuffle answers
  const shuffleAnswers = (answers: Answer[]) => {
    const formattedAnswers = answers.map((answer, index) => ({
      key: Object.keys(answer)[0],
      value: Object.values(answer)[0]
    }));

    // Fisher-Yates shuffle algorithm
    for (let i = formattedAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [formattedAnswers[i], formattedAnswers[j]] = [formattedAnswers[j], formattedAnswers[i]];
    }

    return formattedAnswers;
  };

  // Tela do pergaminho de conhecimento
  const renderKnowledgeScroll = () => {
    return (
      <div className="knowledge-scroll-container">
        <div className="knowledge-scroll">
          <h2>{knowledgeText.title}</h2>
          <p>{knowledgeText.content}</p>
          <button
            className="back-to-menu-button"
            onClick={() => navigate('/', { replace: true })}
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {showKnowledgeScroll ? (
        renderKnowledgeScroll()
      ) : (
        <>
          <div className="quiz-header">
            <div className="game-info">
              <span className="game-info-label">Trilha do conhecimento</span>
            </div>
            {timeLeft !== null && timerActive && (
              <div className={`timer ${timeLeft < 5 ? "timer-warning" : ""}`}>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="game-section">
            {/* Seção inicial com o dado */}
            {!diceRolled ? (
              <div className="dice-initial-section">
                <h2 className="dice-instructions">Role o dado para definir quantas casas você pode avançar!</h2>
                <div className="dice-container">
                  {renderDice(diceValue)}

                  {!isRolling && !diceValue && (
                    <div className="action-buttons-container">
                      <button
                        className="roll-dice-button"
                        onClick={rollDice}
                      >
                        Rolar o Dado
                      </button>

                      <button
                        className={`finish-button ${isFinishLoading ? 'button-loading' : ''}`}
                        onClick={handleFinish}
                        disabled={isFinishLoading}
                      >
                        {isFinishLoading ? (
                          <>
                            <div className="button-spinner"></div>
                            <span>Finalizando...</span>
                          </>
                        ) : "Finalizar"}
                      </button>

                      <button
                        className={`back-button ${isBackLoading ? 'button-loading' : ''}`}
                        onClick={handleBackToParameters}
                        disabled={isBackLoading}
                      >
                        {isBackLoading ? (
                          <>
                            <div className="button-spinner"></div>
                            <span>Voltando...</span>
                          </>
                        ) : "Voltar"}
                      </button>
                    </div>
                  )}

                  {diceValue && !isRolling && !questionLoaded && (
                    <div className="stake-announcement">
                      <p>Esta pergunta vale <span className="dice-value">{diceValue}</span> {diceValue === 1 ? 'casa' : 'casas'}!</p>
                      <p className="loading-question">Carregando pergunta...</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Seção da pergunta (exibida após rolar o dado) */}
            {questionData && diceRolled && (
              <div className="question-section">
                <div className="question-stake">
                  Esta pergunta vale <span className="dice-value-small">{diceValue}</span> {diceValue === 1 ? 'casa' : 'casas'}!
                </div>

                <div className="question-card">
                  <h2>{questionData.question}</h2>
                </div>

                {!showAnswers && (
                  <div className="preparing-message">
                    Preparando as alternativas...
                  </div>
                )}

                {showAnswers && (
                  <div className="answers-grid">
                    {shuffledAnswers.map((answer, index) => {
                      const isSelected = selectedAnswer === answer.key;
                      const isAnswerCorrect = answer.key === questionData?.correct_answer;

                      let cardClass = "answer-card";
                      if (selectedAnswer) {
                        if (isSelected) {
                          cardClass += isAnswerCorrect ? " correct" : " incorrect";
                        } else if (isAnswerCorrect) {
                          cardClass += " correct";
                        }
                      }

                      return (
                        <div
                          key={index}
                          className={cardClass}
                          onClick={() => handleAnswerClick(answer.key)}
                        >
                          <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                          <span className="answer-text">{answer.value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isCorrect !== null && (
                  <div className={`feedback-message ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}>
                    {isCorrect
                      ? `Correto! Avance ${diceValue} ${diceValue === 1 ? 'casa' : 'casas'} no tabuleiro!`
                      : selectedAnswer === "timeout"
                        ? "Tempo esgotado! Não avance no tabuleiro."
                        : "Incorreto! A resposta certa está destacada. Não avance no tabuleiro."}
                  </div>
                )}

                {showNextButton && (
                  <button
                    className="next-button"
                    onClick={handleNextRound}
                  >
                    Próxima rodada
                  </button>
                )}
              </div>
            )}

            {/* Estado de carregamento (somente ao iniciar o jogo) */}
            {!diceRolled && !diceValue && questionData === null && (
              <div className="start-instruction">
                <h2>Bem-vindo a Trilha do conhecimento</h2>
                <p>Comece rolando o dado para determinar o valor da pergunta!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizGame;