export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_LICENSE_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };  
    case "GET_SYSTEMINFO_REQUESTED":
        return {
            ...state,
            system_info: null,
            getSystemInfoLoading: true,
            getSystemInfoError: null
        };
    case "GET_SYSTEMINFO_SUCCESS":
        return {
            ...state,
            system_info: action.response.system_info,
            getSystemInfoLoading: false,
            getSystemInfoError: null
        };
    case "GET_SYSTEMINFO_FAILED":
        return {
            ...state,
            system_info:null,
            getSystemInfoLoading: false,
            getSystemInfoError: action.error
        };
    case "GET_LICENSES_REQUESTED":
        return {
            ...state,
            licenses: null,
            getLicensesLoading: true,
            getLicensesError: null
        };
    case "GET_LICENSES_SUCCESS":
        return {
            ...state,
            licenses: action.response.licenses,
            getLicensesLoading: false,
            getLicensesError: null
        };
    case "GET_LICENSES_FAILED":
        return {
            ...state,
            licenses:null,
            getLicensesLoading: false,
            getLicensesError: action.error
        };
    case "ADD_LICENSE_REQUESTED":
        return {
            ...state,
            addImagesGroupsLoading: true,
            addImagesGroupsError: null
        };
    case "ADD_LICENSE_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorAddLicenseMessage: action.response.error_message,
                addLicenseLoading: false,
                addLicenseError: action.response.error_message
            };
        }
        else {
            return {
                ...state,
                addLicenseLoading: false,
                addLicenseError: null
            };
        }
    case "ADD_LICENSE_FAILED":
        return {
            ...state,
            addLicenseLoading: false,
            addLicenseError: action.error
        };
    case "DELETE_LICENSE_REQUESTED":
        return {
            ...state,
            deleteLicenseLoading: true,
            adeleteLicenseError: null
        };
    case "DELETE_LICENSE_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorDeleteLicenseMessage: action.response.error_message,
                deleteLicenseLoading: false,
                deleteLicenseError: action.response.error_message
            };
        }
        else {
            return {
                ...state,
                deleteLicenseLoading: false,
                deleteLicenseError: null
            };
        }
    case "DELETE_LICENSE_FAILED":
        return {
            ...state,
            deleteLicenseLoading: false,
            deleteLicenseError: action.error
        };
    case "EXPORT_SCHEMA_REQUESTED":
        return {
            ...state,
            schema: null,
            exportSchemaLoading: true,
            exportSchemaError: null
        };
    case "EXPORT_SCHEMA_SUCCESS":
        return {
            ...state,
            schema: action.response.schema,
            exportSchemaLoading: false,
            exportSchemaError: action.response.error_message || null
        };
    case "EXPORT_SCHEMA_FAILED":
        return {
            ...state,
            schema:null,
            exportSchemaLoading: false,
            exportSchemaError: action.error
        };

    case "EXPORT_DATA_REQUESTED":
        return {
            ...state,
            data: null,
            exportDataLoading: true,
            exportDataError: null
        };
    case "EXPORT_DATA_SUCCESS":
        return {
            ...state,
            data: action.response.data,
            exportDataLoading: false,
            exportDataError: action.response.error_message || null
        };
    case "EXPORT_DATA_FAILED":
        return {
            ...state,
            data:null,
            exportDataLoading: false,
            exportDataError: action.error
        };

    case "IMPORT_DATA_REQUESTED":
        return {
            ...state,
            data: null,
            importDataLoading: true,
            importDataError: null
        };
    case "IMPORT_DATA_SUCCESS":
        return {
            ...state,
            data: action.response.data,
            importDataLoading: false,
            importDataError: action.response.error_message || null
        };
    case "IMPORT_DATA_FAILED":
        return {
            ...state,
            data:null,
            importDataLoading: false,
            importDataError: action.error
        };
    default:
        return state;
    }
}