import axios from 'axios';
import { clearLocalStorage } from "../utils/helpers";
import stopReload from "../constants/Constants";

export const hasAuth = (check) => {
  const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
  if (typeof check === 'string') {
    check = check.split(" ")
  }
  for (let i = 0; i < check.length; i++) {
    if (userInfo && _.get(userInfo, 'authorized_views[' + check[i] + ']') === true) {
      return true
    }
  }
  return false
} 
__CLOUD_SERVER__ = window.location.protocol + "//" + window.location.hostname + "/api/"
export const api = axios.create({
  baseURL: `${__CLOUD_SERVER__}`,
  headers: {
    "Accept": "application/json",
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  request => {
    const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
    request.data.token = userInfo && userInfo.token || null; 
    request.data.username = userInfo && userInfo.username || null;

    if (request.url === 'new_session_token') {
      // return early if its a call to new_session_token as we don't want to reset the timeout every 5 minutes
      return request
    }

    if (window.disableAPIActiveState == undefined || window.disableAPIActiveState == 0) { window.localStorage.setItem("unActiveStateSec", new Date().getTime()); }

    return request
  }
);

const unauthedUrls = [
  'authenticate',
  'two_factor_auth',
  'reset_password'
]

api.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject({ status: response.status, error: response.status + ' Invalid request', body: response.data });
    }
  },
  error => {
    if (error.response.status === 403) {
      const rUrl = String(error.response.request.responseURL)
      const callUrl = error.response.request.responseURL.replace(/\/$/, "").split("/").pop() || null
      if (error.response.data && 'reason' in error.response.data && error.response.data.reason === 'expired_password') {
        return error.response.data
      }
      if (!unauthedUrls.includes(callUrl)) {
        window.removeEventListener("beforeunload", stopReload, true);
        clearLocalStorage();
        window.location.reload();
        return []
      } 
    } else if (error.response.status === 401) {
      if (!_.has(error.response.data, 'ui_show_error') || error.response.data.ui_show_error === true) {
        return Promise.reject({ status: error.response.status, error: error.message, body: error.response.data });
      } else {
        console.log(error.response)
      }
      return []
    } else {
      console.log(error) // This should give some context when it's not obvious why something has failed

      let errorMessage = error.message
      if (_.get(error, 'response.data.error_message', false)) {
        errorMessage = error.response.data.error_message
      }
      return Promise.reject({ status: error.response.status, error: errorMessage, body: error.response.data });
    }
  }
);
  