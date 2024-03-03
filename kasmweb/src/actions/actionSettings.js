import { api, hasAuth } from '../utils/axios';

export const getSettings = () => async (dispatch) => {
  
  let data = {};
  if (hasAuth('settings')) {
    dispatch({
      type: "GET_SETTINGS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_settings', data);
      dispatch({
        type: "GET_SETTINGS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_SETTINGS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const updateSettings = (data) => async (dispatch) => {
  

  dispatch({
    type: "UPDATE_SETTINGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_setting', data);
    dispatch({
      type: "UPDATE_SETTINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_SETTINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
