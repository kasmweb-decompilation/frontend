import { api, hasAuth } from '../utils/axios';

export const createZone = (userData) => async (dispatch) => {
  
  let data = {};
  data.target_zone = userData;

  dispatch({
    type: "CREATE_ZONE_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_zone', data);
    dispatch({
      type: "CREATE_ZONE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_ZONE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setZonePageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_ZONE_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const getZones = () => async (dispatch) => {
  
  let data = {};
  if (hasAuth('zones')) {
    dispatch({
      type: "GET_ZONES_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_zones', data);
      dispatch({
        type: "GET_ZONES_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_ZONES_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const updateZone = (userData) => async (dispatch) => {
  
  let data = {};
  data.target_zone = userData;

  dispatch({
    type: "UPDATE_ZONE_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_zone', data);
    dispatch({
      type: "UPDATE_ZONE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_ZONE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const deleteZone = (zoneId) => async (dispatch) => {
  
  let data = {};
  data.target_zone = { "zone_id": zoneId };

  dispatch({
    type: "DELETE_ZONE_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_zone', data);
    dispatch({
      type: "DELETE_ZONE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_ZONE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
