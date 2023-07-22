import axios from 'axios'

import {  ALL_PRODUCTS_REQUEST, 
          ALL_PRODUCTS_SUCCESS, 
          ALL_PRODUCTS_FAIL,
          ALL_PRODUCTS_DETAILS_REQUEST,
          ALL_PRODUCTS_DETAILS_SUCCESS,
          ALL_PRODUCTS_DETAILS_FAIL,
          CLEAR_ERRORS} from '../constants/productConstants'

  export const getProducts = (keyword ='',  currentPage = 1, price, category, rating = 0 ) => async (dispatch) => {
        try {

            dispatch({ type: ALL_PRODUCTS_REQUEST })

            let URI = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`

            if(category){
                
                URI = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`

            }

            const { data } = await axios.get(URI)
            dispatch({ type: ALL_PRODUCTS_SUCCESS, payload: data })
            
        } catch (error) {
            
            dispatch({ type: ALL_PRODUCTS_FAIL, payload: error.response.data.message })
        }
     }

     // Clear Errors
export const clearErrors = () => async (dispatch) =>  {
    return {
        type: CLEAR_ERRORS
    }
}

export const getProductsDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: ALL_PRODUCTS_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/v1/product/${id}`)
        
        dispatch({ 
            type: ALL_PRODUCTS_DETAILS_SUCCESS, 
            payload: data.product
         })
        
    } catch (error) {
        dispatch({ type: ALL_PRODUCTS_DETAILS_FAIL, payload: error.response.data.message })
    }
 }

