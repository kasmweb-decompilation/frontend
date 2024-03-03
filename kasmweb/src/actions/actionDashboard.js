import { api } from '../utils/axios';
import moment from "moment";

export const getUserImages = (user) => async (dispatch) => {

  const data = {};

  if (user) {
    data.target_user = user;
  }

  dispatch({
    type: "GETUSERIMAGE_REQUESTED"
  });
  try {
    const response = await api.post('get_user_images', data);
    dispatch({
      type: "GETUSERIMAGE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GETUSERIMAGE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserImagesEx = (user) => async (dispatch) => {

  const data = {};

  if (user) {
    data.target_user = user;
  }

  dispatch({
    type: "GETUSERIMAGE_EX_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_user_images', data);
    dispatch({
      type: "GETUSERIMAGE_EX_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GETUSERIMAGE_EX_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const getUserKasms = ({ getuserkasmsLoading = true } = {}) => async (dispatch) => {
  let data = {};
  dispatch({
    type: "GETUSERKASMS_REQUESTED",
    getuserkasmsLoading
  });
  try {
    const response = await api.post('get_user_kasms', data);
    dispatch({
      type: "GETUSERKASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GETUSERKASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateUserKasms = ({ getuserkasmsLoading = true } = {}) => async (dispatch) => {
  let data = {};
  try {
    const response = await api.post('get_user_kasms', data);
    dispatch({
      type: "GETUSERKASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GETUSERKASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getStatusKasms = (kasm_id) => async (dispatch) => {
  let data = {};
  data.kasm_id = kasm_id;

  dispatch({
    type: "GETSTATUSKASMS_REQUESTED",
    kasm_id: kasm_id.split("-").join("")
  });
  try {
    const response = await api.post('get_kasm_status', data);
    dispatch({
      type: "GETSTATUSKASMS_SUCCESS",
      response: response,
      kasm_id: kasm_id.split("-").join("")
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GETSTATUSKASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const execKasm = (kasm_data) => async (dispatch) => {
  let data = {};
  data.target_kasm = {};
  data.target_kasm.kasm_id = kasm_data.kasm_id;
  data.target_kasm.kasm_exec = kasm_data.kasm_exec;
  data.target_kasm.kasm_url = kasm_data.kasm_url;

  dispatch({
    type: "EXECKASM_REQUESTED"
  });
  try {
    const response = await api.post('exec_kasm', data);
    dispatch({
      type: "EXECKASM_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "EXECKASM_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateKeepalive = (kasm_id) => async (dispatch) => {
  let data = {};
  data.kasm_id = kasm_id;

  dispatch({
    type: "UPDATE_KEEPALIVE_REQUESTED"
  });
  try {
    const response = await api.post('keepalive', data);
    dispatch({
      type: "UPDATE_KEEPALIVE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_KEEPALIVE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setKasmPageInfo({pageSize,pageNo}){
  return {
    type : 'SET_KASM_PAGEINFO',
    payload : {pageSize,pageNo }
  }
}

export const getDockedSessions = (allSessions) => async (dispatch) => {
  const dockedSessions = JSON.parse(window.localStorage.getItem("docked_sessions"));
  if (dockedSessions && allSessions) {
    const docked = allSessions.filter(x => dockedSessions.includes(x.kasm_id))
    let current = moment.utc()
    const unexpired = docked.filter(d => current < moment.utc(d.expiration_date))
    const unexpiredlist = unexpired.map(a => a.kasm_id);
    window.localStorage.setItem("docked_sessions", JSON.stringify(unexpiredlist));

    dispatch({
      type: 'DOCKED_SESSIONS',
      response: unexpiredlist
    })
  }
}

export const setDockedSessions = (data) => async (dispatch) => {
  window.localStorage.setItem("docked_sessions", JSON.stringify(data));
  dispatch({
    type: 'DOCKED_SESSIONS',
    response: data
  })
}

export const destroyKasms = (kasm_id) => async (dispatch) => {
  let data = {};
  data.kasm_id = kasm_id;

  dispatch({
    type: "DESTROY_KASMS_REQUESTED"
  });
  try {
    const response = await api.post('destroy_kasm', data);
    dispatch({
      type: "DESTROY_KASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DESTROY_KASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const stopKasms = (kasm_id) => async (dispatch) => {
  let data = {};
  data.kasm_id = kasm_id;

  dispatch({
    type: "STOP_KASMS_REQUESTED"
  });
  try {
    const response = await api.post('stop_kasm', data);
    dispatch({
      type: "STOP_KASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "STOP_KASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const pauseKasms = (kasm_id) => async (dispatch) => {
  let data = {};
  data.kasm_id = kasm_id;

  dispatch({
    type: "PAUSE_KASMS_REQUESTED"
  });
  try {
    const response = await api.post('pause_kasm', data);
    dispatch({
      type: "PAUSE_KASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "PAUSE_KASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const startKasms = (kasm_id) => async (dispatch) => {
  let data = {};
  data.kasm_id = kasm_id;

  dispatch({
    type: "START_KASMS_REQUESTED"
  });
  try {
    const response = await api.post('resume_kasm', data);
    dispatch({
      type: "START_KASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "START_KASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const createKasms = (request_data) => async (dispatch) => {
  let data = request_data;
  // I think doing this here saves code duplication if we call createKasms in multiple locations.
  data.client_timezone = window.localStorage.getItem('timezone');
  let client_language = window.localStorage.getItem('i18nextLng');
  if (client_language.indexOf('.') > 0) {
    // Remove any encoding already present
    client_language = client_language.split('.')[0]
  }
  // Swap dash for underscore to match Linux format
  client_language = client_language.replace('-', '_')
  // Add the encoding we have out our Linux containers
  client_language = client_language + '.UTF-8';
  data.client_language = client_language;

  dispatch({
    type: "CREATE_KASMS_REQUESTED"
  });
  try {
    const response = await api.post('request_kasm', data);
    dispatch({
      type: "CREATE_KASMS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_KASMS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getClientSettings = () => async (dispatch) => {
  let data = {};

  dispatch({
    type: "GET_CLIENT_SETTINGS_REQUESTED"
  });
  try {
    const response = await api.post('get_client_settings', data);
    dispatch({
      type: "GET_CLIENT_SETTINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_CLIENT_SETTINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUserDefaultImage = () => async (dispatch) => {
  let data = {};

  dispatch({
    type: "GET_DEFAULT_IMAGE_REQUESTED"
  });
  try {
    const response = await api.post('get_default_images', data);
    dispatch({
      type: "GET_DEFAULT_IMAGE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_DEFAULT_IMAGE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createKasmShareId = (kasm_id) => async (dispatch) => {
  let data = { kasm_id: kasm_id };

  dispatch({
    type: "CREATE_SHARE_ID_REQUESTED"
  });
  try {
    const response = await api.post('create_kasm_share_id', data);
    dispatch({
      type: "CREATE_SHARE_ID_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_SHARE_ID_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const destroyKasmShareId = (kasm_id) => async (dispatch) => {
  let data = { kasm_id: kasm_id };

  dispatch({
    type: "DESTROY_SHARE_ID_REQUESTED"
  });
  try {
    const response = await api.post('delete_kasm_share_id', data);
    dispatch({
      type: "DESTROY_SHARE_ID_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DESTROY_SHARE_ID_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getJoinKasm = (share_id) => async (dispatch) => {
  let data = {};
  data.share_id = share_id;

  dispatch({
    type: "JOIN_KASM_REQUESTED"
  });
  try {
    const response = await api.post('join_kasm', data);
    dispatch({
      type: "JOIN_KASM_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "JOIN_KASM_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getViewedKasms = (kasms) => async (dispatch) => {
  let data = {};
  data.kasms = kasms;

  dispatch({
    type: "GET_VIEWKASM_REQUESTED"
  });
  try {
    const response = await api.post('get_recent_kasms', data);
    dispatch({
      type: "GET_VIEWKASM_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_VIEWKASM_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const clearSearch = (data) => async (dispatch) => {
  dispatch({
    type: "CLEAR_SEARCH",
  });
}

export const search = (data) => async (dispatch) => {
  dispatch({
    type: "SEARCH",
    value: data
  });
}

export const selectCategory = (data) => async (dispatch) => {
  dispatch({
    type: "SELECT_CATEGORY",
    value: data
  });
}

export const setShowProfile = (data) => async (dispatch) => {
  dispatch({
    type: "SHOW_PROFILE",
    value: data
  });
}

export const setProfileSection = (data) => (dispatch) => {
  dispatch({
    type: "PROFILE_SECTION",
    value: data
  })
}

export const setProfileDropdown = (data) => (dispatch) => {
  dispatch({
    type: "PROFILE_DROPDOWN",
    value: data
  })
}
