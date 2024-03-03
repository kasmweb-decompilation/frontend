export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_DEVELOPER_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "RESET_CREATEDAPI":
            return {
                ...state,
                createdApi: null
            }; 
    
        case "GET_APICONFIG_REQUESTED":
            return {
                ...state,
                apis: null,
                getAPILoading: true,
                getAPIError: null
            };
        case "GET_APICONFIG_SUCCESS":
            return {
                ...state,
                apis: action.response && action.response.api_configs || null,
                getAPILoading: false,
                getAPIErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_APICONFIG_FAILED":
            return {
                ...state,
                apis: null,
                getAPILoading: false,
                getAPIError: action.response
            };

        case "CREATE_APICONFIG_REQUESTED":
            return {
                ...state,
                createdApi: null,
                createAPILoading: true,
                createApiError: null
            };
        case "CREATE_APICONFIG_SUCCESS":
            return {
                ...state,
                createdApi: action.response && action.response.api_config || null,
                createAPILoading: false,
                createApiError: action.response && action.response.error_message || null,
            };
        case "CREATE_APICONFIG_FAILED":
            return {
                ...state,
                createdApi: null,
                createAPILoading: false,
                createApiError: action.response
            };

        case "DELETE_APICONFIG_REQUESTED":
            return {
                ...state,
                deletedApi: null,
                deleteAPILoading: true,
                deleteApiError: null
            };
        case "DELETE_APICONFIG_SUCCESS":
            return {
                ...state,
                deletedApi: action.response && action.response.api_config || null,
                deleteAPILoading: false,
                deleteApiErrorMessage: action.response && action.response.error_message || null,
            };
        case "DELETE_APICONFIG_FAILED":
            return {
                ...state,
                deletedApi: null,
                deleteAPILoading: false,
                deleteApiError: action.response
            };

        case "UPDATE_APICONFIG_REQUESTED":
            return {
                ...state,
                updatedApi: null,
                updateAPILoading: true,
                updateApiError: null
            };
        case "UPDATE_APICONFIG_SUCCESS":
            return {
                ...state,
                updatedApi: action.response && action.response.api_config || null,
                updateAPILoading: false,
                updateApiError: action.response && action.response.error_message || null,
            };
        case "UPDATE_APICONFIG_FAILED":
            return {
                ...state,
                updatedApi: null,
                updateAPILoading: false,
                updateApiError: action.response
            };

            case "GET_PERMISSIONS_API_REQUESTED":
                return {
                    ...state,
                    getPermissionsLoading: true
                };
            case "GET_PERMISSIONS_API_SUCCESS": 
                if(action.response && action.response.error_message){
                    return {
                        ...state,
                        errorMessagePermissions: action.response.error_message,
                        getPermissionsApiError: null,
                        getPermissionsLoading: false
                    };
                }
                else {
                    return {
                        ...state,
                        permissions: action.response.permissions,
                        getPermissionsApiError: null,
                        getPermissionsLoading: false
                    };
                }
            case "GET_PERMISSIONS_API_FAILED":
                return {
                    ...state,
                    getPermissionsApiError: action.error,
                    getPermissionsLoading: false
                };
        
            case "REMOVE_PERMISSIONS_API_REQUESTED":
                return {
                    ...state,
                };
            case "REMOVE_PERMISSIONS_API_SUCCESS": 
                if(action.response && action.response.error_message){
                    return {
                        ...state,
                        errorMessageAllPermissions: action.response.error_message,
                    };
                }
                else {
                    return {
                        ...state,
                    };
                }
            case "REMOVE_PERMISSIONS_API_FAILED":
                return {
                    ...state,
                };
        

        default:
            return state;
    }
}