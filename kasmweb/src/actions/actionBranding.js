import { api } from '../utils/axios';

export function setBrandingPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_BRANDING_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const getBrandingConfigs = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_BRANDING_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_branding_configs', data);
    dispatch({
      type: "GET_BRANDING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_BRANDING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const deleteBrandingConfig = (branding_config_id) => async (dispatch) => {
  
  let data = {branding_config_id: branding_config_id};
  dispatch({
    type: "DELETE_BRANDING_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_branding_config', data);
    dispatch({
      type: "DELETE_BRANDING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_BRANDING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createBrandingConfig = (branding_config) => async (dispatch) => {
  
  let data = {};
  data.target_branding_config = branding_config;
  dispatch({
    type: "CREATE_BRANDING_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_branding_config', data);
    dispatch({
      type: "CREATE_BRANDING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_BRANDING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateBrandingConfig = (branding_config) => async (dispatch) => {
  
  let data = {};
  data.target_branding_config = branding_config;
  dispatch({
    type: "UPDATE_BRANDING_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_branding_config', data);
    dispatch({
      type: "UPDATE_BRANDING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_BRANDING_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
