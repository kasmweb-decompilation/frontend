export default function (state = {}, action = {}) {
    switch (action.type) {
    case "SET_ADMIN_USER_PAGEINFO":
       return {
           ...state,
           pageSize:action.payload.pageSize,
           pageNo : action.payload.pageNo
       };
    case "GET_ADMIN_USERS_REQUESTED":
        return {
            ...state,
            getUsersLoading: true,
            getUsersError: null
        };
    case "GET_ADMIN_USERS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessage: action.response.error_message,
                getUsersLoading: false,
                getUsersError: null
            };
        }
        else {
            return {
                ...state,
                users: action.response.users,
                usersPage: action.response.page,
                total: action.response.total,
                getUsersLoading: false,
                getUsersError: null
            };
        }
    case "GET_ADMIN_USERS_FAILED":
        return {
            ...state,
            getUsersLoading: false,
            getUsersError: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };
  
    case "GET_USER_ID_REQUESTED":
        return {
            ...state,
            getUserIdLoading: true,
            getUserIdError: null
        };
    case "GET_USER_ID_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorUserIdMessage: action.response.error_message,
                getUserIdLoading: false,
                getUserIdError: null
            };
        }
        else {
            return {
                ...state,
                user: action.response.user,
                getUserIdLoading: false,
                getUserIdError: null
            };
        }
    case "GET_USER_ID_FAILED":
        return {
            ...state,
            getUserIdLoading: false,
            getUserIdError: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };    
  
    case "CREATE_USER_REQUESTED":
        return {
            ...state,
            createUserLoading: true,
            createUsersError: null
        };
    case "CREATE_USER_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessage: action.response.error_message,
                createUserLoading: false,
                createUsersError: action.response.error_message
            };
        }
        else {
            return {
                ...state,
                createUsersLoading: false,
                createUsersError: null
            };
        }
    case "CREATE_USER_FAILED":
        return {
            ...state,
            createUsersLoading: false,
            createUsersError: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };
  
    case "RESET_PASSWORD_REQUESTED":
        return {
            ...state,
            resetPasswordLoading: true,
            resetPasswordError: null
        };
    case "RESET_PASSWORD_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorResetPasswordMessage: action.response.error_message,
                resetPasswordLoading: false,
                resetPasswordError: null
            };
        }            
        else {
            return {
                ...state,
                errorResetPasswordMessage: null,
                resetPasswordLoading: false,
                resetPasswordError: null
            };
        }
    case "RESET_PASSWORD_FAILED":
        return {
            ...state,
            resetPasswordLoading: false,
            resetPasswordError: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };
  
    case "UPDATE_USER_REQUESTED":
        return {
            ...state,
            updateUserLoading: true,
            updateUsersError: null
        };
        
    case "UPDATE_USER_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorUpdateMessage: action.response.error_message,
                updateUserLoading: false,
                updateUsersError: null
            };
        }
        else {
            return {
                ...state,
                updateUserLoading: false,
                updateUsersError: null
            };
        }
    case "UPDATE_USER_FAILED":
        return {
            ...state,
            updateUserLoading: false,
            updateUsersError: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };
  
    case "DELETE_USER_REQUESTED":
        return {
            ...state,
            deleteUserErrorMessage: null,
            deleteUserLoading: true,
            deleteUsersError: null
        };
    case "DELETE_USER_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                deleteUserErrorMessage: action.response.error_message,
                deleteUserLoading: false,
                deleteUsersError: null
            };
        } else {
            return {
                ...state,
                deleteUserErrorMessage: null,
                deleteUserLoading: false,
                deleteUsersError: null
            };
        }
    case "DELETE_USER_FAILED":
        return {
            ...state,
            deleteUserErrorMessage: null,
            deleteUserLoading: false,
            deleteUsersError: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };
        
    case "DELETE_USER_KASM_REQUESTED":
        return {
            ...state,
            deleteUserKasmErrorMessage: null,
            deleteUserKasmLoading: true,
            deleteUsersKasmError: null
        };
    case "DELETE_USER_KASM_SUCCESS":
        if(action.response && action.response.error_message){
            return{
                ...state,
                deleteUserKasmErrorMessage: action.response.error_message,
                deleteUserKasmLoading: false,
                deleteUsersKasmError: null
            };
        }else {
            return {
                ...state,
                deleteUserKasmErrorMessage: null,
                deleteUserKasmLoading: false,
                deleteUsersKasmError: null
            };
        }
    case "DELETE_USER_KASM_FAILED":
        return {
            ...state,
            deleteUserKasmErrorMessage: null,
            deleteUserKasmLoading: false,
            deleteUsersKasmError: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };
  
    case "GET_USAGE_DUMP_ADMIN_REQUESTED":
        return {
            ...state,
            usageDumpLoading: true,
            usageDump: null,
            usageDumpError: null
        };
    case "GET_USAGE_DUMP_ADMIN_SUCCESS":
        return {
            ...state,
            usageDump: action.response,
            usageDumpLoading: false,
            usageDumpError: action.response.error_message
        };
    case "GET_USAGE_DUMP_ADMIN_FAILED":
        return {
            ...state,
            usageDump: action.response,
            usageDumpLoading: false,
            usageDumpError: action.error
        };
  
    default:
        return state;
    }
  }