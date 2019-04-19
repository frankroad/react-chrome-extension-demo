import * as React from 'react'
import style from './index.module.scss'
import PropTypes from 'prop-types'


class Footer extends React.Component {

    static propTypes = {
        size : PropTypes.number,
        showAll : PropTypes.func,
        showActive : PropTypes.func,
        showCompleted : PropTypes.func,
        clearCompeted : PropTypes.func,
        showState : PropTypes.string
    }

    render() {
        let { size, showAll, showActive, showCompleted, clearCompeted, showState } = this.props
        console.log(showState)
        return (
            <footer className={style.footer}>
                <div>
                    <span>{size || 0} items</span>
                </div>
                <div className={`${style.filters} ${style[showState]}`}>
                    <span onClick={showAll}>All</span>
                    <span onClick={showActive}>Active</span>
                    <span onClick={showCompleted}>Completed</span>
                </div>
                <div className={`${style.clear} ${style.show}`}>
                    <span onClick={clearCompeted}>Clear completed</span>
                </div>
            </footer>
        )
    }
}

export default Footer
