import { api } from '../utils/axios'

export const webauthnRegisterStart = (data) => async (dispatch) => {
  dispatch({
    type: "WEBAUTHN_REGISTER_START_REQUESTED"
  });
  try{
    const response = await api.post('webauthn_register_start', data);
    dispatch({
      type: "WEBAUTHN_REGISTER_START_SUCCESS",
      reponse: response
    })
    return { response }
  } catch (e) {
    dispatch({
      type: "WEBAUTHN_REGISTER_START_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    throw new Error(e.error)
  }
}


export const webauthnRegisterFinish = (data) => async (dispatch) => {
  dispatch({
    type: "WEBAUTHN_REGISTER_FINISH_REQUESTED"
  });
  try{
    const response = await api.post('webauthn_register_finish', data);
    dispatch({
      type: "WEBAUTHN_REGISTER_FINISH_SUCCESS",
      reponse: response
    })
    return { response }
  } catch (e) {
    dispatch({
      type: "WEBAUTHN_REGISTER_FINISH_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    throw new Error(e.error)
  }
}

export const webauthnAuthenticate = (data) => async (dispatch) => {
  dispatch({
    type: "WEBAUTHN_AUTHENTICATE_REQUESTED"
  });
  try{
    const response = await api.post('webauthn_authenticate', data);
    dispatch({
      type: "WEBAUTHN_AUTHENTICATE_SUCCESS",
      response: response
    })
    return { response }
  } catch (e) {
    dispatch({
      type: "WEBAUTHN_AUTHENTICATE_FAILED",
      error: e.error + (e.body && e.body.error_message ? ' - ' + e.body.error_message : '')
    });
    throw new Error(e.error)
  }
}
