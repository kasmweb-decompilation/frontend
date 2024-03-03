import { api } from '../utils/axios';


export function setAutoScalePageInfo({pageSize,pageNo}){
    return {
        type : 'SET_AUTOSCALE_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const getAutoScaleConfigs = () => async (dispatch) => {
    let data = {};
    dispatch({
        type: "GET_AUTOSCALE_REQUESTED"
    });

    try {
        const response = await api.post('admin/get_autoscale_configs', data);
        dispatch({
            type: "GET_AUTOSCALE_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "GET_AUTOSCALE_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}


export const deleteAutoScaleConfig = (autoscale_config_id) => async (dispatch) => {
    let data = {autoscale_config_id: autoscale_config_id};
    dispatch({
        type: "DELETE_AUTOSCALE_REQUESTED"
    });

    try {
        const response = await api.post('admin/delete_autoscale_config', data);
        dispatch({
            type: "DELETE_AUTOSCALE_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "DELETE_AUTOSCALE_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const clearAutoScaleConfig = () => async (dispatch) => {
    dispatch({
        type: "CREATE_AUTOSCALE_REQUESTED"
    });
}

export const createAutoScaleConfig = (autoscale_config) => async (dispatch) => {
    let data = {target_autoscale_config: autoscale_config};
    dispatch({
        type: "CREATE_AUTOSCALE_REQUESTED"
    });

    try {
        const response = await api.post('admin/create_autoscale_config', data);
        dispatch({
            type: "CREATE_AUTOSCALE_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "CREATE_AUTOSCALE_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const  updateAutoScaleConfig = (autoscale_config) => async (dispatch) => {
    let data = {target_autoscale_config: autoscale_config};
    dispatch({
        type: "UPDATE_AUTOSCALE_REQUESTED"
    });

    try {
        const response = await api.post('admin/update_autoscale_config', data);
        dispatch({
            type: "UPDATE_AUTOSCALE_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "UPDATE_AUTOSCALE_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}
