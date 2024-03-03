export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_MANAGER_PAGEINFO":
       return {
           ...state,
           pageSize:action.payload.pageSize,
           pageNo : action.payload.pageNo
       };
    case "GET_MANAGERS_REQUESTED":
        return {
            ...state,
            managers: null,
            getManagersLoading: true,
            getManagersError: null
        };
    case "GET_MANAGERS_SUCCESS":
        return {
            ...state,
            managers: action.response.managers,
            getManagersLoading: false,
            getManagersError: null
        };
    case "GET_MANAGERS__FAILED":
        return {
            ...state,
            managers:null,
            getManagersLoading: false,
            getManagersError: action.error
        };
    case "DELETE_MANAGERS_REQUESTED":
        return {
            ...state,
            deleteManagerLoading: true,
            deleteManagerError: null
        };
    case "DELETE_MANAGERS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                deleteManagerErrorMessage: action.response.error_message,
                deleteManagerLoading: false,
                deleteManagerError: null
            };
        }
        else {
            return {
                ...state,
                deleteManagerLoading: false,
                deleteManagerError: null
            };
        }
    case "DELETE_MANAGERS_FAILED":
        return {
            ...state,
            deleteManagerLoading: false,
            deleteManagerError: action.error
        };
    default:
        return state;
    }
}