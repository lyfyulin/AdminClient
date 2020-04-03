/*
    入口文件
*/
import React from "react"
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './containers/App'
import {counterStore} from './redux'

ReactDOM.render(
    (<Provider store = {counterStore}>
        <App/>
    </Provider>)
    , document.getElementById('root')
)
