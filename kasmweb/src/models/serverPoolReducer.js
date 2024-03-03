export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_SERVER_POOL_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
    case "GET_SERVER_POOLS_REQUESTED":
        return {
            ...state,
            server_pools: null,
            getServerPoolsLoading: true,
            getServerPoolsError: null
        };
    case "GET_SERVER_POOLS_SUCCESS":
        return {
            ...state,
            server_pools: action.response.server_pools,
            getServerPoolsLoading: false,
            getServerPoolsError: action.error || action.response.error_message
        };
    case "GET_SERVER_POOLS_FAILED":
        return {
            ...state,
            server_pools:null,
            getServerPoolsLoading: false,
            getServerPoolsError: action.error
        };
    case "SAVE_SERVER_POOL_REQUESTED":
        return {
            ...state,
            saveServerPoolLoading: true,
            saveServerPoolError: null
        };
    case "SAVE_SERVER_POOL_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                saveErrorServerPoolMessage: action.response.error_message,
                saveServerPoolLoading: false,
                saveServerPoolError: action.error || action.response.error_message
            };
        }
        else {
            return {
                ...state,
                saveErrorServerPoolMessage: action.response && action.response.error_message ? action.response.error_message : null,
                savedServerPool: action.response && action.response.server_pool || null,
                saveServerPoolLoading: false,
                saveServerPoolError: action.error || action.response.error_message
            };
        }
    case "SAVE_SERVER_POOL_FAILED":
        return {
            ...state,
            saveServerPoolLoading: false,
            saveServerPoolError: action.error
        };
    case "DELETE_SERVER_POOL_REQUESTED":
        return {
            ...state,
            deleteServerLoading: true,
            deleteServerError: null
        };
    case "DELETE_SERVER_POOL_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                deleteServerErrorMessage: action.response.error_message,
                deleteServerLoading: false,
                deleteServerError: action.error || action.response.error_message
            };
        }
        else {
            return {
                ...state,
                deleteServerLoading: false,
                deleteServerError: null
            };
        }
    case "DELETE_SERVER_POOL_FAILED":
        return {
            ...state,
            deleteServerLoading: false,
            deleteServerError: action.error
        };

    default:
        return state;
    }
}