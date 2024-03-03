import { api } from '../utils/axios';

export function setStorageProviderPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_STORAGE_PROVIDER_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const getStorageProviders = () => async (dispatch) => {
    let data = {};
    dispatch({
        type: "GET_STORAGE_PROVIDER_REQUESTED"
    });

    try {
        const response = await api.post('admin/get_storage_providers', data);
        dispatch({
            type: "GET_STORAGE_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "GET_STORAGE_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const deleteStorageProvider = (userData) => async (dispatch) => {

    let data = {}
    data.target_storage_provider = userData

    dispatch({
        type: "DELETE_STORAGE_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/delete_storage_provider', data);
        dispatch({
            type: "DELETE_STORAGE_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "DELETE_STORAGE_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }

}

export const updateStorageProvider = (userData) => async (dispatch) => {

    let data = {}
    data.target_storage_provider = userData

    dispatch({
        type: "UPDATE_STORAGE_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/update_storage_provider', data);
        dispatch({
            type: "UPDATE_STORAGE_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "UPDATE_STORAGE_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }

}

export const createStorageProvider = (userData) => async (dispatch) => {

    let data = {}
    data.target_storage_provider = userData

    dispatch({
        type: "CREATE_STORAGE_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/create_storage_provider', data);
        dispatch({
            type: "CREATE_STORAGE_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "CREATE_STORAGE_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }

}