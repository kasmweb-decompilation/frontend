import { api } from '../utils/axios';

export const getApiConfigs = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_APICONFIG_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_api_configs', data);
    dispatch({
      type: "GET_APICONFIG_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_APICONFIG_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setDeveloperPageInfo({pageSize,pageNo}){
  return {
    type : 'SET_DEVELOPER_PAGEINFO',
    payload : {pageSize,pageNo }
  }
}

export const deleteApiKey = (apiId) => async (dispatch) => {
  
  let data = {api_Id: apiId};
  dispatch({
    type: "DELETE_APICONFIG_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_api_configs', data);
    dispatch({
      type: "DELETE_APICONFIG_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_APICONFIG_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createApiKey = (api_config) => async (dispatch) => {
  
  let data = { api_config }
  dispatch({
    type: "CREATE_APICONFIG_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_api_configs', data);
    dispatch({
      type: "CREATE_APICONFIG_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_APICONFIG_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateApiConfigs = (api_config) => async (dispatch) => {
  
  let data = {};
  data.target_api = api_config;
  dispatch({
    type: "UPDATE_APICONFIG_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_api_configs', data);
    dispatch({
      type: "UPDATE_APICONFIG_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_APICONFIG_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getApiPermissions = (apiId) => async (dispatch) => {
  
  let data = {};
  data.target_api_config = {"api_id": apiId};
  dispatch({
    type: "GET_PERMISSIONS_API_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_permissions_group', data);
    dispatch({
      type: "GET_PERMISSIONS_API_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_PERMISSIONS_API_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const addPermissionsApi = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_api_config = {"api_id": data.apiId};
  postData.target_permissions = data.permissionIds;
  dispatch({
    type: "ADD_PERMISSIONS_API_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_permissions_group', postData);
    dispatch({
      type: "ADD_PERMISSIONS_API_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ADD_PERMISSIONS_API_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const removeApiPermissions = (data) => async (dispatch) => {
  let postData = {};
  postData.group_permission_id = data.apiPermissionId;
  dispatch({
    type: "REMOVE_PERMISSIONS_API_REQUESTED"
  });
  try {
    const response = await api.post('admin/remove_permissions_group', postData);
    dispatch({
      type: "REMOVE_PERMISSIONS_API_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "REMOVE_PERMISSIONS_API_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
