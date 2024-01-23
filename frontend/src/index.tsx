import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import {Provider} from 'react-redux'
import store from './redux/store'
import ToastProvider from "./contexts/ToastProvider";
import ProfileProvider from "./contexts/ProfileProvider";
import {SynchronizationProvider} from "./contexts/SynchronizationProvider";

createRoot(document.getElementById('root') as Element).render(
    <Provider store={store}>
        <SynchronizationProvider>
            <ToastProvider>
                <ProfileProvider>
                    <App/>
                </ProfileProvider>
            </ToastProvider>
        </SynchronizationProvider>
    </Provider>,
)
