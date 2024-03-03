import React, { Component } from "react";
import { Spinner, Button as RSButton, CardGroup, Card, CardBody } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getLoginSettings } from "../../actions/actionLogin";
import {createAccount} from "../../actions/actionCreateAccount";
import { required, renderField, email } from "../../utils/formValidations.js";
import "../../../assets/style/style.css";
import ReCAPTCHA from "react-google-recaptcha";
import {getSignOnURL} from "../../actions/actionSaml";
import LoadingSpinner from "../../components/LoadingSpinner";
import {withTranslation} from "react-i18next";
import { Groups, Button, FormField } from "../../components/Form/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/pro-light-svg-icons/faKey";
import { faUser } from "@fortawesome/pro-light-svg-icons/faUser";
import { Modal } from "../../components/Form/Modal";
import { faLock } from "@fortawesome/pro-light-svg-icons/faLock";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recaptcha_needed: true,
            recaptcha_value: null,
            google_recaptcha_site_key: null,
            error: true,
            loginBoxClass: "",
            loginClicked: false,
            authModal: false,
            brandingSet: false,
            loginData: {}
        };
        this.handleCreate = this.handleCreate.bind(this);
        this.signupError = this.signupError.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.onCaptchaChange = this.onCaptchaChange.bind(this);
        this.singleSignOn = this.singleSignOn.bind(this);
        this.handleSSOSuccess = this.handleSSOSuccess.bind(this);
        this.handleSSOError = this.handleSSOError.bind(this);
    }
    onCaptchaChange(value){
        this.setState({recaptcha_value: value});
    }

    handleCreate({ username, password, password_confirm }) {
        //TODO verify password are the same
        //trim passwords
        const {t} = this.props;
        if (password != password_confirm){
            this.signupError(t('signup.the-passwords-do-not-match'))
        }
        else if (!this.state.recaptcha_value){
            this.signupError(t('signup.please-solve-the-recaptcha'))
        }
        else {
            let login_data = {
                "emailaddress": username.trim().toLowerCase(),
                "password": password.trim(),
                "recaptcha": this.state.recaptcha_value
            };
            this.setState({loginBoxClass: "", error:true, loginClicked: true, loginData: login_data});
            this.props.createAccount(login_data).
                then(() => this.handleSuccess(login_data)).
                catch(() => this.signupError());
        }
    }

    signupError(error) {
        const {t} = this.props;
        if (error || this.props.createAccountError) {
            this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
            NotificationManager.error(error || this.props.createAccountError,t('signup.create-account-failed'), 5000);
        }
    }



    handleSuccess() {
        const {t} = this.props;
        if (this.props.createAccountError) {
            this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
            NotificationManager.error(this.props.createAccountError,t('signup.create-account-failed'), 5000);
        }
        else{
           this.toggle();
        }


    }

    handleComplete(){
         window.location.href = "/#/";
    }


    toggle(){
        if (this.state.authModal){
            // The modal is being closed. Push the user to the login page
            this.handleComplete()
        }
        else{
           this.setState({authModal: !this.state.authModal, loginClicked: false});
        }
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
                NotificationManager.error(t('signup.contact-administrator'),t('signup.saml-login-failed'), 5000);
            }
        }
    }

    handleSSOError(){
        const {sso_error, t} = this.props;
        if (sso_error)
            NotificationManager.error(t('signup.contact-administrator'),t('signup.saml-login-failed'), 5000);
    }


    async componentDidMount() {
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

        if (settings.recaptcha && settings.recaptcha.google_recaptcha_site_key){
            this.setState({google_recaptcha_site_key: settings.recaptcha.google_recaptcha_site_key})
        }

    }

    componentWillUnmount() {
    }

    render() {
        if (this.props.getSsoLoading){
            return (<div> <LoadingSpinner /></div>);
        }
        const {login_settings, handleSubmit, t} = this.props;

        let login_splash_background = window.localStorage.getItem('login_splash_background');
        let login_logo = window.localStorage.getItem('login_logo');
        login_logo = login_logo ? login_logo : '/img/logo.svg';
        let powered_by = login_logo != "/img/logo.svg";

        let login_caption = window.localStorage.getItem('login_caption');
        login_caption = login_caption ? login_caption : t('signup.the-container-streaming-platfo');


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

                                    <h1 className="tw-text-xl tw-font-bold tw-mb-8">{t('signup.create-account')}</h1>
                                    <Groups onSubmit={handleSubmit(this.handleCreate)} section="auth" noPadding={true}>
                                        <FormField label="your-email">
                                            <Field
                                                name="username"
                                                component={renderField}
                                                type="text"
                                                validate={email} required
                                            />
                                        </FormField>
                                        <FormField label="your-password">
                                            <Field
                                                name="password"
                                                component={renderField}
                                                type="password"
                                                validate={required} required
                                            />
                                        </FormField>
                                        <FormField label="confirm-your-password">
                                        <Field
                                                name="password_confirm"
                                                placeholder={t('signup.confirm-your-password')}
                                                component={renderField}
                                                type="password"
                                                validate={required} required
                                            />

                                        </FormField>
                                            {this.state.recaptcha_needed ?
                                                    <div style={{
                                                        paddingTop: "20px",
                                                        textAlign: "center",
                                                        display: "inline-block",
                                                        paddingBottom: "20px"
                                                    }}>
                                                        {this.state.google_recaptcha_site_key ?
                                                            <ReCAPTCHA
                                                                sitekey={this.state.google_recaptcha_site_key}
                                                                onChange={this.onCaptchaChange}
                                                            />
                                                            : ""
                                                        }
                                                    </div>
                                                :
                                                ""
                                            }
                                                <div className="tw-my-5">
                                                    {this.state.loginClicked ? <Spinner color="primary" className="login-spinner" /> : <Button full={true} icon={<FontAwesomeIcon icon={faKey} />} large={true} type="submit" section="buttons" name="Submit" />}
                                                </div>


                                    </Groups>
                                    {login_settings && login_settings.sso_enabled && sso_logins && sso_logins.length > 0 &&

                                        <div className="sso-login-options">
                                            {sso_logins}
                                        </div>
                                    }
                                    {this.props.login_settings && this.props.login_settings.notice_message && this.props.login_settings.notice_title &&
                                        <div className="notice-box">
                                            <h4>{this.props.login_settings && this.props.login_settings.notice_title}</h4>
                                            <p>{this.props.login_settings && this.props.login_settings.notice_message}</p>
                                        </div>
                                    }


                                </div>


                            </div>

                        </div>
                            <Card className="text-white tw-flex-1 !tw-bg-center login_box tw-hidden lg:tw-block"  style={{backgroundImage: 'url("' + login_splash_background + '")'}}>
                                <div className="logo-wrapper">
                                    <div className="logo-center">
                                    <img src={login_logo} alt="logo"/>
                                        <CardBody className="text-center">
                                            {powered_by ?
                                            <div className="logo-bottom-txt">
                                                <p>{t('signup.powered-by-kasm-workspaces')}</p>
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
                        icon={<FontAwesomeIcon icon={faUser} />}
                        iconBg="tw-bg-blue-500 tw-text-white"
                        title="signup.success"
                        contentRaw={
                            <React.Fragment>
                                <p>{t('signup.please-check-your-email-for-th')}</p>
                                <div className="tw-mt-5">
                                    <button type="button" className="cancelbutton tw-ml-auto" onClick={this.toggle}>{t('buttons.ok')}</button>
                                </div>
                            </React.Fragment>
                        }
                        open={this.state.authModal}
                        setOpen={this.toggle}

                    />

                </div>
            </div>
        );
    }
}

Signup.propTypes = {
    createAccount: Proptypes.func.isRequired,
    fields: Proptypes.array,
    handleSubmit: Proptypes.func,
    isLoggedIn: Proptypes.bool,
    require2fa: Proptypes.bool,
    setTwoFactor: Proptypes.bool,
    user_info: Proptypes.object,
    signupError: Proptypes.string,
    history: Proptypes.object,
    initialize: Proptypes.func,
};

Signup = withRouter(Signup);

function mapStateToProps(state) {
    return {
        isLoading: state.createAccount.createAccountLoading,
        createAccountError: state.createAccount.createAccountError,
        createAccountSuccess: state.createAccount.createAccountSuccess,
        login_settings: state.auth.login_settings,
        sso_url: state.saml.sso_url,
        sso_error: state.saml.sso_error,
        sso_saml_error: state.saml.sso_saml_error,
        saml_configs: _.get(state.auth.login_settings, "saml.saml_configs", []),
        oidc_configs: _.get(state.auth.login_settings, "oidc.oidc_configs", []),
        getSsoLoading: state.auth.getSsoLoading || false,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
        createAccount: (login_data) => dispatch(createAccount(login_data)),
        getLoginSettings: () => dispatch(getLoginSettings()),
        getsso: (ssoType, id) => dispatch(getSignOnURL(ssoType, id))
    });
}

let SignupWithRouter =  withRouter(Signup);

let SignupComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupWithRouter);
const SignupComponentTranslated = withTranslation('common')(SignupComponent)
export default reduxForm({
    form: "SignupPageForm",
    fields: ["username", "password"]
})(SignupComponentTranslated);