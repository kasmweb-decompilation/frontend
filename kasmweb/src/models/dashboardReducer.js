export default function (state = [], action = {}) {
  switch (action.type) {
    case 'DOCKED_SESSIONS':
      return {
        ...state,
        dockedSessions: action.response
      }
    case 'PAGEROUTE':
      return {
        ...state,
        routes: action.routes
      }
    case "SET_KASM_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
    case "GETUSERIMAGE_REQUESTED":
      return {
        ...state,
        getuserimageLoading: true,
        getuserimageError: null,
      };
    case "GETUSERIMAGE_SUCCESS":
      return {
        ...state,
        availableKasms: action.response.images,
        availableCategories: action.response.all_categories,
        disabledImageMessage: action.response.disabled_image_message,
        getuserimageLoading: false,
        getuserimageError: null,
      };
    case "GETUSERIMAGE_FAILED":
      return {
        ...state,
        availableKasms: null,
        getuserimageLoading: false,
        getuserimageError: action.response,
      };
    case "GETUSERIMAGE_EX_REQUESTED":
      return {
        ...state,
        getuserimageLoading: true,
        getuserimageError: null,
      };
    case "GETUSERIMAGE_EX_SUCCESS":
      return {
        ...state,
        availableKasms: action.response.images,
        availableCategories: action.response.all_categories,
        disabledImageMessage: action.response.disabled_image_message,
        getuserimageLoading: false,
        getuserimageError: null,
      };
    case "GETUSERIMAGE_EX_FAILED":
      return {
        ...state,
        availableKasms: null,
        getuserimageLoading: false,
        getuserimageError: action.response,
      };

    case "GETUSERKASMS_REQUESTED":
      return {
        ...state,
        getuserkasmsLoading: action.getuserkasmsLoading,
        getuserkasmsError: null,
      };
    case "GETUSERKASMS_SUCCESS":
      return {
        ...state,
        liveKasms: action.response.kasms,
        dockKasms: [],
        getuserkasmsLoading: false,
        getuserkasmsError: null,
      };
    case "GETUSERKASMS_FAILED":
      return {
        ...state,
        liveKasms: null,
        getuserkasmsLoading: false,
        getuserkasmsError: "Invalid Data",
      };

    case "GETSTATUSKASMS_REQUESTED":
      return {
        ...state,
        getstatuskasmsLoading: true,
        getstatuskasmsError: null,
        kasmStarting: true,
      };
    case "GETSTATUSKASMS_SUCCESS":
      if (action.response && (action.response.operational_status === "starting" || action.response.operational_status === "requested" || action.response.operational_status === "provisioning" || action.response.operational_status === "assigned")) {
        let progress = {
          ...state.progress
        }
        let operationalMessage = {
          ...state.operationalMessage
        }
        progress[action.kasm_id] = action.response.operational_progress
        operationalMessage[action.kasm_id] = action.response.operational_message
        return {
          ...state,
          errorStatusKasmsMessage: null,
          getstatuskasmsLoading: true,
          getstatuskasmsError: null,
          kasmStarting: true,
          progress,
          operationalMessage
        };

      } else if (action.response && action.response.error_message) {
        return {
          ...state,
          errorStatusKasmsMessage: action.response.error_message,
          getstatuskasmsLoading: false,
          getstatuskasmsError: null,
          kasmStarting: false
        };
      } else {
        let progress = {
          ...state.progress
        }
        progress[action.kasm_id] = 100

        return {
          ...state,
          kasmStatus: action.response.status,
          statusKasms: action.response.kasm,
          currentTime: action.response.current_time,
          errorStatusKasmsMessage: null,
          getstatuskasmsLoading: false,
          getstatuskasmsError: null,
          kasmStarting: false,
          progress
        };
      }
    case "GETSTATUSKASMS_FAILED":
      return {
        ...state,
        execKasmLoading: false,
        execKasmError: action.error && action.error.message,
      };
    case "EXECKASM_REQUESTED":
      return {
        ...state,
        execKasmLoading: true,
        execKasmError: null,
      };
    case "EXECKASM_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
          errorExecKasmMessage: action.response.error_message,
          execKasmLoading: false,
          execKasmError: null,
        };
      } else {
        return {
          ...state,
          execKasm: action.response.kasm,
          errorExecKasmMessage: null,
          execKasmLoading: false,
          execKasmError: null,
        };
      }
    case "EXECKASM_FAILED":
      return {
        ...state,
        execKasmLoading: false,
        execKasmsError: action.error && action.error.message,
      };
    case "DESTROY_KASMS_REQUESTED":
      return {
        ...state,
        destroyKasmsLoading: true,
        destroyKasmsError: null,
      };
    case "DESTROY_KASMS_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
          destroyKasmsErrorMessage: action.response.error_message,
          destroyKasmsLoading: false,
          destroyKasmsError: null,
        };
      } 
      return {
        ...state,
        destroyKasmsErrorMessage: null,
        destroyKasmsLoading: false,
        destroyKasmsError: null,
      };
    case "DESTROY_KASMS_FAILED":
      return {
        ...state,
        destroyKasmsLoading: false,
        destroyKasmsError: action.error && action.error.message,
      };
    case "STOP_KASMS_REQUESTED":
      return {
        ...state,
        stopKasmsLoading: true,
        stopKasmsError: null,
      };
    case "STOP_KASMS_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
          stopKasmsErrorMessage: action.response.error_message,
          stopKasmsLoading: false,
          stopKasmsError: null,
        };
      }
      return {
        ...state,
        stopKasmsErrorMessage: null,
        stopKasmsLoading: false,
        stopKasmsError: null,
      };
    case "STOP_KASMS_FAILED":
      return {
        ...state,
        stopKasmsLoading: false,
        stopKasmsError: action.error && action.error.message,
      };

    case "PAUSE_KASMS_REQUESTED":
      return {
        ...state,
        pauseKasmsLoading: true,
        pauseKasmsError: null,
      };
    case "PAUSE_KASMS_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
          pauseKasmsErrorMessage: action.response.error_message,
          pauseKasmsLoading: false,
          pauseKasmsError: null,
        };
      }
      return {
        ...state,
        pauseKasmsErrorMessage: null,
        pauseKasmsLoading: false,
        pauseKasmsError: null,
      };
    case "PAUSE_KASMS_FAILED":
      return {
        ...state,
        pauseKasmsLoading: false,
        pauseKasmsError: action.error && action.error.message,
      };
    case "START_KASMS_REQUESTED":
      return {
        ...state,
        startKasmsLoading: true,
        startKasmsError: null,
        startKasmsErrorMessage: null,
      };
    case "START_KASMS_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
          startKasmsErrorMessage: action.response.error_message,
          startKasmsLoading: false,
          startKasmsError: null,
        };
      }
      return {
        ...state,
        startKasmsErrorMessage: null,
        startKasmsLoading: false,
        startKasmsError: null,
      };
    case "START_KASMS_FAILED":
      return {
        ...state,
        startKasmsLoading: false,
        startKasmsError: action.error && action.error.message,
        startKasmsErrorMessage: action.response.error_message,
      };

    case "CREATE_KASMS_REQUESTED":
      return {
        ...state,
        createKasmsLoading: true,
        createKasmsError: null,
      };
    case "CREATE_KASMS_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
          errorCreateMessage: action.response.error_message,
          errorCreateMessageDetail: action.response.error_detail,
          createKasmsLoading: false,
          createkasmsError: null,
        };
      } else {
        return {
          ...state,
          createdKasms: action.response,
          errorCreateMessage: null,
          createKasmsLoading: false,
          createkasmsError: null,
        };
      }
    case "CREATE_KASMS_FAILED":
      return {
        ...state,
        createkasmsLoading: false,
        createkasmsError: action.error && action.error.message,
      };

    case "UPDATE_KEEPALIVE_REQUESTED":
      return {
        ...state,
        Update_keepaliveLoading: true,
        Update_keepaliveError: null,
      };
    case "UPDATE_KEEPALIVE_SUCCESS":
      return {
        ...state,
        keepalive: action.response,
        Update_keepaliveLoading: false,
        Update_keepaliveError: null,
      };
    case "UPDATE_KEEPALIVE_FAILED":
      return {
        ...state,
        Update_keepaliveLoading: false,
        Update_keepaliveError: action.error,
      };

    case "GET_CLIENT_SETTINGS_REQUESTED":
      return {
        ...state,
        clientsettings: null,
        getClientSettingsLoading: true,
        getClientSettingsError: null,
      };
    case "GET_CLIENT_SETTINGS_SUCCESS":
      return {
        ...state,
        clientsettings: action.response,
        getClientSettingsLoading: false,
        getClientSettingsError: null,
      };
    case "GET_CLIENT_SETTINGS_FAILED":
      return {
        ...state,
        clientsettings: null,
        getClientSettingsLoading: false,
        getClientSettingsError: action.error,
      };

    case "GET_USER_GROUP_SETTINGS_REQUESTED":
      return {
        ...state,
        clientGroupSettings: null
      };

    case "GET_USER_GROUP_SETTINGS_SUCCESS":
      return {
        ...state,
        clientGroupSettings: action.response.settings
      };

    case "GET_USER_GROUP_SETTINGS_FAILED":
      return {
        ...state,
        clientGroupSettings: null
      };

      case "GET_USER_PERMISSIONS_REQUESTED":
        return {
          ...state,
          userPermissions: null
        };
  
      case "GET_USER_PERMISSIONS_SUCCESS":
        return {
          ...state,
          userPermissions: action.response.permissions
        };
  
      case "GET_USER_PERMISSIONS_FAILED":
        return {
          ...state,
          userPermissions: null
        };
  
    case "GET_DEFAULT_IMAGE_REQUESTED":
      return {
        ...state,
        userdefault: null,
        getUserDefaultLoading: true,
        getUserDefaultError: null,
      };
    case "GET_DEFAULT_IMAGE_SUCCESS":
      return {
        ...state,
        userdefault: action.response,
        getUserDefaultLoading: false,
        getUserDefaultError: null,
      };
    case "GET_DEFAULT_IMAGE_FAILED":
      return {
        ...state,
        userdefault: null,
        getUserDefaultLoading: false,
        getUserDefaultError: action.error,
      };

    case "CREATE_SHARE_ID_REQUESTED":
      return {
        ...state,
        share_id: null,
        createShareLoading: true,
        createShareError: null,
      };
    case "CREATE_SHARE_ID_SUCCESS":
      return {
        ...state,
        share_id: action.response.share_id,
        createShareLoading: false,
        createShareError: action.response.error_message || null,
      };
    case "CREATE_SHARE_ID_FAILED":
      return {
        ...state,
        share_id: null,
        createShareLoading: false,
        createShareError: action.error,
      };

    case "DESTROY_SHARE_ID_REQUESTED":
      return {
        ...state,
        share_id: null,
        destroyShareLoading: true,
        destroyShareError: null,
      };
    case "DESTROY_SHARE_ID_SUCCESS":
      return {
        ...state,
        share_id: action.response.share_id,
        destroyShareLoading: false,
        destroyShareError: action.response.error_message || null,
      };
    case "DESTROY_SHARE_ID_FAILED":
      return {
        ...state,
        share_id: null,
        destroyShareLoading: false,
        destroyShareError: action.error,
      };

    case "JOIN_KASM_REQUESTED":
      return {
        ...state,
        joinKasm: null,
        joinKasmLoading: true,
        joinKasmError: null,
      };
    case "JOIN_KASM_SUCCESS":
      return {
        ...state,
        joinKasm: action.response.kasm,
        joinKasmLoading: false,
        joinKasmError: action.response.error_message || null,
      };
    case "JOIN_KASM_FAILED":
      return {
        ...state,
        joinKasm: null,
        joinKasmLoading: false,
        joinKasmError: action.error,
      };

    case "GET_VIEWKASM_REQUESTED":
      return {
        ...state,
        viewedKasms: null,
        viewKasmsLoading: true,
      };
    case "GET_VIEWKASM_SUCCESS":
      if (action.response.dead_kasms) {
        let joined_kasms = JSON.parse(
          window.localStorage.getItem("joined_kasms")
        );
        for (let dead of action.response.dead_kasms) {
          let index = joined_kasms.kasms.indexOf(dead);
          if (index !== -1) {
            joined_kasms.kasms.splice(index, 1);
            window.localStorage.setItem(
              "joined_kasms",
              JSON.stringify(joined_kasms)
            );
          }
        }
      }
      return {
        ...state,
        viewedKasms: action.response.viewed_kasms,
        viewKasmsLoading: false,
      };
    case "GET_VIEWKASM_FAILED":
      return {
        ...state,
        viewedKasms: null,
        viewKasmsLoading: false,
      };

    case "CLEAR_SEARCH":
      return {
        ...state,
        search: "",
      };

    case "SEARCH":
      return {
        ...state,
        search: action.value,
      };

    case "SELECT_CATEGORY":
      return {
        ...state,
        selectedCategory: action.value,
      };

    case "SHOW_PROFILE":
      return {
        ...state,
        showProfile: action.value,
      };

    case "PROFILE_SECTION":
      return {
        ...state,
        profileSection: action.value,
      };

    case "PROFILE_DROPDOWN":
      return {
        ...state,
        profileDropdown: action.value,
      };
        
    default:
      return state;
  }
}
