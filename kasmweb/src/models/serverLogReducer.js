export default function (state = [], action={}) {
    switch (action.type) {
        case "SERVER_LOG_REQUESTED":
            return {
                ...state,
            };
        case "SERVER_LOG_SUCCESS":
            return {
                ...state,
                serverLogErrorMessage: action.response && action.response.error_message || null,
            };
        case "SERVER_LOG_FAILED":
            return {
                ...state,
                serverLogError: action.response
            };

        default:
            return state;
    }
}