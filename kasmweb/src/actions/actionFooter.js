import { api } from '../utils/axios';

export const getLicenseStatus = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_LICENSESTATUS_REQUESTED"
  });
  try {
    const response = await api.post('license_status', data);
    dispatch({
      type: "GET_LICENSESTATUS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_LICENSESTATUS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}