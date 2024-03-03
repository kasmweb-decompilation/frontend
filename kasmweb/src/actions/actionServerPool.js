import { api, hasAuth } from '../utils/axios';


export const getServerPools = () => async (dispatch) => {
    let data = {};
    if (hasAuth('pools')) {
        dispatch({
            type: "GET_SERVER_POOLS_REQUESTED"
        });

        try {
            const response = await api.post('admin/get_server_pools', data);
            dispatch({
                type: "GET_SERVER_POOLS_SUCCESS",
                response: response
            });
            return {response}
        } catch (e) {
            dispatch({
                type: "GET_SERVER_POOLS_FAILED",
                error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
            });
            const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

        }
    }
}

export const deleteServerPool = (server_pool_id) => async (dispatch) => {
    let data = {
        focus: true,
        target_server_pool: {"server_pool_id": server_pool_id}
    };

    dispatch({
        type: "DELETE_SERVER_POOL_REQUESTED"
    });

    try {
        const response = await api.post('admin/delete_server_pool', data);
        dispatch({
            type: "DELETE_SERVER_POOL_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "DELETE_SERVER_POOL_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const updateServerPool = (userData) => async (dispatch) => {
    let data = {target_server_pool: userData};

    dispatch({
        type: "SAVE_SERVER_POOL_REQUESTED"
    });

    try {
        const response = await api.post('admin/update_server_pool', data);
        dispatch({
            type: "SAVE_SERVER_POOL_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "SAVE_SERVER_POOL_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const createServerPool = (userData) => async (dispatch) => {
    let data = {target_server_pool: userData};

    dispatch({
        type: "SAVE_SERVER_POOL_REQUESTED"
    });

    try {
        const response = await api.post('admin/create_server_pool', data);
        dispatch({
            type: "SAVE_SERVER_POOL_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "SAVE_SERVER_POOL_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}


export function setServerPoolPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_SERVER_POOL_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}
