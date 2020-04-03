/*
    容器组件： 通过 connect 产生的
*/

import { connect } from 'react-redux'
import Counter from '../components/counters'
import {increment, decrement, incrementIfOdd, incrementAsync} from '../redux/actions'


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
    incrementAsync: (number) => { dispatch(incrementAsync(number)) },
})

export default connect(
    mapStateToProps,            // 用来指定传递哪些一般属性  (number/array/object/string等)
    mapDispatchToProps,         // 用来指定传递哪些函数属性  (function)
)(Counter)
*/

// 方法2
export default connect (
    state => ({count: state}),
    {increment, decrement, incrementIfOdd, incrementAsync}      // 编码简洁，不好理解
)(Counter)


/**
 *  容器组件：
 *      通过 connect 包装 UI 组件产生的组件
 *      容器组件是 UI 组件的父组件
 *      容器组件负责项 UI 组件传入标签属性
 *              一般属性：由第一个函数参数的返回值对象决定，属性值从 state 取出
 *              函数属性：由第二个参数来决定
 *                  参数是函数：函数返回的对象中的所有方法作为函数属性传递给 UI 组件
 *                  参数是对象：包装对象中的每个方法，将包装后的方法作为函数属性传递给 UI 组件
 *                      传给UI组件的是包装后的函数，形式： function(...args){dispatch(increment(...args))}


    class ContainerComp extends Component{
        render () {
            return <UIComp state={} {...this}></UIComp>
        }
    }

*/



