import { api } from '../utils/axios';

export const requestCastUrl = (cast_key, kasm_url, docker_network, all_query_args, recaptcha_value, referrer, launch_selections={}) => async (dispatch) => {
  let data = {'cast_key': cast_key, 'recaptcha_value': recaptcha_value, 'referrer': referrer, 'kasm_url': kasm_url, 'docker_network' : docker_network, 'all_query_args': all_query_args, 'x_res': window.innerWidth, 'y_res': window.innerHeigh, 'launch_selections': launch_selections};
  // I think doing this here saves code duplication if we call requestCastUrl in multiple locations.
  data.client_timezone = window.localStorage.getItem('timezone');
  let client_language = window.localStorage.getItem('i18nextLng');
  if (client_language.indexOf('.') > 0) {
    // Remove any encoding already present
    client_language = client_language.split('.')[0]
  }
  // Swap dash for underscore to match Linux format
  client_language = client_language.replace('-', '_')
  // Add the encoding we have out our Linux containers
  client_language = client_language + '.UTF-8';
  data.client_language = client_language;

  dispatch({
    type: "REQUEST_CAST_REQUESTED"
  });
  try {
    const response = await api.post('request_cast', data);
    dispatch({
      type: "REQUEST_CAST_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "REQUEST_CAST_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getCastConfigs = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_CAST_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_cast_configs', data);
    dispatch({
      type: "GET_CAST_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_CAST_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setCastPageInfo({pageSize,pageNo}){
  return {
    type : 'SET_CAST_PAGEINFO',
    payload : {pageSize,pageNo }
  }
}

export const deleteCastConfig = (cast_config_id) => async (dispatch) => {
  
  let data = {cast_config_id: cast_config_id};
  dispatch({
    type: "DELETE_CAST_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_cast_config', data);
    dispatch({
      type: "DELETE_CAST_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_CAST_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createCastConfig = (cast_config) => async (dispatch) => {
  
  let data = {};
  data.target_cast_config = cast_config;
  dispatch({
    type: "CREATE_CAST_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_cast_config', data);
    dispatch({
      type: "CREATE_CAST_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_CAST_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateCastConfig = (cast_config) => async (dispatch) => {
  
  let data = {};
  data.target_cast_config = cast_config;
  dispatch({
    type: "UPDATE_CAST_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_cast_config', data);
    dispatch({
      type: "UPDATE_CAST_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_CAST_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
