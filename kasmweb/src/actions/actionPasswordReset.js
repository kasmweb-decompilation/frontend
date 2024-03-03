import { api } from '../utils/axios';

export const resetEmail = (accountData) => async (dispatch) => {
  dispatch({
    type: "RESET_EMAIL_REQUESTED"
  });
  try {
    const response = await api.post('subscriptions/requestResetEmail', accountData);
    dispatch({
      type: "RESET_EMAIL_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "RESET_EMAIL_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
export const passwordReset = (accountData) => async (dispatch) => {
  dispatch({
    type: "PASSWORD_RESET_REQUESTED"
  });
  try {
    const response = await api.post('subscriptions/passwordReset', accountData);
    dispatch({
      type: "PASSWORD_RESET_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "PASSWORD_RESET_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
