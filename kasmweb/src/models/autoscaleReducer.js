export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_AUTOSCALE_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "GET_AUTOSCALE_REQUESTED":
            return {
                ...state,
                autoscale_configs: null,
                getAutoScaleLoading: true,
                getAutoScaleError: null
            };
        case "GET_AUTOSCALE_SUCCESS":
            return {
                ...state,
                autoscale_configs: action.response && action.response.autoscale_configs || null,
                getAutoScaleLoading: false,
                getAutoScaleErrorMessage: action.error || action.response.error_message,
            };
        case "GET_AUTOSCALE_FAILED":
            return {
                ...state,
                autoscale_configs: null,
                getAutoScaleLoading: false,
                getAutoScaleError: action.error
            };
        

        case "CREATE_AUTOSCALE_REQUESTED":
            return {
                ...state,
                savedAutoScale: null,
                saveAutoScaleLoading: true,
                saveAutoScaleError: null
            };
        case "CREATE_AUTOSCALE_SUCCESS":
            return {
                ...state,
                savedAutoScale: action.response && action.response.autoscale_config || null,
                saveAutoScaleLoading: false,
                saveAutoScaleError: action.error || action.response.error_message,
            };
        case "CREATE_AUTOSCALE_FAILED":
            return {
                ...state,
                savedAutoScale: null,
                saveAutoScaleLoading: false,
                saveAutoScaleError: action.error
            };

        case "DELETE_AUTOSCALE_REQUESTED":
            return {
                ...state,
                deletedAutoScale: null,
                deleteAutoScaleLoading: true,
                deleteAutoScaleError: null
            };
        case "DELETE_AUTOSCALE_SUCCESS":
            return {
                ...state,
                deletedAutoScale: action.response && action.response.autoscale_config || null,
                deleteAutoScaleLoading: false,
                deleteAutoScaleErrorMessage: action.error
            };
        case "DELETE_AUTOSCALE_FAILED":
            return {
                ...state,
                deletedAutoScale: null,
                deleteAutoScaleLoading: false,
                deleteAutoScaleError: action.response
            };

        case "UPDATE_AUTOSCALE_REQUESTED":
            return {
                ...state,
                savedAutoScale: null,
                saveAutoScaleLoading: true,
                saveAutoScaleError: null
            };
        case "UPDATE_AUTOSCALE_SUCCESS":
            return {
                ...state,
                savedAutoScale: action.response && action.response.autoscale_config || null,
                saveAutoScaleLoading: false,
                saveAutoScaleError: action.error || action.response.error_message,
            };
        case "UPDATE_AUTOSCALE_FAILED":
            return {
                ...state,
                savedAutoScale: null,
                saveAutoScaleLoading: false,
                saveAutoScaleError: action.error
            };


        default:
            return state;
    }
}