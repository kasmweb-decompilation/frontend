export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_ZONE_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };   
    case "CREATE_ZONE_REQUESTED":
        return {
            ...state,
            createZoneLoading: true,
            createZoneError: null
        };
    case "CREATE_ZONE_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorCreateMessage: action.response.error_message,
                createZoneLoading: false,
                createZoneError: action.response.error_message
            };
        }
        else {
            return {
                ...state,
                errorCreateMessage: null,
                createZoneLoading: false,
                createZoneError: null
            };
        }
    case "CREATE_ZONE_FAILED":
        return {
            ...state,
            createZoneLoading: false,
            createZoneError: action.error
        };

    case "GET_ZONES_REQUESTED":
        return {
            ...state,
            zones: null,
            getZonesLoading: true,
            getZonesError: null
        };
    case "GET_ZONES_SUCCESS": 
        return {
            ...state,
            zones: action.response.zones,
            getZonesLoading: false,
            getZonesError: null
        };
    case "GET_ZONES_FAILED":
        return {
            ...state,
            zones: null,
            getZonesLoading: false,
            getZonesError: action.error
        };

    case "UPDATE_ZONE_REQUESTED":
        return {
            ...state,
            updateZoneLoading: true,
            updateZoneError: null,
            errorUpdateMessage: null
        };
    case "UPDATE_ZONE_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorUpdateMessage: action.response.error_message,
                updateZoneLoading: false,
                updateZoneError: action.response.error_message
            };
        }
        else {
            return {
                ...state,
                errorUpdateMessage: null,
                updateZoneLoading: false,
                updateZoneError: null
            };
        }
    case "UPDATE_ZONE_FAILED":
        return {
            ...state,
            updateZoneLoading: false,
            updateZoneError: action.error
        };

    case "DELETE_ZONE_REQUESTED":
        return {
            ...state,
            deleteZoneLoading: true,
            deleteZoneError: null
        };
    case "DELETE_ZONE_SUCCESS":
        return {
            ...state,
            deleteZoneLoading: false,
            deleteZoneErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
            deleteZoneError: null
        };
    case "DELETE_ZONE_FAILED":
        return {
            ...state,
            deleteZoneLoading: false,
            deleteZoneError: action.error
        };
    default:
        return state;
    }
}