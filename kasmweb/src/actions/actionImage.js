import { api } from '../utils/axios';

export const createImage = (userData) => async (dispatch) => {
  
  let data = {};
  delete userData['selected-app']
  data.target_image = userData;

  dispatch({
    type: "CREATE_IMAGES_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_image', data);
    dispatch({
      type: "CREATE_IMAGES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_IMAGES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getImages = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_IMAGES_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_images', data);
    dispatch({
      type: "GET_IMAGES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_IMAGES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateImages = (userData) => async (dispatch) => {
  
  let data = {};
  delete userData['selected-app']
  data.target_image = userData;
  dispatch({
    type: "UPDATE_IMAGES_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_image', data);
    dispatch({
      type: "UPDATE_IMAGES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_IMAGES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setImagesPageInfo({pageSize,pageNo}){
  return {
    type : 'SET_IMAGES_PAGEINFO',
    payload : {pageSize,pageNo }
  }
}

export const editWorkspace = (workspace) => async (dispatch) => {
  dispatch({
    type: "EDIT_WORKSPACE",
    response: workspace
  });
}

export const deleteImages = (imageId) => async (dispatch) => {
  
  let data = {};
  data.target_image = {"image_id": imageId};

  dispatch({
    type: "DELETE_IMAGES_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_image', data);
    dispatch({
      type: "DELETE_IMAGES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_IMAGES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getServerCustomNetworkNames = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_SERVER_CUSTOM_NETWORK_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_server_custom_network_names', data);
    dispatch({
      type: "GET_SERVER_CUSTOM_NETWORK_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SERVER_CUSTOM_NETWORK_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getRegistries = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_REGISTRIES_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_registries', data);
    dispatch({
      type: "GET_REGISTRIES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_REGISTRIES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createRegistry = (registry) => async (dispatch) => {
  
  let data = {};
  data.registry = registry
  dispatch({
    type: "CREATE_REGISTRY_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_registry', data);
    dispatch({
      type: "CREATE_REGISTRY_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_REGISTRY_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateRegistry = (registryId) => async (dispatch) => {
  
  let data = {};
  data.registry_id = registryId
  dispatch({
    type: "UPDATE_REGISTRY_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_registry', data);
    dispatch({
      type: "UPDATE_REGISTRY_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_REGISTRY_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const registryAutoUpdate = ({registryId, auto_updates}) => async (dispatch) => {
  
  let data = {};
  data.registry_id = registryId
  data.auto_updates = auto_updates
  dispatch({
    type: "UPDATE_REGISTRY_REQUESTED"
  });
  try {
    const response = await api.post('admin/registry_auto_updates', data);
    dispatch({
      type: "UPDATE_REGISTRY_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_REGISTRY_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}



export const deleteRegistry = (registryId) => async (dispatch) => {
  
  let data = {};
  data.registry_id = registryId;
  dispatch({
    type: "DELETE_REGISTRY_REQUESTED"
  });

  try {
    const response = await api.post('admin/delete_registry', data);
    dispatch({
      type: "DELETE_REGISTRY_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_REGISTRY_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
