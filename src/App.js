/*
应用根组件
*/

import React, {Component} from 'react'
import {Button, message} from 'antd'

export default class App extends Component{

    handleClick = () => {
        message.success("成功点击按钮！")
    }

    render(){
        return (
            <div>
            <h1>good job</h1>
            <Button type="primary" onClick={this.handleClick}>确定</Button>
            </div>
        )
    }
}


