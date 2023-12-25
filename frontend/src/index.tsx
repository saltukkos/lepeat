import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TrainingSession from './training/TrainingSession';
import { store } from "./redux/store"
import { Provider } from 'react-redux'
import {noun1, translationsTrainingDefinition} from "./model/DefaultModel";


ReactDOM.render(
    //This makes the store accessible to the App that is passing it as a prop
  <Provider store={store}>
    <TrainingSession trainingDefinition={ translationsTrainingDefinition } termTrainingProgress={[{
        term: noun1,
        iterationNumber: 0,
    }]}/>
  </Provider>,
document.getElementById('root')
)

