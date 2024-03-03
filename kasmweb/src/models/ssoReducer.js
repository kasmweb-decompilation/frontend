import { clearLocalStorage } from "../utils/helpers";

export default function (state = [], action={}) {
    switch (action.type) {
        case "SAML_LOGIN_REQUESTED":
            return{
                ...state,
                getSsoLoading: true
            };
        case "SAML_LOGIN_SUCCESS":
            if(action.response.error_message) {
                window.localStorage.removeItem("user_info");
                return {
                    ...state,
                    sso_error_message: action.response.error_message ? action.response.error_message : null
                }
            }
            var old_info = JSON.parse(window.localStorage.getItem("user_info"));
            old_info.username = action.response.username;
            old_info.token = action.response.token;
            old_info.role = action.response.role;
            old_info.user_id = action.response.user_id;
            old_info.is_anonymous = action.response.is_anonymous;
            old_info.dashboard_redirect = action.response.dashboard_redirect;
            old_info.require_subscription = action.response.require_subscription;
            old_info.has_subscription = action.response.has_subscription;
            old_info.has_plan = action.response.has_plan;
            old_info.display_ui_errors = action.response.display_ui_errors;
            old_info.program_data = action.response.program_data;
            old_info.authorized_views = action.response.authorized_views;
            window.localStorage.setItem("user_info", JSON.stringify(old_info));
            return{
                ...state,
                auto_login_kasm: action.response.auto_login_kasm,
                sso_error_message: action.response.error_message ? action.response.error_message : null,
                sso_enabled: action.response.sso,
                getSsoLoading: false
            };
        case "SAML_LOGIN_FAILED":
                window.localStorage.removeItem("user_info");
            return{
                ...state,
                getSsoLoading: false
            };
        default:
            return state;
    }
}