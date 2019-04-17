import * as React from 'react'
import { render } from "react-dom"
import { Provider } from 'react-redux'
import createStore from '../../../app/redux/configureStore'
import Popup from '../../../app/containers/Popup'

const initialize = [{ id : 0, text : "欢迎使用todo", completed : false }]

chrome.storage.sync.get(
    'todos',
    ({ todos }) => {
        todos = todos ? todos : initialize

        let store = createStore({ todos })
        let save = () => chrome.storage.sync.set({
            todos : store.getState().todos
        })

        if ( todos === initialize ) {
            save()
        }
        store.subscribe(save)

        render((
                <Provider store={store}>
                    <Popup />
                </Provider>
            ),
            document.getElementById('root')
        )
    }
)


