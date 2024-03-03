export default function (state={}, action={}) {
    switch (action.type) {
        case "SET_SAML_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };  
        case "GET_SSO__REQUESTED":
            return {
                ...state,
            };
        case "GET_SSO_SUCCESS":
            return {
                ...state,
                sso_url: action.response.url,
                sso_error_message: action.response && action.response.error_message ? action.response.error_message : null,
                sso_error: null
            };
        case "GET_SSO_FAILED":
            return {
                ...state,
                sso_error_message: action.response && action.response.error_message ? action.response.error_message : null,
                sso_error: action.error
            };
        case "SET_SAML_REQUESTED":
            return {
                ...state,
            };
        case "SET_SAML_SUCCESS":
            return {
                ...state,
                saml_set: action.response.saml_config,
                SamlErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
                SamlError: null
            };
        case "SET_SAML_FAILED":
            return {
                ...state,
                set_saml_error: action.response.error_message,
                SamlError: action.error
            };

        case "DELETE_SAML_REQUESTED":
            return {
                ...state,
                deleteSamlLoading: true,
                deleteSamlError: null
            };
        case "DELETE_SAML_SUCCESS":
            return {
                ...state,
                deleteSamlLoading: false,
                deleteSamlErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
                deleteSamlError: null
            };
        case "DELETE_SAML_FAILED":
            return {
                ...state,
                deleteSamlLoading: false,
                deleteSamlError: action.error
            };

        case "UPDATE_SAML_REQUESTED":
            return {
                ...state,
            };
        case "UPDATE_SAML_SUCCESS":
            return {
                ...state,
                saml_set: action.response.saml_config,
                update_saml_error_message: action.response && action.response.error_message ? action.response.error_message : null
            };
        case "UPDATE_SAML_FAILED":
            return {
                ...state,
                set_saml_error: action.response.error_message
            };
        case "GET_SAML_REQUESTED":
            return {
                ...state,
            };
        case "GET_SAML_SUCCESS":
            return {
                ...state,
                saml_config: action.response.saml_config
            };
        case "GET_SAML_FAILED":
            return {
                ...state,
                get_saml_error: action.response.error_message
            };
        case "GET_SAML_CONFIGS_REQUESTED":
            return {
                ...state,
                samlConfigLoading: true
            };
        case "GET_SAML_CONFIGS_SUCCESS":
            return {
                ...state,
                samlConfigLoading: false,
                saml_configs: action.response.saml_configs
            };
        case "GET_SAML_CONFIGS_FAILED":
            return {
                ...state,
                samlConfigLoading: false,
                get_saml_configs_error: action.response.error_message ? action.response.error_message : null
            };
        default:
            return state;
    }
}