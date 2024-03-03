import { api } from '../utils/axios';

export const getAttributeFields = () => async (dispatch) => {

  let data = {};

  dispatch({
    type: "ATTRIBUTE_FIELDS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_sso_attribute_mapping_fields', data);
    dispatch({
      type: "ATTRIBUTE_FIELDS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "ATTRIBUTE_FIELDS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }
}

export const createAttributeField = (data) => async (dispatch) => {
  dispatch({
    type: "CREATE_ATTRIBUTE_FIELD_REQUESTED"
  });
  try {
    const response = await api.post('admin/add_sso_attribute_mapping', data);
    dispatch({
      type: "CREATE_ATTRIBUTE_FIELD_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_ATTRIBUTE_FIELD_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }
}

export const updateAttributeField = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_ATTRIBUTE_FIELD_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_sso_attribute_mapping', data);
    dispatch({
      type: "UPDATE_ATTRIBUTE_FIELD_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_ATTRIBUTE_FIELD_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }
}

export const getMappedFields = (data) => async (dispatch) => {
  dispatch({
    type: "GET_MAPPED_FIELDS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_sso_attribute_mappings', data);
    dispatch({
      type: "GET_MAPPED_FIELDS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_MAPPED_FIELDS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }

}

export const deleteAttributeField = (data) => async (dispatch) => {
  dispatch({
    type: "DELETE_MAPPED_FIELD_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_sso_attribute_mapping', data);
    dispatch({
      type: "DELETE_MAPPED_FIELD_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_MAPPED_FIELD_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }

}