export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_USAGE_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
    case "SET_ADMIN_USAGE_PAGEINFO":
        return {
            ...state,
            adminUsagePageSize:action.payload.pageSize,
            adminUsagePageNo : action.payload.pageNo
        }; 
    case "SET_USER_PROFILE_PAGEINFO":
        return {
            ...state,
            userProfilePageSize:action.payload.pageSize,
            userProfilePageNo : action.payload.pageNo
        }; 
    case "GET_USER_REQUESTED":
        return {
            ...state,
            user: [],
            getUserLoading: true,
            getUserError: null
        };
    case "GET_USER_SUCCESS":
        return {
            ...state,
            user: action.response.user,
            getUserLoading: false,
            getUserError: null
        };
    case "GET_USER_FAILED":
        return {
            ...state,
            user: [],
            getUserLoading: false,
            getUserError: action.error
        };
        
    case "SET_USER_PASSWORD_REQUESTED":
        return {
            ...state,
            setUserPasswordLoading: true,
            setUserPasswordError: null
        };
    case "SET_USER_PASSWORD_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessage: action.response.error_message,
                setUserPasswordLoading: false,
                setUserPasswordError: null
            };
        }
        else {
            return {
                ...state,
                errorMessage: null,
                setUserPasswordLoading: false,
                setUserPasswordError: null
            };
        }
    case "SET_USER_PASSWORD_FAILED":
        return {
            ...state,
            setUserPasswordLoading: false,
            setUserPasswordError: action.error
        };

    case "GET_USER_ATTRIBUTES_REQUESTED":
        return {
            ...state,
            userattributes: [],
            getUserAttrLoading: true,
            getUserAttrError: null
        };
    case "GET_USER_ATTRIBUTES_SUCCESS":
        return {
            ...state,
            userattributes: action.response.user_attributes,
            getUserAttrLoading: false,
            getUserAttrError: null
        };
    case "GET_USER_ATTRIBUTES_FAILED":
        return {
            ...state,
            userattributes: [],
            getUserAttrLoading: false,
            getUserAttrError: action.error
        };

    case "UPDATE_USER_ATTRIBUTES_REQUESTED":
        return {
            ...state,
            updateUserAttrLoading: true,
            updateUserAttrError: null
        };
    case "UPDATE_USER_ATTRIBUTES_SUCCESS":
        return {
            ...state,
            updateUserErrorMessage: action.response.error_message,
            updateUserAttrLoading: false,
            updateUserAttrError: null
        };
    case "UPDATE_USER_ATTRIBUTES_FAILED":
        return {
            ...state,
            updateUserErrorMessage: action.response.error_message,
            updateUserAttrLoading: false,
            updateUserAttrError: action.error
        };

    case "GET_USAGE_DUMP_REQUESTED":
        return {
            ...state,
            usageDumpLoading: true,
            usageDump: null,
            usageDumpError: null
        };
    case "GET_USAGE_DUMP_SUCCESS":
        return {
            ...state,
            usageDump: action.response,
            usageDumpLoading: false,
            usageDumpError: action.response.error_message
        };
    case "GET_USAGE_DUMP_FAILED":
        return {
            ...state,
            usageDump: action.response,
            usageDumpLoading: false,
            usageDumpError: action.error
        };

    case "GET_USAGE_SUMMARY_REQUESTED":
        return {
            ...state,
            usageSummaryLoading: true,
            usageSummary: null,
            usageSummaryError: null
        };
    case "GET_USAGE_SUMMARY_SUCCESS":
        return {
            ...state,
            usageSummary: action.response,
            usageSummaryLoading: false,
            usageSummaryError: action.response.error_message
        };
    case "GET_USAGE_SUMMARY_FAILED":
        return {
            ...state,
            usageSummary: action.response,
            usageSummaryLoading: false,
            usageSummaryError: action.error
        };

    case "GET_SUBSCRIPTION_INFO_REQUESTED":
        return {
            ...state,
            subInfoLoading: true,
            subSummary: null,
            billingInfo: null,
            subInfoError: null
        };
    case "GET_SUBSCRIPTION_INFO_SUCCESS":
        return {
            ...state,
            subSummary: action.response.subscription_info,
            billingInfo: action.response.billing_info,
            subInfoLoading: false,
            subInfoError: action.response.error_message
        };
    case "GET_SUBSCRIPTION_INFO_FAILED":
        return {
            ...state,
            subSummary: action.response,
            billingInfo: null,
            subInfoLoading: false,
            subInfoError: action.error
        };

    case "CANCEL_SUBSCRIPTION_REQUESTED":
        return {
            ...state,
            cancelSubLoading: true,
            cancelSub: null,
            cancelSubError: null
        };
    case "CANCEL_SUBSCRIPTION_SUCCESS":
        return {
            ...state,
            cancelSub: action.response,
            cancelSubLoading: false,
            cancelSubError: action.response.error_message
        };
    case "CANCEL_SUBSCRIPTION_FAILED":
        return {
            ...state,
            cancelSub: action.response,
            cancelSubLoading: false,
            cancelSubError: action.error
        };

    case "GET_PRODUCTS_REQUESTED":
        return {
            ...state,
            getProductsLoading: true,
            productList: null,
            getProductsError: null
        };
    case "GET_PRODUCTS_SUCCESS":
        return {
            ...state,
            productList: action.response,
            getProductsLoading: false,
            getProductsError: action.response.error_message
        };
    case "GET_PRODUCTS_FAILED":
        return {
            ...state,
            productList: action.response,
            getProductsLoading: false,
            getProductsError: action.error
        };

    case "UPDATE_SUBSCRIPTION_REQUESTED":
        return {
            ...state,
            updateSubLoading: true,
            updateSub: null,
            updateSubError: null
        };
    case "UPDATE_SUBSCRIPTION_SUCCESS":
        return {
            ...state,
            updateSub: action.response,
            updateSubLoading: false,
            updateSubError: action.response.error_message
        };
    case "UPDATE_SUBSCRIPTION_FAILED":
        return {
            ...state,
            updateSub: action.response,
            updateSubLoading: false,
            updateSubError: action.error
        };

    case "UPDATE_PAYMENT_REQUESTED":
        return {
            ...state,
            updatePaymentLoading: true,
            updatePayment: null,
            updatePaymentError: null
        };
    case "UPDATE_PAYMENT_SUCCESS":
        return {
            ...state,
            updatePayment: action.response,
            updatePaymentLoading: false,
            updatePaymentError: action.response.error_message
        };
    case "UPDATE_PAYMENT_FAILED":
        return {
            ...state,
            updatePayment: action.response,
            updatePaymentLoading: false,
            updatePaymentError: action.error
        };

    case "RENEW_SUBSCRIPTION_REQUESTED":
        return {
            ...state,
            renewSubLoading: true,
            renewSub: null,
            renewSubError: null
        };
    case "RENEW_SUBSCRIPTION_SUCCESS":
        return {
            ...state,
            renewSub: action.response,
            renewSubLoading: false,
            renewSubError: action.response.error_message
        };
    case "RENEW_SUBSCRIPTION_FAILED":
        return {
            ...state,
            renewSub: action.response,
            renewSubLoading: false,
            renewSubError: action.error
        };


    case "CREATE_SUBSCRIPTION_REQUESTED":
        return {
            ...state,
            createSubLoading: true,
            createSub: null,
            createSubError: null
        };
    case "CREATE_SUBSCRIPTION_SUCCESS":
        return {
            ...state,
            createSub: action.response,
            createSubLoading: false,
            createSubError: action.response.error_message
        };
    case "CREATE_SUBSCRIPTION_FAILED":
        return {
            ...state,
            createSub: action.response,
            createSubLoading: false,
            createSubError: action.error
        };

    case "GET_LANGUAGES_REQUESTED":
        return {
            ...state,
            allLanguages: [],
            getLanguagesLoading: true,
            getLanguagesError: null
        };
    case "GET_LANGUAGES_SUCCESS":
        return {
            ...state,
            allLanguages: action.response.languages,
            getLanguagesLoading: false,
            getLanguagesError: null
        };
    case "GET_LANGUAGES_FAILED":
        return {
            ...state,
            allLanguages: [],
            getLanguagesLoading: false,
            getLanguagesError: action.error
        };

    case "GET_TIMEZONES_REQUESTED":
        return {
            ...state,
            allTimezones: [],
            getTimezonesLoading: true,
            getTimezonesError: null
        };
    case "GET_TIMEZONES_SUCCESS":
        return {
            ...state,
            allTimezones: action.response.timezones,
            getTimezonesLoading: false,
            getTimezonesError: null
        };
    case "GET_TIMEZONES_FAILED":
        return {
            ...state,
            allTimezones: [],
            getTimezonesLoading: false,
            getTimezonesError: action.error
        };
    case "GET_USERAUTHSETTINGS_REQUESTED":
        return {
            ...state,
            userAuthSettings: {},
            userAuthSettingsLoading: true,
            userAuthSettingsError: null
        };
    case "GET_USERAUTHSETTINGS_SUCCESS":
        return {
            ...state,
            userAuthSettings: action.response,
            userAuthSettingsLoading: false,
            userAuthSettingsError: null
        };
    case "GET_USERAUTHSETTINGS_FAILED":
        return {
            ...state,
            userAuthSettings: {},
            userAuthSettingsLoading: false,
            userAuthSettingsError: action.error
        };
    case "SET_SECRET_AUTHENTICATED_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
            };
        }
        else {
            return {
                ...state,
                generatedSecret: action.response.generated_secret,
                qrCode: action.response.qrcode,
                authtype: 'soft',
            };
        }
    case "SET_SECRET_AUTHENTICATED_FAILED":
        return {
            ...state,
            setSecretError: action.response
        };
    default:
        return state;
    }
}