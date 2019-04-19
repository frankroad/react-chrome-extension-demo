export const types = {
    ADD_TODO : 'ADD_TODO',
    DELETE_TODO : 'DELETE_TODO',
    EDIT_TODO : 'EDIT_TODO',
    COMPLETE_TODO : 'COMPLETE_TODO',
    COMPLETE_ALL : 'COMPLETE_ALL',
    CLEAR_COMPLETED : 'CLEAR_COMPLETED'
}
export const actions = {
    addTodo : (text) => ({ type : types.ADD_TODO, text }),

    deleteTodo : (id) => ({ type : types.DELETE_TODO, id }),

    editTodo : (id, text) => ({ type : types.EDIT_TODO, id, text }),

    completeTodo : (id) => ({ type : types.COMPLETE_TODO, id }),

    completeAll : () => ({ type : types.COMPLETE_ALL }),

    clearCompleted : () => ({ type : types.CLEAR_COMPLETED }),
}

export default (state = [], action) => {
    switch ( action.type ) {
        case types.ADD_TODO:
            return [{
                id : state.reduce((pre, todo) => Math.max(pre, todo.id), -1) + 1,
                text : action.text,
                completed : false,
            }, ...state]
        case types.DELETE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case types.EDIT_TODO:
            return state.map((todo) => todo.id === action.id
                ? { ...todo, text : action.text }
                : todo
            )
        case types.COMPLETE_TODO:
            return state.map((todo) => todo.id === action.id
                ? { ...todo, completed : !todo.completed }
                : todo
            )
        case types.COMPLETE_ALL:
            return state.map((todo) => ({ ...todo, completed : true }))
        case types.CLEAR_COMPLETED:
            return state.filter((todo) => !todo.completed)
        default:
            return state
    }
}


