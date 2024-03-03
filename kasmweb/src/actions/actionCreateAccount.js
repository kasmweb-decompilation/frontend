import { api } from '../utils/axios';

export const createAccount = (accountData) => async (dispatch) => {
  dispatch({
    type: "CREATE_ACCOUNT_REQUESTED"
  });
  try {
    const response = await api.post('subscriptions/createAccount', accountData);
    dispatch({
      type: "CREATE_ACCOUNT_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_ACCOUNT_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
