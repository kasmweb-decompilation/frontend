import { api } from '../utils/axios';

export const getServers = (userData) => async (dispatch) => {
  
  let data = {};
  if (userData && userData.server_id) {
    data.target_server = { "server_id": userData.server_id };
  }

  dispatch({
    type: "GET_SERVERS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_servers', data);
    dispatch({
      type: "GET_SERVERS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SERVERS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const deleteServer = ({server_id, force}) => async (dispatch) => {
  
  let data = {};
  data.force = force || false;
  data.target_server = { "server_id": server_id };

  dispatch({
    type: "DELETE_SERVERS_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_server', data);
    dispatch({
      type: "DELETE_SERVERS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_SERVERS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateServer = (userData) => async (dispatch) => {
  
  let data = {};
  data.target_server = userData;

  dispatch({
    type: "UPDATE_SERVER_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_server', data);
    dispatch({
      type: "UPDATE_SERVER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_SERVER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createServer = (userData) => async (dispatch) => {
    let data = {target_server: userData};
    dispatch({
      type: "CREATE_SERVER_REQUESTED"
    });

    try {
    const response = await api.post('admin/create_server', data);
    dispatch({
        type: "CREATE_SERVER_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "CREATE_SERVER_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export function setAgentPageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_AGENT_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const destroyAgentKasms = (server_id) => async (dispatch) => {
  
  let data = {};
  data.target_server = { "server_id": server_id };

  dispatch({
    type: "DESTROY_AGENT_KASMS_REQUESTED"
  });
  try {
    const response = await api.post('admin/destroy_agent_kasms', data);
    dispatch({
      type: "DESTROY_AGENT_KASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DESTROY_AGENT_KASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

