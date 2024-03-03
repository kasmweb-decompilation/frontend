import { clearLocalStorage } from "../utils/helpers";
import {Redirect } from 'react-router-dom';


export default function (state = [], action={}) {
    switch (action.type) {
    case "RESET_PW_REQUESTED":
        return {
            ...state,
            isLoggedIn: false,
            loginLoading: true,
            sessionToken: null,
            loginError: null
        };
    case "RESET_PW_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                isLoggedIn: false,
                loginLoading: false,
                sessionToken: null,    
                loginError: action.response.error_message
            };
        }
        return {
            ...state,
            isLoggedIn: false,
            loginLoading: false,
            sessionToken: null,
            loginError: null
        };
    case "RESET_PW_FAILED":
        return {
            ...state,
            isLoggedIn: false,
            loginLoading: false,
            sessionToken: null,
            loginError: action.error
        };
 
    case "LOGIN_REQUESTED":
        return {
            ...state,
            hasResetPassword: false,
            isLoggedIn: false,
            loginLoading: true,
            sessionToken: null,
            loginError: null,
            webAuthnAuthenticationOptions: null,
            require2fa: false,
            setTwoFactor: false,
            twoFactorErrorMessage: null,
            webAuthnErrorMessage: null,
        };
    case "LOGIN_SUCCESS":
        if(action.response.reason && action.response.reason === 'expired_password'){
            return {
                ...state,
                hasResetPassword: true,
                isLoggedIn: false,
                loginLoading: false,
                sessionToken: action.response.token,
                loginError: null
            };

        }
        if(action.response.error_message){
            window.localStorage.removeItem("user_info");
            return {
                ...state,
                isLoggedIn: false,
                loginLoading: false,
                loginError: action.response.error_message
            };
        }

        //two factor check
        if (action.response.require_2fa) {
            return {
                ...state,
                require2fa: action.response.require_2fa,
                setTwoFactor: action.response.set_two_factor,
                isLoggedIn: false,
                loginLoading: false,
                sessionToken: action.response.token,
                loginError: null,
                allow_totp_2fa: action.response.allow_totp_2fa,
                allow_webauthn_2fa: action.response.allow_webauthn_2fa,
            };
        }
        if (action.response.webauthn_authentication_options) {
            return {
                ...state,
                webAuthnAuthenticationOptions: action.response.webauthn_authentication_options,
                request_id: action.response.request_id,
                isLoggedIn: false,
                loginLoading: false,
                sessionToken: action.response.token,
                loginError: null,
            }
        }
        var old_info = JSON.parse(window.localStorage.getItem("user_info"));
        old_info.token = action.response.token;
        old_info.role = action.response.role;
        old_info.user_id = action.response.user_id;
        old_info.is_anonymous = action.response.is_anonymous;
        old_info.dashboard_redirect = action.response.dashboard_redirect;
        old_info.require_subscription = action.response.require_subscription;
        old_info.has_subscription = action.response.has_subscription;
        old_info.has_plan = action.response.has_plan;
        old_info.display_ui_errors = action.response.display_ui_errors;
        old_info.enable_ui_server_logging = action.response.enable_ui_server_logging;
        old_info.program_data = action.response.program_data;
        old_info.authorized_views = action.response.authorized_views;

        window.localStorage.setItem("user_info", JSON.stringify(old_info));
        if (window.location.hash === "#/staticlogin") {
            window.location.href = ("/#/");
        }
        return {
            ...state,
            auto_login_kasm: action.response.auto_login_kasm,
            theme: action.response.theme,
            isLoggedIn: true,
            loginLoading: false,
            sessionToken: action.response.token,
            loginError: null
        };
     case "LOGIN__FAILED":
        window.localStorage.removeItem("user_info");
        // FIXME KASM-334 - This is a quick hack to catch redirections during logins for a customers in line CAC auth system
        //  fetch doesnt give access to the redirect location, so we force full page reload which will force another
        //  redirect that will be followed by the browser.
        if (action.error.response.is_redirect){
            window.location.reload(true);
        }
        return {
            ...state,
            isLoggedIn: false,
            sessionToken: null,
            loginLoading: false,
            loginError: "Error during request. Please contact an administrator"
        };

     case "AUTH_REQUESTED":
         return {
             ...state,
             twoFactorError: null,
             twoFactorErrorMessage: null,
         };
     case "AUTH_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                twoFactorErrorMessage: action.response.error_message,
                twoFactorError: null
            };
        }
        else {
            var old_info = JSON.parse(window.localStorage.getItem("user_info"));
            old_info.token = action.response.token;
            old_info.role = action.response.role;
            old_info.user_id = action.response.user_id;
            old_info.is_anonymous = action.response.is_anonymous;
            old_info.dashboard_redirect = action.response.dashboard_redirect;
            old_info.require_subscription = action.response.require_subscription;
            old_info.has_subscription = action.response.has_subscription;
            old_info.has_plan = action.response.has_plan;
            old_info.display_ui_errors = action.response.display_ui_errors;
            old_info.enable_ui_server_logging = action.response.enable_ui_server_logging;
            old_info.program_data = action.response.program_data;
            old_info.authorized_views = action.response.authorized_views;

            window.localStorage.setItem("user_info", JSON.stringify(old_info));
            return {
                ...state,
                auto_login_kasm: action.response.auto_login_kasm,
                isLoggedIn: true,
                twoFactorErrorMessage: null,
                twoFactorError: null
            };
        }
     case "AUTH_FAILED":
         return {
             ...state,
             logoutError: action.response.error_message
         };
    
    case "LOGOUT_REQUESTED":
        return {
            ...state,
            logoutLoading: true,
            logoutError: null
        }; 
    case "LOGOUT_SUCCESS":
        clearLocalStorage(action.logout_all);
        if (action.response && action.response.slo_url) {
            window.location = action.response.slo_url;
            return {
                ...state,
                logoutLoading: false,
                logoutError: null
            }
        }
        location.href = ("/#/staticlogin");
        location.reload(true);
        return {
            ...state,
            logoutLoading: false,
            logoutError: null
        };
    case "LOGOUT_SUCCESS_CONTROLLED":
        clearLocalStorage(action.logout_all);
        if (action.response && action.response.slo_url) {
            return {
                ...state,
                logoutLoading: false,
                logoutError: null
            }
        }
        return {
            ...state,
            logoutLoading: false,
            logoutError: null
        };

    case "LOGOUT_FAILED":   
        return {
            ...state,
            logoutLoading: false,
            logoutError: action.response ? action.response.error_message: null
        }; 

        
    case "GETNEWTOKEN_REQUESTED":    
        return{
            ...state,
            refreshTokenLoading: true,
            refreshTokenError: null,
        };
    case "GETNEWTOKEN_SUCCESS":
        if(action.response){
            let newToken = action.response.token;
            let old_info = JSON.parse(window.localStorage.getItem("user_info"));
            old_info.token = newToken;
            //window.localStorage.clear();
            old_info.require_subscription = action.response.require_subscription;
            old_info.has_subscription = action.response.has_subscription;
            old_info.has_plan = action.response.has_plan;
            old_info.authorized_views = action.response.authorized_views;
            window.localStorage.setItem("user_info", JSON.stringify(old_info));
        }
        return{
            ...state,
            refreshTokenLoading: false,
            sessionToken: action.response.token,
            refreshTokenError: null,
        };
    case "GETNEWTOKEN_FAILED":
        return{
            ...state,
            refreshTokenLoading: false,
            // refreshTokenError: action.response.error_message,
        };


    case "SET_SECRET_REQUESTED":
        return {
            ...state,
            setSecretError: null
        };
    case "SET_SECRET_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                setSecretErrorMessage: action.response.error_message,
                setSecretError: null
            };
        }
        else {
            return {
                ...state,
                generatedSecret: action.response.generated_secret,
                qrCode: action.response.qrcode,
                setSecretErrorMessage: null,
                setSecretError: null,
                authtype: 'soft',
            };
        }
    case "SET_SECRET_FAILED":
        return {
            ...state,
            setSecretErrorMessage: null,
            setSecretError: action.response
        };
    case "GET_SSO_STATUS_REQUESTED":
        return{
            ...state,
            getSsoLoading: true
        };
    case "GET_SSO_STATUS_SUCCESS":
        return{
            ...state,
            login_settings: action.response,
            getSsoLoading: false
        };
    case "GET_SSO_STATUS_FAILED":
        return{
            ...state,
            getSsoLoading: false
        };
    case "SLO_STATUS_REQUESTED":
        return{
            ...state,
            getSloLoading: true
        };
    case "SLO_STATUS_SUCCESS":
        clearLocalStorage();
        if (action.response.url) {
            window.location.href = action.response.url;
        } else
            window.location.href = "/#/staticlogin";
        return{
            ...state,
            slo_url: action.response.url,
            slo_error_message: action.response.error_message ? action.response.error_message : null,
            getSloLoading: false
        };
    case "SLO_STATUS_FAILED":
        clearLocalStorage();
        return{
            ...state,
            getSloLoading: false
        };
    case "WEBAUTHN_REGISTER_FINISH_SUCCESS":
        return{
            ...state,
            require2fa: false,
            setTwoFactor: false,
            isLoggedIn: false,
            loginLoading: false,
            loginError: null,
        }
    case "WEBAUTHN_AUTHENTICATE_SUCCESS":
            if(action.response && action.response.error_message){
                return {
                    ...state,
                    webAuthnErrorMessage: action.response.error_message,
                    webAuthnError: null
                };
            }
            else {
                var old_info = JSON.parse(window.localStorage.getItem("user_info"));
                old_info.token = action.response.token;
                old_info.role = action.response.role;
                old_info.user_id = action.response.user_id;
                old_info.is_anonymous = action.response.is_anonymous;
                old_info.dashboard_redirect = action.response.dashboard_redirect;
                old_info.require_subscription = action.response.require_subscription;
                old_info.has_subscription = action.response.has_subscription;
                old_info.has_plan = action.response.has_plan;
                old_info.display_ui_errors = action.response.display_ui_errors;
                old_info.enable_ui_server_logging = action.response.enable_ui_server_logging;
                old_info.program_data = action.response.program_data;
                old_info.authorized_views = action.response.authorized_views;
    
                window.localStorage.setItem("user_info", JSON.stringify(old_info));
                return {
                    ...state,
                    auto_login_kasm: action.response.auto_login_kasm,
                    isLoggedIn: true,
                    webAuthnErrorMessage: null,
                    webAuthnError: null
                };
            }
         case "WEBAUTHN_AUTHENTICATE_FAILED":
             return {
                 ...state,
                 logoutError: action.response.error_message
             };
    default:
        return state;
    }
}
