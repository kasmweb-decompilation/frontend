import React, { Component } from "react";
import { Container, Spinner, Row, Col, CardGroup, Button as RSButton, Card, CardBody, CardFooter, UncontrolledTooltip, InputGroup, Jumbotron, ModalHeader, ModalBody } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { QRCode } from "react-qr-svg";
import { loginFunction, getLoginSettings, get_two_factor, setSecret, loginResetPassword } from "../../../actions/actionLogin";
import { webauthnAuthenticate, webauthnRegisterFinish, webauthnRegisterStart } from "../../../actions/actionWebAuthn.js";
import { arrayBufferToBase64, arrayToArrayBuffer, getWebauthnCredential } from "../../../utils/helpers.js";
import { getSignOnURL } from "../../../actions/actionSaml";
import { required, renderField, renderPass, secret, password, mustMatch, noOldPassword } from "../../../utils/formValidations.js";
import "../../../../assets/style/style.css";
import LoadingSpinner from "../../../components/LoadingSpinner/index.js";
import { setThemeColor } from "../../../utils/helpers.js";
import {withTranslation} from "react-i18next";
import { Groups, Button, FormField } from "../../../components/Form/Form.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey.js';
import { Modal, ModalFooter } from "../../../components/Form/Modal";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock.js";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle.js";
import { SetTwoFactorModal } from "../../../components/SetTwoFactorModal/SetTwoFactorModal.js";


const mustMatchPassword = mustMatch('new_password');
const dontReusePassword = noOldPassword('password');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: true,
            loginBoxClass: "",
            loginClicked: false,
            authModal: false,
            resetPassword: false,
            set2faModal: false,
            brandingSet: false,
            loginData: {},
            authtype: 'none'
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);
        this.handleUseTotpButton = this.handleUseTotpButton.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.loginError = this.loginError.bind(this);
        this.toggle = this.toggle.bind(this);
        this.softToken = this.softToken.bind(this);
        this.hardToken = this.hardToken.bind(this);
        this.toggle2faModal = this.toggle2faModal.bind(this);
        this.toggle3 = this.toggle3.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleSetSecret = this.handleSetSecret.bind(this);
        this.handleHardSetSecret = this.handleHardSetSecret.bind(this);
        this.singleSignOn = this.singleSignOn.bind(this);
        this.handleSSOSuccess = this.handleSSOSuccess.bind(this);
        this.handleSSOError = this.handleSSOError.bind(this);
    }

    handleLogin({ username, password }) {

        let login_data = {
            "username": username.trim().toLowerCase(),
            "password": password
        };
        this.setState({loginBoxClass: "", error:true, loginClicked: true, loginData: login_data});
        this.props.loginFunc(login_data).
            then(() => this.completeLogin(login_data)).
            catch((e) => this.loginError(e));
    }

    handleResetPassword({ username, password, new_password }) {

        let login_data = {
            "username": username.trim().toLowerCase(),
            "current_password": password,
            new_password
        };

        this.setState({loginBoxClass: "", error:true, loginClicked: true, loginData: login_data});
        this.props.loginReset(login_data).
            then(() => this.resetComplete(login_data)).
            catch(() => this.loginError());
    }

    loginError(e) {
        console.log(e)
        const { t } = this.props;
        if (this.state.error) {
            this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
            NotificationManager.error(this.props.loginError,t('auth.login-failed'), 5000);
        }
    }

    resetComplete() {
        const { loginError, t } = this.props;
        if (loginError) {
            this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
            NotificationManager.error(loginError,t('auth.reset-failed'), 5000);
            return false
        } 

        this.setState({resetPassword: false, loginClicked: false });
        NotificationManager.success(t('auth.password-has-been-changed-plea'),t('auth.password-updated'), 5000);
        // Commented out the auto login below because it doesn't trigger a password manager update, will see if there is a way to trigger
        /* NotificationManager.success("Password has been changed, logging in with new credentials.","Password Updated", 5000);
        let login_data = this.state.loginData;
        login_data.password = login_data.new_password;
        delete login_data.new_password
        delete login_data.current_password
        this.handleLogin(login_data); */
    }

    handleUseTotpButton() {
        this.props.setSecret(this.state.loginData).then(() => this.setState({authtype: 'soft'}))
    }

    completeLogin(login_data) {
        const { loginError, t } = this.props;
        // reset password on login
        if (this.props.hasResetPassword && !loginError) {
            this.setState({resetPassword: true})
        }
        else if (this.props.require2fa && !loginError) {
            if (!this.props.setTwoFactor) {
                //first time setup of two factor
                this.setState({set2faModal: true})
            } else {
                //two factor one time password check
                this.setState({authModal: true})
            }
        } else if (this.props.webAuthnAuthenticationOptions) {
            getWebauthnCredential({
                authenticationOptions: this.props.webAuthnAuthenticationOptions,
                loginData: this.state.loginData,
                requestId: this.props.request_id
            }).then((cred)=>this.props.webauthnAuthenticate(cred)).then(() => this.handleSuccess()).catch((e) => this.loginError(e))
        //Normal Login
        } else {
            if (loginError) {
                this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
                NotificationManager.error(loginError,t('auth.login-failed'), 5000);
            } else {
                if (this.props.theme){
                    setThemeColor(this.props.theme);
                }
                if (this.props.location.state === undefined || this.props.location.state.from.pathname === "/" || this.props.location.state.from.pathname.indexOf("logout") > -1) {
                    if (this.props.auto_login_kasm) {
                        window.location.href = "/#/go";
                    } else {
                        window.location.href = "/#/";
                    }
                } else {
                    window.location.href = "/#" + this.props.location.state.from.pathname + this.props.location.state.from.search;
                }
            }
        }
    }

    async registerWebauthn() {
        const {t} = this.props
        let login_data = this.state.loginData;
        try {
            let response = await this.props.webauthnRegisterStart(login_data);
            let registration_options = response.response.registration_options
            registration_options.challenge = arrayToArrayBuffer(registration_options.challenge, 'challenge')
            registration_options.user.id = arrayToArrayBuffer(registration_options.user.id, 'user.id')
            let credential = await navigator.credentials.create({
              publicKey: registration_options
            })
            let body = {
              credential: {
                id: credential.id,
                rawId: arrayBufferToBase64(credential.rawId),
                response: {
                  attestationObject: arrayBufferToBase64(credential.response.attestationObject),
                  clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON)
                }
              },
              request_id: response.response.request_id,
              ...login_data,
            };
            response = await this.props.webauthnRegisterFinish(body);
            this.setState({set2faModal: false, authModal: false, loginClicked: false});
            NotificationManager.success(t('auth.successful-webauthn-register'))
          } catch (e) {
            NotificationManager.error(e.error,t('auth.failed-webauthn-register'), 3000);
          }
    }

    handleAuth({ authCode }) {
        //Do authorization in backend
        let login_data = this.state.loginData;
        login_data.code = authCode;
        this.props.get_two_factor(login_data).
            then(() => this.handleSuccess()).
            catch(() => this.handleError());
    }

    handleSuccess() {
        const {twoFactorErrorMessage, webAuthnErrorMessage, t} = this.props;
        if(twoFactorErrorMessage){
            NotificationManager.error(twoFactorErrorMessage,t('auth.two-factor-authentication-fail'), 3000);
            this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
            this.toggle();
        } else if (webAuthnErrorMessage){
            NotificationManager.error(webAuthnErrorMessage,t('auth.webauthn-authentication-fail'), 3000)
            this.setState({loginBoxClass: "login_error", error: false, loginClicked: false})
        //Two Factor Login
        } else {
            if (this.props.location.state === undefined || this.props.location.state.from.pathname === "/" || this.props.location.state.from.pathname.indexOf("logout") > -1) {
                if (this.props.auto_login_kasm) {
                    window.location.href = "/#/go";
                } else {
                    window.location.href = "/#/";
                }
            } else {
                window.location.href = "/#" + this.props.location.state.from.pathname + this.props.location.state.from.search;
            }
        }
    }

    handleError() {
        const {twoFactorError, setSecretError, t} = this.props;
        if(setSecretError){
            NotificationManager.error(setSecretError,t('auth.set-two-factor-authentication'), 3000);
        }
        if(twoFactorError){
            NotificationManager.error(twoFactorError,t('auth.two-factor-authentication-fail'), 3000);
        } else {
            NotificationManager.error("",t('auth.two-factor-authentication-fail'), 3000);
        }
        this.props.initialize({
            authCode: ""
        });
        this.setState({loginBoxClass: "login_error", authModal: false, set2faModal: false, error:false, loginClicked: false});
    }

    handleSetSecret(){
        //call auth again
        this.setState({set2faModal: false, authModal: true})
    }

    async handleHardSetSecret(data) {
        const { t } = this.props;
        let login_data = this.state.loginData;
        login_data.target_token = {
            serial_number: data.serial_number
        };
        try {

            await this.props.setSecret(login_data)
            const { setSecretErrorMessage } = this.props
            if (setSecretErrorMessage) {
                return NotificationManager.error(setSecretErrorMessage,t('auth.token-registration-failed'), 3000);
            }
            this.setState({set2faModal: false, authModal: true});
        } catch (e) {
            NotificationManager.error(e.error,t('auth.token-registration-failed'), 3000);
        }
        
    }

    noneAuthType(){
        this.setState({authtype: 'none'})
    }

    softToken(){
        this.setState({authtype: 'soft'})
    }

    hardToken(){
        this.setState({authtype: 'hard'})
    }

    toggle(){
        this.setState({authModal: !this.state.authModal, loginClicked: false});
    }

    toggle2faModal(){
        this.setState({set2faModal: !this.state.set2faModal, loginClicked: false});
    }

    toggle3(){
        this.setState({resetPassword: !this.state.resetPassword, loginClicked: false});
    }

    singleSignOn(ssoType, id){
        window.localStorage.setItem(ssoType, id);
        if (typeof this.props.location.state !== 'undefined') {
            window.localStorage.setItem("continuation_url", "/#" + this.props.location.state.from.pathname + this.props.location.state.from.search);
        }
        this.props.getsso(ssoType, id)
            .then(() => this.handleSSOSuccess())
            .catch(() => this.handleSSOError());
    }

    handleSSOSuccess() {
        const {sso_url, sso_error_message, sso_error, t} = this.props;
        if (sso_error_message) {
            NotificationManager.error(sso_error_message,t('signup.saml-login-failed'), 5000);
        } else {
            if (sso_url) {
                window.location.href = sso_url;
            } else {
                NotificationManager.error(t('auth.contact-administrator'),t('auth.saml-login-failed'), 5000);
            }
        }
    }

    handleSSOError(){
        const {sso_error, t} = this.props;
        if (sso_error)
            NotificationManager.error(t('auth.contact-administrator'),t('auth.saml-login-failed'), 5000);
    }

    async componentDidMount() {
        try {
            const { response: settings } = await this.props.getLoginSettings();
            window.localStorage.setItem("login_logo", settings.login_logo);
            window.localStorage.setItem("login_caption", settings.login_caption);
            window.localStorage.setItem("header_logo", settings.header_logo);
            window.localStorage.setItem("login_splash_background", settings.login_splash_background);
            window.localStorage.setItem("splash_background", settings.splash_background);
            window.localStorage.setItem("html_title", settings.html_title);
            window.localStorage.setItem("favicon_logo", settings.favicon_logo);
            window.localStorage.setItem("loading_session_text", settings.loading_session_text);
            window.localStorage.setItem("joining_session_text", settings.joining_session_text);
            window.localStorage.setItem("destroying_session_text", settings.destroying_session_text);
            window.localStorage.setItem("launcher_background_url", settings.launcher_background_url);
            this.setState({brandingSet: true})

            if (
                this.props.login_settings.sso_enabled &&
                (this.props.saml_configs.length !== 0 || this.props.oidc_configs.length !== 0) &&
                this.props.location.pathname !== "/staticlogin"
            ) {
                const config = _.find(this.props.saml_configs, { auto_login: true });
                if (config){
                    this.singleSignOn("saml_id", config.saml_id);
                }
                else{
                const oidc_config = _.find(this.props.oidc_configs, { auto_login: true });
                if (oidc_config){
                    this.singleSignOn("oidc_id", oidc_config.oidc_id);
                }
                }
            }
        } catch {}

    }

    componentWillUnmount() {
    }

    render() {
        if (this.props.getSsoLoading){
            return (<div> <LoadingSpinner /></div>);
        }
        const {login_settings, handleSubmit, t } = this.props;

        let login_splash_background = window.localStorage.getItem('login_splash_background');
        let login_logo = window.localStorage.getItem('login_logo');
        login_logo = login_logo ? login_logo : '/img/logo.svg';
        let powered_by = login_logo != "/img/logo.svg";

        let login_caption = window.localStorage.getItem('login_caption');
        login_caption = login_caption ? login_caption : t('auth.the-container-streaming-platfo');


        let elem = document.getElementById("favicon");
        let favicon_logo = window.localStorage.getItem('favicon_logo');
        if (favicon_logo != undefined){
            elem.href=favicon_logo;
        }

        let html_title = window.localStorage.getItem('html_title');
        if (html_title != undefined){
             document.title=html_title;
        }

        const saml_logins = _.map(this.props.saml_configs, config =>
            <div key={config.saml_id} displayName={config.display_name}>
                <div  className="sso-login-option">
                    <RSButton
                        className="px-4 mb-2 sso-login-button"
                        onClick={(id) => this.singleSignOn("saml_id", config.saml_id)}
                        type="submit">

                        <span className="sso-login-logo">
                            { config.logo_url ?
                                <img src={config.logo_url} alt="sso-logo"/>
                            :
                                <span className="sso-login-lock">
                                    <FontAwesomeIcon id="login_assistance_tip" icon={faLock} />
                                </span>

                            }
                        </span>
                        <span className="sso-login-name">
                            {config.display_name}
                        </span>
                    </RSButton>
                </div>
            </div>
        );

        const oidc_logins = _.map(this.props.oidc_configs, config =>
            <div key={config.oidc_id} displayName={config.display_name}>
                <div  className="sso-login-option">
                    <RSButton
                        className="px-4 mb-2 sso-login-button"
                        onClick={(id) => this.singleSignOn("oidc_id", config.oidc_id)}
                        type="submit">

                        <span className="sso-login-logo">
                            <span className="sso-login-logo">
                                { config.logo_url ?
                                    <img src={config.logo_url} alt="sso-logo"/>
                                :
                                    <span className="sso-login-lock">
                                        <FontAwesomeIcon id="login_assistance_tip" icon={faLock} />
                                    </span>

                                }
                            </span>
                        </span>
                        <span className="sso-login-name">
                            {config.display_name}
                        </span>
                    </RSButton>
                </div>
            </div>

        );

        let sso_logins = saml_logins
        sso_logins.push(...oidc_logins);
        sso_logins.sort((a, b) => (a.props.displayName.toLowerCase() > b.props.displayName.toLowerCase()) ? 1 : -1)

        return (
                <div className="tw-w-full">
                    <div className={" " + this.state.loginBoxClass}>
                        <CardGroup className="mb-0 tw-w-full">
                            <div className="tw-w-full tw-flex tw-relative lg:tw-max-w-md xl:tw-max-w-xl tw-h-screen tw-justify-center tw-bg-[image:var(--bg)] dark:tw-bg-[var(--color-echo)] dark:tw-bg-[image:none] dark:tw-border tw-border-solid tw-border-0 tw-border-r tw-border-[var(--border-color)]">
                                <div className="tw-flex tw-relative tw-h-screen tw-w-full tw-justify-center tw-overflow-auto">

                                    <div className="tw-p-8 login-card-top tw-my-auto tw-w-full tw-max-w-sm">

                                    <h1 className="tw-text-xl tw-font-bold tw-mb-8"><strong>{t('auth.login')}</strong> </h1> 
                                        <Groups onSubmit={handleSubmit(this.handleLogin)} section="auth" noPadding={true}>
                                            <FormField label="your-email">
                                                <Field
                                                    name="username"
                                                    component={renderField}
                                                    type="text"
                                                    validate={required} required
                                                    disabled={this.state.authModal}
                                                />
                                            </FormField>
                                            <FormField label="your-password">
                                                <Field 
                                                    name="password"
                                                    component={renderField}
                                                    type="password"
                                                    validate={required} required
                                                    disabled={this.state.authModal}
                                                />
                                            </FormField>
                                            <div className="tw-my-5">
                                                    {this.state.loginClicked ? <Spinner color="primary" className="login-spinner" /> : <Button full={true} icon={<FontAwesomeIcon icon={faKey} />} large={true} type="submit" section="auth" name="login" />}
                                                </div>

                                        </Groups>

                                        {login_settings  && login_settings.sso_enabled && sso_logins && sso_logins.length > 0 &&
                                            <div className="sso-login-options">
                                                {sso_logins}
                                            </div>
                                        }
                                    {this.props.login_settings && this.props.login_settings.notice_message && this.props.login_settings.notice_title &&
                                        <div className="tw-text-xs text-muted-more tw-mt-6">
                                                <h4 className="tw-text-base">{this.props.login_settings && this.props.login_settings.notice_title}</h4>
                                                <p>{this.props.login_settings && this.props.login_settings.notice_message}</p>
                                        </div>
                                        } 


                                    </div>


                                
                                </div>
                                {this.props.login_settings && this.props.login_settings.login_assistance &&
                                    <CardFooter className="login-assistance tw-absolute tw-bottom-0 tw-left-0 tw-right-0">
                                        <div className="login-assistance-head"><span className="need-help">{t('auth.need-help')}</span>
                                        <span className="login-assist-txt"> <FontAwesomeIcon id="login_assistance_tip" icon={faInfoCircle} />
                                            <a href={this.props.login_settings && this.props.login_settings.login_assistance}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                {t('auth.login-assistance')}
                                                <UncontrolledTooltip placement="bottom" target="login_assistance_tip">
                                                    {t('auth.follow-link-for-login-instruct')}
                                                </UncontrolledTooltip>
                                            </a></span></div> 
                                    </CardFooter>
                                }

                            </div>
                            <Card className="text-white tw-flex-1 !tw-bg-center login_box tw-hidden lg:tw-block"  style={{backgroundImage: 'url("' + login_splash_background + '")'}}>
                                <div className="logo-wrapper">
                                    <div className="logo-center tw-pl-24">
                                    <img src={login_logo} alt="logo"/>
                                        <CardBody className="text-center">
                                            {powered_by ?
                                            <div className="logo-bottom-txt">
                                                <p>{t('auth.powered-by-kasm-workspaces')}</p>
                                            </div>
                                            :
                                            ""}
                                            <div className = "logo-bottom-txt">
                                                <h5>{login_caption}</h5>
                                            </div>
                                        </CardBody>
                                    </div>
                                </div>
                            </Card>
                        </CardGroup>

                    <Modal
                        icon={<FontAwesomeIcon icon={faKey} />}
                        iconBg="tw-bg-blue-500 tw-text-white"
                        title="auth.reset-password"
                        contentRaw={
                            <Groups className="tw-text-left tw-mt-8" noPadding section="auth" onSubmit={handleSubmit(this.handleResetPassword)}>
                                <p>{t('auth.your-password-has-expired-plea')}</p>
                                <FormField label="new-password">
                                    <Field
                                        name="new_password"
                                        validate={[required, password, dontReusePassword]} required
                                        component={renderPass} />

                                </FormField>
                                <FormField label="confirm-password">
                                    <Field
                                        name="confirm_password"
                                        validate={[mustMatchPassword]} required
                                        component={renderPass} />

                                </FormField>
                                <ModalFooter cancel={this.toggle3} saveName='buttons.Submit' />
                            </Groups>
                        }
                        open={this.state.resetPassword}
                        setOpen={this.toggle3}

                    />

                    <Modal
                        icon={<FontAwesomeIcon icon={faKey} />}
                        iconBg="tw-bg-blue-500 tw-text-white"
                        title="auth.two-factor-authentication"
                        contentRaw={
                            <Groups className="tw-text-left tw-mt-8" noPadding section="auth" onSubmit={handleSubmit(this.handleAuth)}>
                                <FormField label="enter-code">
                                    <Field
                                        autoFocus={true}
                                        name="authCode"
                                        type="text"
                                        component={renderField} />

                                </FormField>
                                <ModalFooter cancel={this.toggle} saveName='buttons.Submit' />
                            </Groups>
                        }
                        open={this.state.authModal}
                        setOpen={this.toggle}
                    />
                    <SetTwoFactorModal
                        handleWebAuthn={() => this.registerWebauthn()}
                        handleSoftTotp={() => this.handleSetSecret()}
                        handleHardTotp={handleSubmit(this.handleHardSetSecret)}
                        authType={this.state.authtype}
                        open={this.state.set2faModal}
                        setOpen={this.toggle2faModal}
                        qrCode={this.props.qrCode}
                        closeAction={() => this.toggle2faModal()}
                        allow_webauthn_2fa={this.props.allow_webauthn_2fa}
                        allow_totp_2fa={this.props.allow_totp_2fa}
                        handleUseHardTotpButton={() => this.hardToken()}
                        handleUseSoftTotpButton={() => this.handleUseTotpButton()}
                        generatedSecret={this.props.generatedSecret}
                        t={this.props.t}
                        handleBackButton={() => this.noneAuthType()}
                    />
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginFunc: Proptypes.func.isRequired,
    fields: Proptypes.array,
    handleSubmit: Proptypes.func,
    isLoggedIn: Proptypes.bool,
    require2fa: Proptypes.bool,
    hasResetPassword: Proptypes.bool,
    setTwoFactor: Proptypes.bool,
    user_info: Proptypes.object,
    loginError: Proptypes.string,
    history: Proptypes.object,
    initialize: Proptypes.func,
    sso_enabled: Proptypes.string,
    theme: Proptypes.string,
    webAuthnAuthenticationOptions: Proptypes.object,
    request_id: Proptypes.string,
    allow_totp_2fa: Proptypes.bool,
    allow_webauthn_2fa: Proptypes.bool,
};

Login = withRouter(Login);

function mapStateToProps(state) {
    return {
        twoFactorErrorMessage: state.auth.twoFactorErrorMessage || null,
        twoFactorError: state.auth.twoFactorError || null,
        isLoggedIn: state.auth.isLoggedIn,
        require2fa: state.auth.require2fa,
        hasResetPassword: state.auth.hasResetPassword,
        setTwoFactor: state.auth.setTwoFactor,
        user_info: state.auth.user_info,
        loginError: state.auth.loginError,
        setSecretErrorMessage: state.auth.setSecretErrorMessage || null,
        setSecretError: state.auth.setSecretError || null,
        qrCode: state.auth.qrCode || null,
        getSecretErrorMessage: state.auth.setSecretErrorMessage || null,
        getSecretError: state.auth.setSecretError || null,
        generatedSecret: state.auth.generatedSecret || null,
        login_settings: state.auth.login_settings,
        sso_url: state.saml.sso_url,
        saml_configs: _.get(state.auth.login_settings, "saml.saml_configs", []),
        oidc_configs: _.get(state.auth.login_settings, "oidc.oidc_configs", []),
        sso_saml_error: state.saml.sso_saml_error,
        sso_error: state.saml.sso_error,
        auto_login_kasm: state.auth.auto_login_kasm,
        getSsoLoading: state.auth.getSsoLoading || false,
        theme: state.auth.theme,
        webAuthnAuthenticationOptions: state.auth.webAuthnAuthenticationOptions,
        request_id: state.auth.request_id,
        webAuthnErrorMessage: state.auth.webAuthnErrorMessage || null,
        webAuthnError: state.auth.webAuthnError || null,
        allow_totp_2fa: state.auth.allow_totp_2fa,
        allow_webauthn_2fa: state.auth.allow_webauthn_2fa,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
        loginFunc: (login_data) => dispatch(loginFunction(login_data)),
        loginReset: (login_data) => dispatch(loginResetPassword(login_data)),
        get_two_factor: (login_data) => dispatch(get_two_factor(login_data)),
        setSecret: (login_data) => dispatch(setSecret(login_data)),
        getLoginSettings: () => dispatch(getLoginSettings()),
        getsso: (ssoType, id) => dispatch(getSignOnURL(ssoType, id)),
        webauthnRegisterStart: (data) => dispatch(webauthnRegisterStart(data)),
        webauthnRegisterFinish: (data) => dispatch(webauthnRegisterFinish(data)),
        webauthnAuthenticate: (data) => dispatch(webauthnAuthenticate(data)),
    });
}

let LoginWithRouter =  withRouter(Login);

let LoginComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginWithRouter);
const LoginComponentTranslated = withTranslation('common')(LoginComponent)
export default reduxForm({
    form: "LoginPageForm",
    fields: ["username", "password"]
})(LoginComponentTranslated);