import { api } from '../utils/axios';
import { USER_ID } from "../constants/Constants";

export const getUser = () => async (dispatch) => {
  
  let data = {};
  data.target_user = { "user_id": USER_ID };

  dispatch({
    type: "GET_USER_REQUESTED"
  });
  try {
    const response = await api.post('get_user', data);
    dispatch({
      type: "GET_USER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserAttributes = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_USER_ATTRIBUTES_REQUESTED"
  });
  try {
    const response = await api.post('get_user_attributes', data);
    dispatch({
      type: "GET_USER_ATTRIBUTES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USER_ATTRIBUTES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateUserAttribute = (target_user_attributes) => async (dispatch) => {
  
  let data = {};
  data.target_user_attributes = target_user_attributes;

  dispatch({
    type: "UPDATE_USER_ATTRIBUTES_REQUESTED"
  });
  try {
    const response = await api.post('update_user_attribute', data);
    dispatch({
      type: "UPDATE_USER_ATTRIBUTES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_USER_ATTRIBUTES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const setUserPassword = (password) => async (dispatch) => {
  
  let data = {};
  data.current_password = password.password,
    data.new_password = password.confirmPassword;
  data.set_two_factor = password.setTwoFactor;

  dispatch({
    type: "SET_USER_PASSWORD_REQUESTED"
  });
  try {
    const response = await api.post('set_password', data);
    dispatch({
      type: "SET_USER_PASSWORD_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SET_USER_PASSWORD_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserUsageDump = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_USAGE_DUMP_REQUESTED"
  });
  try {
    const response = await api.post('get_usage_details', data);
    dispatch({
      type: "GET_USAGE_DUMP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USAGE_DUMP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserUsageSummary = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_USAGE_SUMMARY_REQUESTED"
  });
  try {
    const response = await api.post('get_usage_summary', data);
    dispatch({
      type: "GET_USAGE_SUMMARY_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USAGE_SUMMARY_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getSubscriptionInfo = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_SUBSCRIPTION_INFO_REQUESTED"
  });
  try {
    const response = await api.post('subscription_info', data);
    dispatch({
      type: "GET_SUBSCRIPTION_INFO_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SUBSCRIPTION_INFO_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const cancelSubscription = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "CANCEL_SUBSCRIPTION_REQUESTED"
  });
  try {
    const response = await api.post('cancel_subscription', data);
    dispatch({
      type: "CANCEL_SUBSCRIPTION_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CANCEL_SUBSCRIPTION_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateSubscription = (planData) => async (dispatch) => {
  
  let data = planData;

  dispatch({
    type: "UPDATE_SUBSCRIPTION_REQUESTED"
  });
  try {
    const response = await api.post('update_subscription', data);
    dispatch({
      type: "UPDATE_SUBSCRIPTION_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_SUBSCRIPTION_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updatePayment = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "UPDATE_PAYMENT_REQUESTED"
  });
  try {
    const response = await api.post('update_payment', data);
    dispatch({
      type: "UPDATE_PAYMENT_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_PAYMENT_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const renewSubscription = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "RENEW_SUBSCRIPTION_REQUESTED"
  });
  try {
    const response = await api.post('renew_subscription', data);
    dispatch({
      type: "RENEW_SUBSCRIPTION_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "RENEW_SUBSCRIPTION_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createSubscription = (planData) => async (dispatch) => {
  
  let data = planData;

  dispatch({
    type: "CREATE_SUBSCRIPTION_REQUESTED"
  });
  try {
    const response = await api.post('create_subscription', data);
    dispatch({
      type: "CREATE_SUBSCRIPTION_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_SUBSCRIPTION_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
export function setUsagePageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_USAGE_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}
export function setAdminUsagePageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_ADMIN_USAGE_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}
export function setUserProfilePageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_USER_PROFILE_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const getLanguages = () => async (dispatch) => {

  let data = {};

  dispatch({
    type: "GET_LANGUAGES_REQUESTED"
  });
  try {
    const response = await api.post('get_languages', data);
    dispatch({
      type: "GET_LANGUAGES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_LANGUAGES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getTimezones = () => async (dispatch) => {

  let data = {};

  dispatch({
    type: "GET_TIMEZONES_REQUESTED"
  });
  try {
    const response = await api.post('get_timezones', data);
    dispatch({
      type: "GET_TIMEZONES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_TIMEZONES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserAuthSettings = () => async (dispatch) => {

  let data = {};

  dispatch({
    type: "GET_USERAUTHSETTINGS_REQUESTED"
  });
  try {
    const response = await api.post('get_user_auth_settings', data);
    dispatch({
      type: "GET_USERAUTHSETTINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USERAUTHSETTINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const webauthnGetAuthOptions = () => async (dispatch) => {

  let data = {};

  dispatch({
    type: "WEBAUTHN_GET_AUTH_OPTIONS_REQUESTED"
  });
  try {
    const response = await api.post('webauthn_get_auth_options', data);
    dispatch({
      type: "WEBAUTHN_GET_AUTH_OPTIONS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "WEBAUTHN_GET_AUTH_OPTIONS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const clearUserTwoFactor = (authData) => async (dispatch) => {
  let data = authData;
  dispatch({
    type: "CLEAR_USER_TWO_FACTOR_REQUESTED"
  });
  try {
    const response = await api.post('clear_user_two_factor', data);
    dispatch({
      type: "CLEAR_USER_TWO_FACTOR_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CLEAR_USER_TWO_FACTOR_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const checkPassword = (authData) => async (dispatch) => {
  let data = authData;
  dispatch({
    type: "CHECK_PASSWORD_REQUESTED"
  });
  try {
    const response = await api.post('check_password', data);
    dispatch({
      type: "CHECK_PASSWORD_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CHECK_PASSWORD_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const setSecretAuthenticated = (authData) => async (dispatch) => {
  let data = authData;
  dispatch({
    type: "SET_SECRET_AUTHENTICATED_REQUESTED"
  });
  try {
    const response = await api.post('set_secret_authenticated', data);
    dispatch({
      type: "SET_SECRET_AUTHENTICATED_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SET_SECRET_AUTHENTICATED_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const twoFactorAuthAuthenticated = (authData) => async (dispatch) => {
  let data = authData;
  dispatch({
    type: "TWO_FACTOR_AUTH_AUTHENTICATED_REQUESTED"
  });
  try {
    const response = await api.post('two_factor_auth_authenticated', data);
    dispatch({
      type: "TWO_FACTOR_AUTH_AUTHENTICATED_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "TWO_FACTOR_AUTH_AUTHENTICATED_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const webauthnAuthenticatedRegisterStart = (authData) => async (dispatch) => {
  let data = authData;
  dispatch({
    type: "WEBAUTHN_AUTHENTICATED_REGISTER_START_REQUESTED"
  });
  try {
    const response = await api.post('webauthn_authenticated_register_start', data);
    dispatch({
      type: "WEBAUTHN_AUTHENTICATED_REGISTER_START_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "WEBAUTHN_AUTHENTICATED_REGISTER_START_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const webauthnAuthenticatedRegisterFinish = (authData) => async (dispatch) => {
  let data = authData;
  dispatch({
    type: "WEBAUTHN_AUTHENTICATED_REGISTER_FINISH_REQUESTED"
  });
  try {
    const response = await api.post('webauthn_authenticated_register_finish', data);
    dispatch({
      type: "WEBAUTHN_AUTHENTICATED_REGISTER_FINISH_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "WEBAUTHN_AUTHENTICATED_REGISTER_FINISH_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
