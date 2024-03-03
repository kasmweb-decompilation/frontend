import { api } from '../utils/axios';

export function setDnsProviderPageInfo({pageSize,pageNo}){
    return {
        type : 'SET_DNS_PROVIDER_PAGEINFO',
        payload : {pageSize,pageNo }
    }
}

export const getDnsProviderConfigs = () => async (dispatch) => {
    let data = {};

    dispatch({
        type: "GET_DNS_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/get_dns_provider_configs', data);
        dispatch({
            type: "GET_DNS_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "GET_DNS_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}


export const deleteDnsProviderConfig = (dns_provider_config_id, dns_provider_name) => async (dispatch) => {
    let data = {
        target_dns_provider_config:
            {
                dns_provider_config_id: dns_provider_config_id,
                dns_provider_name: dns_provider_name
            }
    };

    dispatch({
        type: "DELETE_DNS_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/delete_dns_provider_config', data);
        dispatch({
            type: "DELETE_DNS_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "DELETE_DNS_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const createDnsProviderConfig = (dns_provider_config) => async (dispatch) => {
    let data = {target_dns_provider_config: dns_provider_config};

    dispatch({
        type: "CREATE_DNS_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/create_dns_provider_config', data);
        dispatch({
            type: "CREATE_DNS_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "CREATE_DNS_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}

export const updateDnsProviderConfig = (dns_provider_config) => async (dispatch) => {
    let data = {target_dns_provider_config: dns_provider_config};

    dispatch({
        type: "UPDATE_DNS_PROVIDER_REQUESTED"
    })

    try {
        const response = await api.post('admin/update_dns_provider_config', data);
        dispatch({
            type: "UPDATE_DNS_PROVIDER_SUCCESS",
            response: response
        });
        return {response}
    } catch (e) {
        dispatch({
            type: "UPDATE_DNS_PROVIDER_FAILED",
            error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
        });
        const errorMsg = e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    throw new Error(errorMsg);

    }
}
