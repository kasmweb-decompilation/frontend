export default function (state={}, action={}) {
    switch (action.type) {
        case "SET_GROUP_USER_PAGEINFO":
        return {
            ...state,
            userPageSize:action.payload.pageSize,
            userPageNo : action.payload.pageNo
        }; 
        case "SET_GROUP_SETTING_PAGEINFO":
        return {
            ...state,
            settingPageSize:action.payload.pageSize,
            settingPageNo : action.payload.pageNo
        }; 
        case "SET_GROUP_IMAGE_PAGEINFO":
        return {
            ...state,
            imagePageSize:action.payload.pageSize,
            imagePageNo : action.payload.pageNo
        };
        case "SET_GROUP_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        };

    case "GET_USERSIN_GROUP_REQUESTED":
        return {
            ...state,
            getUserGroupsLoading: true,
            getUserGroupsUserError: null
        };
    case "GET_USERSIN_GROUP_SUCCESS": 
        return {
            ...state,
            users: action.response.users,
            total: action.response.total,
            getUserGroupsLoading: false,
            getUserGroupsError: null
        };
    case "GET_USERSIN_GROUP_FAILED":
        return {
            ...state,
            getUserGroupsLoading: false,
            getUserGroupsError: action.error
        };

    case "GET_GROUPS_REQUESTED":
        return {
            ...state,
            getGroupsLoading: true,
            getGroupsError: null
        };
    case "GET_GROUPS_SUCCESS": 
        return {
            ...state,
            groups: action.response.groups,
            getGroupsLoading: false,
            getGroupsError: null
        };
    case "GET_GROUPS_FAILED":
        return {
            ...state,
            getGroupsLoading: false,
            getGroupsError: action.error
        };

    case "UPDATE_GROUPS_REQUESTED":
        return {
            ...state,
            updateGroupsLoading: true,
            errorMessage: null
        };
    case "UPDATE_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessage: action.response.error_message,
                updateGroupsLoading: false,
            };
        }
        else {
            return {
                ...state,
                errorMessage: null,
                updateGroupsLoading: false,
            };
        }
    case "UPDATE_GROUPS_FAILED":
        return {
            ...state,
            updateGroupsLoading: false,
            errorMessage: action.error
        };
    
    case "ADD_USER_TO_GROUP_REQUESTED":
        return {
            ...state,
            addUserToGroupLoading: true,
            addUserToGroupGroupsError: null
        };
    case "ADD_USER_TO_GROUP_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessageAddUser: action.response.error_message,
                addUserToGroupLoading: false,
                addUserToGroupGroupsError: null
            };
        }
        else {
            return {
                ...state,
                errorMessageAddUser: null,
                addUserToGroupLoading: false,
                addUserToGroupGroupsError: null
            };
        }
    case "ADD_USER_TO_GROUP_FAILED":
        return {
            ...state,
            addUserToGroupLoading: false,
            addUserToGroupErrorMessage: null,
            addUserToGroupGroupsError: action.error
        };

    case "DELETE_USER_FROM_GROUP_REQUESTED":
        return {
            ...state,
            deleteUserFromGroupLoading: true,
            deleteUserFromGroupErrorMessage: null,
            deleteUserFomGroupGroupsError: null
        };
    case "DELETE_USER_FROM_GROUP_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessageDeleteUser: action.response.error_message,
                deleteUserFromGroupLoading: false,
                deleteUserFromGroupError: null
            };
        }
        else {
            return {
                ...state,
                deleteUserFromGroupLoading: false,
                deleteUserFomGroupGroupsError: null
            };
        }
    case "DELETE_USER_FROM_GROUP_FAILED":
        return {
            ...state,
            deleteUserFromGroupLoading: false,
            deleteUserFromGroupErrorMessage: null,
            deleteUserFomGroupGroupsError: action.error
        };

    case "CREATE_GROUP_REQUESTED":
        return {
            ...state,
            createGroupsLoading: true,
            errorMessage: null
        };
    case "CREATE_GROUP_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessage: action.response.error_message,
                createGroupsLoading: false,
            };
        }
        else {
            return {
                ...state,
                errorMessage: null,
                createGroupsLoading: false,
            };
        }
    case "CREATE_GROUP_FAILED":
        return {
            ...state,
            createGroupsLoading: false,
            errorMessage: action.error || (action.response && action.response.body ? action.response.body : "Error")
        };

    case "DELETE_GROUP_REQUESTED":
        return {
            ...state,
            deleteGroupsLoading: true,
            deleteGroupsError: null
        };
        
    case "DELETE_GROUP_SUCCESS":
        return {
            ...state,
            deleteGroupsLoading: false,
            deleteGroupErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
            deleteGroupsError: null
        };

    case "DELETE_GROUP_FAILED":
        return {
            ...state,
            deleteGroupsLoading: false,
            deleteGroupsError: action.error
        };

    case "GET_SETTINGS_GROUPS_REQUESTED":
        return {
            ...state,
            getSettingsGroupsLoading: true,
            getSettingsGroupsUserError: null
        };
    case "GET_SETTINGS_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessageSettings: action.response.error_message,
                getSettingsGroupsLoading: false,
                getSettingsGroupsError: null
            };
        }
        else {
            return {
                ...state,
                settings: action.response.settings,
                getSettingsGroupsLoading: false,
                getSettingsGroupsError: null
            };
        }
    case "GET_SETTINGS_GROUPS_FAILED":
        return {
            ...state,
            getSettingsGroupsLoading: false,
            getSettingsGroupsError: action.error
        };

    case "GET_PERMISSIONS_GROUPS_REQUESTED":
        return {
            ...state,
            getPermissionsLoading: true
        };
    case "GET_PERMISSIONS_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessagePermissions: action.response.error_message,
                getPermissionsGroupsError: null,
                getPermissionsLoading: false
            };
        }
        else {
            return {
                ...state,
                permissions: action.response.permissions,
                getPermissionsGroupsError: null,
                getPermissionsLoading: false
            };
        }
    case "GET_PERMISSIONS_GROUPS_FAILED":
        return {
            ...state,
            getPermissionsGroupsError: action.error,
            getPermissionsLoading: false
        };

    case "REMOVE_PERMISSIONS_GROUPS_REQUESTED":
        return {
            ...state,
        };
    case "REMOVE_PERMISSIONS_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessageAllPermissions: action.response.error_message,
            };
        }
        else {
            return {
                ...state,
            };
        }
    case "REMOVE_PERMISSIONS_GROUPS_FAILED":
        return {
            ...state,
        };

    case "GET_PERMISSIONS_ALL_REQUESTED":
        return {
            ...state,
        };
    case "GET_PERMISSIONS_ALL_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessageAllPermissions: action.response.error_message,
                getPermissionsAllError: null
            };
        }
        else {
            return {
                ...state,
                allPermissions: action.response.permissions,
                getPermissionsAllError: null
            };
        }
    case "GET_PERMISSIONS_ALL_FAILED":
        return {
            ...state,
            getPermissionsAllError: action.error
        };



    case "ADD_SETTINGS_GROUPS_REQUESTED":
        return {
            ...state,
            addSettingsGroupsLoading: true,
            addSettingsGroupsError: null
        };
    case "ADD_SETTINGS_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                addSettingsGroupErrorMessage: action.response.error_message,
                addSettingsGroupsLoading: false,
                addSettingsGroupsError: null
            };
        }
        else {
            return {
                ...state,
                addSettingsGroupErrorMessage: null,
                addSettingsGroupsLoading: false,
                addSettingsGroupsError: null
            };
        }
    case "ADD_SETTINGS_GROUPS_FAILED":
        return {
            ...state,
            addSettingsGroupsLoading: false,
            addSettingsGroupsError: action.error
        };

    case "UPDATE_SETTINGS_GROUPS_REQUESTED":
        return {
            ...state,
            updateSettingsGroupsLoading: true,
            updateSettingsGroupsError: null
        };
    case "UPDATE_SETTINGS_GROUPS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                updateSettingsGroupErrorMessage: action.response.error_message,
                updateSettingsGroupsLoading: false,
                updateSettingsGroupsError: null
            };
        }
        else {
            return {
                ...state,
                updateSettingsGroupErrorMessage: null,
                updateSettingsGroupsLoading: false,
                updateSettingsGroupsError: null
            };
        }
    case "UPDATE_SETTINGS_GROUPS_FAILED":
        return {
            ...state,
            updateSettingsGroupsLoading: false,
            updateSettingsGroupsError: action.error
        };

    case "REMOVE_SETTINGS_GROUPS_REQUESTED":
        return {
            ...state,
            removeSettingsGroupsLoading: true,
            removeSettingsGroupsUserError: null
        };
    case "REMOVE_SETTINGS_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorMessageRemove: action.response.error_message,
                removeSettingsGroupsLoading: false,
                removeSettingsGroupsError: null
            };
        }
        else {
            return {
                ...state,
                removeSettingsGroupsLoading: false,
                removeSettingsGroupsError: null
            };
        }
    case "REMOVE_SETTINGS_GROUPS_FAILED":
        return {
            ...state,
            removeSettingsGroupsLoading: false,
            removeSettingsGroupsError: action.error
        };

    case "GET_IMAGES_GROUPS_REQUESTED":
        return {
            ...state,
            getImagesGroupsLoading: true,
            getImagesGroupsUserError: null
        };
    case "GET_IMAGES_GROUPS_SUCCESS": 
        return {
            ...state,
            images: action.response.images,
            getImagesGroupsLoading: false,
            getImagesGroupsError: null
        };
    case "GET_IMAGES_GROUPS_FAILED":
        return {
            ...state,
            getImagesGroupsLoading: false,
            getImagesGroupsError: action.error
        };

    case "ADD_IMAGES_GROUPS_REQUESTED":
        return {
            ...state,
            addImagesGroupsLoading: true,
            addImagesGroupsError: null
        };
    case "ADD_IMAGES_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorAddImageMessage: action.response.error_message,
                addImagesGroupsLoading: false,
                addImagesGroupsError: null
            };
        }
        else {
            return {
                ...state,
                addImagesGroupsLoading: false,
                addImagesGroupsError: null
            };
        }
    case "ADD_IMAGES_GROUPS_FAILED":
        return {
            ...state,
            addImagesGroupsLoading: false,
            addImagesGroupsError: action.error
        };

    case "Remove_IMAGES_GROUPS_REQUESTED":
        return {
            ...state,
            removeImagesGroupsLoading: true,
            removeImagesGroupsError: null
        };
    case "REMOVE_IMAGES_GROUPS_SUCCESS": 
        if(action.response && action.response.error_message){
            return {
                ...state,
                errorImageMessage: action.response.error_message,
                removeImagesGroupsLoading: false,
                removeImagesGroupsError: null
            };
        }
        else {
            return {
                ...state,
                removeImagesGroupsLoading: false,
                removeImagesGroupsError: null
            };
        }
    case "REMOVE_IMAGES_GROUPS_FAILED":
        return {
            ...state,
            removeImagesGroupsLoading: false,
            removeImagesGroupsError: action.error
        };
       
    case "GET_SETTINGS_ID_REQUESTED":
        return {
            ...state,
            getSettingsIdLoading: true,
            getSettingsIdError: null
        };
    case "GET_SETTINGS_ID_SUCCESS": 
        return {
            ...state,
            allSettings: action.response.settings,
            getSettingsIdLoading: false,
            getSettingsIdError: null
        };
    case "GET_SETTINGS_ID_FAILED":
        return {
            ...state,
            getSettingsIdLoading: false,
            getSettingsIdError: action.error
        };

    case "SSO_CONFIGS_REQUESTED":
        return {
            ...state,
            ssos: null,
            getAllSSOsLoading: true,
            getAllSSOsError: null
        };
    case "SSO_CONFIGS_SUCCESS":
        return {
            ...state,
            ssos: action.response.ssos,
            getAllSSOsLoading: false,
            getAllSSOsError: null
        };
    case "SSO_CONFIGS_FAILED":
        return {
            ...state,
            ssos: null,
            getAllSSOsLoading: false,
            getAllSSOsError: action.error
        };


    case "ADD_SSO_MAPPING_GROUPS_REQUESTED":
        return {
            ...state,
            addSsoMappingMessage: null,
            addSsoMappingGroupsLoading: true,
            addSsoMappingGroupsError: null
        };
    case "ADD_SSO_MAPPING_GROUPS_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                addSsoMappingMessage: action.response.error_message,
                addSsoMappingGroupsLoading: false,
                addSsoMappingGroupsError: null
            };
        }
        else {
            return {
                ...state,
                addSsoMappingGroupsLoading: false,
                addSsoMappingGroupsError: null
            };
        }
    case "ADD_SSO_MAPPING_GROUPS_FAILED":
        return {
            ...state,
            addSsoMappingGroupsLoading: false,
            addSsoMappingGroupsError: action.error
        };

    case "GET_SSO_MAPPINGS_GROUP_REQUESTED":
        return {
            ...state,
            getSsoMappingGroupsLoading: true,
            getSsoMappingGroupsError: null
        };
    case "GET_SSO_MAPPINGS_GROUP_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                getSsoMappingMessage: action.response.error_message,
                getSsoMappingGroupsLoading: false,
                getSsoMappingGroupsError: null
            };
        }
        else {
            return {
                ...state,
                groupMappings: action.response.group_mappings,
                getSsoMappingGroupsLoading: false,
                getSsoMappingGroupsError: null
            };
        }
    case "GET_SSO_MAPPINGS_GROUP_FAILED":
        return {
            ...state,
            getSsoMappingGroupsLoading: false,
            getSsoMappingGroupsError: action.error
        };

    case "DELETE_SSO_MAPPING_GROUP_REQUESTED":
        return {
            ...state,
            deleteSsoMappingGroupsLoading: true,
            deleteSsoMappingGroupsError: null
        };
    case "DELETE_SSO_MAPPING_GROUP_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                deleteSsoMappingMessage: action.response.error_message,
                deleteSsoMappingGroupsLoading: false,
                deleteSsoMappingGroupsError: null
            };
        }
        else {
            return {
                ...state,
                deleteSsoMappingGroupsLoading: false,
                deleteSsoMappingGroupsError: null
            };
        }
    case "DELETE_SSO_MAPPING_GROUP_FAILED":
        return {
            ...state,
            deleteSsoMappingGroupsLoading: false,
            deleteSsoMappingGroupsError: action.error
        };

    case "UPDATE_SSO_MAPPING_GROUP_REQUESTED":
        return {
            ...state,
            updateSsoMappingMessage: null,
            updateSsoMappingGroupsLoading: true,
            updateSsoMappingGroupsError: null
        };
    case "UPDATE_SSO_MAPPING_GROUP_SUCCESS":
        if(action.response && action.response.error_message){
            return {
                ...state,
                updateSsoMappingMessage: action.response.error_message,
                updateSsoMappingGroupsLoading: false,
                updateSsoMappingGroupsError: null
            };
        }
        else {
            return {
                ...state,
                updateSsoMappingGroupsLoading: false,
                updateSsoMappingGroupsError: null
            };
        }
    case "UPDATE_SSO_MAPPING_GROUP_FAILED":
        return {
            ...state,
            updateSsoMappingGroupsLoading: false,
            updateSsoMappingGroupsError: action.error
        };

    default:
        return state;
    }
}