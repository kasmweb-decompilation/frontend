export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_DNS_PROVIDER_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "GET_DNS_PROVIDER_REQUESTED":
            return {
                ...state,
                dns_provider_configs: null,
                getDnsProviderLoading: true,
                getDnsProviderError: null
            };
        case "GET_DNS_PROVIDER_SUCCESS":
            return {
                ...state,
                dns_provider_configs: action.response && action.response.dns_provider_configs || null,
                getDnsProviderLoading: false,
                getDnsProviderErrorMessage: action.error || action.response.error_message,
            };
        case "GET_DNS_PROVIDER_FAILED":
            return {
                ...state,
                dns_provider_configs: null,
                getDnsProviderLoading: false,
                getDnsProviderError: action.error
            };
        

        case "CREATE_DNS_PROVIDER_REQUESTED":
            return {
                ...state,
                savedDnsProvider: null,
                saveDnsProviderLoading: true,
                saveDnsProviderError: null
            };
        case "CREATE_DNS_PROVIDER_SUCCESS":
            return {
                ...state,
                savedDnsProvider: action.response && action.response.dns_provider_config || null,
                saveDnsProviderLoading: false,
                saveDnsProviderError: action.error || action.response.error_message,
            };
        case "CREATE_DNS_PROVIDER_FAILED":
            return {
                ...state,
                savedDnsProvider: null,
                saveDnsProviderLoading: false,
                saveDnsProviderError: action.error
            };

        case "DELETE_DNS_PROVIDER_REQUESTED":
            return {
                ...state,
                deletedDnsProvider: null,
                deleteDnsProviderLoading: true,
                deleteDnsProviderError: null
            };
        case "DELETE_DNS_PROVIDER_SUCCESS":
            return {
                ...state,
                deletedDnsProvider: action.response && action.response.dns_provider_config || null,
                deleteDnsProviderLoading: false,
                deleteDnsProviderError: action.error || action.response.error_message,
            };
        case "DELETE_DNS_PROVIDER_FAILED":
            return {
                ...state,
                deletedDnsProvider: null,
                deleteDnsProviderLoading: false,
                deleteDnsProviderError: action.error
            };

        case "UPDATE_DNS_PROVIDER_REQUESTED":
            return {
                ...state,
                savedDnsProvider: null,
                saveDnsProviderLoading: true,
                saveDnsProviderError: null
            };
        case "UPDATE_DNS_PROVIDER_SUCCESS":
            return {
                ...state,
                savedDnsProvider: action.response && action.response.dns_provider_config || null,
                saveDnsProviderLoading: false,
                saveDnsProviderError: action.error || action.response.error_message,
            };
        case "UPDATE_DNS_PROVIDER_FAILED":
            return {
                ...state,
                savedDnsProvider: null,
                saveDnsProviderLoading: false,
                saveDnsProviderError: action.error || action.response.error_message
            };


        default:
            return state;
    }
}