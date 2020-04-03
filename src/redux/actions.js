import { INCREMENT, DECREMENT, INCREMENTIFODD } from "./action-types"

export const increment = ( data ) => ({ type: INCREMENT, data })
export const decrement = ( data ) => ({ type: DECREMENT, data })
export const incrementIfOdd = ( data ) => ({ type: INCREMENTIFODD, data })

// 创建异步增加的 action
// 异步 action 是一个函数，参数是 dispatch 函数
// 1.执行异步代码；2.完成后，分发一个同步action
export function incrementAsync ( data ){
    return dispatch => {
        // 1.执行异步代码
        setTimeout(() => {
            // 2.完成后，分发一个同步的 action
            dispatch( increment(data) )
        }, 1000)
    }
}

