import { clearLocalStorage } from "../utils/helpers";
import {Redirect } from 'react-router-dom';


export default function (state = [], action={}) {
    switch (action.type) {
    case "CREATE_ACCOUNT_REQUESTED":
        return {
            ...state,
            createAccountSuccess: null,
            createAccountLoading: true,
            createAccountError: null
        };
    case "CREATE_ACCOUNT_SUCCESS":
        if(action.response.error_message){
            return {
                ...state,
                createAccountLoading: false,
                createAccountError: action.response.error_message
            };
        }

        return {
            ...state,
            createAccountSuccess: action.response.created,
            createAccountLoading: false,
            createAccountError: null
        };
     case "CREATE_ACCOUNT_FAILED":
        return {
            ...state,
            createAccountLoading: false,
            createAccountError: "Error during request. Please contact an administrator"
        };

    default:
        return state;
    }
}
