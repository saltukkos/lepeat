import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TrainingSession from './training/TrainingSession';
import { store } from "./redux/store"
import { Provider } from 'react-redux'


ReactDOM.render(
    //This makes the store accessible to the App that is passing it as a prop
  <Provider store={store}>
    <TrainingSession />
  </Provider>,
document.getElementById('root')
)

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <WordCheckComponent />
//   </React.StrictMode>
// );

