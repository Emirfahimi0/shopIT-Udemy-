import React, { Fragment,  } from 'react'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
import MetaData from '../layout/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart,removeItemFromCart } from '../../actions'
import { formatAmount,formatCurrency } from '../../utils'


const CartItem = () => {

  const alert = useAlert()
  const dispatch = useDispatch()
  const { cartItems } = useSelector((state) => state.cart)

  const totalUnits = cartItems.reduce((acc, item) =>(acc + formatAmount(item.quantity)),0)
  const totalPrice = cartItems.reduce((acc, item) =>(acc + formatAmount(item.quantity* item.price)),0)
  console.log(typeof totalPrice)


  const handleIncrementQuantityItem = (id, quantity, stock) => {

    const qty = quantity + 1
    if(qty >= stock) return 
    
    dispatch(addItemToCart(id,qty)) 

  }
  
  const handleDecrementQuantityItem = (id, quantity) => {

    const qty = quantity - 1
    if(qty <=1) return 
    
    dispatch(addItemToCart(id,qty)) 
  }
  
  const handleRemoveItem = (id) => {

    dispatch(removeItemFromCart(id)) 

  }


  return (
    <Fragment>
      <MetaData title={'Your cart'} />
      {cartItems.length === 0 ? (
   
        <h2 className='mt-5'>No Items in the cart</h2>
      ) : (
        <Fragment>
          <h2 className='mt-5'>
            Your Cart: <b> My Cart: {cartItems.length} items</b>
          </h2>

          <div className='row d-flex justify-content-between'>
            <div className='col-12 col-lg-8'>
              {cartItems.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <hr />
                    <div className='cart-item' key={item.product}>
                      <div className='row'>
                        <div className='col-4 col-lg-3'>
                          <img src={item.image} alt='Laptop' height='90' width='115' />
                        </div>

                        <div className='col-5 col-lg-3'>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>

                        <div className='col-4 col-lg-2 mt-4 mt-lg-0'>
                          <p id='card_item_price'>{item.price}</p>
                        </div>

                        <div className='col-4 col-lg-3 mt-4 mt-lg-0'>
                          <div className='stockCounter d-inline'>
                            <span className='btn btn-danger minus' onClick={()=> handleDecrementQuantityItem(item.product,item.quantity)}>-</span>

                            <input type='number' className='form-control count d-inline' value={item.quantity} readOnly />

                            <span className='btn btn-primary plus' onClick={()=> handleIncrementQuantityItem(item.product,item.quantity,item.stock)}>+</span>
                          </div>
                        </div>

                        <div className='col-4 col-lg-1 mt-4 mt-lg-0'>
                          <i id='delete_cart_item' className='fa fa-trash btn btn-danger' onClick={()=> handleRemoveItem(item.product)}></i>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </Fragment>
                )
              })}
            </div>

            <div className='col-12 col-lg-3 my-4'>
              <div id='order_summary'>
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal: <span className='order-summary-values'>{totalUnits} (Units)</span>
                </p>
                <p>
                  Est. total: <span className='order-summary-values'>{formatCurrency(totalPrice)}</span>
                </p>

                <hr />
                <button id='checkout_btn' className='btn btn-primary btn-block'>
                  Check out
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default CartItem
