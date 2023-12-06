import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from './Loader';
import Error from './Error';
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  status: 'loading', 
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  theSecondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

function reducer (state, action) {
  switch (action.type) {
    case 'dataRecieved': 
    return {
      ...state, questions: action.payload, 
      status: 'ready'
    };

    case 'dataFailed': 
    return {
      ...state, status: 'error'
    };

    case 'start':
      return {
          ...state, status: 'active', theSecondsRemaining: state.questions.length * SECS_PER_QUESTION      
      };

    case 'newAnswer':
      const question = state.questions.at(state.index);

      return {
        ...state, 
        answer: action.payload, 
        points: action.payload === question.correctOption 
        ? state.points + question.points 
        : state.points
      };

    case 'nextQuestion':
      return {
        ...state, index: state.index +1,  answer: null
      };

    case 'finished':
      return {...state, status: 'finished', highScore: state.points > state.highScore ? state.points : state.highScore };

    case 'restart':
    return {...initialState, questions: state.questions, status: 'ready', highScore: state.highScore};

    case 'tick':
      return{...state, 
        theSecondsRemaining: state.theSecondsRemaining - 1,
        status: state.theSecondsRemaining === 0 ? 'finished' : state.status
      };

    default : throw new Error( "Action unkonwn");
  }
}

function App() {
const [{questions, status, index, answer, points, highScore, theSecondsRemaining}, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch('http://localhost:8000/questions')
    .then(res => res.json())
    .then( data => dispatch({type: 'dataRecieved', payload: data}))
    .catch ( (err) => dispatch({type: 'dataFailed'}));
  }, []);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, current) => prev + current.points, 0)

  return (
<div className="app">
  <Header />

<Main >
  {status === 'loading' && 
  <Loader />}
  {status === 'error' && 
  <Error />} 
  {status === 'ready' &&
  <StartScreen numQuestions = {numQuestions}
  dispatch={dispatch}/>}  
  {status === 'active' &&
  <>
  < Progress 
  index={index} 
  numQuestions={numQuestions} 
  points={points} 
  maxPoints = {maxPoints}
  answer = {answer}/>

  <Question 
  question= {questions[index]} 
  dispatch ={dispatch}
  answer = {answer}/>
  < Footer>
  <Timer dispatch={dispatch} theSecondsRemaining={theSecondsRemaining}/>
        <NextButton 
        dispatch={dispatch} 
        answer= {answer}
        index={index}
        numQuestions={numQuestions}/>
  </Footer>

  </>
  }
  {status === 'finished' && 
  <FinishScreen 
  points={points} 
  maxPoints={maxPoints}
   highScore={highScore}
   dispatch={dispatch}/>}
  
</Main>

</div>
  )
}

export default App;
