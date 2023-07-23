import { ADD_TO_CART } from '../constants'

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {

    case ADD_TO_CART: 

    const item = action.payload
    const isItem = state.cartItems.find(c => c.product === item.product)

    if(isItem){
        return {
            ...state,
            cartItems: state.cartItems.map(c => c.product===isItem.product ? item : c)
        }
    }
    else 
    return {
        ...state,
        cartItems:[...state.cartItems, item]
    }

    default:
      return state
  }
}
