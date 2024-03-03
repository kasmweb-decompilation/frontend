export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_PHYSICAL_TOKEN_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };
        case "GET_PHYSICAL_TOKENS_REQUESTED":
            return {
                ...state,
                physical_tokens: null,
                getPhysicalTokenLoading: true,
                getPhysicalTokenError: null
            };
        case "GET_PHYSICAL_TOKENS_SUCCESS":
            return {
                ...state,
                physical_tokens: action.response && action.response.physical_tokens || null,
                getPhysicalTokenLoading: false,
                getPhysicalTokenErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_PHYSICAL_TOKENS_FAILED":
            return {
                ...state,
                physical_tokens: null,
                getPhysicalTokenLoading: false,
                getPhysicalTokenError: action.response
            };
        

        case "UPLOAD_PHYSICAL_TOKENS_REQUESTED":
            return {
                ...state,
                uploadedPhysicalToken: null,
                createPhysicalTokenLoading: true,
                createPhysicalTokenError: null
            };
        case "UPLOAD_PHYSICAL_TOKENS_SUCCESS":
            return {
                ...state,
                uploadedPhysicalToken: action.response && action.response.PhysicalToken_config || null,
                uploadPhysicalTokenLoading: false,
                uploadPhysicalTokenError: action.response && action.response.error_message || null,
            };
        case "UPLOAD_PHYSICAL_TOKENS_FAILED":
            return {
                ...state,
                uploadedPhysicalToken: null,
                uploadPhysicalTokenLoading: false,
                uploadPhysicalTokenError: action.response
            };

        case "DELETE_PHYSICAL_TOKEN_REQUESTED":
            return {
                ...state,
                deletedPhysicalToken: null,
                deletePhysicalTokenLoading: true,
                deletePhysicalTokenError: null
            };
        case "DELETE_PHYSICAL_TOKEN_SUCCESS":
            return {
                ...state,
                deletedPhysicalToken: action.response && action.response.tokens_deleted || null,
                deletePhysicalTokenLoading: false,
                deletePhysicalTokenErrorMessage: action.response && action.response.error_message || null,
            };
        case "DELETE_PHYSICAL_TOKEN_FAILED":
            return {
                ...state,
                deletedPhysicalToken: null,
                deletePhysicalTokenLoading: false,
                deletePhysicalTokenError: action.response
            };

        case "UNASSIGN_PHYSICAL_TOKEN_REQUESTED":
            return {
                ...state,
                updatedPhysicalToken: null,
                updatePhysicalTokenLoading: true,
                updatePhysicalTokenError: null
            };
        case "UNASSIGN_PHYSICAL_TOKEN_SUCCESS":
            return {
                ...state,
                updatedPhysicalToken: action.response && action.response.physical_token || null,
                updatePhysicalTokenLoading: false,
                updatePhysicalTokenError: action.response && action.response.error_message || null,
            };
        case "UNASSIGN_PHYSICAL_TOKEN_FAILED":
            return {
                ...state,
                updatedPhysicalToken: null,
                updatePhysicalTokenLoading: false,
                updatePhysicalTokenError: action.response
            };

        case "ASSIGN_PHYSICAL_TOKEN_REQUESTED":
            return {
                ...state,
                updatedPhysicalToken: null,
                updatePhysicalTokenLoading: true,
                updatePhysicalTokenError: null
            };
        case "ASSIGN_PHYSICAL_TOKEN_SUCCESS":
                return {
                    ...state,
                    updatedPhysicalToken: action.response && action.response.physical_token || null,
                    updatePhysicalTokenLoading: false,
                    updatePhysicalTokenError: action.response && action.response.error_message || null,
                };
        case "ASSIGN_PHYSICAL_TOKEN_FAILED":
                return {
                    ...state,
                    updatedPhysicalToken: null,
                    updatePhysicalTokenLoading: false,
                    updatePhysicalTokenError: action.response
                };


        default:
            return state;
    }
}