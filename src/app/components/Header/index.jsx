import * as React from 'react'
import style from './index.module.scss'

class Header extends React.Component {
    render() {
        return (
            <header className={style.header} >
                <h1 className={style.title} >todos</h1 >
            </header >
        )
    }
}

export default Header
