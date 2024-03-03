export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_OIDC_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };
         case "REQUEST_OIDC_REQUESTED":
            return {
                ...state,
                oidcResponse: null,
                requestOidcLoading: true,
                requestOidcError: null,
            };
        case "REQUEST_OIDC_SUCCESS":
            return {
                ...state,
                oidcResponse: action.response && action.response.oidc || null,
                requestOidcLoading: false,
                requestOidcError: action.response && action.response.error_message || null,
                requestOidcErrorMessage: action.response && action.response.error_message || null,
            };
        case "REQUEST_OIDC_FAILED":
            return {
                ...state,
                oidcResponse: null,
                requestOidcLoading: false,
                requestOidcError: action.response
            };

        case "GET_OIDC_REQUESTED":
            return {
                ...state,
                oidc_configs: null,
                getOidcLoading: true,
                getOidcError: null
            };
        case "GET_OIDC_SUCCESS":
            return {
                ...state,
                oidc_configs: action.response && action.response.oidc_configs || null,
                getOidcLoading: false,
                getOidcErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_OIDC_FAILED":
            return {
                ...state,
                oidc_configs: null,
                getOidcLoading: false,
                getOidcError: action.response
            };
        

        case "CREATE_OIDC_REQUESTED":
            return {
                ...state,
                createdOidc: null,
                createOidcLoading: true,
                createOidcError: null
            };
        case "CREATE_OIDC_SUCCESS":
            return {
                ...state,
                createdOidc: action.response && action.response.oidc_config || null,
                createOidcLoading: false,
                createOidcError: action.response && action.response.error_message || null,
            };
        case "CREATE_OIDC_FAILED":
            return {
                ...state,
                createdOidc: null,
                createOidcLoading: false,
                createOidcError: action.response
            };

        case "DELETE_OIDC_REQUESTED":
            return {
                ...state,
                deletedOidc: null,
                deleteOidcLoading: true,
                deleteOidcError: null
            };
        case "DELETE_OIDC_SUCCESS":
            return {
                ...state,
                deletedOidc: action.response && action.response.oidc_config || null,
                deleteOidcLoading: false,
                deleteOidcErrorMessage: action.response && action.response.error_message || null,
            };
        case "DELETE_OIDC_FAILED":
            return {
                ...state,
                deletedOidc: null,
                deleteOidcLoading: false,
                deleteOidcError: action.response
            };

        case "UPDATE_OIDC_REQUESTED":
            return {
                ...state,
                updatedOidc: null,
                updateOidcLoading: true,
                updateOidcError: null
            };
        case "UPDATE_OIDC_SUCCESS":
            return {
                ...state,
                updatedOidc: action.response && action.response.oidc_config || null,
                updateOidcLoading: false,
                updateOidcError: action.response && action.response.error_message || null,
            };
        case "UPDATE_OIDC_FAILED":
            return {
                ...state,
                updatedOidc: null,
                updateOidcLoading: false,
                updateOidcError: action.response
            };


        default:
            return state;
    }
}