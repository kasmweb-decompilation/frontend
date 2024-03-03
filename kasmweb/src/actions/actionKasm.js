import { api } from '../utils/axios';

export const getKasm = () => async (dispatch) => {
  
  let data = {}; 

  dispatch({
    type: "GET_KASM_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_kasms', data);
    dispatch({
      type: "GET_KASM_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_KASM_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getKasmId = (kasm_id) => async (dispatch) => {
  
  let data = {};
  data.target_kasm = {"kasm_id": kasm_id};   

  dispatch({
    type: "GET_KASM_ID_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_kasm', data);
    dispatch({
      type: "GET_KASM_ID_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_KASM_ID_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createImageFromSession = (data) => async (dispatch) => {


  dispatch({
    type: "CREATE_IMAGE_FROM_SESSION_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_image_from_session', data);
    dispatch({
      type: "CREATE_IMAGE_FROM_SESSION_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_IMAGE_FROM_SESSION_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getSessionHistory = (options) => async (dispatch) => {
  let data = {};
  data = {
    page: options.page,
    page_size: options.pageSize || 20,
    filters: options.filters,
    or_filters: options.or_filters,
    sort_by: options.sortBy,
    sort_direction: options.sortDirection
  }

  dispatch({
    type: "SESSION_HISTORY_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_session_history', data);
    dispatch({
      type: "SESSION_HISTORY_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SESSION_HISTORY_FAILED",
      error: e.error
    });
    throw new Error(e.error);
  }

}

export const getSessionRecording = (options) => async (dispatch) => {
  let data = {};
  data = {
    target_kasm_id: options.kasm_id,
    preauth_download_link: true,
    page: options.page || 1
  }

  dispatch({
    type: "SESSION_RECORDING_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_session_recording', data);
    dispatch({
      type: "SESSION_RECORDING_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "SESSION_RECORDING_FAILED",
      error: e.error
    });
    throw new Error(e.error);
  }

}


