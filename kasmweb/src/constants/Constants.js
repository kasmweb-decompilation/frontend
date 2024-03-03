let TOKEN = null;
let USER_NAME = null;
let USER_ID = null;
let IS_ANONYMOUS = null;
let REQUIRE_SUBSCRIPTION = null;
let HAS_SUBSCRIPTION = null;
let HAS_PLAN = null;
let DASHBOARD_REDIRECT = null;
let PROGRAM_DATA = null;
let DISPLAY_UI_ERRORS = null;
let ENABLE_UI_SERVER_LOGGING = null;

const reload = () => {
    TOKEN = null;
    USER_NAME = null;
    USER_ID = null;
    IS_ANONYMOUS = null;
    REQUIRE_SUBSCRIPTION = null;
    HAS_SUBSCRIPTION = null;
    HAS_PLAN = null;
    DASHBOARD_REDIRECT = null;
    PROGRAM_DATA = null;
    DISPLAY_UI_ERRORS = null;
    ENABLE_UI_SERVER_LOGGING = null;

    let userInfo = null;

    try {
        const userInfoData = window.localStorage.getItem("user_info");

        if (!userInfoData) {
            throw new Error(`No user info stored`);
        }

        userInfo = JSON.parse(userInfoData);
    } catch (e) {
        console.error(`Cannot parse user info. ${e.message}`);
        return;
    }

    TOKEN = userInfo.token;
    USER_NAME = userInfo.username;
    USER_ID = userInfo.user_id;
    IS_ANONYMOUS = userInfo.is_anonymous;
    REQUIRE_SUBSCRIPTION = userInfo.require_subscription;
    HAS_SUBSCRIPTION = userInfo.has_subscription;
    HAS_PLAN = userInfo.has_plan;
    DASHBOARD_REDIRECT = userInfo.dashboard_redirect;
    PROGRAM_DATA = userInfo.program_data;
    DISPLAY_UI_ERRORS = userInfo.display_ui_errors;
    ENABLE_UI_SERVER_LOGGING = userInfo.enable_ui_server_logging;

}

const STRIP_DATA = {
    "allow_card_payment": false,
    "subscription_required": false,
    "allow_uploads": true,
    "allow_downloads": true,
    "allow_clipboard": true,
    "invite_only": true,
    "stripe_public_api_key": "pk_test_Q8aGzRsKZQVACZmBw562Dcbh",
    "google_recaptcha_public_key": "6Le5qy4UAAAAAGSsuiAYVhAm4b_YlKFTIeTgch2e",
    "welcome_message": "Welcome to Kasm. Click Desktop to enter your Kasm Desktop. The control panel will be on the left. When you are finished, you can chose to destroy your desktop or logout to preserve it. Your desktop will be preserved for up to 1 hour."
};

export default function stopReload(e) {
    console.trace("Prevent Reload/Navigation");
    e.preventDefault();
    e.returnValue = '';
}

reload();

export {
    reload,
    USER_NAME,
    IS_ANONYMOUS,
    REQUIRE_SUBSCRIPTION,
    HAS_SUBSCRIPTION,
    HAS_PLAN,
    DASHBOARD_REDIRECT,
    USER_ID,
    TOKEN,
    STRIP_DATA,
    PROGRAM_DATA,
    DISPLAY_UI_ERRORS,
    ENABLE_UI_SERVER_LOGGING,
};