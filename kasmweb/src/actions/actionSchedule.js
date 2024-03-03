import { api } from '../utils/axios';


export const getSchedules = (data) => async (dispatch) => {
  dispatch({
    type: "GET_SCHEDULES_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_schedules', data);
    dispatch({
      type: "GET_SCHEDULES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SCHEDULES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const deleteSchedule = (data) => async (dispatch) => {

  dispatch({
    type: "DELETE_SCHEDULE_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_schedule', data);
    dispatch({
      type: "DELETE_SCHEDULE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_SCHEDULE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const createSchedule = (data) => async (dispatch) => {

  dispatch({
    type: "CREATE_SCHEDULE_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_schedule', data);
    dispatch({
      type: "CREATE_SCHEDULE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_SCHEDULE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}


export const updateSchedule = (data) => async (dispatch) => {

  dispatch({
    type: "UPDATE_SCHEDULE_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_schedule', data);
    dispatch({
      type: "UPDATE_SCHEDULE_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_SCHEDULE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

