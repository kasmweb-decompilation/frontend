import { Modal } from "../Form/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/pro-light-svg-icons/faKey";
import { Button as RSButton } from "reactstrap";
import { renderField } from "../../utils/formValidations";
import { QRCode } from "react-qr-svg";
import { ModalFooter } from "../Form/Modal";
import { Groups, FormField } from "../Form/Form";
import { Field } from "redux-form";
import React from "react";
import otp from "../../../assets/images/otp.svg"

export function SetTwoFactorModal(props){
    const { handleWebAuthn, handleSoftTotp, handleHardTotp, handleBackButton, authType, open, setOpen, qrCode, closeAction, allow_totp_2fa, allow_webauthn_2fa, handleUseHardTotpButton, handleUseSoftTotpButton, generatedSecret, t} = props
    return (
        <Modal
            icon={<FontAwesomeIcon icon={faKey} />}
            iconBg="tw-bg-blue-500 tw-text-white"
            title={authType === 'none' ? "auth.two-factor-setup" : "auth.authenticator-setup"}
            contentRaw={
                <React.Fragment>
                    {authType === 'none' ? 
                        <div>
                            <p>{t('auth.two-factor-required-general')}</p>
                            {allow_totp_2fa === true ?
                            <React.Fragment>
                                <RSButton
                                        className="px-4 mb-2 sso-login-button"
                                        onClick={() => handleUseSoftTotpButton()}
                                        type="button">
                                        <span className="sso-login-name">
                                            {t('auth.use-soft-token')}
                                        </span>
                                </RSButton>
                                <RSButton
                                        className="px-4 mb-2 sso-login-button"
                                        onClick={() => handleUseHardTotpButton()}
                                        type="button">
                                        <span className="sso-login-name">
                                            {t('auth.use-hard-token')}
                                        </span>
                                </RSButton>
                            </React.Fragment>
                            : null
                            }
                            {allow_webauthn_2fa ?
                            <RSButton
                                    className="px-4 mb-2 sso-login-button"
                                    onClick={() => handleWebAuthn()}
                                    type="button">
                                    <span className="sso-login-name">
                                        {t('auth.use-webauthn')}
                                    </span>
                            </RSButton>
                            : null
                            }
                            { ! allow_totp_2fa &&  ! allow_webauthn_2fa ?
                                <p>
                                    {t('auth.no-allowed-second-factor-device')}
                                </p>
                            : null
                            }
                            <div className="tw-mt-5 sm:tw-mt-6 sm:tw-grid sm:tw-grid-flow-row-dense sm:tw-grid-cols-1 sm:tw-gap-3">
                                <button type="button" className="cancelbutton" onClick={closeAction}>{t('buttons.Cancel')}</button>
                            </div>
                        </div>
                    : null 
                    }
                    {qrCode && authType === 'soft' ?
                        <div>
                            <p>{t('auth.two-factor-authentication-is-r')}
                                <a href="https://support.google.com/accounts/answer/1066447?hl=en&ref_topic=2954345" rel="noopener noreferrer" target="_blank" > {t('auth.google-authenticator')} </a>
                                {t('auth.or-similar-totp-based-authenti')}</p>
                            <div className="text-center">
                                <h5>{t('auth.scan-this-code')}</h5>
                                <QRCode
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="Q"
                                    style={{ width: 128 }}
                                    value={qrCode}
                                />
                                <br></br>
                                <b>Secret: {generatedSecret}</b><br />
                            </div>
                            <ModalFooter cancel={() => handleBackButton()} save={handleSoftTotp} saveName='buttons.continue' cancelButtonText={t('buttons.back')} />
                        </div>
                    : null
                    }
                    {authType === 'hard' ?
                        <div>
                            <Groups className="tw-text-left tw-mt-8" noPadding section="auth" onSubmit={handleHardTotp}>
                                <p>{t('auth.enter-the-serial-number-found-')}</p>
                                <img style={{ height: '80px', marginBottom: '25px' }} src={otp} alt={t('auth.physical-hardware-device')} />
                                <Field
                                    autoFocus={true}
                                    name="serial_number"
                                    type="text"
                                    placeholder={t('auth.serial-number')}
                                    component={renderField} />
                                <ModalFooter cancel={() => handleBackButton()} saveName='buttons.continue' cancelButtonText={t('buttons.back')} />
                            </Groups>
                        </div>
                    : null
                    }
                </React.Fragment>
            }
            open={open}
            setOpen={setOpen}

        />
    )
}
