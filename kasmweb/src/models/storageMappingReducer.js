export default function (state={}, action={}) {
    switch (action.type) {

    case "GET_STORAGE_MAPPINGS_REQUESTED":
        return {
            ...state,
        };
    case "GET_STORAGE_MAPPINGS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            storageMappings: action.response.storage_mappings,
        };
    case "GET_STORAGE_MAPPINGS_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

    case "GET_AVAILABLE_STORAGE_PROVIDERS_REQUESTED":
        return {
            ...state,
        };
    case "GET_AVAILABLE_STORAGE_PROVIDERS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            storageProviders: action.response.storage_providers,
        };
    case "GET_AVAILABLE_STORAGE_PROVIDERS_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

    case "DELETE_STORAGE_MAPPINGS_REQUESTED":
        return {
            ...state,
            failureMessage: null,
        };
    case "DELETE_STORAGE_MAPPINGS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'storage mapping successfully deleted'
        };
    case "DELETE_STORAGE_MAPPINGS_FAILED":
        return {
            ...state,
            failureMessage: action.error
        }

    case "CREATE_STORAGE_MAPPINGS_REQUESTED":
        return {
            ...state,
            failureMessage: null,
            redirectUrl: null
        };
    case "CREATE_STORAGE_MAPPINGS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'Storage mapping successfully created',
            redirectUrl: action.response.url,
        };
    case "CREATE_STORAGE_MAPPINGS_FAILED":
        return {
            ...state,
            failureMessage: action.error,
        };
    case "UPDATE_STORAGE_MAPPINGS_REQUESTED":
        return {
            ...state,
            failureMessage: null,
            redirectUrl: null
        };
    case "UPDATE_STORAGE_MAPPINGS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'storage mapping successfully update',
            redirectUrl: action.response.url,
        };
    case "UPDATE_STORAGE_MAPPINGS_FAILED":
        return {
            ...state,
            failureMessage: action.error,
        };

    default:
        return state;
    }
}