import { api } from '../utils/axios';

export const getPhysicalTokens = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_PHYSICAL_TOKENS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_physical_tokens', data);
    dispatch({
      type: "GET_PHYSICAL_TOKENS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_PHYSICAL_TOKENS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setPhysicalTokenPageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_PHYSICAL_TOKEN_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const deletePhysicalToken = (serial_or_file) => async (dispatch) => {
  
  // let data = { target_token: { "serial_number": serial_number } };
  let data = { target_token: serial_or_file };
  dispatch({
    type: "DELETE_PHYSICAL_TOKEN_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_physical_token', data);
    dispatch({
      type: "DELETE_PHYSICAL_TOKEN_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_PHYSICAL_TOKEN_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const unassignPhysicalToken = (serial_number) => async (dispatch) => {
  
  let data = { target_token: { "serial_number": serial_number } };
  dispatch({
    type: "UNASSIGN_PHYSICAL_TOKEN_REQUESTED"
  });
  try {
    const response = await api.post('admin/unassign_physical_token', data);
    dispatch({
      type: "UNASSIGN_PHYSICAL_TOKEN_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UNASSIGN_PHYSICAL_TOKEN_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const assignPhysicalToken = ({serial_number, user_id}) => async (dispatch) => {
  
  let data = { target_token: { "serial_number": serial_number }, target_user: { "user_id" : user_id } };
  dispatch({
    type: "ASSIGN_PHYSICAL_TOKEN_REQUESTED"
  });
  try {
    const response = await api.post('admin/assign_physical_token', data);
    dispatch({
      type: "ASSIGN_PHYSICAL_TOKEN_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ASSIGN_PHYSICAL_TOKEN_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const uploadPhysicalToken = (data) => async (dispatch) => {
  dispatch({
    type: "UPLOAD_PHYSICAL_TOKENS_REQUESTED"
  });
  try {
    let formData = new FormData();
    formData.append('zippw', data.zippw);
    formData.append('ufile', data.ufile);

    const response = await api.post('admin/upload_physical_tokens', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    });
    dispatch({
      type: "UPLOAD_PHYSICAL_TOKENS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPLOAD_PHYSICAL_TOKENS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
