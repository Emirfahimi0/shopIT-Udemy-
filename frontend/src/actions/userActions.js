import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_FAIL,
  LOAD_USER_SUCCESS,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_RESET,
  FORGOT_PASSWORD_SUCCESS,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  CLEAR_ERRORS
} from '../constants'

import axios from 'axios'

// Login action handlers
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let URI = '/api/v1/login'
    const { data } = await axios.post(URI, { email, password }, config)

    dispatch({ type: LOGIN_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message })
  }
}

// Register action handlers
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    let URI = '/api/v1/register'
    const { data } = await axios.post(URI, userData, config)

    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({ type: REGISTER_USER_FAIL, payload: error.response.data.message })
  }
}

// Load User action handlers
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST })

    let URI = '/api/v1/me'
    const { data } = await axios.get(URI)

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user
    })
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.message
    })
  }
}

// Update profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const { data } = await axios.put('/api/v1/me/update', userData, config)

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success
    })
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message
    })
  }
}

// Update password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.put('/api/v1/password/update', passwords, config)

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.success
    })
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message
    })
  }
}

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.post('/api/v1/password/forgot', email, config)

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message
    })
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message
    })
  }
}

// reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PASSWORD_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config)

    dispatch({
      type: NEW_PASSWORD_SUCCESS,
      payload: data.success
    })
  } catch (error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: error.response.data.message
    })
  }
}

// Logout user
export const logout = () => async (dispatch) => {
  try {
    let URI = '/api/v1/logout'
    await axios.get(URI)

    dispatch({ type: LOGOUT_SUCCESS })
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message })
  }
}

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  return {
    type: CLEAR_ERRORS
  }
}
