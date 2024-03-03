export default function (state={}, action={}) {
    switch (action.type) {
    case "GET_SETTINGS_REQUESTED":
        return {
            ...state,
            settings: null,
            getSettingsLoading: true,
            getSettingsError: null
        };
    case "GET_SETTINGS_SUCCESS":
        const settings = action.response.settings.map(setting => {
            if (setting.value === "True") setting.value = "true";
            if (setting.value === "False") setting.value = "false";
            return setting;
        });

        return {
            ...state,
            settings,
            getSettingsLoading: false,
            getSettingsError: null
        };
    case "GET_SETTINGS_FAILED":
        return {
            ...state,
            settings:null,
            getSettingsLoading: false,
            getSettingsError: action.error
        };

    case "UPDATE_SETTINGS_REQUESTED":
        return {
            ...state,
            updateSettingsLoading: true,
            updateSettingsError: null
        };
    case "UPDATE_SETTINGS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessage: action.response.error_message,
                updateSettingsLoading: false,
                updateSettingsError: null
            };
        }
        else {
            return {
                ...state,
                errorMessage: null,
                updateSettingsLoading: false,
                updateSettingsError: null
            };
        }
    case "UPDATE_SETTINGS_FAILED":
        return {
            ...state,
            updateSettingsLoading: false,
            updateSettingsError: action.error
        };
    default:
        return state;
    }
}