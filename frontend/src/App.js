import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import productDetails from './components/product/productDetails'

import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'

import UpdatePassword from './components/user/UpdatePassword'

import ProtectedRoute from './components/Route/ProtectedRoute'
import { loadUser } from './actions/userActions'
import store from './store'
import ForgotPassword from './components/user/ForgotPassword'
import { NewPassword } from './components/user/NewPassword'
import CartItem from './components/cart/CartItem'
import Shipping from './components/cart/Shipping'

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className='App'>
        <Header />
        <div className='container container-fluid'>
          <Route path='/' component={Home} exact />
          <Route path='/search/:keyword' component={Home} />
          <Route path='/product/:id' component={productDetails} exact />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/cart' component={CartItem} />
          <Route path='/password/forgot' component={ForgotPassword} />
          <Route path='/password/reset/:token' component={NewPassword} />
          <ProtectedRoute path='/shipping' component={Shipping} exact />
          <ProtectedRoute path='/me' component={Profile} exact />
          <ProtectedRoute path='/me/update' component={UpdateProfile} exact />
          <ProtectedRoute path='/password/update' component={UpdatePassword} exact />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
