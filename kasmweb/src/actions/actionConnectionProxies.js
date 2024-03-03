import { api } from '../utils/axios';

export const createConnectionProxy = (userData) => async (dispatch) => {
    let data = {target_connection_proxy: userData};

    dispatch({
        type: "CREATE_CONNECTION_PROXY_REQUESTED"
    });

    try {
        const response = await api.post('admin/create_connection_proxy', data);
        dispatch({
            type: "CREATE_CONNECTION_PROXY_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "CREATE_CONNECTION_PROXY_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export function setConnectionProxyPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_CONNECTION_PROXY_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const getConnectionProxies = () => async (dispatch) => {
    let data = {};

    dispatch({
        type: "GET_CONNECTION_PROXIES_REQUESTED"
    });

    try {
        const response = await api.post('admin/get_connection_proxies', data);
        dispatch({
            type: "GET_CONNECTION_PROXIES_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "GET_CONNECTION_PROXIES_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const updateConnectionProxy = (userData) => async (dispatch) => {
    let data = {target_connection_proxy: userData};

    dispatch({
        type: "UPDATE_CONNECTION_PROXY_REQUESTED"
    });

    try {
        const response = await api.post('admin/update_connection_proxy', data);
        dispatch({
            type: "UPDATE_CONNECTION_PROXY_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "UPDATE_CONNECTION_PROXY_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const deleteConnectionProxy = (connection_proxyId) => async (dispatch) => {
    let data = {target_connection_proxy: {"connection_proxy_id": connection_proxyId}};

    dispatch({
        type: "DELETE_CONNECTION_PROXY_REQUESTED"
    });

    try {
        const response = await api.post('admin/delete_connection_proxy', data);
        dispatch({
            type: "DELETE_CONNECTION_PROXY_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "DELETE_CONNECTION_PROXY_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}
