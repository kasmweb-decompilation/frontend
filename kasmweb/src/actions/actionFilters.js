import { api } from '../utils/axios';

export const getUrlFilterPolicies = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_FILTER_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_url_filter_policies', data);
    dispatch({
      type: "GET_FILTER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_FILTER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getUrlFilterCategories = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_FILTER_CATEGORIES_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_all_categories', data);
    dispatch({
      type: "GET_FILTER_CATEGORIES_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_FILTER_CATEGORIES_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const getSafeSearchPatterns = () => async (dispatch) => {
  
  let data = {};
  dispatch({
    type: "GET_SAFE_SEARCH_PATTERNS_REQUESTED"
  });
  try {
    const response = await api.post('admin/get_safe_search_patterns', data);
    dispatch({
      type: "GET_SAFE_SEARCH_PATTERNS_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "GET_SAFE_SEARCH_PATTERNS_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export function setWebFilterPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_WEB_FILTER_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const deleteUrlFilterPolicy = (filter_policy_id) => async (dispatch) => {
  
  let data = {filter_policy_id: filter_policy_id};
  dispatch({
    type: "DELETE_FILTER_REQUESTED"
  });
  try {
    const response = await api.post('admin/delete_url_filter_policy', data);
    dispatch({
      type: "DELETE_FILTER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "DELETE_FILTER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const createUrlFilterPolicy = (filter_policy) => async (dispatch) => {
  
  let data = {};
  data.target_url_filter_policy = filter_policy;
  dispatch({
    type: "CREATE_FILTER_REQUESTED"
  });
  try {
    const response = await api.post('admin/create_url_filter_policy', data);
    dispatch({
      type: "CREATE_FILTER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "CREATE_FILTER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}

export const updateUrlFilterPolicy = (filter_policy) => async (dispatch) => {
  
  let data = {};
  data.target_url_filter_policy = filter_policy;
  dispatch({
    type: "UPDATE_FILTER_REQUESTED"
  });
  try {
    const response = await api.post('admin/update_url_filter_policy', data);
    dispatch({
      type: "UPDATE_FILTER_SUCCESS",
      response: response
    });
    return { response }
  } catch (e) {
    dispatch({
      type: "UPDATE_FILTER_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

  }
}
