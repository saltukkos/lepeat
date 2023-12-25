import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store } from "./redux/store"
import { Provider } from 'react-redux'
import HomePage from "./components/home/HomePage";


ReactDOM.render(
    //This makes the store accessible to the App that is passing it as a prop
  <Provider store={store}>
      <HomePage />
  </Provider>,
document.getElementById('root')
)

