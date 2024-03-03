export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_STAGING_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo,
        }; 
        case "GET_STAGING_REQUESTED":
            return {
                ...state,
                staging_configs: null,
                getStagingLoading: true,
                getStagingError: null
            };
        case "GET_STAGING_SUCCESS":
            return {
                ...state,
                staging_configs: action.response && action.response.staging_configs || null,
                getStagingLoading: false,
                getStagingErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_STAGING_FAILED":
            return {
                ...state,
                staging_configs: null,
                getStagingLoading: false,
                getStagingError: action.response
            };
        

        case "CREATE_STAGING_REQUESTED":
            return {
                ...state,
                createdStaging: null,
                createStagingLoading: true,
                createStagingError: null
            };
        case "CREATE_STAGING_SUCCESS":
            return {
                ...state,
                createdStaging: action.response && action.response.staging_config || null,
                createStagingLoading: false,
                createStagingError: action.response && action.response.error_message || null,
            };
        case "CREATE_STAGING_FAILED":
            return {
                ...state,
                createdStaging: null,
                createStagingLoading: false,
                createStagingError: action.response
            };

        case "DELETE_STAGING_REQUESTED":
            return {
                ...state,
                deletedStaging: null,
                deleteStagingLoading: true,
                deleteStagingError: null
            };
        case "DELETE_STAGING_SUCCESS":
            return {
                ...state,
                deletedStaging: action.response && action.response.staging_config || null,
                deleteStagingLoading: false,
                deleteStagingErrorMessage: action.response && action.response.error_message || null,
            };
        case "DELETE_STAGING_FAILED":
            return {
                ...state,
                deletedStaging: null,
                deleteStagingLoading: false,
                deleteStagingError: action.response
            };

        case "UPDATE_STAGING_REQUESTED":
            return {
                ...state,
                updatedStaging: null,
                updateStagingLoading: true,
                updateStagingError: null
            };
        case "UPDATE_STAGING_SUCCESS":
            return {
                ...state,
                updatedStaging: action.response && action.response.staging_config || null,
                updateStagingLoading: false,
                updateStagingError: action.response && action.response.error_message || null,
            };
        case "UPDATE_STAGING_FAILED":
            return {
                ...state,
                updatedStaging: null,
                updateStagingLoading: false,
                updateStagingError: action.response
            };


        default:
            return state;
    }
}