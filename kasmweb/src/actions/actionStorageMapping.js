import { api } from '../utils/axios';


export const getStorageMappings = (data) => async (dispatch) => {
  dispatch({
    type: "GET_STORAGE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('/get_storage_mappings', data);
    dispatch({
      type: "GET_STORAGE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_STORAGE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getAvailableStorageProviders = () => async (dispatch) => {
  let data = {}
  dispatch({
    type: "GET_AVAILABLE_STORAGE_PROVIDERS_REQUESTED"
  });
  try {
    const response = await api.post('/get_available_storage_providers', data);
    dispatch({
      type: "GET_AVAILABLE_STORAGE_PROVIDERS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_AVAILABLE_STORAGE_PROVIDERS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}



export const deleteStorageMapping = (data) => async (dispatch) => {

  dispatch({
    type: "DELETE_STORAGE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('/delete_storage_mapping', data);
    dispatch({
      type: "DELETE_STORAGE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_STORAGE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const createStorageMapping = (data) => async (dispatch) => {

  dispatch({
    type: "CREATE_STORAGE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('/create_storage_mapping', data);
    dispatch({
      type: "CREATE_STORAGE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_STORAGE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const updateStorageMapping = (data) => async (dispatch) => {

  dispatch({
    type: "UPDATE_STORAGE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('/update_storage_mapping', data);
    dispatch({
      type: "UPDATE_STORAGE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_STORAGE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

