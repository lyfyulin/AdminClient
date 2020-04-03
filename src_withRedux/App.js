/*
应用根组件
*/

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { increment, decrement, incrementIfOdd, incrementAsync } from './redux/actions'


export default class App extends Component{

    static propTypes = {
        store: PropTypes.object.isRequired
    }

    increment = () => {
        const number = this.refs.numberSelect.value * 1
        this.props.store.dispatch( increment( number ) )
    }

    decrement = () => {
        const number = this.refs.numberSelect.value * 1
        this.props.store.dispatch( decrement( number ) )
    }
    incrementIfOdd = () => {
        const number = this.refs.numberSelect.value * 1
        const count = this.props.store.getState()
        if( count%2 === 1 ){
            this.props.store.dispatch( incrementIfOdd(number) )
        }
    }
    incrementAsync = () => {
        const number = this.refs.numberSelect.value * 1
        setTimeout( () => {
            this.props.store.dispatch( incrementAsync(number) )
        }, 1000 )
    }
    render(){
        
        const counter = this.props.store.getState()
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


