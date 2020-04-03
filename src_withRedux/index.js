/*
    入口文件
*/
import React from "react"
import ReactDOM from 'react-dom'

import App from './App'
import {counterStore} from './redux'

const render = ()  => {
    ReactDOM.render(
        <App store = {counterStore} />, document.getElementById('root')
    )
}

render()

// 绑定监视 store 内部状态数据改变的监听
counterStore.subscribe(render)

