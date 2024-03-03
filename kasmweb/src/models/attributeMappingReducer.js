export default function (state = [], action={}) {
    switch (action.type) {
    case "ATTRIBUTE_FIELDS_REQUESTED":
        return {
            ...state,
        };
    case "ATTRIBUTE_FIELDS_SUCCESS":
        if(action.response.error_message){
            return {
                ...state,
                optMappings: action.response.fields
            };
        }
        return {
            ...state,
        };
     case "ATTRIBUTE_FIELDS_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

     case "CREATE_ATTRIBUTE_FIELD_REQUESTED":
        return {
            ...state,
        };

     case "CREATE_ATTRIBUTE_FIELD_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'Mapped attribute successfully created'
        };

     case "CREATE_ATTRIBUTE_FIELD_FAILED":
        return {
            ...state,
            failureMessage: action.error,
        };

     case "GET_MAPPED_FIELDS_REQUESTED":
        return {
            ...state,
        };

     case "GET_MAPPED_FIELDS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            attributeMapping: action.response.attribute_mappings
        };

     case "GET_MAPPED_FIELDS_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

     case "UPDATE_ATTRIBUTE_FIELD_REQUESTED":
        return {
            ...state,
        };

     case "UPDATE_ATTRIBUTE_FIELD_SUCCESS":
        return {
            ...state,
            successMessage: 'Mapped attribute successfully updated'
        };

     case "UPDATE_ATTRIBUTE_FIELD_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

     case "DELETE_MAPPED_FIELD_REQUESTED":
        return {
            ...state,
        };

     case "DELETE_MAPPED_FIELD_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                failureMessage: action.response.error_message,
            };
        }
        return {
            ...state,
            successMessage: 'Mapped attribute successfully deleted'
        };

     case "DELETE_MAPPED_FIELD_FAILED":
        return {
            ...state,
            failureMessage: action.error
        };

    default:
        return state;
    }
}