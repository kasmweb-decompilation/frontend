import { api } from '../utils/axios';

export const getSystemInfo = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_SYSTEMINFO_REQUESTED"
  });
  try {
    const response = await api.post('admin/system_info', data);
    dispatch({
      type: "GET_SYSTEMINFO_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SYSTEMINFO_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getLicenses = () => async (dispatch) => {
  
  let data = {};

  dispatch({
    type: "GET_LICENSES_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_licenses', data);
    dispatch({
      type: "GET_LICENSES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_LICENSES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const addLicense = (data) => async (dispatch) => {
  
  let postData = {};
  postData.license_key = data.license_key;

  dispatch({
    type: "ADD_LICENSE_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_license', postData);
    dispatch({
      type: "ADD_LICENSE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ADD_LICENSE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setLicensePageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_LICENSE_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const deleteLicense = (data) => async (dispatch) => {
  
  let postData = {};
  postData.license_id = data.licenseId;

  dispatch({
    type: "DELETE_LICENSE_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_license', postData);
    dispatch({
      type: "DELETE_LICENSE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_LICENSE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const exportSchema = () => async (dispatch) => {

  let data = {};

  dispatch({
    type: "EXPORT_SCHEMA_REQUESTED"
  });
  try {
    const response = await api.post('admin/export_schema', data);
    dispatch({
      type: "EXPORT_SCHEMA_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "EXPORT_SCHEMA_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const exportData = (data) => async (dispatch) => {

  dispatch({
    type: "EXPORT_DATA_REQUESTED"
  });
  try {
    const response = await api.post('admin/export_data', data);
    dispatch({
      type: "EXPORT_DATA_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "EXPORT_DATA_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const importData = (data) => async (dispatch) => {

  dispatch({
    type: "IMPORT_DATA_REQUESTED"
  });
  try {
    const response = await api.post('admin/import_data', data);
    dispatch({
      type: "IMPORT_DATA_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "IMPORT_DATA_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

