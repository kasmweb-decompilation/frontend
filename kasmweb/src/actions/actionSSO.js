import { api } from '../utils/axios';

export const login_saml = (login_data, user_data) => async (dispatch) => {
  var user_info = { "username": login_data.username };
  // setting username for the user that is needed in all apis
  window.localStorage.setItem("user_info", JSON.stringify(user_info));
  let data = user_data;

  dispatch({
    type: "SAML_LOGIN_REQUESTED"
  });
  try {
    const response = await api.post('login_saml', data);
    dispatch({
      type: "SAML_LOGIN_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SAML_LOGIN_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}