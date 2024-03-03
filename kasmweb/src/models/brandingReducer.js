export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_BRANDING_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "GET_BRANDING_REQUESTED":
            return {
                ...state,
                branding_configs: null,
                getBrandingLoading: true,
                getBrandingError: null
            };
        case "GET_BRANDING_SUCCESS":
            return {
                ...state,
                branding_configs: action.response && action.response.branding_configs || null,
                getBrandingLoading: false,
                getBrandingErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_BRANDING_FAILED":
            return {
                ...state,
                branding_configs: null,
                getBrandingLoading: false,
                getBrandingError: action.response
            };
        

        case "CREATE_BRANDING_REQUESTED":
            return {
                ...state,
                createdBranding: null,
                createBrandingLoading: true,
                createBrandingError: null
            };
        case "CREATE_BRANDING_SUCCESS":
            return {
                ...state,
                createdBranding: action.response && action.response.branding_config || null,
                createBrandingLoading: false,
                createBrandingError: action.response && action.response.error_message || null,
            };
        case "CREATE_BRANDING_FAILED":
            return {
                ...state,
                createdBranding: null,
                createBrandingLoading: false,
                createBrandingError: action.response
            };

        case "DELETE_BRANDING_REQUESTED":
            return {
                ...state,
                deletedBranding: null,
                deleteBrandingLoading: true,
                deleteBrandingError: null
            };
        case "DELETE_BRANDING_SUCCESS":
            return {
                ...state,
                deletedBranding: action.response && action.response.branding_config || null,
                deleteBrandingLoading: false,
                deleteBrandingErrorMessage: action.response && action.response.error_message || null,
            };
        case "DELETE_BRANDING_FAILED":
            return {
                ...state,
                deletedBranding: null,
                deleteBrandingLoading: false,
                deleteBrandingError: action.response
            };

        case "UPDATE_BRANDING_REQUESTED":
            return {
                ...state,
                updatedBranding: null,
                updateBrandingLoading: true,
                updateBrandingError: null
            };
        case "UPDATE_BRANDING_SUCCESS":
            return {
                ...state,
                updatedBranding: action.response && action.response.branding_config || null,
                updateBrandingLoading: false,
                updateBrandingError: action.response && action.response.error_message || null,
            };
        case "UPDATE_BRANDING_FAILED":
            return {
                ...state,
                updatedBranding: null,
                updateBrandingLoading: false,
                updateBrandingError: action.response
            };


        default:
            return state;
    }
}