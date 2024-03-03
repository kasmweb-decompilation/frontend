export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_LDAP_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
    case "CREATE_LDAP_REQUESTED":
        return {
            ...state,
            createLdapLoading: true,
            createLdapError: null
        };
    case "CREATE_LDAP_SUCCESS": 
        return {
            ...state,
            errorCreateMessage: action.response && action.response.error_message ? action.response.error_message : null,
            createLdapLoading: false,
            createLdapError: null
        };
    case "CREATE_LDAP_FAILED":
        return {
            ...state,
            createLdapLoading: false,
            createLdapError: action.error
        };

    case "GET_LDAP_ID_REQUESTED":
        return {
            ...state,
            getLdapIdLoading: true,
            getLdapIdError: null
        };
    case "GET_LDAP_ID_SUCCESS": 
        return {
            ...state,
            ldap_config: action.response.ldap_config,
            getLdapIdLoading: false,
            getLdapIdError: null
        };
    case "GET_LDAP_ID_FAILED":
        return {
            ...state,
            getLdapIdLoading: false,
            getLdapIdError: action.error
        };    

    case "GET_LDAP_REQUESTED":
        return {
            ...state,
            getLdapLoading: true,
            getLdapError: null
        };
    case "GET_LDAP_SUCCESS": 
        return {
            ...state,
            ldap_configs: action.response.ldap_configs,
            getLdapLoading: false,
            getLdapError: null
        };
    case "GET_LDAP_FAILED":
        return {
            ...state,
            getLdapLoading: false,
            getLdapError: action.error
        };

    case "UPDATE_LDAP_REQUESTED":
        return {
            ...state,
            updateLdapLoading: true,
            updateLdapError: null
        };
    case "UPDATE_LDAP_SUCCESS": 
        return {
            ...state,
            errorUpdateMessage: action.response && action.response.error_message ? action.response.error_message : null,
            updateLdapLoading: false,
            updateLdapError: null
        };
    case "UPDATE_LDAP_FAILED":
        return {
            ...state,
            updateLdapLoading: false,
            updateLdapError: action.error
        };

    case "DELETE_LDAP_REQUESTED":
        return {
            ...state,
            deleteLdapLoading: true,
            deleteLdapError: null
        };
    case "DELETE_LDAP_SUCCESS": 
        return {
            ...state,
            deleteLdapLoading: false,
            deleteLdapErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
            deleteLdapError: null
        };
    case "DELETE_LDAP_FAILED":
        return {
            ...state,
            deleteLdapLoading: false,
            deleteLdapError: action.error
        };

    case "TEST_LDAP_CONFIG_REQUESTED":
        return {
            ...state,
            TestLdapConfigLoading: true,
            TestLdapConfigError: null
        };
    case "TEST_LDAP_CONFIG_SUCCESS": 
        return {
            ...state,
            TestLdapConfigLoading: false,
            TestLdapConfigErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
            TestLdapConfigError: null
        };
    case "TEST_LDAP_CONFIG_FAILED":
        return {
            ...state,
            TestLdapConfigLoading: false,
            TestLdapConfigError: action.error
        };    

    default:
        return state;
    }
}