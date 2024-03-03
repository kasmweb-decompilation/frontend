export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_VM_PROVIDER_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "GET_VM_PROVIDER_REQUESTED":
            return {
                ...state,
                vm_provider_configs: null,
                getVmProviderLoading: true,
                getVmProviderError: null
            };
        case "GET_VM_PROVIDER_SUCCESS":
            return {
                ...state,
                vm_provider_configs: action.response && action.response.vm_provider_configs || null,
                getVmProviderLoading: false,
                getVmProviderErrorMessage: action.error || action.response.error_message,
            };
        case "GET_VM_PROVIDER_FAILED":
            return {
                ...state,
                vm_provider_configs: null,
                getVmProviderLoading: false,
                getVmProviderError: action.error
            };
        case "CREATE_VM_PROVIDER_REQUESTED":
            return {
                ...state,
                savedVmProvider: null,
                saveVmProviderLoading: true,
                saveVmProviderError: null
            };
        case "CREATE_VM_PROVIDER_SUCCESS":
            return {
                ...state,
                savedVmProvider: action.response && action.response.vm_provider_config || null,
                saveVmProviderLoading: false,
                saveVmProviderError: action.error || action.response.error_message,
            };
        case "CREATE_VM_PROVIDER_FAILED":
            return {
                ...state,
                savedVmProvider: null,
                saveVmProviderLoading: false,
                saveVmProviderError: action.error
            };

        case "DELETE_VM_PROVIDER_REQUESTED":
            return {
                ...state,
                deletedVmProvider: null,
                deleteVmProviderLoading: true,
                deleteVmProviderError: null
            };
        case "DELETE_VM_PROVIDER_SUCCESS":
            return {
                ...state,
                deletedVmProvider: action.response && action.response.vm_provider_config || null,
                deleteVmProviderLoading: false,
                deleteVmProviderError: action.error || action.response.error_message || null,
                deleteVmProviderErrorMessage: action.error || action.response.error_message || null,
            };
        case "DELETE_VM_PROVIDER_FAILED":
            return {
                ...state,
                deletedVmProvider: null,
                deleteVmProviderLoading: false,
                deleteVmProviderError: action.error
            };

        case "UPDATE_VM_PROVIDER_REQUESTED":
            return {
                ...state,
                savedVmProvider: null,
                saveVmProviderLoading: true,
                saveVmProviderError: null
            };
        case "UPDATE_VM_PROVIDER_SUCCESS":
            return {
                ...state,
                savedVmProvider: action.response && action.response.vm_provider_config || null,
                saveVmProviderLoading: false,
                saveVmProviderError: action.error || action.response.error_message,
            };
        case "UPDATE_VM_PROVIDER_FAILED":
            return {
                ...state,
                savedVmProvider: null,
                saveVmProviderLoading: false,
                saveVmProviderError: action.error
            };
        default:
            return state;
    }
}
