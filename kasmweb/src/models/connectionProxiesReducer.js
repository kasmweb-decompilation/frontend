export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_CONNECTION_PROXY_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };   
    case "CREATE_CONNECTION_PROXY_REQUESTED":
        return {
            ...state,
            createConnectionProxyLoading: true,
            createConnectionProxyError: null
        };
    case "CREATE_CONNECTION_PROXY_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorCreateMessage: action.response.error_message,
                createConnectionProxyLoading: false,
                createConnectionProxyError: action.error || action.response.error_message
            };
        }
        else {
            return {
                ...state,
                errorCreateMessage: null,
                createConnectionProxyLoading: false,
                createConnectionProxyError: null
            };
        }
    case "CREATE_CONNECTION_PROXY_FAILED":
        return {
            ...state,
            createConnectionProxyLoading: false,
            createConnectionProxyError: action.error
        };

    case "GET_CONNECTION_PROXIES_REQUESTED":
        return {
            ...state,
            connection_proxies: null,
            getConnectionProxiesLoading: true,
            getConnectionProxiesError: null
        };
    case "GET_CONNECTION_PROXIES_SUCCESS":
        return {
            ...state,
            connection_proxies: action.response.connection_proxies,
            getConnectionProxiesLoading: false,
            getConnectionProxiesError: action.error || action.response.error_message
        };
    case "GET_CONNECTION_PROXIES_FAILED":
        return {
            ...state,
            connection_proxies: null,
            getConnectionProxiesLoading: false,
            getConnectionProxiesError: action.error
        };

    case "UPDATE_CONNECTION_PROXY_REQUESTED":
        return {
            ...state,
            updateConnectionProxyLoading: true,
            updateConnectionProxyError: null,
            errorUpdateMessage: null
        };
    case "UPDATE_CONNECTION_PROXY_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorUpdateMessage: action.response.error_message,
                updateConnectionProxyLoading: false,
                updateConnectionProxyError: action.error || action.response.error_message
            };
        }
        else {
            return {
                ...state,
                errorUpdateMessage: null,
                updateConnectionProxyLoading: false,
                updateConnectionProxyError: action.error || action.response.error_message
            };
        }
    case "UPDATE_CONNECTION_PROXY_FAILED":
        return {
            ...state,
            updateConnectionProxyLoading: false,
            updateConnectionProxyError: action.error
        };

    case "DELETE_CONNECTION_PROXY_REQUESTED":
        return {
            ...state,
            deleteConnectionProxyLoading: true,
            deleteConnectionProxyError: null
        };
    case "DELETE_CONNECTION_PROXY_SUCCESS":
        return {
            ...state,
            deleteConnectionProxyLoading: false,
            deleteConnectionProxyErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
            deleteConnectionProxyError: action.error || action.response.error_message
        };
    case "DELETE_CONNECTION_PROXY_FAILED":
        return {
            ...state,
            deleteConnectionProxyLoading: false,
            deleteConnectionProxyError: action.error
        };
    default:
        return state;
    }
}