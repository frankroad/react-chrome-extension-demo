import * as React from 'react'
import style from './index.module.scss'
import PropTypes from 'prop-types'

class TodoInputText extends React.Component {
    static propTypes = {
        handleSubmit : PropTypes.func
    }

    state = { text : '' }

    handleChange = (e) => this.setState({ text : e.target.value })

    // 回车提交todo
    handleSubmit = (e) => {
        if ( e.which === 13 && this.state.text ) {
            this.props.handleSubmit && this.props.handleSubmit(this.state.text)
            this.setState({ text : '' })
        }
    }

    render() {
        return (
            <input type="text"
                   className={style.edit}
                   value={this.state.text}
                   placeholder={this.props.placeholder || 'what needs to be done'}
                   autoFocus={true}
                   onChange={this.handleChange}
                   onKeyDown={this.handleSubmit}
            />
        )
    }
}

export default TodoInputText
