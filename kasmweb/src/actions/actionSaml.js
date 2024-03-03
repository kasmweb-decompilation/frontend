import { api } from '../utils/axios';

export const getSignOnURL = (ssoType, id) => async (dispatch) => {
  
  let data = {};
  data.id = id;
  data.sso_type = ssoType;

  dispatch({
    type: "GET_SSO_REQUESTED"
  });
  try {
    const response = await api.post('sso', data);
    dispatch({
      type: "GET_SSO_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SSO_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const set_saml_config = (formData) => async (dispatch) => {
  
  let data = {};
  data.target_saml_config = formData;

  dispatch({
    type: "SET_SAML_REQUESTED"
  });
  try {
    const response = await api.post('admin/set_saml_config', data);
    dispatch({
      type: "SET_SAML_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SET_SAML_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setSamlPageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_SAML_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const update_saml_config = (formData) => async (dispatch) => {
  
  let data = {};
  data.target_saml_config = formData;

  dispatch({
    type: "UPDATE_SAML_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_saml_config', data);
    dispatch({
      type: "UPDATE_SAML_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_SAML_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const deleteSaml = (samlId) => async (dispatch) => {
  
  let data = {};
  data.target_saml_config = { "saml_id": samlId };

  dispatch({
    type: "DELETE_SAML_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_saml_config', data);
    dispatch({
      type: "DELETE_SAML_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_SAML_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const get_saml_config = (id) => async (dispatch) => {
  
  let data = {};
  let target_saml_config = {};
  target_saml_config['saml_id'] = id;
  data.target_saml_config = target_saml_config;

  dispatch({
    type: "GET_SAML_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_saml_config', data);
    dispatch({
      type: "GET_SAML_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SAML_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const get_saml_configs = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_SAML_CONFIGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_saml_configs', data);
    dispatch({
      type: "GET_SAML_CONFIGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SAML_CONFIGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
