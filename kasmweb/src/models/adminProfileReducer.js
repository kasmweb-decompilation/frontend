export default function (state={}, action={}) {
    switch (action.type) {
    case "GET_ADMIN_PROFILE_REQUESTED":
        return {
            ...state,
            getUserLoading: true,
            getUserError: null
        };
    case "GET_ADMIN_PROFILE_SUCCESS":
        return {
            ...state,
            user: action.response.user,
            getUserLoading: false,
            getUsersError: null
        };
    case "GET_ADMIN_PROFILE_FAILED":
        return {
            ...state,
            getUserLoading: false,
            getUserError: action.error
        };

    case "SET_ADMIN_PASSWORD_REQUESTED":
        return {
            ...state,
            setAdminPasswordLoading: true,
            setAdminPasswordUserError: null
        };
    case "SET_ADMIN_PASSWORD_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessage: action.response.error_message,
                setAdminPasswordLoading: false,
                setAdminPasswordUserError: null
            };
        }
        else {
            return {
                ...state,
                setAdminPasswordLoading: false,
                setAdminPasswordUserError: null
            };
        }
    case "SET_ADMIN_PASSWORD_FAILED":
        return {
            ...state,
            setAdminPasswordLoading: false,
            setAdminPasswordUserError: action.error
        };
    default:
        return state;
    }
}