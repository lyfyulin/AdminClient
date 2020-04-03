import { createStore, applyMiddleware } from 'redux' 
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { counter } from './reducers'



// reducer 是用来管理数据的回调函数， reducer 函数的参数： 参数1：需要管理的变量（给一个默认值，也就是初始状态值）；参数2：和操作操作变量（ action以及data ）
// reducer(oldState, { type, data })

// store 维护 state (object) 和 reducer (function)
// store 的操作：1.获取状态：getState();  2.分发action操作状态值，交给 reducers 操作：dispatch();  3.绑定状态值改变的监听：subscribe();
// store第一次调用 reducer 是在 store 创建时候，为了返回初始状态值。后面其他时候都是用 dispatch 时候调用 reducers , dispatch 中的参数都是 action
// store.dispatch( { type, data } )

// createStore 必须传入一个 reducer 
export const counterStore = createStore( counter, composeWithDevTools(applyMiddleware(thunk)) )


