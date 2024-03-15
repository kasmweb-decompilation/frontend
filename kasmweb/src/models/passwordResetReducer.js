import { clearLocalStorage } from "../utils/helpers";
import { Redirect } from 'react-router-dom';


export default function (state = [], action={}) {
    switch (action.type) {
    case "RESET_EMAIL_REQUESTED":
        return {
            ...state,
            resetEmailSuccess: null,
            resetEmailLoading: true,
            resetEmailError: null
        };
    case "RESET_EMAIL_SUCCESS":
        if(action.response.error_message){
            return {
                ...state,
                resetEmailLoading: false,
                resetEmailError: action.response.error_message
            };
        }

        return {
            ...state,
            resetEmailSuccess: action.response.created,
            resetEmailLoading: false,
            resetEmailError: null
        };
     case "RESET_EMAIL_FAILED":
        return {
            ...state,
            resetEmailLoading: false,
            resetEmailError: "Error during request. Please contact an administrator"
        };

    case "PASSWORD_RESET_REQUESTED":
        return {
            ...state,
            resetEmailSuccess: null,
            resetEmailLoading: true,
            resetEmailError: null
        };
    case "PASSWORD_RESET_SUCCESS":
        if(action.response.error_message){
            return {
                ...state,
                passwordResetLoading: false,
                resetEmailError: action.response.error_message
            };
        }

        return {
            ...state,
            resetEmailSuccess: action.response.created,
            resetEmailLoading: false,
            resetEmailError: null
        };
     case "PASSWORD_RESET_FAILED":
        return {
            ...state,
            resetEmailLoading: false,
            resetEmailError: "Error during request. Please contact an administrator"
        };

    default:
        return state;
    }
}
