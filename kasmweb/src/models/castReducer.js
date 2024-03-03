export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_CAST_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };
         case "REQUEST_CAST_REQUESTED":
            return {
                ...state,
                castResponse: null,
                requestCastLoading: true,
                requestCastError: null,
                castBrandingResponse: null
            };
        case "REQUEST_CAST_SUCCESS":
            console.log(action.response.error_message)
            return {
                ...state,
                castResponse: action.response && action.response.cast || null,
                castBrandingResponse: action.response && action.response.branding || null,
                castLaunchResponse: action.response && action.response.launch_config || null,
                requestCastLoading: false,
                requestCastError: action.response && action.response.error_message || null,
                requestCastErrorMessage: action.response && action.response.error_message || null,
                requestCastRecaptchaSiteKey: action.response && action.response.google_recaptcha_site_key || null,

            };
        case "REQUEST_CAST_FAILED":
            return {
                ...state,
                castResponse: null,
                requestCastLoading: false,
                requestCastError: action.response
            };

        case "GET_CAST_REQUESTED":
            return {
                ...state,
                cast_configs: null,
                getCastLoading: true,
                getCastError: null
            };
        case "GET_CAST_SUCCESS":
            return {
                ...state,
                cast_configs: action.response && action.response.cast_configs || null,
                getCastLoading: false,
                getCastErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_CAST_FAILED":
            return {
                ...state,
                cast_configs: null,
                getCastLoading: false,
                getCastError: action.response
            };
        

        case "CREATE_CAST_REQUESTED":
            return {
                ...state,
                createdCast: null,
                createCastLoading: true,
                createCastError: null
            };
        case "CREATE_CAST_SUCCESS":
            return {
                ...state,
                createdCast: action.response && action.response.cast_config || null,
                createCastLoading: false,
                createCastError: action.response && action.response.error_message || null,
            };
        case "CREATE_CAST_FAILED":
            return {
                ...state,
                createdCast: null,
                createCastLoading: false,
                createCastError: action.response
            };

        case "DELETE_CAST_REQUESTED":
            return {
                ...state,
                deletedCast: null,
                deleteCastLoading: true,
                deleteCastError: null
            };
        case "DELETE_CAST_SUCCESS":
            return {
                ...state,
                deletedCast: action.response && action.response.cast_config || null,
                deleteCastLoading: false,
                deleteCastErrorMessage: action.response && action.response.error_message || null,
            };
        case "DELETE_CAST_FAILED":
            return {
                ...state,
                deletedCast: null,
                deleteCastLoading: false,
                deleteCastError: action.response
            };

        case "UPDATE_CAST_REQUESTED":
            return {
                ...state,
                updatedCast: null,
                updateCastLoading: true,
                updateCastError: null
            };
        case "UPDATE_CAST_SUCCESS":
            return {
                ...state,
                updatedCast: action.response && action.response.cast_config || null,
                updateCastLoading: false,
                updateCastError: action.response && action.response.error_message || null,
            };
        case "UPDATE_CAST_FAILED":
            return {
                ...state,
                updatedCast: null,
                updateCastLoading: false,
                updateCastError: action.response
            };


        default:
            return state;
    }
}