/*
    容器组件： 通过 connect 产生的
*/

import React from 'react'
import { connect } from 'react-redux'
import Counter from '../components/counters'
import {increment, decrement} from '../redux/actions'


/*
方法1
// 将特定 state 数据映射成标签属性传递给 UI 组件(Counter)
// redux 在调用此函数时，传入了 store.getState() 的值。
const mapStateToProps = (state) => ({        // 返回对象的所有属性传给 UI 组件
    count: state
})

// 将包含 dispatch 函数调用语句的函数映射成函数属性
// redux 在调用次函数时, 传入了 store.dispatch 的值
const mapDispatchToProps = ( dispatch ) => ({
    increment: (number) => {dispatch(increment(number))},
    decrement: (number) => {dispatch(decrement(number))},
})

export default connect(
    mapStateToProps,            // 用来指定传递哪些一般属性  (number/array/object/string等)
    mapDispatchToProps,         // 用来指定传递哪些函数属性  (function)
)(Counter)
*/

// 方法2
export default connect (
    state => ({count: state}),
    {increment, decrement}
)(Counter)




