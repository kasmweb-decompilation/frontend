export default function (state = [], action={}) {
    switch (action.type) {

     case "CREATE_FILE_MAPPINGS_REQUESTED":
        return {
            ...state,
            failureMessage: null
        };

     case "CREATE_FILE_MAPPINGS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'File mapping successfully created'
        };

     case "CREATE_FILE_MAPPINGS_FAILED":
        return {
            ...state,
            failureMessage: action.error,
        };

     case "GET_FILE_MAPPINGS_REQUESTED":
        return {
            ...state,
        };

     case "GET_FILE_MAPPINGS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            fileMapping: action.response.file_mappings
        };

     case "GET_FILE_MAPPINGS_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

     case "DELETE_FILE_MAPPINGS_REQUESTED":
        return {
            ...state,
        };

     case "DELETE_FILE_MAPPINGS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'File mapping successfully deleted'
        };

     case "DELETE_FILE_MAPPINGS_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

    default:
        return state;
    }
}