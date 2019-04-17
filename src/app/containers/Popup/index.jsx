import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from '../../redux/modules/todos'

import Header from "../../../app/components/Header"
import TodoInputText from "../../../app/components/TodoInputText"
import TodoItem from "../../../app/components/TodoItem"
import Footer from "../../components/Footer"


import style from './goble.module.css'

const ShowState = {
    All : 'all',
    Active : 'active',
    Completed : 'completed'
}

class Popup extends React.Component {
    state = { showState : ShowState.All }

    showAll = () => this.setState({ showState : ShowState.All })

    showActive = () => this.setState({ showState : ShowState.Active })

    showCompleted = () => this.setState({ showState : ShowState.Completed })

    render() {
        const { todos, addTodo, editTodo, completeTodo, deleteTodo, clearCompleted } = this.props
        console.log('todos:', todos)
        return (
            <>
                <Header />
                <section className={style.section}>
                    <TodoInputText handleSubmit={addTodo} />
                    {filtersTodos(todos, this.state.showState)
                    .map((todo) => (
                        <TodoItem
                            text={todo.text}
                            completed={todo.completed}
                            key={todo.id}
                            handleSubmit={(text) => editTodo(todo.id, text)}
                            handleFulfillClick={() => completeTodo(todo.id)}
                            handleDeleteClick={() => deleteTodo(todo.id)}
                        />
                    ))}
                    <Footer
                        size={todos.length}
                        showAll={this.showAll}
                        showActive={this.showActive}
                        showCompleted={this.showCompleted}
                        clearCompeted={() => clearCompleted()}
                        showState={this.state.showState}
                    />
                </section>
            </>
        )
    }
}

function filtersTodos(todos, showState) {
    switch ( showState ) {
        case ShowState.Completed:
            return todos.filter((todo) => todo.completed)
        case ShowState.Active:
            return todos.filter((todo) => !todo.completed)
        case ShowState.All:
        default:
            return todos
    }
}

const mapStateToProps = (state) => ({
    todos : state.todos
})

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators(actions, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(Popup)
