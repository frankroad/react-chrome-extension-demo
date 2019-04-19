import * as React from 'react'
import style from './index.module.scss'
import PropTypes from 'prop-types'

class TodoItem extends React.Component {
    static propTypes = {
        text : PropTypes.string.isRequired,
        completed : PropTypes.bool.isRequired,
        handleSubmit : PropTypes.func,
        handleFulfillClick : PropTypes.func,
        handleDeleteClick : PropTypes.func
    }

    state = {
        readonly : true,
        text : this.props.text
    }

    // 双击时, 改为可编辑状态
    handleDoubleClick = () => {
        this.setState({ readonly : false })
    }

    // 失去焦点时, 提交, 改为只读
    handleBlur = () => {
        this.setState({ readonly : true })
        this.handleSubmit()
    }

    // 回车提交todo
    handleKeyDown = (e) => {
        if ( e.which === 13 ) {
            this.handleBlur()
        }
    }

    // 用户重新todo文本
    handleRewriteTodo = (e) => this.setState({ text : e.target.value })

    // 提交
    handleSubmit = () => this.props.handleSubmit && this.props.handleSubmit(this.state.text)

    // 点击完成按钮
    handleFulfillClick = () => this.props.handleFulfillClick && this.props.handleFulfillClick()

    // 点击删除按钮
    handleDeleteClick = () => this.props.handleDeleteClick && this.props.handleDeleteClick()


    render() {
        const { readonly, text } = this.state
        return (
            <section className={`${style.item} ${this.props.completed ? style.complete : style.unfinished}`}>
                <button onClick={this.handleFulfillClick} />
                <div className={style.text}>
                    {readonly
                        ? <span onDoubleClick={this.handleDoubleClick}>{text}</span>
                        : <input type='text'
                                 value={text}
                                 onKeyDown={this.handleKeyDown}
                                 autoFocus={true}
                                 onChange={this.handleRewriteTodo}
                                 onBlur={this.handleBlur}
                        />
                    }
                </div>
                <button onClick={this.handleDeleteClick} />
            </section>
        )
    }
}

export default TodoItem
