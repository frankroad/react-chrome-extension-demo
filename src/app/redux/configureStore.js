import { createStore } from 'redux'
import reducer from './modules'

export default (initialState) => createStore(reducer, initialState)
