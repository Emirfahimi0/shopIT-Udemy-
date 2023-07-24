import { ADD_TO_CART, REMOVE_ITEM_FROM_CART, SAVE_SHIPPING_INFO } from '../constants'

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
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

    case REMOVE_ITEM_FROM_CART:

      return {
        ...state,
        cartItems: state.cartItems.filter(c => c.product !== action.payload)
      }

    case SAVE_SHIPPING_INFO : 
         
        return {
          ...state,
          shippingInfo: action.payload
        }

    default:
      return state
  }
}
