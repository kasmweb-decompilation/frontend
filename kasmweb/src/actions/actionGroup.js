import { api } from '../utils/axios';

export const getGroups = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_groups', data);
    dispatch({
      type: "GET_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateGroups = (userData) => async (dispatch) => {
  let group_metadata = {}
  if (userData.form_metadata) {
      userData.form_metadata.map((item) => {
          if (item.key == '') return
          group_metadata[item.key] = item.value
      })
  }

  userData.group_metadata = group_metadata
  

  let data = {};
  data.target_group = userData;
  dispatch({
    type: "UPDATE_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_group', data);
    dispatch({
      type: "UPDATE_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setGroupUserPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_GROUP_USER_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export function setGroupSettingPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_GROUP_SETTING_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export function setGroupImagePageInfo({pageSize,pageNo}){
    return {
        type : 'SET_GROUP_IMAGE_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}


export const getUsersGroup = (groupId, page, pageSize, filters) => async (dispatch) => {
  
  let data = {};
  data.target_group = {"group_id": groupId };
  data.page = page;
  data.page_size = pageSize;
  data.filters = filters;
  dispatch({
    type: "GET_USERSIN_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_users_group', data);
    dispatch({
      type: "GET_USERSIN_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_USERSIN_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createGroup = (userData) => async (dispatch) => {
  
  let data = {};
  data.target_group = userData;
  dispatch({
    type: "CREATE_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_group', data);
    dispatch({
      type: "CREATE_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const addUserToGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_group = {"group_id": data.groupId};   
  postData.target_user = {"user_id": data.userId};   
  dispatch({
    type: "ADD_USER_TO_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_user_group', postData);
    dispatch({
      type: "ADD_USER_TO_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ADD_USER_TO_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setGroupPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_GROUP_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const deleteUserFromGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_group = {"group_id": data.groupId};   
  postData.target_user = {"user_id": data.userId};   
  dispatch({
    type: "DELETE_USER_FROM_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/remove_user_group', postData);
    dispatch({
      type: "DELETE_USER_FROM_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_USER_FROM_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const deleteGroup = (groupId, force) => async (dispatch) => {
  
  let data = {};
  data.target_group = {"group_id": groupId};
  data.force = force;
  dispatch({
    type: "DELETE_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_group', data);
    dispatch({
      type: "DELETE_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getSettingsGroup = (groupId) => async (dispatch) => {
  
  let data = {};
  data.target_group = {"group_id": groupId};
  dispatch({
    type: "GET_SETTINGS_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_settings_group', data);
    dispatch({
      type: "GET_SETTINGS_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SETTINGS_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getGroupPermissions = (groupId) => async (dispatch) => {
  
  let data = {};
  data.target_group = {"group_id": groupId};
  dispatch({
    type: "GET_PERMISSIONS_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_permissions_group', data);
    dispatch({
      type: "GET_PERMISSIONS_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_PERMISSIONS_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getAllPermissions = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_PERMISSIONS_ALL_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_permissions', data);
    dispatch({
      type: "GET_PERMISSIONS_ALL_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_PERMISSIONS_ALL_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const addPermissionsGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_group = {"group_id": data.groupId};
  postData.target_permissions = data.permissionIds;
  dispatch({
    type: "ADD_PERMISSIONS_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_permissions_group', postData);
    dispatch({
      type: "ADD_PERMISSIONS_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ADD_PERMISSIONS_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const removeGroupPermissions = (data) => async (dispatch) => {
  
  let postData = {};
  postData.group_permission_id = data.groupPermissionId;
  dispatch({
    type: "REMOVE_PERMISSIONS_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/remove_permissions_group', postData);
    dispatch({
      type: "REMOVE_PERMISSIONS_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "REMOVE_PERMISSIONS_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getSettingsId = (groupId) => async (dispatch) => { 
  
  let data = {};
  data.target_group = {"group_id": groupId};
  dispatch({
    type: "GET_SETTINGS_ID_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_settings_group', data);
    dispatch({
      type: "GET_SETTINGS_ID_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SETTINGS_ID_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const addSettingsGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_group = {"group_id": data.groupId};
  postData.target_setting = {"group_setting_id": data.groupSettingId, "value" : data.value};
  dispatch({
    type: "ADD_SETTINGS_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_settings_group', postData);
    dispatch({
      type: "ADD_SETTINGS_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ADD_SETTINGS_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateSettingsGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_group = {"group_id": data.groupId};
  postData.target_setting = {"group_setting_id": data.groupSettingId, "value" : data.value};
  dispatch({
    type: "UPDATE_SETTINGS_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_settings_group', postData);
    dispatch({
      type: "UPDATE_SETTINGS_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_SETTINGS_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const removeSettingsGroup = (groupSettingId) => async (dispatch) => {
  
  let data = {};
  data.group_setting_id = groupSettingId;
  dispatch({
    type: "REMOVE_SETTINGS_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/remove_settings_group', data);
    dispatch({
      type: "REMOVE_SETTINGS_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "REMOVE_SETTINGS_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getImagesGroup = (groupId) => async (dispatch) => {
  
  let data = {};
  data.target_group = {"group_id": groupId};
  dispatch({
    type: "GET_IMAGES_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_images_group', data);
    dispatch({
      type: "GET_IMAGES_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_IMAGES_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const addImagesGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_group = {"group_id": data.groupId};
  postData.target_image = {"image_id": data.imageId};
  dispatch({
    type: "ADD_IMAGES_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_images_group', postData);
    dispatch({
      type: "ADD_IMAGES_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ADD_IMAGES_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const removeImagesGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_group = {"group_id": data.groupId};
  postData.target_image = {"image_id": data.imageId};
  dispatch({
    type: "Remove_IMAGES_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/remove_images_group', postData);
    dispatch({
      type: "REMOVE_IMAGES_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "REMOVE_IMAGES_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getAllSSOs = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "SSO_CONFIGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_all_ssos', data);
    dispatch({
      type: "SSO_CONFIGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SSO_CONFIGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const addSsoMappingGroup = (data) => async (dispatch) => {
  
  let postData = {};
  postData.target_sso_mapping = {"group_id": data.groupId,
                                  "sso_id": data.sso_id,
                                  "sso_group_attributes": data.sso_group_attributes,
                                  "apply_to_all_users": data.apply_to_all_users};
  dispatch({
    type: "ADD_SSO_MAPPING_GROUPS_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_sso_mapping_group', postData);
    dispatch({
      type: "ADD_SSO_MAPPING_GROUPS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ADD_SSO_MAPPING_GROUPS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getSsoMappingsGroup = (group_id) => async (dispatch) => {
  
  let postData = {"group_id": group_id};
  dispatch({
    type: "GET_SSO_MAPPINGS_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_sso_mappings_group', postData);
    dispatch({
      type: "GET_SSO_MAPPINGS_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SSO_MAPPINGS_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const deleteSsoMappingGroup = (sso_group_id) => async (dispatch) => {
  
  let postData = {"sso_group_id": sso_group_id};
  dispatch({
    type: "DELETE_SSO_MAPPING_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_sso_mapping_group', postData);
    dispatch({
      type: "DELETE_SSO_MAPPING_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_SSO_MAPPING_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateSsoMappingGroup = (data) => async (dispatch) => {
  
  let postData = {}
  postData.target_sso_mapping = {"sso_group_id": data.sso_group_id,
                                  "sso_id": data.sso_id,
                                  "sso_type": data.sso_type,
                                  "sso_group_attributes": data.sso_group_attributes,
                                  "apply_to_all_users": data.apply_to_all_users};
  dispatch({
    type: "UPDATE_SSO_MAPPING_GROUP_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_sso_mapping_group', postData);
    dispatch({
      type: "UPDATE_SSO_MAPPING_GROUP_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_SSO_MAPPING_GROUP_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}