import { api } from '../utils/axios';

export const getOidcConfigs = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_OIDC_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_oidc_configs', data);
    dispatch({
      type: "GET_OIDC_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_OIDC_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setOidcPageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_OIDC_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const deleteOidcConfig = (oidc_config_id) => async (dispatch) => {
  
  let data = { oidc_config_id: oidc_config_id };
  dispatch({
    type: "DELETE_OIDC_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_oidc_config', data);
    dispatch({
      type: "DELETE_OIDC_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_OIDC_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createOidcConfig = (oidc_config) => async (dispatch) => {
  
  let data = {};
  data.target_oidc_config = oidc_config;
  dispatch({
    type: "CREATE_OIDC_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_oidc_config', data);
    dispatch({
      type: "CREATE_OIDC_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_OIDC_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateOidcConfig = (oidc_config) => async (dispatch) => {
  
  let data = {};
  data.target_oidc_config = oidc_config;
  dispatch({
    type: "UPDATE_OIDC_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_oidc_config', data);
    dispatch({
      type: "UPDATE_OIDC_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_OIDC_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
