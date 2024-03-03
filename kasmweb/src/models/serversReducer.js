export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_AGENT_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
    case "GET_SERVERS_REQUESTED":
        return {
            ...state,
            servers: null,
            getServersLoading: true,
            getServersError: null
        };
    case "GET_SERVERS_SUCCESS":
        return {
            ...state,
            servers: action.response.servers,
            getServersLoading: false,
            getServersError: null
        };
    case "GET_SERVERS__FAILED":
        return {
            ...state,
            servers:null,
            getServersLoading: false,
            getServersError: action.error
        };
    case "UPDATE_SERVER_REQUESTED":
        return {
            ...state,
            updateServerLoading: true,
            updateServerError: null
        };
    case "UPDATE_SERVER_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                updateErrorServerMessage: action.response.error_message,
                updateServerLoading: false,
                updateServerError: null
            };
        }
        else {
            return {
                ...state,
                updateErrorServerMessage: action.response && action.response.error_message ? action.response.error_message : null,
                updateServerLoading: false,
                updateServerError: null
            };
        }
    case "UPDATE_SERVER_FAILED":
        return {
            ...state,
            updateServerLoading: false,
            updateServerError: action.error
        };
    case "DELETE_SERVERS_REQUESTED":
        return {
            ...state,
            deleteServerLoading: true,
            deleteServerError: null,
            deleteServerErrorMessage: null
        };
    case "DELETE_SERVERS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                deleteServerErrorMessage: action.response.error_message,
                deleteServerLoading: false,
                deleteServerError: null
            };
        }
        else {
            return {
                ...state,
                deleteServerLoading: false,
                deleteServerError: null
            };
        }
    case "DELETE_SERVERS_FAILED":
        return {
            ...state,
            deleteServerLoading: false,
            deleteServerError: action.error
        };

    case "DESTROY_AGENT_KASMS_REQUESTED":
        return {
            ...state,
            destroyAgentKasmsLoading: true,
            destroyAgentKasmsError: null
        };

    case "DESTROY_AGENT_KASMS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                destroyAgentKasmsErrorMessage: action.response.error_message,
                deleteServerLoading: false,
                destroyAgentKasmsError: true
            };
        }
        else {
            return {
                ...state,
                destroyAgentKasmsLoading: false,
                destroyAgentKasmsError: null
            };
        }
    case "DESTROY_AGENT_KASMS_FAILED":
        return {
            ...state,
            destroyAgentKasmsLoading: false,
            destroyAgentKasmsError: action.error
        };
    default:
        return state;
    }
}