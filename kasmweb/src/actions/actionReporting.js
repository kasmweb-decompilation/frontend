import { api, hasAuth } from '../utils/axios';

export const getReport = (report) => async (dispatch) => {

  let data = report;

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_REPORT_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_REPORT_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_REPORT_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getTotalUsers = (report) => async (dispatch) => {

  let data = report;
  data.name = "total_users";

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_TOTALUSERS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_TOTALUSERS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_TOTALUSERS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getAgent = (agent) => async (dispatch) => {

  let data = agent;
  data.name = "agent_resource_utilization";
  data.filters = { "server_id": agent.server_id };
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_AGENT_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_agent_report', data);
      dispatch({
        type: "GET_AGENT_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_AGENT_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getAgentGraph = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "agent_resource_utilization";

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_AGENTGRAPH_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_AGENTGRAPH_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_AGENTGRAPH_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getActiveUsers = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "active_users";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_ACTIVE_USERS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_ACTIVE_USERS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_ACTIVE_USERS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getLogins = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "logins_by_hour";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_LOGINS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_LOGINS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_LOGINS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getAvgKasm = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "avg_kasm_length";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_KASM_LENGTH_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_KASM_LENGTH_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_KASM_LENGTH_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getDestroyedKasms = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "destroyed_kasms";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_DESTROYED_KASMS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_DESTROYED_KASMS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_DESTROYED_KASMS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getCreatedKasms = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "created_kasms";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_CREATED_KASMS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_CREATED_KASMS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_CREATED_KASMS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getKasms = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "kasms";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_KASMS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_KASMS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_KASMS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getErrors = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "get_errors";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_ERRORS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_ERRORS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_ERRORS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getImageUsage = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "image_usage";
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_IMAGE_USE_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_IMAGE_USE_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_IMAGE_USE_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export function setUserUsagePageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_USER_USAGE_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export function setDomainUsagePageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_DOMAIN_USAGE_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}

export const getUserUsage = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "user_kasm_usage";

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_KASM_USE_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_KASM_USE_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_KASM_USE_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getDomainUsage = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "domain_usage";

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_DOMAIN_USE_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_DOMAIN_USE_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_DOMAIN_USE_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getCurrentUsers = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "current_users";

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_CURRENT_USERS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_CURRENT_USERS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_CURRENT_USERS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getCurrentKasms = (filters) => async (dispatch) => {

  let data = filters;
  data.name = "current_kasms";

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_CURRENT_KASMS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_CURRENT_KASMS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_CURRENT_KASMS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getAlert = (filters) => async (dispatch) => {

  let data = {};
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_ALERT_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_alert_report', data);
      dispatch({
        type: "GET_ALERT_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_ALERT_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const getLogs = (filters) => async (dispatch) => {

  let data = {
    name: "logs",
    filters: filters.filters,
    exclude_filters: filters.exclude_filters,
    limit: filters.limit || 100,
  };
  if (filters.delta) {
    data.delta = filters.delta
  }
  if (filters.start_date && filters.end_date) {
    data.start_date = filters.start_date;
    data.end_date = filters.end_date;
  }

  if (hasAuth('reports')) {
    dispatch({
      type: "GET_LOG_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_report', data);
      dispatch({
        type: "GET_LOG_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_LOG_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export const gethosts = () => async (dispatch) => {

  let data = {};
  if (hasAuth('reports')) {
    dispatch({
      type: "GET_HOSTS_REQUESTED"
    });
    try {
      const response = await api.post('admin/get_distinct_hosts', data);
      dispatch({
        type: "GET_HOSTS_SUCCESS",
        response: response
      });
      return { response }
    } catch (e) {
      dispatch({
        type: "GET_HOSTS_FAILED",
        error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
      });
      const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
  }
}

export function setLogsPageInfo({ pageSize, pageNo }) {
  return {
    type: 'SET_LOGS_PAGEINFO',
    payload: { pageSize, pageNo }
  }
}
