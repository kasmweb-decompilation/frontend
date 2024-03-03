import { api } from '../utils/axios';

export const getAdminUsers = (options = {}) => async (dispatch) => {
  let data = {};
  data = {
    page: options.page,
    page_size: options.pageSize || 20,
    filters: options.filters,
    sort_by: options.sortBy,
    sort_direction: options.sortDirection,
    anonymous: options.anonymous,
    anonymous_only: options.anonymous_only
  }

  dispatch({
    type: "GET_ADMIN_USERS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_users', data);
    dispatch({
      type: "GET_ADMIN_USERS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_ADMIN_USERS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setPageInfo({pageSize,pageNo}){
  return {
    type : 'SET_ADMIN_USER_PAGEINFO',
    payload : {pageSize,pageNo }
  }
}

export const getUsersId = (userId) => async (dispatch) => {
     
  let data = {};
  data.target_user = {"user_id": userId}; 
  dispatch({
    type: "GET_USER_ID_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_user', data);
    dispatch({
      type: "GET_USER_ID_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USER_ID_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserGroupSettings = (user) => async (dispatch) => {
  let data = {
    target_user: user
  };
  dispatch({
    type: "GET_USER_GROUP_SETTINGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_user_groups_settings', data);
    dispatch({
      type: "GET_USER_GROUP_SETTINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USER_GROUP_SETTINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserPermissions = (user) => async (dispatch) => {
  let data = {
    target_user: user
  };
  dispatch({
    type: "GET_USER_PERMISSIONS_REQUESTED"
  });
  try {
    const response = await api.post('get_user_permissions', data);
    dispatch({
      type: "GET_USER_PERMISSIONS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USER_PERMISSIONS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createUser = (userData) => async (dispatch) => {
  
  let data = {};
  if (userData.realm !== undefined && userData.realm !== 'local') {
    userData.password = self.crypto.randomUUID()
  }
  data.target_user = userData;   
  dispatch({
    type: "CREATE_USER_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_user', data);
    dispatch({
      type: "CREATE_USER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_USER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateUser = (userData) => async (dispatch) => {
    
    let data = {};
    data.target_user = userData;
    data.target_user.force_password_reset = userData.force_password_reset || false;
    dispatch({
      type: "UPDATE_USER_REQUESTED"
    });
    try {
      const response = await api.post('admin/update_user', data);
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "UPDATE_USER_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const resetPasswordFunc = (userData) => async (dispatch) => {
  let data = {};
  data.target_user = userData;
  dispatch({
    type: "RESET_PASSWORD_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_user', data);
    dispatch({
      type: "RESET_PASSWORD_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "RESET_PASSWORD_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const deleteUser = (userId, force) => async (dispatch) => {
  
  let data = {};
  data.target_user = {"user_id": userId};
  data.force = force
  dispatch({
    type: "DELETE_USER_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_user', data);
    dispatch({
      type: "DELETE_USER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_USER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const deleteUserKasm = (kasmId) => async (dispatch) => {
  
  let data = {};
  data.kasm_id = kasmId;
  dispatch({
    type: "DELETE_USER_KASM_REQUESTED"
  });
  try {
    const response = await api.post('destroy_kasm', data);
    dispatch({
      type: "DELETE_USER_KASM_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_USER_KASM_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getAdminUsageDump = (user_id) => async (dispatch) => {
  
  let data = {"user_id": user_id};
  dispatch({
    type: "GET_USAGE_DUMP_ADMIN_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_user_usage_dump', data);
    dispatch({
      type: "GET_USAGE_DUMP_ADMIN_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USAGE_DUMP_ADMIN_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
