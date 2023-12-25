import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {RootState, store} from "./redux/store"
import {Provider, useDispatch, useSelector} from 'react-redux'
import HomePage from "./components/home/HomePage";


// example how to use redux in component
//
//import {decrement, increment} from "./slices/trainingSessionSlice";
//
// const dispatch = useDispatch();
// const count = useSelector((state: RootState) => state.trainingSession.value);
//
// <button
//     aria-label="Increment value"
//     onClick={() => dispatch(increment())}
// >
//     Increment
// </button>
// <button
//     aria-label="Decrement value"
//     onClick={() => dispatch(decrement())}
// >
//     Decrement
// </button>


ReactDOM.render(
    //This makes the store accessible to the App that is passing it as a prop
    <Provider store={store}>
        <HomePage/>
    </Provider>,
    document.getElementById('root')
)

