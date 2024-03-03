export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_STORAGE_PROVIDER_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "GET_STORAGE_PROVIDER_REQUESTED":
            return {
                ...state,
                storage_providers: null,
                getStorageProviderLoading: true,
                getStorageProviderError: null
            };
        case "GET_STORAGE_PROVIDER_SUCCESS":
            return {
                ...state,
                storage_providers: action.response && action.response.storage_providers || null,
                getStorageProviderLoading: false,
                getStorageProviderError: action.error || action.response.error_message,
            };
        case "GET_STORAGE_PROVIDER_FAILED":
            return {
                ...state,
                storage_providers: null,
                createStorageProviderLoading: false,
                createStorageProviderError: action.error
            };
        case "CREATE_STORAGE_PROVIDER_REQUESTED":
            return {
                ...state,
                storage_providers: null,
                createStorageProviderLoading: true,
                createStorageProviderError: null
            };
        case "CREATE_STORAGE_PROVIDER_SUCCESS":
            return {
                ...state,
                storage_providers: action.response && action.response.storage_providers || null,
                createStorageProviderLoading: false,
                createStorageProviderError: action.error || action.response.error_message,
            };
        case "CREATE_STORAGE_PROVIDER_FAILED":
            return {
                ...state,
                storage_providers: null,
                createStorageProviderLoading: false,
                createStorageProviderError: action.error
            };

        case "UPDATE_STORAGE_PROVIDER_REQUESTED":
            return {
                ...state,
                storage_providers: null,
                updateStorageProviderLoading: true,
                updateStorageProviderError: null
            };
        case "UPDATE_STORAGE_PROVIDER_SUCCESS":
            return {
                ...state,
                storage_providers: action.response && action.response.storage_providers || null,
                updateStorageProviderLoading: false,
                updateStorageProviderError: action.error || action.response.error_message,
            };
        case "UPDATE_STORAGE_PROVIDER_FAILED":
            return {
                ...state,
                storage_providers: null,
                updateStorageProviderLoading: false,
                updateStorageProviderError: action.error
            };
        case "DELETE_STORAGE_PROVIDER_REQUESTED":
            return {
                ...state,
                deletedStorageProvider: null,
                deleteStorageProviderLoading: true,
                deleteStorageProviderError: null
            };
        case "DELETE_STORAGE_PROVIDER_SUCCESS":
            return {
                ...state,
                deletedStorageProvider: action.response && action.response.storage_provider || null,
                deleteStorageProviderLoading: false,
                deleteStorageProviderError: action.error || action.response.error_message || null,
                deleteStorageProviderErrorMessage: action.error || action.response.error_message || null,
            };
        case "DELETE_STORAGE_PROVIDER_FAILED":
            return {
                ...state,
                deletedStorageProvider: null,
                deleteStorageProviderLoading: false,
                deleteStorageProviderError: action.error
            };

        default:
            return state;
    }
}
