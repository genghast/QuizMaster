import React, { useState } from 'react';
import './CreateTest.css';
import { useNavigate } from 'react-router-dom';


const CreateQuiz = () => {

  //check user is logged in or not
  if (!localStorage.getItem('token')) {
    navigate('/login');
  }
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: [''], correctAnswer: '' }]);
  const [error, setError] = useState('');
  const { navigate } = useNavigate();

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleTimeLimitChange = (e) => setTimeLimit(e.target.value);

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = newQuestions[questionIndex].options[optionIndex];
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: [''], correctAnswer: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let q of questions) {
      if (!q.correctAnswer) {
        setError('Please select a correct answer for each question.');
        return;
      }
    }

    try {
      const url = process.env.REACT_APP_BACKEND_URL + '/quizzes';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, questions, timeLimit }),
      });
      const data = await response.json();
      console.log(data);
      alert('Quiz created successfully');
      setError('');
      navigate('/my-tests');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  };

  return (
    <div className="create-quiz">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <input type="text" id="title" value={title} onChange={handleTitleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="timeLimit">Time Limit (minutes)</label>
          <input type="number" id="timeLimit" value={timeLimit} onChange={handleTimeLimitChange} required />
        </div>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-card">
            <div className="form-group">
              <label htmlFor={`question-${qIndex}`}>Question</label>
              <input type="text" id={`question-${qIndex}`} value={q.question} onChange={(e) => handleQuestionChange(qIndex, e)} required />
              <button type="button" className="remove-button" onClick={() => removeQuestion(qIndex)}>Remove Question</button>
            </div>
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="form-group option-group">
                <label htmlFor={`option-${qIndex}-${oIndex}`}>Option {oIndex + 1}</label>
                <input
                  type="text"
                  id={`option-${qIndex}-${oIndex}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                  required
                />
                <button type="button" onClick={() => removeOption(qIndex, oIndex)}>Remove</button>
                <input
                  type="radio"
                  id={`correctAnswer-${qIndex}-${oIndex}`}
                  name={`correctAnswer-${qIndex}`}
                  checked={q.correctAnswer === option}
                  onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                />
                <label htmlFor={`correctAnswer-${qIndex}-${oIndex}`}>Correct</label>
              </div>
            ))}
            <button type="button" onClick={() => addOption(qIndex)}>Add Option</button>
          </div>
        ))}
        {error && <p className="error">{error}</p>}
        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
