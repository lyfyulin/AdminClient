/*
应用根组件
*/

import React, {Component} from 'react'
export default class App extends Component{

    state = {
        count: 0,
    }

    increment = () => {
        const number = this.refs.numberSelect.value * 1
        this.setState({
            count: this.state.count + number
        })
    }
    decrement = () => {
        const number = this.refs.numberSelect.value * 1
        this.setState({
            count: this.state.count - number
        })
    }
    incrementIfOdd = () => {
        const number = this.refs.numberSelect.value * 1
        const {count} = this.state
        if( count%2 === 1 ){
            this.setState({
                count: count + number
            })
        }
    }
    incrementAsync = () => {
        const number = this.refs.numberSelect.value * 1
        const {count} = this.state
        setTimeout( () => {
            this.setState({
                count: count + number
            })
        }, 1000 )
    }
    render(){
        const {count} = this.state
        return (
            <div style={{ padding: 30, display:'flex' }}>
                <p>click {count} times</p>
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


