import { INCREMENT, DECREMENT, INCREMENTIFODD, INCREMENTASYNC } from "./action-types"

export const increment = ( data ) => ({ type: INCREMENT, data })
export const decrement = ( data ) => ({ type: DECREMENT, data })
export const incrementIfOdd = ( data ) => ({ type: INCREMENTIFODD, data })
export const incrementAsync = ( data ) => ({ type: INCREMENTASYNC, data })

