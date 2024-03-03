import { api } from '../utils/axios';

export const logout = (logout_data) => async (dispatch) => {
  let data = {};
  data.saml_id = window.localStorage.getItem("saml_id");
  data.logout_all = logout_data && logout_data.logout_all ? logout_data.logout_all : false;

  dispatch({
    type: "LOGOUT_REQUESTED"
  });
  try {
    const response = await api.post('logout', data);
    dispatch({
      type: "LOGOUT_SUCCESS",
      response: response,
      logout_all: data.logout_all
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "LOGOUT_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const logoutControlled = (logout_data) => async (dispatch) => {
  let data = {};
  data.saml_id = window.localStorage.getItem("saml_id");
  data.logout_all = logout_data && logout_data.logout_all ? logout_data.logout_all : false;

  dispatch({
    type: "LOGOUT_REQUESTED"
  });
  try {
    const response = await api.post('logout', data);
    dispatch({
      type: "LOGOUT_SUCCESS_CONTROLLED",
      response: response,
      logout_all: data.logout_all
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "LOGOUT_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const loginResetPassword = (login_data) => async (dispatch) => {
  var user_info = {"username": login_data.username};
  // setting username for the user that is needed in all apis
  window.localStorage.setItem("user_info", JSON.stringify(user_info));

  dispatch({
    type: "RESET_PW_REQUESTED"
  });
  try {
    const response = await api.post('reset_password', login_data);
    dispatch({
      type: "RESET_PW_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "RESET_PW_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const loginFunction = (login_data) => async (dispatch) => {
  var user_info = {"username": login_data.username};
  // setting username for the user that is needed in all apis
  window.localStorage.setItem("user_info", JSON.stringify(user_info));

  dispatch({
    type: "LOGIN_REQUESTED"
  });
  try {
    const response = await api.post('authenticate', login_data);
    dispatch({
      type: "LOGIN_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "LOGIN__FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const get_two_factor = (login_data) => async (dispatch) => {
  dispatch({
    type: "AUTH_REQUESTED"
  });
  try {
    const response = await api.post('two_factor_auth', login_data);
    dispatch({
      type: "AUTH_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "AUTH_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getNewToken = (payload_data) => async (dispatch) => {
  dispatch({
    type: "GETNEWTOKEN_REQUESTED"
  });
  try {
    const response = await api.post('new_session_token', payload_data);
    dispatch({
      type: "GETNEWTOKEN_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GETNEWTOKEN_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getLoginSettings = () => async (dispatch) => {
  let data = {};

  dispatch({
    type: "GET_SSO_STATUS_REQUESTED"
  });
  try {
    const response = await api.post('login_settings', data);
    dispatch({
      type: "GET_SSO_STATUS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SSO_STATUS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const sloFunction = () => async (dispatch) => {
  let data = {};

  data.saml_id = window.localStorage.getItem("saml_id");
  dispatch({
    type: "SLO_STATUS_REQUESTED"
  });
  try {
    const response = await api.post('saml_logout', data);
    dispatch({
      type: "SLO_STATUS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SLO_STATUS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const setSecret = (login_data) => async (dispatch) => {
  
  dispatch({
    type: "SET_SECRET_REQUESTED"
  });
  try {
    const response = await api.post('set_secret', login_data);
    dispatch({
      type: "SET_SECRET_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SET_SECRET_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
