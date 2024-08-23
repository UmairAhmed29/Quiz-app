import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the questions!', error);
      });
  }, []);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const handleAnswerClick = (isCorrect, index) => {
    setAnswered(true);
    setIsCorrect(isCorrect);
    setSelectedOption(index);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      alert(`Quiz finished! Your score is ${score} / ${questions.length}`);
    }
  };

  const getDifficultyStars = () => {
    const difficulty = questions[currentQuestion].difficulty;
    let stars = [false, false, false]; // Three stars, all white by default

    if (difficulty === 'easy') {
      stars[0] = true; // Only first star is black
    } else if (difficulty === 'medium') {
      stars[0] = stars[1] = true; // First two stars are black
    } else if (difficulty === 'hard') {
      stars = [true, true, true]; // All three stars are black
    }

    return stars;
  };

  const progress = (currentQuestion / questions.length) * 100;
  const currentScorePercentage = (score / questions.length) * 100;
  const maxScorePossible = ((score + (questions.length - (currentQuestion + 1))) / questions.length) * 100;
  const minScorePossible = (score / questions.length) * 100;

  const stars = getDifficultyStars();

  return (
    <div className="quiz-container">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      

      <h1>Question {currentQuestion + 1} of {questions.length}</h1>
      <p className="question-category">{decodeURIComponent(questions[currentQuestion].category)}</p>
      <div className="difficulty-stars">
        {stars.map((isBlack, index) => (
          <span key={index} className={isBlack ? 'star-black' : 'star-white'}>&#9733;</span>
        ))}
      </div> 
      <p style={{ fontWeight: 'bold', fontSize: '24px' }}>{decodeURIComponent(questions[currentQuestion].question)}</p>

     
      
      
        
      <div className="options-grid">
        {[
          ...questions[currentQuestion].incorrect_answers.map((ans, idx) => ({ text: decodeURIComponent(ans), isCorrect: false, index: idx })),
          { text: decodeURIComponent(questions[currentQuestion].correct_answer), isCorrect: true, index: questions[currentQuestion].incorrect_answers.length }
        ].sort(() => Math.random() - 0.5).map((option, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswerClick(option.isCorrect, index)} 
            disabled={answered}
            style={{
              backgroundColor: selectedOption === index ? 'black' : '',
              color: selectedOption === index ? 'white' : ''
            }}
          >
            {option.text}
          </button>
        ))}
      </div>

      {answered && (
        <>
          <div className="answer-feedback">
            {isCorrect ? 'Correct!' : 'Sorry!'}
          </div>
          <button onClick={handleNextQuestion}>Next Question</button>
        </>
      )}

      <div className="score-container">
        <div className="score-progress-bar-container">
          <div className="min-score-progress-bar" style={{ width: `${minScorePossible}%`, backgroundColor: 'grey' }}></div>
          <div className="max-score-progress-bar" style={{ width: `${maxScorePossible}%`, backgroundColor: 'lightgrey' }}></div>
          <div className="score-progress-bar" style={{ width: `${currentScorePercentage}%`, backgroundColor: 'black' }}></div>
        </div>
        <div className="score-text">
          <p>Score: {score} / {questions.length}</p>
          <p>Max Score: {score + questions.length - (currentQuestion + 1)}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
