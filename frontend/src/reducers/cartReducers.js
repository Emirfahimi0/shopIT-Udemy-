import { ADD_TO_CART } from '../constants'

export const cartReducer = (state = { cartItem: [] }, action) => {
  switch (action.type) {

    case ADD_TO_CART: 

    const item = action.payload
    const isItem = state.cartItem.find(c => c.product === item.product)

    if(isItem){
        return {
            ...state,
            cartItem: state.cartItem.map(c => c.product===isItem.product ?item : i)
        }
    }
    else 
    return {
        ...state,
        cartItem:[...state.cartItem, item]
    }
  }
}
