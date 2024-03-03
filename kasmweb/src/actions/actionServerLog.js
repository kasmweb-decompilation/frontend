import { api } from '../utils/axios';
import { ENABLE_UI_SERVER_LOGGING } from "../constants/Constants.js";

export const serverLog = (log, trace) => async (dispatch) => {
  
  let data = {};
  log.client_timestamp = new Date().toISOString();

  let level = log.level || "info";

  switch (level) {
    case "debug":
      console.debug(log);
      break;
    case "info":
      console.info(log);
      break;
    case "warning":
      console.warn(log);
      break;
    case "error":
      console.error(log);
      break;
    default:
      console.log(log);
  }

  if (trace) {
    console.trace(log);
  }

  data.logs = [log];

  if (ENABLE_UI_SERVER_LOGGING) {
    dispatch({
      type: "SERVER_LOG_REQUESTED"
    });
    try {
      const response = await api.post('ui_log', data);
      dispatch({
        type: "SERVER_LOG_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "SERVER_LOG_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }

  }
  else {
    return { type: null };
  }
}