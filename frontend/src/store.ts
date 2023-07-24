import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productsReducer, productDetailsReducer } from './reducers/productReducers'
import { cartReducer,authReducer, userReducer, forgotPasswordReducer  } from './reducers'

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  auth: authReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
})

interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}




let initialState:any = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems')!) as CartItem[]
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo')!) as IShippingInfo
      : {} as IShippingInfo,
  },

};


const middlware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
