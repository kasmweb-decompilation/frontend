export default function (state={}, action={}) {
    switch (action.type) {
    case "GET_LICENSESTATUS_REQUESTED":
        return {
            ...state,
            license_info: null,
            getSystemInfoLoading: true,
            getSystemInfoError: null
        };
    case "GET_LICENSESTATUS_SUCCESS":
        return {
            ...state,
            license_info: action.response.license,
            getSystemInfoLoading: false,
            getSystemInfoError: null
        };
    case "GET_LICENSESTATUS_FAILED":
        return {
            ...state,
            license_info:null,
            getSystemInfoLoading: false,
            getSystemInfoError: action.error
        };
    default:
        return state;
    }
}