export default function (state = [], action={}) {
    switch (action.type) {
    case "GET_KASM_REQUESTED":
        return {
            ...state,
            getKasmLoading: true,
            getKasmError: null
        };
    case "GET_KASM_SUCCESS":
        return {
            ...state,
            kasms: action.response.kasms,
            current_time: action.response.current_time,
            getKasmLoading: false,
            getKasmError: null,
        };
    case "GET_KASM_FAILED":
        return {
            ...state,
            getKasmLoading: false,
            getKasmError: action.response
        };

    case "GET_KASM_ID_REQUESTED":
        return {
            ...state,
            getKasm_IdLoading: true,
            getKasm_IdError: null
        };
    case "GET_KASM_ID_SUCCESS":
        return {
            ...state,
            kasm: action.response.kasm,
            getKasm_IdLoading: false,
            getKasm_IdError: null,
        };
    case "GET_KASM_ID_FAILED":
        return {
            ...state,
            getKasm_IdLoading: false,
            getKasm_IdError: action.response
        };

    case "CREATE_IMAGE_FROM_SESSION_REQUESTED":
      return {
        ...state,
        createImageSessionLoading: true,
        createImageSessionError: null,
        createdImageSession: null,
        createImageSessionErrorMessage: null,

      };
    case "CREATE_IMAGE_FROM_SESSION_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
          createImageSessionErrorMessage: action.response.error_message,
          createImageSessionLoading: false,
          createImageSessionError: true,
          createdImageSession: null
        };
      }
      return {
        ...state,
        createdImageSession: action.response.image,
        createImageSessionErrorMessage: null,
        createImageSessionLoading: false,
        createImageSessionError: null,
      };
    case "CREATE_IMAGE_FROM_SESSION_FAILED":
      return {
        ...state,
        createImageSessionLoading: false,
        createImageSessionError: action.error && action.error.message,
        createdImageSession: null
      };

    case "SESSION_HISTORY_REQUESTED":
      return {
        ...state,
      };

    case "SESSION_HISTORY_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        history: action.response,
      };

    case "SESSION_HISTORY_FAILED":
      return {
        ...state,
      };

    case "SESSION_RECORDING_REQUESTED":
      return {
        ...state,
        session_recordings: null,
        page: null,
        per_page: null,
        items: null,
        total_duration: null,
      };
  

    case "SESSION_RECORDING_SUCCESS":
      if (action.response && action.response.error_message) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        session_recordings: action.response.session_recordings,
        page: action.response.page,
        per_page: action.response.per_page,
        items: action.response.items,
        total_duration: action.response.total_duration,
      };
  


    default:
        return state;
    }
}