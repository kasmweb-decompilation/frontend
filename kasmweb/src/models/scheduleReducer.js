export default function (state={}, action={}) {
    switch (action.type) {

    case "GET_SCHEDULES_REQUESTED":
        return {
            ...state,
        };
    case "GET_SCHEDULES_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            schedules: action.response.schedules,
        };
    case "GET_SCHEDULES_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

    case "DELETE_SCHEDULE_REQUESTED":
        return {
            ...state,
            failureMessage: null,
        };
    case "DELETE_SCHEDULE_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'Schedule successfully deleted'
        };
    case "DELETE_SCHEDULE_FAILED":
        return {
            ...state,
            failureMessage: action.error
        }

    case "CREATE_SCHEDULE_REQUESTED":
        return {
            ...state,
            failureMessage: null,
            redirectUrl: null
        };
    case "CREATE_SCHEDULE_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'Schedule successfully created',
            redirectUrl: action.response.url,
        };
    case "CREATE_SCHEDULE_FAILED":
        return {
            ...state,
            failureMessage: action.error,
        };

    case "UPDATE_SCHEDULE_REQUESTED":
        return {
            ...state,
            failureMessage: null,
            redirectUrl: null
        };
    case "UPDATE_SCHEDULE_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'Schedule successfully updated',
            redirectUrl: action.response.url,
        };
    case "UPDATE_SCHEDULE_FAILED":
        return {
            ...state,
            failureMessage: action.error,
        };

    default:
        return state;
    }
}