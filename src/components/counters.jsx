/*
    UI组件：负责显示
    没有使用任何 redux 相关语法
*/

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Counter extends Component{

    static propTypes = {
        count: PropTypes.number.isRequired,
        increment: PropTypes.func.isRequired,
        decrement: PropTypes.func.isRequired,
        incrementIfOdd: PropTypes.func.isRequired,
        incrementAsync: PropTypes.func.isRequired,
    }

    increment = () => {
        const number = this.refs.numberSelect.value * 1
        this.props.increment( number )
    }

    decrement = () => {
        const number = this.refs.numberSelect.value * 1
        this.props.decrement( number )
    }
    incrementIfOdd = () => {
        const number = this.refs.numberSelect.value * 1
        const count = this.props.count
        if( count%2 === 1 ){
            this.props.incrementIfOdd(number)
        }
    }
    incrementAsync = () => {
        const number = this.refs.numberSelect.value * 1
        this.props.incrementAsync(number)
    }
    render(){
        
        const counter = this.props.count
        return (
            <div style={{ padding: 30, display:'flex' }}>
                <p>click {counter} times</p>
                <select ref = "numberSelect">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <button onClick = {this.increment}>+</button>
                <button onClick = {this.decrement}>-</button>
                <button onClick = {this.incrementIfOdd}>奇数+1</button>
                <button onClick = {this.incrementAsync}>同步+1</button>
            </div>
        )
    }
}


