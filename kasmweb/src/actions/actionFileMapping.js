import { api } from '../utils/axios';

export const createFileMapping = (data) => async (dispatch) => {
  dispatch({
    type: "CREATE_FILE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_file_map', data);
    dispatch({
      type: "CREATE_FILE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_FILE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }
}



export const uploadFileMapping = (data) => async (dispatch) => {

  let formData = new FormData();

  dispatch({
    type: "CREATE_FILE_MAPPINGS_REQUESTED"
  });

  formData.append('name', data.target_file_map.name);
  formData.append('description', data.target_file_map.description);
  formData.append('destination', data.target_file_map.destination);
  formData.append('is_executable', data.target_file_map.is_executable);
  formData.append('is_writable', data.target_file_map.is_writable);
  formData.append('file_type', data.target_file_map.file_type);
  formData.append('ufile', data.target_file_map.ufile);
  formData.append('image_id', data.target_file_map.image_id || null);
  formData.append('group_id', data.target_file_map.group_id || null);
  formData.append('user_id', data.target_file_map.user_id || null);
  formData.append('file_map_id', data.target_file_map.file_map_id || null);

  try {
    const response = await api.post('admin/upload_file_mapping', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    dispatch({
      type: "CREATE_FILE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_FILE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }
}


export const updateFileMapping = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_FILE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_file_map', data);
    dispatch({
      type: "UPDATE_FILE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_FILE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }
}

export const getFileMappings = (data) => async (dispatch) => {
  dispatch({
    type: "GET_FILE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_file_mappings', data);
    dispatch({
      type: "GET_FILE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_FILE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }

}

export const deleteFileMapping = (data) => async (dispatch) => {
  dispatch({
    type: "DELETE_FILE_MAPPINGS_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_file_map', data);
    dispatch({
      type: "DELETE_FILE_MAPPINGS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_FILE_MAPPINGS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
  }

}