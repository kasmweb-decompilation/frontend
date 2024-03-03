import { api } from '../utils/axios';

export const getStagingConfigs = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_STAGING_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_staging_configs', data);
    dispatch({
      type: "GET_STAGING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_STAGING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setStagingPageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_STAGING_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}


export const deleteStagingConfig = (staging_config_id) => async (dispatch) => {
  
  let data = {};
  data.target_staging_config = { staging_config_id: staging_config_id };

  dispatch({
    type: "DELETE_STAGING_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_staging_config', data);
    dispatch({
      type: "DELETE_STAGING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_STAGING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createStagingConfig = (staging_config) => async (dispatch) => {
  
  let data = {};
  data.target_staging_config = staging_config;

  dispatch({
    type: "CREATE_STAGING_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_staging_config', data);
    dispatch({
      type: "CREATE_STAGING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_STAGING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateStagingConfig = (staging_config) => async (dispatch) => {
  
  let data = {};
  data.target_staging_config = staging_config;

  dispatch({
    type: "UPDATE_STAGING_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_staging_config', data);
    dispatch({
      type: "UPDATE_STAGING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_STAGING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
