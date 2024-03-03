import { api } from '../utils/axios';

export const getManagers = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_MANAGERS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_managers', data);
    dispatch({
      type: "GET_MANAGERS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_MANAGERS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setManagerPageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_MANAGER_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const deleteManager = (manager_id) => async (dispatch) => {
  
  let data = {};
  data.focus = true;
  data.target_manager = { "manager_id": manager_id };
  dispatch({
    type: "DELETE_MANAGERS_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_manager', data);
    dispatch({
      type: "DELETE_MANAGERS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_MANAGERS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
