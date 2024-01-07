import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './redux/store'

createRoot(document.getElementById('root') as Element).render(
    <Provider store={store}>
        <App />
    </Provider>,
)
