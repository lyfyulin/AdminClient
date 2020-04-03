
import { INCREMENT, DECREMENT, INCREMENTIFODD, INCREMENTASYNC } from "./action-types"

export const counter = ( state = 1, action )  => {

    switch ( action.type ) {
        case INCREMENT:
            return  state + action.data
        case DECREMENT:
            return state - action.data
        case INCREMENTIFODD:
            return state + action.data
        case INCREMENTASYNC:
            return state + action.data
        default:    // 产生初始状态值
            return state;
    }
}


export const counter2 = (  ) => {

}