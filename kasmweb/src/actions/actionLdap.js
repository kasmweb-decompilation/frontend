import { api } from '../utils/axios';

export const createLdap = (userData) => async (dispatch) => {
  
  let data = {};
  data.target_ldap_config = userData;

  dispatch({
    type: "CREATE_LDAP_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_ldap_config', data);
    dispatch({
      type: "CREATE_LDAP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_LDAP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getLdapId = (ldapId) => async (dispatch) => {
  
  let data = {};
  data.target_ldap_config = {"ldap_id": ldapId};

  dispatch({
    type: "GET_LDAP_ID_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_ldap_config', data);
    dispatch({
      type: "GET_LDAP_ID_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_LDAP_ID_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const getLdap = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_LDAP_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_ldap_configs', data);
    dispatch({
      type: "GET_LDAP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_LDAP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateLdap = (userData) => async (dispatch) => {
  
  let data = {};
  data.target_ldap_config = userData;

  dispatch({
    type: "UPDATE_LDAP_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_ldap_config', data);
    dispatch({
      type: "UPDATE_LDAP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_LDAP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setLdapPageInfo({pageSize,pageNo}){
  return {
    type : 'SET_LDAP_PAGEINFO',
    payload : {pageSize,pageNo }
  }
}

export const deleteLdap = (ldapId) => async (dispatch) => {
  
  let data = {};
  data.target_ldap_config = {"ldap_id": ldapId};

  dispatch({
    type: "DELETE_LDAP_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_ldap_config', data);
    dispatch({
      type: "DELETE_LDAP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_LDAP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const testLdapConfig = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_ldap_config = {"ldap_id": data.ldapId};
  postData.target_user = {"username": data.username, "password" : data.password};

  dispatch({
    type: "TEST_LDAP_CONFIG_REQUESTED"
  });
  try {
    const response = await api.post('admin/test_ldap_config', postData);
    dispatch({
      type: "TEST_LDAP_CONFIG_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "TEST_LDAP_CONFIG_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
