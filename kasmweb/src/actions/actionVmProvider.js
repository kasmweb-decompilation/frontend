import { api } from '../utils/axios';

export function setVmProviderPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_VM_PROVIDER_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const getVmProviderConfigs = () => async (dispatch) => {
    let data = {};
    dispatch({
        type: "GET_VM_PROVIDER_REQUESTED"
    });

    try {
        const response = await api.post('admin/get_vm_provider_configs', data);
        dispatch({
            type: "GET_VM_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "GET_VM_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const deleteVmProviderConfig = ({ vm_provider_config_id, vm_provider_name }) => async (dispatch) => {
    let data = {
        target_vm_provider_config : {
            vm_provider_config_id,
            vm_provider_name
        }
    };
    dispatch({
        type: "DELETE_VM_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/delete_vm_provider_config', data);
        dispatch({
            type: "DELETE_VM_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "DELETE_VM_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }

}

export const createVmProviderConfig = (vm_provider_config) => async (dispatch) => {
    let data = {target_vm_provider_config: vm_provider_config};
    dispatch({
        type: "CREATE_VM_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/create_vm_provider_config', data);
        dispatch({
            type: "CREATE_VM_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "CREATE_VM_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const updateVmProviderConfig = (vm_provider_config) => async (dispatch) => {
    let data = {target_vm_provider_config: vm_provider_config};
    dispatch({
        type: "UPDATE_VM_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/update_vm_provider_config', data);
        dispatch({
            type: "UPDATE_VM_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "UPDATE_VM_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}
